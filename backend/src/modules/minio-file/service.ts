import { AbstractFileProviderService, MedusaError } from '@medusajs/utils';
import { Logger } from '@medusajs/types';
import { 
  ProviderUploadFileDTO,
  ProviderDeleteFileDTO,
  ProviderFileResultDTO,
  ProviderGetFileDTO,
  ProviderUploadStreamDTO,
  ProviderGetPresignedUploadUrlDTO
} from '@medusajs/types';
import { Client } from 'minio';
import path from 'path';
import { ulid } from 'ulid';
import { PassThrough, Readable, Writable } from 'stream';

type InjectedDependencies = {
  logger: Logger
}

interface MinioServiceConfig {
  endPoint: string
  accessKey: string
  secretKey: string
  bucket?: string
}

export interface MinioFileProviderOptions {
  endPoint: string
  accessKey: string
  secretKey: string
  bucket?: string
}

const DEFAULT_BUCKET = 'medusa-media'

/**
 * Service to handle file storage using MinIO.
 */
class MinioFileProviderService extends AbstractFileProviderService {
  static identifier = 'minio-file'
  protected readonly config_: MinioServiceConfig
  protected readonly logger_: Logger
  protected client: Client
  protected readonly bucket: string

  constructor({ logger }: InjectedDependencies, options: MinioFileProviderOptions) {
    super()
    this.logger_ = logger
    const rawEndpoint = (options.endPoint || '').replace(/^https?:\/\//i, '').replace(/\/+$/, '')
    let host = rawEndpoint
    let port = 443
    let useSSL = true

    if (rawEndpoint.includes(':')) {
      const [h, p] = rawEndpoint.split(':')
      host = h
      port = parseInt(p, 10) || 443
      useSSL = port === 443 || process.env.SSL === 'true'
    }

    this.config_ = {
      endPoint: host,
      accessKey: options.accessKey,
      secretKey: options.secretKey,
      bucket: options.bucket
    }

    // Use provided bucket or default
    this.bucket = this.config_.bucket || DEFAULT_BUCKET
    this.logger_.info(`MinIO service initialized with bucket: ${this.bucket}`)

    // Initialize Minio client with sanitized settings
    this.client = new Client({
      endPoint: host,
      port,
      useSSL,
      accessKey: this.config_.accessKey,
      secretKey: this.config_.secretKey
    })

    // Initialize bucket and policy
    this.initializeBucket().catch(error => {
      this.logger_.error(`Failed to initialize MinIO bucket: ${error.message}`)
    })
  }

  static validateOptions(options: Record<string, any>) {
    const requiredFields = [
      'endPoint',
      'accessKey',
      'secretKey'
    ]

    requiredFields.forEach((field) => {
      if (!options[field]) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `${field} is required in the provider's options`
        )
      }
    })
  }

  private async initializeBucket(): Promise<void> {
    try {
      // Check if bucket exists
      const bucketExists = await this.client.bucketExists(this.bucket)
      
      if (!bucketExists) {
        // Create the bucket
        await this.client.makeBucket(this.bucket)
        this.logger_.info(`Created bucket: ${this.bucket}`)

        // Set bucket policy to allow public read access
        const policy = {
          Version: '2012-10-17',
          Statement: [
            {
              Sid: 'PublicRead',
              Effect: 'Allow',
              Principal: '*',
              Action: ['s3:GetObject'],
              Resource: [`arn:aws:s3:::${this.bucket}/*`]
            }
          ]
        }

        await this.client.setBucketPolicy(this.bucket, JSON.stringify(policy))
        this.logger_.info(`Set public read policy for bucket: ${this.bucket}`)
      } else {
        this.logger_.info(`Using existing bucket: ${this.bucket}`)
        
        // Verify/update policy on existing bucket
        try {
          const policy = {
            Version: '2012-10-17',
            Statement: [
              {
                Sid: 'PublicRead',
                Effect: 'Allow',
                Principal: '*',
                Action: ['s3:GetObject'],
                Resource: [`arn:aws:s3:::${this.bucket}/*`]
              }
            ]
          }
          await this.client.setBucketPolicy(this.bucket, JSON.stringify(policy))
          this.logger_.info(`Updated public read policy for existing bucket: ${this.bucket}`)
        } catch (policyError) {
          this.logger_.warn(`Failed to update policy for existing bucket: ${policyError.message}`)
        }
      }
    } catch (error) {
      this.logger_.error(`Error initializing bucket: ${error.message}`)
      throw error
    }
  }

  protected getFileUrl(fileKey: string): string {
    const baseUrl =
      process.env.MINIO_S3_FILE_URL ||
      process.env.MINIO_FILE_URL ||
      `https://${this.config_.endPoint}/${this.bucket}`
    return `${baseUrl.replace(/\/+$/, '')}/${fileKey}`
  }

  async upload(
    file: ProviderUploadFileDTO
  ): Promise<ProviderFileResultDTO> {
    if (!file) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        'No file provided'
      )
    }

    if (!file.filename) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        'No filename provided'
      )
    }

    try {
      const parsedFilename = path.parse(file.filename)
      const fileKey = `${parsedFilename.name}-${ulid()}${parsedFilename.ext}`
      const content = Buffer.from(file.content, 'binary')

      // Upload file with public-read access
      await this.client.putObject(
        this.bucket,
        fileKey,
        content,
        content.length,
        {
          'Content-Type': file.mimeType,
          'x-amz-meta-original-filename': file.filename,
          'x-amz-acl': file.access === 'private' ? 'private' : 'public-read'
        }
      )

      const url = this.getFileUrl(fileKey)

      this.logger_.info(`Successfully uploaded file ${fileKey} to MinIO bucket ${this.bucket}`)

      return {
        url,
        key: fileKey
      }
    } catch (error) {
      this.logger_.error(`Failed to upload file: ${error.message}`)
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to upload file: ${error.message}`
      )
    }
  }

  async getUploadStream(
    fileData: ProviderUploadStreamDTO
  ): Promise<{
    writeStream: Writable
    promise: Promise<ProviderFileResultDTO>
    url: string
    fileKey: string
  }> {
    if (!fileData) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        'No file data provided'
      )
    }

    if (!fileData.filename) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        'No filename provided'
      )
    }

    try {
      const parsedFilename = path.parse(fileData.filename)
      const fileKey = `${parsedFilename.name}-${ulid()}${parsedFilename.ext}`
      const url = this.getFileUrl(fileKey)

      const pass = new PassThrough()

      const promise = this.client.putObject(
        this.bucket,
        fileKey,
        pass,
        undefined,
        {
          'Content-Type': fileData.mimeType,
          'x-amz-meta-original-filename': fileData.filename,
          'x-amz-acl': fileData.access === 'private' ? 'private' : 'public-read'
        }
      ).then(() => {
        this.logger_.info(`Successfully streamed file ${fileKey} to MinIO bucket ${this.bucket}`)
        return {
          url,
          key: fileKey
        }
      }).catch((error) => {
        this.logger_.error(`Failed to stream file ${fileKey} to MinIO: ${error.message}`)
        throw new MedusaError(
          MedusaError.Types.UNEXPECTED_STATE,
          `Failed to stream file: ${error.message}`
        )
      })

      return {
        writeStream: pass,
        promise,
        url,
        fileKey
      }
    } catch (error) {
      this.logger_.error(`Failed to initialize upload stream: ${error.message}`)
      throw error
    }
  }

  async delete(
    fileData: ProviderDeleteFileDTO | ProviderDeleteFileDTO[]
  ): Promise<void> {
    const files = Array.isArray(fileData) ? fileData : [fileData]
    for (const file of files) {
      if (!file?.fileKey) continue
      try {
        await this.client.removeObject(this.bucket, file.fileKey)
        this.logger_.info(`Successfully deleted file ${file.fileKey} from MinIO bucket ${this.bucket}`)
      } catch (error) {
        // Log error but don't throw if file doesn't exist
        this.logger_.warn(`Failed to delete file ${file.fileKey}: ${error.message}`)
      }
    }
  }

  async getPresignedDownloadUrl(
    fileData: ProviderGetFileDTO
  ): Promise<string> {
    if (!fileData?.fileKey) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        'No file key provided'
      )
    }

    try {
      const url = await this.client.presignedGetObject(
        this.bucket,
        fileData.fileKey,
        24 * 60 * 60 // URL expires in 24 hours
      )
      this.logger_.info(`Generated presigned URL for file ${fileData.fileKey}`)
      return url
    } catch (error) {
      this.logger_.error(`Failed to generate presigned URL: ${error.message}`)
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to generate presigned URL: ${error.message}`
      )
    }
  }

  async getPresignedUploadUrl(
    fileData: ProviderGetPresignedUploadUrlDTO
  ): Promise<ProviderFileResultDTO> {
    if (!fileData?.filename) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        'No filename provided'
      )
    }

    try {
      const parsedFilename = path.parse(fileData.filename)
      const fileKey = `${parsedFilename.name}-${ulid()}${parsedFilename.ext}`
      const expiresIn = fileData.expiresIn || 24 * 60 * 60
      const url = await this.client.presignedPutObject(
        this.bucket,
        fileKey,
        expiresIn
      )
      return {
        url,
        key: fileKey
      }
    } catch (error) {
      this.logger_.error(`Failed to generate presigned upload URL: ${error.message}`)
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to generate presigned upload URL: ${error.message}`
      )
    }
  }

  async getDownloadStream(
    fileData: ProviderGetFileDTO
  ): Promise<Readable> {
    if (!fileData?.fileKey) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        'No file key provided'
      )
    }

    try {
      return await this.client.getObject(this.bucket, fileData.fileKey)
    } catch (error) {
      this.logger_.error(`Failed to get download stream for ${fileData.fileKey}: ${error.message}`)
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to get download stream: ${error.message}`
      )
    }
  }

  async getAsBuffer(
    fileData: ProviderGetFileDTO
  ): Promise<Buffer> {
    if (!fileData?.fileKey) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        'No file key provided'
      )
    }

    try {
      const stream = await this.client.getObject(this.bucket, fileData.fileKey)
      const chunks: Buffer[] = []
      for await (const chunk of stream) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
      }
      return Buffer.concat(chunks)
    } catch (error) {
      this.logger_.error(`Failed to get file as buffer for ${fileData.fileKey}: ${error.message}`)
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to get file as buffer: ${error.message}`
      )
    }
  }
}

export default MinioFileProviderService

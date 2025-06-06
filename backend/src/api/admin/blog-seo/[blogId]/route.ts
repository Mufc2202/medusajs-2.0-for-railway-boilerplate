import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import type { FileDTO } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { PRODUCT_SEO_MODULE } from "../../../../modules/product-seo";
import { SeoDetailsTypes } from "../../../../modules/product-seo/models/seo-details";
import ProductSeoModuleService from "../../../../modules/product-seo/service";
import { uploadFilesWorkflow } from "@medusajs/medusa/core-flows";
import { RemoteLink } from "@medusajs/framework/modules-sdk";
import { BLOG_MODULE } from "modules/blog";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  if (req.params.blogId) {
    const { data } = await query.graph({
      entity: "blog",
      fields: ["*", "seo_details.*", "seo_details.metaSocial.*"],
      filters: {
        id: req.params.blogId,
      },
    });

    if (!data.at(0)?.seo_details) {
      return res.status(400).json({ message: "Blog SEO not found" });
    }
    // if (Array.isArray(data.at(0)?.seo_details)) {
    //   res.json({
    //     data: data.at(0)?.seo_details.find((seo) => seo !== null),
    //   });
    //   return;
    // }

    return res.json({
      data: data.at(0)?.seo_details,
    });
  }
  return res.status(400).json({ message: "Blog ID is required" });
}

export async function POST(
  req: MedusaRequest<SeoDetailsTypes>,
  res: MedusaResponse
) {
  try {
    if (!req.params.blogId) {
      res.status(400).json({ message: "Blog ID is required" });
    }
    const productSeoService: ProductSeoModuleService =
      req.scope.resolve(PRODUCT_SEO_MODULE);
    const { metaSocial, metaImage, ...rest } = req.body;
    const socials =
      typeof metaSocial === "string" ? JSON.parse(metaSocial) : metaSocial;
    // return;
    if (!rest.metaTitle || !rest.metaDescription) {
      res
        .status(400)
        .json({ message: "Meta title and description are required" });
      return;
    }
    // create social details with the json body provided

    const files_input = req.files as Express.Multer.File[];
    console.log(files_input);

    const social_files = files_input.filter((f) =>
      f.originalname.includes("metaSocial.image")
    );
    const seo_files = files_input.filter(
      (f) => !f.originalname.includes("metaSocial.image")
    );
    let upload_result: FileDTO | null = null;
    if (seo_files.length > 0) {
      const { result } = await uploadFilesWorkflow(req.scope).run({
        input: {
          files: seo_files?.map((f) => ({
            filename: f.originalname,
            mimeType: f.mimetype,
            content: f.buffer.toString("binary"),
            access: "public",
          })),
        },
      });
      if (result) {
        upload_result = result[0];
      }
    }
    const data = await productSeoService.createSeoDetails({
      ...rest,
      ...(upload_result?.url && { metaImage: upload_result?.url }),
    });

    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
    const { data: blogData } = await query.graph({
      entity: "blog",
      fields: ["*"],
      filters: {
        id: req.params.blogId,
      },
    });
    if (socials && Array.isArray(socials) && socials.at(0)) {
      socials.forEach(async (item) => {
        let upload_result: FileDTO | null = null;
        const new_image_file = social_files.find((f) => {
          if (f.originalname.includes(`new_item_${item.index}_newMetaSocial`)) {
            return f;
          }
        });
        if (new_image_file) {
          const { result } = await uploadFilesWorkflow(req.scope).run({
            input: {
              files: [
                {
                  filename: new_image_file.originalname,
                  mimeType: new_image_file.mimetype,
                  content: new_image_file.buffer.toString("binary"),
                  access: "public",
                },
              ],
            },
          });
          if (result) {
            upload_result = result[0];
          }
        }
        const social_data = await productSeoService.createSeoSocials({
          ...item,
          seo_details_id: data.id,
          // ...(upload_result?.url && { image: upload_result?.url }),
        });
        await productSeoService.updateSeoSocials({
          id: social_data.id,
          ...(upload_result?.url && { image: upload_result?.url }),
        });
      });
    }
    const newProductSeo = await productSeoService.retrieveSeoDetails(data.id, {
      relations: ["*", "metaSocial.*"],
    });
    const remoteLink: RemoteLink = req.scope.resolve(
      ContainerRegistrationKeys.REMOTE_LINK
    );
    await remoteLink.create({
      [BLOG_MODULE]: {
        blog_id: blogData.at(0)?.id,
      },
      productSeoModuleService: {
        seo_details_id: data.id,
      },
    });
    res.json({ data: newProductSeo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

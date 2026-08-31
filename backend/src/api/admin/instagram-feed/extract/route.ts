import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework";
import { uploadFilesWorkflow } from "@medusajs/medusa/core-flows";

export async function POST(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  try {
    const rawInput = (req.body as any)?.url || (req.body as any)?.input || "";

    if (!rawInput || typeof rawInput !== "string") {
      return res.status(400).json({
        success: false,
        message: "Please provide an Instagram post URL or embed snippet.",
      });
    }

    // Extract shortcode and permalink
    const match =
      rawInput.match(/(?:https:\/\/(?:www\.)?instagram\.com\/(?:p|reel|tv)\/([a-zA-Z0-9_-]+))/i) ||
      rawInput.match(/data-instgrm-permalink=["'](https:\/\/www\.instagram\.com\/(?:p|reel|tv)\/([a-zA-Z0-9_-]+))/i);

    if (!match || !match[1]) {
      return res.status(400).json({
        success: false,
        message: "Invalid Instagram link. Expected format: https://www.instagram.com/p/{id}/ or https://www.instagram.com/reel/{id}/",
      });
    }

    const shortcode = match[1];
    const isReel = rawInput.includes("/reel/") || rawInput.includes("/tv/");
    const cleanPermalink = `https://www.instagram.com/${isReel ? "reel" : "p"}/${shortcode}/`;

    // Fetch OpenGraph and HTML data from Instagram using crawler User-Agent
    const ogResponse = await fetch(cleanPermalink, {
      headers: {
        "User-Agent": "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.html)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    const html = await ogResponse.text();

    // Extract title & description for caption
    const ogTitleMatch =
      html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i) ||
      html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:title["']/i);
    const ogDescMatch =
      html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i) ||
      html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:description["']/i);

    const rawTitle = ogTitleMatch
      ? ogTitleMatch[1].replace(/&amp;/g, "&").replace(/&#039;/g, "'").replace(/&quot;/g, '"')
      : "";
    const rawDesc = ogDescMatch
      ? ogDescMatch[1].replace(/&amp;/g, "&").replace(/&#039;/g, "'").replace(/&quot;/g, '"')
      : "";

    // Parse clean caption
    let caption = "";
    const quoteMatch = rawTitle.match(/:\s*["']([\s\S]+?)["']\s*$/i) || rawDesc.match(/:\s*["']([\s\S]+?)["']\s*$/i);
    if (quoteMatch && quoteMatch[1]) {
      caption = quoteMatch[1].trim();
    } else if (rawTitle) {
      caption = rawTitle.replace(/^Dolgin's Fine Jewelry on Instagram:\s*/i, "").trim();
    } else {
      caption = rawDesc;
    }

    // Extract dynamic live likes, comments, and date from Instagram
    const descLikesMatch = rawDesc.match(/([0-9,]+)\s+likes/i) || rawTitle.match(/([0-9,]+)\s+likes/i);
    const descCommentsMatch = rawDesc.match(/([0-9,]+)\s+comments/i);
    const descDateMatch = rawDesc.match(/on\s+([A-Za-z]+\s+[0-9]+,\s+[0-9]{4}):/i);

    const likesCount = descLikesMatch ? parseInt(descLikesMatch[1].replace(/,/g, ""), 10) : 0;
    const commentsCount = descCommentsMatch ? parseInt(descCommentsMatch[1].replace(/,/g, ""), 10) : 0;
    const postedAt = descDateMatch ? descDateMatch[1] : null;

    // Extract Poster Image (og:image)
    const ogImageMatch =
      html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i) ||
      html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/i);
    const ogImageUrl = ogImageMatch ? ogImageMatch[1].replace(/&amp;/g, "&") : "";

    // Find all CDN image URLs from body
    const allCdnUrls = [...html.matchAll(/https:[^"'\s<>]+/g)]
      .map((m) => m[0].replace(/\\u0026/g, "&").replace(/\\\//g, "/").replace(/&amp;/g, "&"))
      .filter(
        (u) =>
          (u.includes("scontent") || u.includes("cdninstagram") || u.includes("fbcdn")) &&
          (u.includes(".jpg") || u.includes(".png") || u.includes(".webp")) &&
          !u.includes("rsrc.php") &&
          !u.includes("s150x150") &&
          !u.includes("s240x240") &&
          !u.includes("s320x320") &&
          !u.includes("s480x480") &&
          !u.includes("profile_pic")
      );

    // 1. REEL / VIDEO POSTS
    if (isReel) {
      const mp4Matches = [...html.matchAll(/https:[^"'\s<>]+\.mp4[^"'\s<>]*/g)]
        .map((m) =>
          m[0]
            .replace(/\\u0026/g, "&")
            .replace(/\\\//g, "/")
            .replace(/&amp;/g, "&")
            .replace(/\\u003C[\s\S]*$/, "")
            .replace(/%3C[\s\S]*$/, "")
        )
        .filter((u) => !u.includes("rsrc.php"));

      const progressiveMp4 = mp4Matches.find((u) => u.includes("xpv_progressive") || u.includes("dash_baseline_1"));
      const rawVideoUrl = progressiveMp4 || mp4Matches[0];

      let uploadedVideoUrl: string | null = null;
      let uploadedPosterUrl: string | null = null;

      if (rawVideoUrl) {
        try {
          const videoRes = await fetch(rawVideoUrl);
          if (videoRes.ok) {
            const videoBuf = Buffer.from(await videoRes.arrayBuffer());
            const { result: videoUploadResult } = await uploadFilesWorkflow(req.scope).run({
              input: {
                files: [
                  {
                    filename: `instagram_${shortcode}_reel.mp4`,
                    mimeType: "video/mp4",
                    content: videoBuf.toString("binary"),
                    access: "public",
                  },
                ],
              },
            });
            if (videoUploadResult && videoUploadResult.length > 0 && videoUploadResult[0].url) {
              uploadedVideoUrl = videoUploadResult[0].url;
            }
          }
        } catch (videoErr) {
          console.warn("Video upload to storage fallback:", videoErr);
          uploadedVideoUrl = rawVideoUrl;
        }

        // Find clean unwatermarked cover frame from HTML body
        const cleanCoverMatch = allCdnUrls.find(
          (u) =>
            u.includes("video_additional_cover_frame") ||
            (u.includes("CLIPS.xpids") && !u.includes("stp=c"))
        );
        const targetPosterUrl = cleanCoverMatch || ogImageUrl;

        if (targetPosterUrl) {
          try {
            const posterRes = await fetch(targetPosterUrl);
            if (posterRes.ok) {
              const posterBuf = Buffer.from(await posterRes.arrayBuffer());
              const { result: posterUploadResult } = await uploadFilesWorkflow(req.scope).run({
                input: {
                  files: [
                    {
                      filename: `instagram_${shortcode}_poster.jpg`,
                      mimeType: "image/jpeg",
                      content: posterBuf.toString("binary"),
                      access: "public",
                    },
                  ],
                },
              });
              if (posterUploadResult && posterUploadResult.length > 0 && posterUploadResult[0].url) {
                uploadedPosterUrl = posterUploadResult[0].url;
              }
            }
          } catch (posterErr) {
            uploadedPosterUrl = targetPosterUrl;
          }
        }

        return res.status(200).json({
          success: true,
          media_url: uploadedVideoUrl || rawVideoUrl,
          thumbnail_url: uploadedPosterUrl || ogImageUrl || null,
          caption: caption || `Dolgins Fine Jewelry — @dolgins_jewelry`,
          permalink: cleanPermalink,
          media_type: "VIDEO",
          likes_count: likesCount,
          comments_count: commentsCount,
          posted_at: postedAt,
          shortcode,
          metadata: {
            video_url: uploadedVideoUrl || rawVideoUrl,
            thumbnail_url: uploadedPosterUrl || ogImageUrl || null,
            likes_count: likesCount,
            comments_count: commentsCount,
            posted_at: postedAt,
          },
        });
      }
    }

    // 2. CAROUSEL & STANDARD IMAGE POSTS
    // Extract cluster ID from og:image (e.g. /728900874_18206356303350120_6969916371388272907_n.jpg -> 1820635)
    const ogParts = ogImageUrl.match(/\/([0-9]+)_([0-9]+)_([0-9]+)_/);
    const clusterPrefix = ogParts ? ogParts[2].substring(0, 7) : null;

    // Filter URLs belonging specifically to THIS post's cluster
    const matchedUrls = allCdnUrls.filter((u) => {
      if (clusterPrefix && u.includes(`_${clusterPrefix}`)) {
        return true;
      }
      const efgMatch = u.match(/efg=([^&]+)/);
      if (efgMatch) {
        try {
          const decoded = Buffer.from(decodeURIComponent(efgMatch[1]), "base64").toString("utf-8");
          if (decoded.includes("CAROUSEL_ITEM") && clusterPrefix && u.includes(clusterPrefix)) {
            return true;
          }
        } catch (e) {}
      }
      return false;
    });

    // Group by distinct slide item ID
    const slideMap = new Map<string, string>();
    for (const url of matchedUrls.length > 0 ? matchedUrls : allCdnUrls) {
      const idMatch = url.match(/\/([0-9]+)_[0-9]+_[0-9]+_n\.jpg/i) || url.match(/ig_cache_key=([^&]+)/i);
      const itemId = idMatch ? idMatch[1] : url.split("?")[0];

      const isUncropped = !url.includes("stp=c");
      const is1080 = url.includes("1080x1080") || url.includes("dst-jpg_e35_tt6") || url.includes("2500") || url.includes("1667");

      if (!slideMap.has(itemId)) {
        slideMap.set(itemId, url);
      } else {
        const existing = slideMap.get(itemId)!;
        if (isUncropped && (!existing.includes("1080") && !existing.includes("dst-jpg_e35_tt6"))) {
          slideMap.set(itemId, url);
        }
      }
    }

    let extractedImages = Array.from(slideMap.values());

    // Fallback to og:image if no images found
    if (extractedImages.length === 0 && ogImageUrl) {
      extractedImages.push(ogImageUrl);
    }

    const uploadedUrls: string[] = [];

    // Download and upload each slide image to Medusa storage so they are permanent and uncropped
    for (let i = 0; i < extractedImages.length; i++) {
      const imgUrl = extractedImages[i];
      try {
        const imgRes = await fetch(imgUrl);
        if (imgRes.ok) {
          const arrayBuffer = await imgRes.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          const { result } = await uploadFilesWorkflow(req.scope).run({
            input: {
              files: [
                {
                  filename: `instagram_${shortcode}_slide_${i + 1}.jpg`,
                  mimeType: "image/jpeg",
                  content: buffer.toString("binary"),
                  access: "public",
                },
              ],
            },
          });

          if (result && result.length > 0 && result[0].url) {
            uploadedUrls.push(result[0].url);
          } else {
            uploadedUrls.push(imgUrl);
          }
        } else {
          uploadedUrls.push(imgUrl);
        }
      } catch (uploadErr) {
        console.warn(`Failed to upload slide ${i + 1}, using direct CDN:`, uploadErr);
        uploadedUrls.push(imgUrl);
      }
    }

    const mainMediaUrl = uploadedUrls[0] || `https://www.instagram.com/p/${shortcode}/embed/`;

    return res.status(200).json({
      success: true,
      media_url: mainMediaUrl,
      thumbnail_url: uploadedUrls[0] || ogImageUrl || null,
      caption: caption || `Dolgins Fine Jewelry — @dolgins_jewelry`,
      permalink: cleanPermalink,
      media_type: uploadedUrls.length > 1 ? "CAROUSEL_ALBUM" : "IMAGE",
      likes_count: likesCount,
      comments_count: commentsCount,
      posted_at: postedAt,
      shortcode,
      carousel_images: uploadedUrls.length > 1 ? uploadedUrls : undefined,
      metadata: {
        ...(uploadedUrls.length > 1 ? { carousel_images: uploadedUrls } : {}),
        likes_count: likesCount,
        comments_count: commentsCount,
        posted_at: postedAt,
      },
    });
  } catch (error: any) {
    console.error("Error extracting Instagram post metadata:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to extract Instagram metadata.",
    });
  }
}

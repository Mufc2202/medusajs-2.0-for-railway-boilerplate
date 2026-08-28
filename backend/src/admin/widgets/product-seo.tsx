import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types";
import { GlobeEurope, PencilSquare, Photo, Plus, ArrowPath, CheckCircle } from "@medusajs/icons";
import {
  Container,
  Heading,
  Text,
  Badge,
  Button,
  Input,
  Drawer,
  IconButton,
  toast,
  Toaster,
  Textarea,
} from "@medusajs/ui";
import { useState, useEffect, useRef } from "react";

export interface SeoDetails {
  id?: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaImage?: string | null;
  keywords?: string | null;
  metaRobots?: string | null;
  structuredData?: Record<string, any> | string | null;
  feedData?: Record<string, any> | string | null;
  metaViewport?: string | null;
  canonicalURL?: string | null;
}

const ProductSeoWidget = ({ data }: DetailWidgetProps<AdminProduct>) => {
  const [seo, setSeo] = useState<SeoDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  // Form Fields
  const [metaTitle, setMetaTitle] = useState<string>("");
  const [metaDescription, setMetaDescription] = useState<string>("");
  const [keywords, setKeywords] = useState<string>("");
  const [canonicalURL, setCanonicalURL] = useState<string>("");
  const [metaRobots, setMetaRobots] = useState<string>("index, follow");
  const [structuredData, setStructuredData] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch SEO data
  const fetchSeo = async () => {
    if (!data?.id) return;
    try {
      setLoading(true);
      const res = await fetch(`/admin/product-seo/${data.id}`, {
        credentials: "include",
      });
      if (res.ok) {
        const json = await res.json();
        const details = json.seoDetails || json.data || json;
        if (details && (details.metaTitle || details.id)) {
          setSeo(details);
        } else {
          setSeo(null);
        }
      }
    } catch (err) {
      console.error("Error fetching product SEO:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeo();
  }, [data?.id]);

  const openEditDrawer = () => {
    setMetaTitle(seo?.metaTitle || data?.title || "");
    setMetaDescription(seo?.metaDescription || data?.description || "");
    setKeywords(seo?.keywords || "");
    setCanonicalURL(seo?.canonicalURL || "");
    setMetaRobots(seo?.metaRobots || "index, follow");
    setStructuredData(
      typeof seo?.structuredData === "object"
        ? JSON.stringify(seo.structuredData, null, 2)
        : seo?.structuredData || ""
    );
    setImageFile(null);
    setImagePreview(seo?.metaImage || data?.thumbnail || "");
    setIsDrawerOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("metaTitle", metaTitle);
      formData.append("metaDescription", metaDescription);
      formData.append("keywords", keywords);
      formData.append("canonicalURL", canonicalURL);
      formData.append("metaRobots", metaRobots);
      formData.append("structuredData", structuredData || "{}");

      if (imageFile) {
        formData.append("files", imageFile);
      }

      const url = seo?.id
        ? `/admin/product-seo/${data.id}/${seo.id}`
        : `/admin/product-seo/${data.id}`;
      const method = seo?.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formData,
        credentials: "include",
      });

      if (res.ok) {
        toast.success("Product SEO saved successfully");
        setIsDrawerOpen(false);
        fetchSeo();
      } else {
        const err = await res.json();
        toast.error("Failed to save SEO", {
          description: err.message || "Unknown error",
        });
      }
    } catch (err: any) {
      toast.error("Error saving SEO: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container className="p-5 shadow-xs border border-ui-border-base space-y-4 mt-4">
      <Toaster />
      <div className="flex items-center justify-between border-b border-ui-border-base pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600">
            <GlobeEurope className="w-5 h-5" />
          </div>
          <div>
            <Heading level="h2" className="text-sm sm:text-base font-bold text-ui-fg-base">
              Search Engine Optimization (SEO)
            </Heading>
            <Text className="text-xs text-ui-fg-subtle">
              Manage meta tags, OpenGraph preview, keywords, and indexing settings for Google search.
            </Text>
          </div>
        </div>

        <Button variant="secondary" size="small" onClick={openEditDrawer}>
          <PencilSquare className="w-3.5 h-3.5 mr-1" />
          {seo ? "Edit SEO" : "Configure SEO"}
        </Button>
      </div>

      {loading ? (
        <div className="py-6 text-center text-xs text-ui-fg-muted flex items-center justify-center gap-2">
          <ArrowPath className="w-4 h-4 animate-spin text-ui-fg-interactive" />
          Loading SEO details...
        </div>
      ) : seo ? (
        <div className="space-y-3">
          {/* SERP Search Preview Card */}
          <div className="p-4 rounded-xl border border-ui-border-base bg-ui-bg-subtle/40 space-y-1">
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono truncate">
              {seo.canonicalURL || `https://dolgins.com/products/${data.handle}`}
            </div>
            <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer line-clamp-1">
              {seo.metaTitle || data.title}
            </div>
            <div className="text-xs text-ui-fg-subtle line-clamp-2">
              {seo.metaDescription || data.description || "No description set."}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs pt-1">
            <div className="p-3 rounded-lg border border-ui-border-base bg-ui-bg-base">
              <span className="text-[11px] text-ui-fg-muted block">Meta Robots:</span>
              <span className="font-semibold text-ui-fg-base">{seo.metaRobots || "index, follow"}</span>
            </div>
            <div className="p-3 rounded-lg border border-ui-border-base bg-ui-bg-base">
              <span className="text-[11px] text-ui-fg-muted block">Keywords:</span>
              <span className="font-semibold text-ui-fg-base truncate block">
                {seo.keywords || "None"}
              </span>
            </div>
            <div className="p-3 rounded-lg border border-ui-border-base bg-ui-bg-base">
              <span className="text-[11px] text-ui-fg-muted block">Social Image:</span>
              <span className="font-semibold text-ui-fg-base truncate block">
                {seo.metaImage ? "Configured" : "Default Thumbnail"}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-6 text-center flex flex-col items-center justify-center gap-2">
          <Text className="text-xs text-ui-fg-subtle">
            No custom SEO tags configured for this product. Default title and description are currently used.
          </Text>
          <Button variant="secondary" size="small" onClick={openEditDrawer}>
            <Plus className="w-3.5 h-3.5 mr-1" />
            Set Custom SEO Meta Tags
          </Button>
        </div>
      )}

      {/* Edit SEO Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <Drawer.Content className="max-w-xl">
          <form onSubmit={handleSaveSeo} className="flex flex-col h-full">
            <Drawer.Header>
              <Drawer.Title>Product SEO & Social Metadata</Drawer.Title>
              <Drawer.Description>
                Optimize how this product appears on Google search results and social media shares.
              </Drawer.Description>
            </Drawer.Header>

            <Drawer.Body className="space-y-4 overflow-y-auto p-4 sm:p-6">
              {/* Meta Title */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-ui-fg-base">Meta Title</label>
                  <span className="text-[10px] text-ui-fg-muted">
                    {metaTitle.length}/60 chars
                  </span>
                </div>
                <Input
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="e.g. 14K Diamond Solitaire Ring | Dolgins Jewelry"
                  className="text-xs"
                />
              </div>

              {/* Meta Description */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-ui-fg-base">Meta Description</label>
                  <span className="text-[10px] text-ui-fg-muted">
                    {metaDescription.length}/160 chars
                  </span>
                </div>
                <Textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="e.g. Handcrafted 14K gold diamond solitaire engagement ring featuring brilliant cut center stone with lifetime warranty."
                  className="text-xs min-h-[80px]"
                />
              </div>

              {/* Keywords */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ui-fg-base">Keywords</label>
                <Input
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="diamond ring, 14k gold, solitaire, bridal jewelry"
                  className="text-xs"
                />
              </div>

              {/* Canonical URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ui-fg-base">Canonical URL</label>
                <Input
                  value={canonicalURL}
                  onChange={(e) => setCanonicalURL(e.target.value)}
                  placeholder="https://dolgins.com/products/diamond-solitaire-ring"
                  className="text-xs"
                />
              </div>

              {/* Robots */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ui-fg-base">Robots Tag</label>
                <Input
                  value={metaRobots}
                  onChange={(e) => setMetaRobots(e.target.value)}
                  placeholder="index, follow"
                  className="text-xs"
                />
              </div>

              {/* Social OG Image */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ui-fg-base">
                  Social Sharing Image (OpenGraph)
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border border-dashed border-ui-border-base rounded-xl p-3 text-center cursor-pointer hover:border-ui-border-interactive hover:bg-ui-bg-subtle/50 transition-all flex items-center justify-center gap-3"
                >
                  {imagePreview ? (
                    <div className="w-20 h-14 rounded-md overflow-hidden border border-ui-border-base shrink-0">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <Photo className="w-6 h-6 text-ui-fg-muted" />
                  )}
                  <span className="text-xs text-ui-fg-interactive font-medium">
                    {imagePreview ? "Click to change social image" : "Upload custom social preview image"}
                  </span>
                </div>
              </div>

              {/* Structured Data JSON */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ui-fg-base">
                  Structured Data (Schema.org JSON-LD)
                </label>
                <Textarea
                  value={structuredData}
                  onChange={(e) => setStructuredData(e.target.value)}
                  placeholder='{ "@context": "https://schema.org", "@type": "Product" }'
                  className="text-xs font-mono min-h-[90px]"
                />
              </div>
            </Drawer.Body>

            <Drawer.Footer className="border-t border-ui-border-base flex justify-end gap-2 p-4">
              <Button variant="secondary" size="small" type="button" onClick={() => setIsDrawerOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="small" type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <ArrowPath className="w-3.5 h-3.5 animate-spin mr-1" />
                    Saving...
                  </>
                ) : (
                  "Save SEO Tags"
                )}
              </Button>
            </Drawer.Footer>
          </form>
        </Drawer.Content>
      </Drawer>
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: "product.details.after",
});

export default ProductSeoWidget;

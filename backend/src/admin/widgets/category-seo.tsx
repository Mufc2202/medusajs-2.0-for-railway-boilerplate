import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { DetailWidgetProps, AdminProductCategory } from "@medusajs/framework/types";
import { GlobeEurope, PencilSquare, Photo, Plus, ArrowPath } from "@medusajs/icons";
import {
  Container,
  Heading,
  Text,
  Badge,
  Button,
  Input,
  Drawer,
  toast,
  Toaster,
  Textarea,
} from "@medusajs/ui";
import { useState, useEffect, useRef } from "react";

export interface CategorySeoDetails {
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

const CategorySeoWidget = ({ data }: DetailWidgetProps<AdminProductCategory>) => {
  const [seo, setSeo] = useState<CategorySeoDetails | null>(null);
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

  const fetchSeo = async () => {
    if (!data?.id) return;
    try {
      setLoading(true);
      const res = await fetch(`/admin/category-seo/${data.id}`, {
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
      console.error("Error fetching category SEO:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeo();
  }, [data?.id]);

  const openEditDrawer = () => {
    setMetaTitle(seo?.metaTitle || data?.name || "");
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
    setImagePreview(seo?.metaImage || "");
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
        ? `/admin/category-seo/${data.id}/${seo.id}`
        : `/admin/category-seo/${data.id}`;
      const method = seo?.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formData,
        credentials: "include",
      });

      if (res.ok) {
        toast.success("Category SEO saved successfully");
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
              Category SEO Metadata
            </Heading>
            <Text className="text-xs text-ui-fg-subtle">
              Meta tags and Google indexing rules for category: <span className="font-semibold">{data.name}</span>
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
          Loading category SEO...
        </div>
      ) : seo ? (
        <div className="space-y-3">
          <div className="p-4 rounded-xl border border-ui-border-base bg-ui-bg-subtle/40 space-y-1">
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono truncate">
              {seo.canonicalURL || `https://dolgins.com/categories/${data.handle}`}
            </div>
            <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 line-clamp-1">
              {seo.metaTitle || data.name}
            </div>
            <div className="text-xs text-ui-fg-subtle line-clamp-2">
              {seo.metaDescription || data.description || "No description set."}
            </div>
          </div>
        </div>
      ) : (
        <div className="py-4 text-center flex flex-col items-center justify-center gap-2">
          <Text className="text-xs text-ui-fg-subtle">
            No custom SEO tags configured for this category.
          </Text>
          <Button variant="secondary" size="small" onClick={openEditDrawer}>
            <Plus className="w-3.5 h-3.5 mr-1" />
            Set Category SEO Tags
          </Button>
        </div>
      )}

      {/* Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <Drawer.Content className="max-w-xl">
          <form onSubmit={handleSaveSeo} className="flex flex-col h-full">
            <Drawer.Header>
              <Drawer.Title>Category SEO & Social Metadata</Drawer.Title>
              <Drawer.Description>
                Optimize search engine discovery for category {data.name}.
              </Drawer.Description>
            </Drawer.Header>

            <Drawer.Body className="space-y-4 overflow-y-auto p-4 sm:p-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ui-fg-base">Meta Title</label>
                <Input
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="e.g. Diamond Engagement Rings | Dolgins Jewelry"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ui-fg-base">Meta Description</label>
                <Textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Browse our exclusive collection of custom diamond engagement rings and bridal jewelry."
                  className="text-xs min-h-[80px]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ui-fg-base">Keywords</label>
                <Input
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="engagement rings, diamonds, bridal"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ui-fg-base">Canonical URL</label>
                <Input
                  value={canonicalURL}
                  onChange={(e) => setCanonicalURL(e.target.value)}
                  placeholder={`https://dolgins.com/categories/${data.handle}`}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ui-fg-base">Robots Tag</label>
                <Input
                  value={metaRobots}
                  onChange={(e) => setMetaRobots(e.target.value)}
                  placeholder="index, follow"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ui-fg-base">Social Sharing Image</label>
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
                    {imagePreview ? "Change category social image" : "Upload category social banner"}
                  </span>
                </div>
              </div>
            </Drawer.Body>

            <Drawer.Footer className="border-t border-ui-border-base flex justify-end gap-2 p-4">
              <Button variant="secondary" size="small" type="button" onClick={() => setIsDrawerOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="small" type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Category SEO"}
              </Button>
            </Drawer.Footer>
          </form>
        </Drawer.Content>
      </Drawer>
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: "product_category.details.after",
});

export default CategorySeoWidget;

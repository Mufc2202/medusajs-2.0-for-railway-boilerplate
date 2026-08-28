import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { DetailWidgetProps, AdminProductCategory } from "@medusajs/framework/types";
import { Photo, PencilSquare, Plus, ArrowPath, Trash } from "@medusajs/icons";
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
  Select,
} from "@medusajs/ui";
import { useState, useEffect, useRef } from "react";

export interface CategoryDetailsItem {
  id?: string;
  thumbnail?: string | null;
  product_aspect_ratio?: string | null;
  product_bg_color?: string | null;
  media?: string[] | null;
}

const CategoryDetailsWidget = ({ data }: DetailWidgetProps<AdminProductCategory>) => {
  const [details, setDetails] = useState<CategoryDetailsItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  // Form Fields
  const [aspectRatio, setAspectRatio] = useState<string>("1:1");
  const [bgColor, setBgColor] = useState<string>("#ffffff");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const fetchCategoryDetails = async () => {
    if (!data?.id) return;
    try {
      setLoading(true);
      const res = await fetch(`/admin/product-category-details/category/${data.id}`, {
        credentials: "include",
      });
      if (res.ok) {
        const json = await res.json();
        const catDetails = json.categoryDetails || json.data || json;
        if (catDetails && (catDetails.id || catDetails.thumbnail)) {
          setDetails(catDetails);
        } else {
          setDetails(null);
        }
      }
    } catch (err) {
      console.error("Error fetching category details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryDetails();
  }, [data?.id]);

  const openEditDrawer = () => {
    setAspectRatio(details?.product_aspect_ratio || "1:1");
    setBgColor(details?.product_bg_color || "#ffffff");
    setThumbnailFile(null);
    setThumbnailPreview(details?.thumbnail || "");
    setIsDrawerOpen(true);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("product_aspect_ratio", aspectRatio);
      formData.append("product_bg_color", bgColor);

      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }

      const res = await fetch(`/admin/product-category-details/category/${data.id}`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (res.ok) {
        toast.success("Category media details saved");
        setIsDrawerOpen(false);
        fetchCategoryDetails();
      } else {
        const err = await res.json();
        toast.error("Failed to save category details", {
          description: err.message || "Unknown error",
        });
      }
    } catch (err: any) {
      toast.error("Error saving details: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container className="p-5 shadow-xs border border-ui-border-base space-y-4 mt-4">
      <Toaster />
      <div className="flex items-center justify-between border-b border-ui-border-base pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600">
            <Photo className="w-5 h-5" />
          </div>
          <div>
            <Heading level="h2" className="text-sm sm:text-base font-bold text-ui-fg-base">
              Category Media & Display Settings
            </Heading>
            <Text className="text-xs text-ui-fg-subtle">
              Storefront category hero thumbnail, aspect ratio, and backdrop colors.
            </Text>
          </div>
        </div>

        <Button variant="secondary" size="small" onClick={openEditDrawer}>
          <PencilSquare className="w-3.5 h-3.5 mr-1" />
          {details ? "Edit Media" : "Configure Media"}
        </Button>
      </div>

      {loading ? (
        <div className="py-6 text-center text-xs text-ui-fg-muted flex items-center justify-center gap-2">
          <ArrowPath className="w-4 h-4 animate-spin text-ui-fg-interactive" />
          Loading media details...
        </div>
      ) : details ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs items-center">
          {/* Thumbnail */}
          <div className="flex items-center gap-3 p-3 rounded-xl border border-ui-border-base bg-ui-bg-subtle/30">
            <div className="w-14 h-14 rounded-lg overflow-hidden border border-ui-border-base bg-ui-bg-base shrink-0 flex items-center justify-center">
              {details.thumbnail ? (
                <img src={details.thumbnail} alt="Category" className="w-full h-full object-cover" />
              ) : (
                <Photo className="w-6 h-6 text-ui-fg-muted" />
              )}
            </div>
            <div>
              <span className="font-semibold text-ui-fg-base block">Category Hero</span>
              <span className="text-[11px] text-ui-fg-subtle">{details.thumbnail ? "Uploaded" : "None"}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl border border-ui-border-base bg-ui-bg-base">
            <span className="text-[11px] text-ui-fg-muted block">Product Aspect Ratio:</span>
            <span className="font-semibold text-ui-fg-base text-sm mt-0.5 block">
              {details.product_aspect_ratio || "1:1"}
            </span>
          </div>

          <div className="p-3 rounded-xl border border-ui-border-base bg-ui-bg-base flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg border border-ui-border-base shrink-0 shadow-xs"
              style={{ backgroundColor: details.product_bg_color || "#ffffff" }}
            />
            <div>
              <span className="text-[11px] text-ui-fg-muted block">Background Color:</span>
              <span className="font-mono text-xs font-semibold text-ui-fg-base">
                {details.product_bg_color || "#ffffff"}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-4 text-center flex flex-col items-center justify-center gap-2">
          <Text className="text-xs text-ui-fg-subtle">
            No category media or display styling configured.
          </Text>
          <Button variant="secondary" size="small" onClick={openEditDrawer}>
            <Plus className="w-3.5 h-3.5 mr-1" />
            Set Category Media & Colors
          </Button>
        </div>
      )}

      {/* Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <Drawer.Content className="max-w-md">
          <form onSubmit={handleSaveDetails} className="flex flex-col h-full">
            <Drawer.Header>
              <Drawer.Title>Category Media & Backdrop</Drawer.Title>
              <Drawer.Description>
                Configure storefront display settings for category {data.name}.
              </Drawer.Description>
            </Drawer.Header>

            <Drawer.Body className="space-y-4 overflow-y-auto p-4 sm:p-6">
              {/* Category Thumbnail Image */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ui-fg-base">Category Banner Thumbnail</label>
                <input
                  type="file"
                  ref={thumbnailInputRef}
                  onChange={handleThumbnailChange}
                  accept="image/*"
                  className="hidden"
                />
                <div
                  onClick={() => thumbnailInputRef.current?.click()}
                  className="border-2 border-dashed border-ui-border-base rounded-xl p-4 text-center cursor-pointer hover:border-ui-border-interactive hover:bg-ui-bg-subtle/50 transition-all flex flex-col items-center justify-center gap-2"
                >
                  {thumbnailPreview ? (
                    <div className="relative w-full h-32 rounded-lg overflow-hidden border border-ui-border-base group">
                      <img src={thumbnailPreview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-medium transition-opacity">
                        Click to change image
                      </div>
                    </div>
                  ) : (
                    <>
                      <Photo className="w-6 h-6 text-ui-fg-muted" />
                      <span className="text-xs text-ui-fg-interactive font-medium">
                        Upload category hero thumbnail
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Aspect Ratio */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ui-fg-base">Product Grid Aspect Ratio</label>
                <Input
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  placeholder="1:1, 4:3, 16:9, or 3:4"
                  className="text-xs"
                />
              </div>

              {/* Background Color */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ui-fg-base">Backdrop Tint / Color (Hex)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-9 h-9 p-0.5 rounded-lg border border-ui-border-base cursor-pointer bg-transparent"
                  />
                  <Input
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    placeholder="#ffffff or #f8f9fa"
                    className="text-xs font-mono"
                  />
                </div>
              </div>
            </Drawer.Body>

            <Drawer.Footer className="border-t border-ui-border-base flex justify-end gap-2 p-4">
              <Button variant="secondary" size="small" type="button" onClick={() => setIsDrawerOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="small" type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Media"}
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

export default CategoryDetailsWidget;

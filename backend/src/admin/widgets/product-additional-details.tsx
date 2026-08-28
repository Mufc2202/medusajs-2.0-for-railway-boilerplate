import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types";
import { DocumentText, PencilSquare, Plus, ArrowPath, InformationCircleSolid } from "@medusajs/icons";
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
  Switch,
} from "@medusajs/ui";
import { useState, useEffect } from "react";

export interface AdditionalDetailsItem {
  id?: string;
  additional_description?: string | null;
  additional_details_title?: string | null;
  additional_details_content?: string | null;
  grid_view?: boolean | null;
}

const ProductAdditionalDetailsWidget = ({ data }: DetailWidgetProps<AdminProduct>) => {
  const [details, setDetails] = useState<AdditionalDetailsItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  // Form Fields
  const [addDescription, setAddDescription] = useState<string>("");
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalContent, setModalContent] = useState<string>("");
  const [gridView, setGridView] = useState<boolean>(false);

  const fetchAdditionalDetails = async () => {
    if (!data?.id) return;
    try {
      setLoading(true);
      const res = await fetch(`/admin/product-additional-details/product/${data.id}`, {
        credentials: "include",
      });
      if (res.ok) {
        const json = await res.json();
        const addDetails = json.additionalDetails || json.data || json;
        if (addDetails && (addDetails.id || addDetails.additional_details_title)) {
          setDetails(addDetails);
        } else {
          setDetails(null);
        }
      }
    } catch (err) {
      console.error("Error fetching product additional details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdditionalDetails();
  }, [data?.id]);

  const openEditDrawer = () => {
    setAddDescription(details?.additional_description || "");
    setModalTitle(details?.additional_details_title || "");
    setModalContent(details?.additional_details_content || "");
    setGridView(!!details?.grid_view);
    setIsDrawerOpen(true);
  };

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        additional_description: addDescription,
        additional_details_title: modalTitle,
        additional_details_content: modalContent,
        grid_view: gridView,
      };

      const res = await fetch(`/admin/product-additional-details/product/${data.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (res.ok) {
        toast.success("Additional details saved successfully");
        setIsDrawerOpen(false);
        fetchAdditionalDetails();
      } else {
        const err = await res.json();
        toast.error("Failed to save details", {
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
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600">
            <InformationCircleSolid className="w-5 h-5" />
          </div>
          <div>
            <Heading level="h2" className="text-sm sm:text-base font-bold text-ui-fg-base">
              Custom Product Specifications & Modal Content
            </Heading>
            <Text className="text-xs text-ui-fg-subtle">
              Supplementary specifications, care instructions, diamond certificates, and pop-up modal details.
            </Text>
          </div>
        </div>

        <Button variant="secondary" size="small" onClick={openEditDrawer}>
          <PencilSquare className="w-3.5 h-3.5 mr-1" />
          {details ? "Edit Specifications" : "Configure Details"}
        </Button>
      </div>

      {loading ? (
        <div className="py-6 text-center text-xs text-ui-fg-muted flex items-center justify-center gap-2">
          <ArrowPath className="w-4 h-4 animate-spin text-ui-fg-interactive" />
          Loading additional specifications...
        </div>
      ) : details ? (
        <div className="space-y-3 text-xs">
          {details.additional_description && (
            <div className="p-3.5 rounded-xl border border-ui-border-base bg-ui-bg-subtle/30 space-y-1">
              <span className="text-[11px] text-ui-fg-muted font-semibold block">Extended Description:</span>
              <p className="text-xs text-ui-fg-base">{details.additional_description}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-xl border border-ui-border-base bg-ui-bg-base space-y-1">
              <span className="text-[11px] text-ui-fg-muted font-semibold block">Modal Card Title:</span>
              <span className="font-semibold text-xs text-ui-fg-base block">
                {details.additional_details_title || "None"}
              </span>
              {details.additional_details_content && (
                <p className="text-xs text-ui-fg-subtle line-clamp-2 mt-1">
                  {details.additional_details_content}
                </p>
              )}
            </div>

            <div className="p-3.5 rounded-xl border border-ui-border-base bg-ui-bg-base flex items-center justify-between">
              <div>
                <span className="text-[11px] text-ui-fg-muted font-semibold block">Layout Display:</span>
                <span className="font-semibold text-xs text-ui-fg-base block mt-0.5">
                  {details.grid_view ? "Grid View Enabled" : "Standard List View"}
                </span>
              </div>
              <Badge size="xsmall" color={details.grid_view ? "blue" : "grey"}>
                {details.grid_view ? "Grid Mode" : "List Mode"}
              </Badge>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-4 text-center flex flex-col items-center justify-center gap-2">
          <Text className="text-xs text-ui-fg-subtle">
            No supplementary specifications or custom modal details set for this product.
          </Text>
          <Button variant="secondary" size="small" onClick={openEditDrawer}>
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Custom Specifications
          </Button>
        </div>
      )}

      {/* Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <Drawer.Content className="max-w-xl">
          <form onSubmit={handleSaveDetails} className="flex flex-col h-full">
            <Drawer.Header>
              <Drawer.Title>Product Specifications & Modal</Drawer.Title>
              <Drawer.Description>
                Configure additional specifications and interactive popup modal content for {data.title}.
              </Drawer.Description>
            </Drawer.Header>

            <Drawer.Body className="space-y-4 overflow-y-auto p-4 sm:p-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ui-fg-base">Supplementary Description</label>
                <Textarea
                  value={addDescription}
                  onChange={(e) => setAddDescription(e.target.value)}
                  placeholder="e.g. Ring sizing guide, custom engraving options, or hallmark authentication details."
                  className="text-xs min-h-[80px]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ui-fg-base">Detail Modal Title</label>
                <Input
                  value={modalTitle}
                  onChange={(e) => setModalTitle(e.target.value)}
                  placeholder="e.g. Diamond Grading & Certification Details"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ui-fg-base">Detail Modal Body Content</label>
                <Textarea
                  value={modalContent}
                  onChange={(e) => setModalContent(e.target.value)}
                  placeholder="e.g. Every diamond sold by Dolgins is graded according to GIA standards for Cut, Color, Clarity, and Carat weight."
                  className="text-xs min-h-[110px]"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-ui-border-base bg-ui-bg-subtle/40">
                <div>
                  <span className="text-xs font-semibold block text-ui-fg-base">Grid View Display</span>
                  <span className="text-[11px] text-ui-fg-subtle block">
                    Render specifications as a structured 2-column grid on the product details page.
                  </span>
                </div>
                <Switch checked={gridView} onCheckedChange={setGridView} />
              </div>
            </Drawer.Body>

            <Drawer.Footer className="border-t border-ui-border-base flex justify-end gap-2 p-4">
              <Button variant="secondary" size="small" type="button" onClick={() => setIsDrawerOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="small" type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Specifications"}
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

export default ProductAdditionalDetailsWidget;

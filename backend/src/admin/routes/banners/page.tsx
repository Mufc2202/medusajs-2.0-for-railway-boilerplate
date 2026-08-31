import { defineRouteConfig } from "@medusajs/admin-sdk";
import {
  Photo,
  Plus,
  Trash,
  PencilSquare,
  EllipsisHorizontal,
  ArrowPath,
  MagnifyingGlass,
  ArrowUpRightOnBox,
} from "@medusajs/icons";
import {
  Container,
  Heading,
  Text,
  Button,
  Input,
  Table,
  Drawer,
  IconButton,
  DropdownMenu,
  Switch,
  StatusBadge,
  Label,
  Hint,
  usePrompt,
  toast,
  Toaster,
  Textarea,
  clx,
} from "@medusajs/ui";
import { useState, useEffect, useMemo, useRef } from "react";

export interface BannerItem {
  id: string;
  name: string;
  text: string;
  link?: string | null;
  image?: string | null;
  isActive: boolean;
  metadata?: Record<string, any> | null;
  created_at?: string;
  updated_at?: string;
}

const BannersPage = () => {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  const prompt = usePrompt();

  // Create / Edit Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [editingBanner, setEditingBanner] = useState<BannerItem | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  // Form Fields
  const [formName, setFormName] = useState<string>("");
  const [formText, setFormText] = useState<string>("");
  const [formLink, setFormLink] = useState<string>("");
  const [formIsActive, setFormIsActive] = useState<boolean>(true);
  const [formImageFile, setFormImageFile] = useState<File | null>(null);
  const [formImagePreview, setFormImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch Banners from API
  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await fetch("/admin/banner-images", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setBanners(data.bannerList || []);
      } else {
        toast.error("Failed to load banners");
      }
    } catch (err: any) {
      toast.error("Error fetching banners: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Filtered Banners
  const filteredBanners = useMemo(() => {
    return banners.filter((b) => {
      const matchSearch =
        search === "" ||
        b.name?.toLowerCase().includes(search.toLowerCase()) ||
        b.text?.toLowerCase().includes(search.toLowerCase()) ||
        b.link?.toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && b.isActive) ||
        (statusFilter === "inactive" && !b.isActive);

      return matchSearch && matchStatus;
    });
  }, [banners, search, statusFilter]);

  // Open Create Drawer
  const openCreateDrawer = () => {
    setEditingBanner(null);
    setFormName("");
    setFormText("");
    setFormLink("");
    setFormIsActive(true);
    setFormImageFile(null);
    setFormImagePreview("");
    setIsDrawerOpen(true);
  };

  // Open Edit Drawer
  const openEditDrawer = (banner: BannerItem) => {
    setEditingBanner(banner);
    setFormName(banner.name || "");
    setFormText(banner.text || "");
    setFormLink(banner.link || "");
    setFormIsActive(!!banner.isActive);
    setFormImageFile(null);
    setFormImagePreview(banner.image || "");
    setIsDrawerOpen(true);
  };

  // Handle Image Selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormImageFile(file);
      setFormImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle Save (Create or Update)
  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error("Banner name is required");
      return;
    }
    if (!formText.trim()) {
      toast.error("Banner text is required");
      return;
    }

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("name", formName.trim());
      formData.append("text", formText.trim());
      formData.append("link", formLink.trim());
      formData.append("isActive", formIsActive ? "true" : "false");

      if (formImageFile) {
        formData.append("files", formImageFile);
      }

      let url = "/admin/banner-images";
      let method = "POST";

      if (editingBanner) {
        url = `/admin/banner-images/${editingBanner.id}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        body: formData,
        credentials: "include",
      });

      if (res.ok) {
        toast.success(
          editingBanner ? "Banner updated successfully" : "Banner created successfully"
        );
        setIsDrawerOpen(false);
        fetchBanners();
      } else {
        const errData = await res.json();
        toast.error("Failed to save banner", {
          description: errData.message || "Unknown error",
        });
      }
    } catch (err: any) {
      toast.error("Error saving banner: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Handle Delete Banner with native Medusa prompt
  const handleDeleteBanner = async (id: string, name: string) => {
    const userConfirmed = await prompt({
      title: "Delete Banner",
      description: `Are you sure you want to delete banner "${name}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
    });

    if (!userConfirmed) return;

    try {
      const res = await fetch(`/admin/banner-images/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        toast.success(`Banner "${name}" deleted`);
        fetchBanners();
      } else {
        toast.error("Failed to delete banner");
      }
    } catch (err: any) {
      toast.error("Error deleting banner: " + err.message);
    }
  };

  // Toggle Active Status
  const handleToggleActive = async (banner: BannerItem) => {
    try {
      const formData = new FormData();
      formData.append("name", banner.name);
      formData.append("text", banner.text || "");
      formData.append("link", banner.link || "");
      formData.append("isActive", !banner.isActive ? "true" : "false");

      const res = await fetch(`/admin/banner-images/${banner.id}`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      if (res.ok) {
        toast.success(
          !banner.isActive
            ? `Banner "${banner.name}" published`
            : `Banner "${banner.name}" moved to draft`
        );
        fetchBanners();
      } else {
        toast.error("Failed to update banner status");
      }
    } catch (err: any) {
      toast.error("Error toggling banner status: " + err.message);
    }
  };

  return (
    <div className="flex flex-col gap-y-2">
      <Toaster />

      {/* Standard Medusa Container Card */}
      <Container className="divide-y p-0 overflow-hidden shadow-xs">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <Heading level="h1" className="text-lg font-semibold text-ui-fg-base">
              Banners
            </Heading>
            <Text size="small" className="text-ui-fg-subtle">
              Manage promotional banners, hero sliders, and announcement alerts across your storefront.
            </Text>
          </div>

          <div className="flex items-center gap-x-2">
            <Button
              variant="secondary"
              size="small"
              onClick={fetchBanners}
              disabled={loading}
            >
              <ArrowPath className={clx("w-3.5 h-3.5", loading && "animate-spin")} />
              Refresh
            </Button>
            <Button variant="secondary" size="small" onClick={openCreateDrawer}>
              <Plus className="w-3.5 h-3.5" />
              Create Banner
            </Button>
          </div>
        </div>

        {/* Search & Filter Toolbar (type="text" prevents double magnifying glass icon) */}
        <div className="px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-ui-bg-subtle/30">
          <div className="relative flex-1 max-w-xs">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ui-fg-muted pointer-events-none" />
            <Input
              size="small"
              type="text"
              placeholder="Search banners..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-x-1.5 self-end sm:self-auto">
            <Button
              variant={statusFilter === "all" ? "primary" : "secondary"}
              size="small"
              onClick={() => setStatusFilter("all")}
            >
              All ({banners.length})
            </Button>
            <Button
              variant={statusFilter === "active" ? "primary" : "secondary"}
              size="small"
              onClick={() => setStatusFilter("active")}
            >
              Published ({banners.filter((b) => b.isActive).length})
            </Button>
            <Button
              variant={statusFilter === "inactive" ? "primary" : "secondary"}
              size="small"
              onClick={() => setStatusFilter("inactive")}
            >
              Drafts ({banners.filter((b) => !b.isActive).length})
            </Button>
          </div>
        </div>

        {/* Table Content */}
        {loading ? (
          <div className="py-16 text-center text-ui-fg-muted flex flex-col items-center justify-center gap-2">
            <ArrowPath className="w-5 h-5 animate-spin text-ui-fg-interactive" />
            <Text size="small">Loading banners...</Text>
          </div>
        ) : filteredBanners.length === 0 ? (
          <div className="py-16 text-center flex flex-col items-center justify-center gap-3 px-4">
            <div className="p-3 bg-ui-bg-subtle rounded-full border border-ui-border-base">
              <Photo className="w-6 h-6 text-ui-fg-muted" />
            </div>
            <div>
              <Heading level="h3" className="text-base font-semibold text-ui-fg-base">
                {search ? "No matching banners" : "No banners created yet"}
              </Heading>
              <Text size="small" className="text-ui-fg-subtle max-w-sm mt-1">
                {search
                  ? `No banners match "${search}".`
                  : "Get started by creating promotional hero banners for your storefront."}
              </Text>
            </div>
            {!search && (
              <Button size="small" variant="secondary" onClick={openCreateDrawer}>
                <Plus className="w-3.5 h-3.5 mr-1" />
                Create Banner
              </Button>
            )}
          </div>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell className="w-[45%]">Banner</Table.HeaderCell>
                <Table.HeaderCell className="w-[30%]">Destination Link</Table.HeaderCell>
                <Table.HeaderCell className="w-[20%]">Status</Table.HeaderCell>
                <Table.HeaderCell className="w-12 text-right">Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredBanners.map((banner) => (
                <Table.Row key={banner.id} className="h-12">
                  {/* Banner: Inline Thumbnail + Name + Copy */}
                  <Table.Cell>
                    <div className="flex items-center gap-x-3 overflow-hidden py-1">
                      <div className="w-10 h-8 rounded border border-ui-border-base overflow-hidden bg-ui-bg-subtle shrink-0 flex items-center justify-center">
                        {banner.image ? (
                          <img
                            src={banner.image}
                            alt={banner.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Photo className="w-4 h-4 text-ui-fg-muted" />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span
                          className="font-medium text-xs text-ui-fg-base truncate block"
                          title={banner.name}
                        >
                          {banner.name}
                        </span>
                        {banner.text && (
                          <span
                            className="text-[11px] text-ui-fg-subtle truncate block"
                            title={banner.text}
                          >
                            {banner.text}
                          </span>
                        )}
                      </div>
                    </div>
                  </Table.Cell>

                  {/* Link Destination */}
                  <Table.Cell>
                    {banner.link ? (
                      <a
                        href={banner.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-ui-fg-interactive hover:underline inline-flex items-center gap-1 text-xs truncate max-w-xs"
                      >
                        <span className="truncate">{banner.link}</span>
                        <ArrowUpRightOnBox className="w-3 h-3 shrink-0" />
                      </a>
                    ) : (
                      <span className="text-xs text-ui-fg-muted italic">—</span>
                    )}
                  </Table.Cell>

                  {/* Status Badge */}
                  <Table.Cell>
                    <StatusBadge
                      color={banner.isActive ? "green" : "grey"}
                      className="cursor-pointer select-none"
                      onClick={() => handleToggleActive(banner)}
                    >
                      {banner.isActive ? "Published" : "Draft"}
                    </StatusBadge>
                  </Table.Cell>

                  {/* Actions Menu */}
                  <Table.Cell className="text-right">
                    <DropdownMenu>
                      <DropdownMenu.Trigger asChild>
                        <IconButton variant="transparent" size="small">
                          <EllipsisHorizontal className="w-4 h-4 text-ui-fg-muted" />
                        </IconButton>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content align="end" className="w-40">
                        <DropdownMenu.Item onClick={() => openEditDrawer(banner)} className="gap-x-2">
                          <PencilSquare className="w-4 h-4" />
                          Edit
                        </DropdownMenu.Item>
                        <DropdownMenu.Item onClick={() => handleToggleActive(banner)} className="gap-x-2">
                          {banner.isActive ? "Move to draft" : "Publish"}
                        </DropdownMenu.Item>
                        <DropdownMenu.Separator />
                        <DropdownMenu.Item
                          onClick={() => handleDeleteBanner(banner.id, banner.name)}
                          className="gap-x-2 text-ui-fg-error"
                        >
                          <Trash className="w-4 h-4" />
                          Delete
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </Container>

      {/* Standard Medusa Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <Drawer.Content className="max-w-lg">
          <form onSubmit={handleSaveBanner} className="flex flex-col h-full">
            <Drawer.Header>
              <Drawer.Title>
                {editingBanner ? "Edit Banner" : "Create Banner"}
              </Drawer.Title>
              <Drawer.Description>
                Configure banner image, link destination, and visibility settings.
              </Drawer.Description>
            </Drawer.Header>

            <Drawer.Body className="space-y-4 p-6 overflow-y-auto">
              {/* Name */}
              <div className="flex flex-col gap-y-2">
                <Label size="small" weight="plus">
                  Banner Name <span className="text-ui-fg-error">*</span>
                </Label>
                <Input
                  size="small"
                  placeholder="e.g. Summer Diamond Collection Sale"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                />
              </div>

              {/* Text */}
              <div className="flex flex-col gap-y-2">
                <Label size="small" weight="plus">
                  Banner Content / Copy <span className="text-ui-fg-error">*</span>
                </Label>
                <Textarea
                  placeholder="e.g. Save up to 25% on selected custom jewelry and wedding bands."
                  value={formText}
                  onChange={(e) => setFormText(e.target.value)}
                  className="min-h-[85px]"
                  required
                />
              </div>

              {/* Link */}
              <div className="flex flex-col gap-y-2">
                <Label size="small" weight="plus">
                  Target Link (URL or relative path)
                </Label>
                <Input
                  size="small"
                  placeholder="e.g. /categories/diamonds or https://dolgins.com/sale"
                  value={formLink}
                  onChange={(e) => setFormLink(e.target.value)}
                />
                <Hint>Optional link when customers click on this banner.</Hint>
              </div>

              {/* Image Upload */}
              <div className="flex flex-col gap-y-2">
                <Label size="small" weight="plus">Banner Image Asset</Label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border border-dashed border-ui-border-base rounded-lg p-4 text-center cursor-pointer hover:bg-ui-bg-subtle/50 transition-colors flex flex-col items-center justify-center gap-y-2"
                >
                  {formImagePreview ? (
                    <div className="relative w-full h-32 rounded overflow-hidden border border-ui-border-base">
                      <img
                        src={formImagePreview}
                        alt="Banner Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center text-white text-xs font-medium transition-opacity">
                        Click to change image
                      </div>
                    </div>
                  ) : (
                    <>
                      <Photo className="w-6 h-6 text-ui-fg-muted" />
                      <Text size="small" className="text-ui-fg-subtle">
                        <span className="font-semibold text-ui-fg-interactive">Upload image</span> (PNG, JPG, WEBP)
                      </Text>
                    </>
                  )}
                </div>
              </div>

              {/* Publish Switch */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-ui-border-base bg-ui-bg-subtle/30">
                <div className="flex flex-col">
                  <Label size="small" weight="plus">Publish immediately</Label>
                  <Text size="xsmall" className="text-ui-fg-subtle">
                    Make this banner active on your live storefront immediately.
                  </Text>
                </div>
                <Switch
                  checked={formIsActive}
                  onCheckedChange={setFormIsActive}
                />
              </div>
            </Drawer.Body>

            <Drawer.Footer className="border-t border-ui-border-base flex justify-end gap-x-2 p-4">
              <Button
                variant="secondary"
                size="small"
                type="button"
                onClick={() => setIsDrawerOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" size="small" type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <ArrowPath className="w-3.5 h-3.5 animate-spin mr-1" />
                    Saving...
                  </>
                ) : editingBanner ? (
                  "Save changes"
                ) : (
                  "Create banner"
                )}
              </Button>
            </Drawer.Footer>
          </form>
        </Drawer.Content>
      </Drawer>
    </div>
  );
};

export const config = defineRouteConfig({
  label: "Banners",
  icon: Photo,
});

export default BannersPage;

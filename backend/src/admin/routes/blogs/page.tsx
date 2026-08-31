import { defineRouteConfig } from "@medusajs/admin-sdk";
import {
  DocumentText,
  Plus,
  Trash,
  PencilSquare,
  EllipsisHorizontal,
  ArrowPath,
  MagnifyingGlass,
  ArrowUpRightOnBox,
  Photo,
  XMarkMini,
} from "@medusajs/icons";
import {
  Container,
  Heading,
  Text,
  Badge,
  Button,
  Input,
  Table,
  Drawer,
  IconButton,
  DropdownMenu,
  Label,
  Hint,
  usePrompt,
  toast,
  Toaster,
  Textarea,
  clx,
} from "@medusajs/ui";
import { useState, useEffect, useMemo, useRef } from "react";

export interface BlogItem {
  id: string;
  title: string;
  subtitle?: string | null;
  handle: string;
  image?: string | null;
  content: string;
  product_categories?: Array<{ id: string; name?: string }>;
  user?: { id: string; email?: string; first_name?: string; last_name?: string };
  created_at?: string;
  updated_at?: string;
}

export interface ProductCategoryOption {
  id: string;
  name: string;
}

const BlogsAdminPage = () => {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [categories, setCategories] = useState<ProductCategoryOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");

  const prompt = usePrompt();

  // Drawer & Form State
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [editingBlog, setEditingBlog] = useState<BlogItem | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  // Form Fields
  const [formTitle, setFormTitle] = useState<string>("");
  const [formSubtitle, setFormSubtitle] = useState<string>("");
  const [formHandle, setFormHandle] = useState<string>("");
  const [formContent, setFormContent] = useState<string>("");
  const [formSelectedCategoryIds, setFormSelectedCategoryIds] = useState<string[]>([]);
  const [categorySearch, setCategorySearch] = useState<string>("");
  const [formImageFile, setFormImageFile] = useState<File | null>(null);
  const [formImagePreview, setFormImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch Blogs
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/admin/blogs", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setBlogs(data.blogs || []);
      } else {
        toast.error("Failed to load blog posts");
      }
    } catch (err: any) {
      toast.error("Error fetching blogs: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Product Categories
  const fetchCategories = async () => {
    try {
      const res = await fetch("/admin/product-categories?limit=100", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setCategories(
          (data.product_categories || []).map((c: any) => ({
            id: c.id,
            name: c.name,
          }))
        );
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, []);

  // Category Map for fast name lookup
  const categoryMap = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [categories]);

  // Filtered Categories inside Drawer
  const filteredCategoryOptions = useMemo(() => {
    if (!categorySearch.trim()) return categories;
    const q = categorySearch.toLowerCase();
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, categorySearch]);

  // Filtered Blogs
  const filteredBlogs = useMemo(() => {
    return blogs.filter((b) => {
      const q = search.toLowerCase();
      return (
        search === "" ||
        b.title?.toLowerCase().includes(q) ||
        b.subtitle?.toLowerCase().includes(q) ||
        b.handle?.toLowerCase().includes(q) ||
        b.content?.toLowerCase().includes(q)
      );
    });
  }, [blogs, search]);

  // Open Create Drawer
  const openCreateDrawer = () => {
    setEditingBlog(null);
    setFormTitle("");
    setFormSubtitle("");
    setFormHandle("");
    setFormContent("");
    setFormSelectedCategoryIds([]);
    setCategorySearch("");
    setFormImageFile(null);
    setFormImagePreview("");
    setIsDrawerOpen(true);
  };

  // Open Edit Drawer
  const openEditDrawer = (blog: BlogItem) => {
    setEditingBlog(blog);
    setFormTitle(blog.title || "");
    setFormSubtitle(blog.subtitle || "");
    setFormHandle(blog.handle || "");
    setFormContent(blog.content || "");
    setFormSelectedCategoryIds(
      (blog.product_categories || []).map((cat) => cat.id).filter(Boolean)
    );
    setCategorySearch("");
    setFormImageFile(null);
    setFormImagePreview(blog.image || "");
    setIsDrawerOpen(true);
  };

  // Helper: auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setFormTitle(val);
    if (!editingBlog) {
      const slug = val
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setFormHandle(slug);
    }
  };

  // Handle Image Selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormImageFile(file);
      setFormImagePreview(URL.createObjectURL(file));
    }
  };

  // Toggle Category selection
  const toggleCategory = (id: string) => {
    setFormSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Handle Save
  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!formHandle.trim()) {
      toast.error("Handle / URL slug is required");
      return;
    }
    if (!formContent.trim()) {
      toast.error("Content is required");
      return;
    }

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("title", formTitle.trim());
      formData.append("subtitle", formSubtitle.trim());
      formData.append("handle", formHandle.trim());
      formData.append("content", formContent.trim());
      formData.append("categories", JSON.stringify(formSelectedCategoryIds));

      if (formImageFile) {
        formData.append("blogImage", formImageFile);
      }

      let url = "/admin/blogs";
      let method = "POST";

      if (editingBlog) {
        url = `/admin/blogs/${editingBlog.id}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        body: formData,
        credentials: "include",
      });

      if (res.ok) {
        toast.success(
          editingBlog ? "Article updated successfully" : "Article published successfully"
        );
        setIsDrawerOpen(false);
        fetchBlogs();
      } else {
        const err = await res.json();
        toast.error("Failed to save article", {
          description: err.message || "Unknown error",
        });
      }
    } catch (err: any) {
      toast.error("Error saving article: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Handle Delete with native Medusa prompt
  const handleDeleteBlog = async (id: string, title: string) => {
    const userConfirmed = await prompt({
      title: "Delete Blog Article",
      description: `Are you sure you want to delete article "${title}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
    });

    if (!userConfirmed) return;

    try {
      const res = await fetch(`/admin/blogs/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        toast.success(`Article "${title}" deleted`);
        fetchBlogs();
      } else {
        toast.error("Failed to delete article");
      }
    } catch (err: any) {
      toast.error("Error deleting article: " + err.message);
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
              Blogs & Articles
            </Heading>
            <Text size="small" className="text-ui-fg-subtle">
              Manage educational articles, diamond buying guides, and news for your jewelry store.
            </Text>
          </div>

          <div className="flex items-center gap-x-2">
            <Button
              variant="secondary"
              size="small"
              onClick={fetchBlogs}
              disabled={loading}
            >
              <ArrowPath className={clx("w-3.5 h-3.5", loading && "animate-spin")} />
              Refresh
            </Button>
            <Button variant="secondary" size="small" onClick={openCreateDrawer}>
              <Plus className="w-3.5 h-3.5" />
              Write Article
            </Button>
          </div>
        </div>

        {/* Search Toolbar (type="text" prevents double magnifying glass icon) */}
        <div className="px-6 py-3 flex items-center justify-between gap-3 bg-ui-bg-subtle/30">
          <div className="relative flex-1 max-w-xs">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ui-fg-muted pointer-events-none" />
            <Input
              size="small"
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <Text size="small" className="text-ui-fg-subtle">
            {filteredBlogs.length} {filteredBlogs.length === 1 ? "article" : "articles"}
          </Text>
        </div>

        {/* Table Content */}
        {loading ? (
          <div className="py-16 text-center text-ui-fg-muted flex flex-col items-center justify-center gap-2">
            <ArrowPath className="w-5 h-5 animate-spin text-ui-fg-interactive" />
            <Text size="small">Loading articles...</Text>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="py-16 text-center flex flex-col items-center justify-center gap-3 px-4">
            <div className="p-3 bg-ui-bg-subtle rounded-full border border-ui-border-base">
              <DocumentText className="w-6 h-6 text-ui-fg-muted" />
            </div>
            <div>
              <Heading level="h3" className="text-base font-semibold text-ui-fg-base">
                {search ? "No matching articles" : "No articles written yet"}
              </Heading>
              <Text size="small" className="text-ui-fg-subtle max-w-sm mt-1">
                {search
                  ? `No articles match "${search}".`
                  : "Write your first blog post or education guide to engage customers."}
              </Text>
            </div>
            {!search && (
              <Button size="small" variant="secondary" onClick={openCreateDrawer}>
                <Plus className="w-3.5 h-3.5 mr-1" />
                Write Article
              </Button>
            )}
          </div>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell className="w-[38%]">Article</Table.HeaderCell>
                <Table.HeaderCell className="w-[24%]">Handle</Table.HeaderCell>
                <Table.HeaderCell className="w-[24%]">Categories</Table.HeaderCell>
                <Table.HeaderCell className="w-[14%]">Author</Table.HeaderCell>
                <Table.HeaderCell className="w-12 text-right">Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredBlogs.map((blog) => {
                const activeCats = (blog.product_categories || [])
                  .map((cat) => ({
                    id: cat.id,
                    name: cat.name || categoryMap.get(cat.id),
                  }))
                  .filter((cat) => Boolean(cat.name));

                return (
                  <Table.Row key={blog.id} className="h-12">
                    {/* Article: Inline Thumbnail + Title + Subtitle */}
                    <Table.Cell>
                      <div className="flex items-center gap-x-3 overflow-hidden py-1">
                        <div className="w-8 h-8 rounded border border-ui-border-base overflow-hidden bg-ui-bg-subtle shrink-0 flex items-center justify-center">
                          {blog.image ? (
                            <img
                              src={blog.image}
                              alt={blog.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <DocumentText className="w-4 h-4 text-ui-fg-muted" />
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span
                            className="font-medium text-xs text-ui-fg-base truncate block"
                            title={blog.title}
                          >
                            {blog.title}
                          </span>
                          {blog.subtitle && (
                            <span
                              className="text-[11px] text-ui-fg-subtle truncate block"
                              title={blog.subtitle}
                            >
                              {blog.subtitle}
                            </span>
                          )}
                        </div>
                      </div>
                    </Table.Cell>

                    {/* Dedicated Clean Handle Column */}
                    <Table.Cell>
                      <span
                        className="text-xs text-ui-fg-muted font-mono truncate block"
                        title={`/blogs/${blog.handle}`}
                      >
                        /blogs/{blog.handle}
                      </span>
                    </Table.Cell>

                    {/* Categories Column */}
                    <Table.Cell>
                      {activeCats.length === 0 ? (
                        <span className="text-xs text-ui-fg-muted">—</span>
                      ) : activeCats.length > 2 ? (
                        <span
                          className="text-xs text-ui-fg-subtle truncate block"
                          title={activeCats.map((c) => c.name).join(", ")}
                        >
                          {activeCats.slice(0, 2).map((c) => c.name).join(", ")}{" "}
                          <span className="text-ui-fg-muted font-medium">
                            (+{activeCats.length - 2} more)
                          </span>
                        </span>
                      ) : (
                        <span
                          className="text-xs text-ui-fg-subtle truncate block"
                          title={activeCats.map((c) => c.name).join(", ")}
                        >
                          {activeCats.map((c) => c.name).join(", ")}
                        </span>
                      )}
                    </Table.Cell>

                    {/* Author */}
                    <Table.Cell>
                      <Text size="small" className="text-ui-fg-subtle truncate block">
                        {blog.user
                          ? `${blog.user.first_name || ""} ${blog.user.last_name || blog.user.email || ""}`.trim() || "Staff"
                          : "Admin"}
                      </Text>
                    </Table.Cell>

                    {/* Actions */}
                    <Table.Cell className="text-right">
                      <DropdownMenu>
                        <DropdownMenu.Trigger asChild>
                          <IconButton variant="transparent" size="small">
                            <EllipsisHorizontal className="w-4 h-4 text-ui-fg-muted" />
                          </IconButton>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content align="end" className="w-40">
                          <DropdownMenu.Item onClick={() => openEditDrawer(blog)} className="gap-x-2">
                            <PencilSquare className="w-4 h-4" />
                            Edit
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            onClick={() => {
                              navigator.clipboard.writeText(`/blogs/${blog.handle}`);
                              toast.success("Slug copied to clipboard");
                            }}
                            className="gap-x-2"
                          >
                            <ArrowUpRightOnBox className="w-4 h-4" />
                            Copy Link
                          </DropdownMenu.Item>
                          <DropdownMenu.Separator />
                          <DropdownMenu.Item
                            onClick={() => handleDeleteBlog(blog.id, blog.title)}
                            className="gap-x-2 text-ui-fg-error"
                          >
                            <Trash className="w-4 h-4" />
                            Delete
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        )}
      </Container>

      {/* Standard Medusa Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <Drawer.Content className="max-w-2xl">
          <form onSubmit={handleSaveBlog} className="flex flex-col h-full">
            <Drawer.Header>
              <Drawer.Title>
                {editingBlog ? "Edit Article" : "Write Article"}
              </Drawer.Title>
              <Drawer.Description>
                Write customer guides, jewelry stories, and news in Markdown.
              </Drawer.Description>
            </Drawer.Header>

            <Drawer.Body className="space-y-4 p-6 overflow-y-auto">
              {/* Title */}
              <div className="flex flex-col gap-y-2">
                <Label size="small" weight="plus">
                  Title <span className="text-ui-fg-error">*</span>
                </Label>
                <Input
                  size="small"
                  placeholder="e.g. How to Choose the Perfect Diamond Cut"
                  value={formTitle}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                />
              </div>

              {/* Subtitle */}
              <div className="flex flex-col gap-y-2">
                <Label size="small" weight="plus">Subtitle / Summary</Label>
                <Input
                  size="small"
                  placeholder="e.g. A comprehensive guide to understanding diamond brilliance and proportions."
                  value={formSubtitle}
                  onChange={(e) => setFormSubtitle(e.target.value)}
                />
              </div>

              {/* Slug / Handle */}
              <div className="flex flex-col gap-y-2">
                <Label size="small" weight="plus">
                  URL Handle <span className="text-ui-fg-error">*</span>
                </Label>
                <div className="flex items-center gap-x-2">
                  <span className="text-xs text-ui-fg-muted font-mono bg-ui-bg-subtle px-2.5 py-1.5 rounded border border-ui-border-base">
                    /blogs/
                  </span>
                  <Input
                    size="small"
                    placeholder="how-to-choose-diamond-cut"
                    value={formHandle}
                    onChange={(e) => setFormHandle(e.target.value)}
                    className="font-mono flex-1"
                    required
                  />
                </div>
                <Hint>Unique URL path identifier for storefront routing.</Hint>
              </div>

              {/* Refined Categories Selector */}
              <div className="flex flex-col gap-y-2">
                <div className="flex items-center justify-between">
                  <Label size="small" weight="plus">Store Categories</Label>
                  <Text size="xsmall" className="text-ui-fg-subtle">
                    {formSelectedCategoryIds.length} selected
                  </Text>
                </div>

                {/* Selected Category Tags */}
                {formSelectedCategoryIds.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 items-center p-2 rounded-lg bg-ui-bg-subtle/50 border border-ui-border-base">
                    {formSelectedCategoryIds.map((id) => (
                      <Badge
                        key={id}
                        size="small"
                        color="blue"
                        className="gap-x-1 pr-1 select-none"
                      >
                        <span>{categoryMap.get(id) || id}</span>
                        <button
                          type="button"
                          onClick={() => toggleCategory(id)}
                          className="hover:bg-blue-200/50 dark:hover:bg-blue-900/50 rounded-full p-0.5 transition-colors"
                        >
                          <XMarkMini className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                    <Button
                      size="small"
                      variant="transparent"
                      type="button"
                      onClick={() => setFormSelectedCategoryIds([])}
                      className="text-ui-fg-muted hover:text-ui-fg-error text-[11px] h-6 px-1.5 ml-auto"
                    >
                      Clear all
                    </Button>
                  </div>
                )}

                {/* Searchable Category List Box */}
                <div className="rounded-lg border border-ui-border-base bg-ui-bg-base overflow-hidden">
                  <div className="p-2 border-b border-ui-border-base bg-ui-bg-subtle/30">
                    <div className="relative">
                      <MagnifyingGlass className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ui-fg-muted pointer-events-none" />
                      <Input
                        size="small"
                        type="text"
                        placeholder="Filter categories (e.g. rings, repair)..."
                        value={categorySearch}
                        onChange={(e) => setCategorySearch(e.target.value)}
                        className="pl-8 text-xs h-7"
                      />
                    </div>
                  </div>

                  <div className="max-h-44 overflow-y-auto p-1 divide-y divide-ui-border-base/40">
                    {filteredCategoryOptions.length === 0 ? (
                      <div className="py-4 text-center text-xs text-ui-fg-muted">
                        No categories found matching "{categorySearch}"
                      </div>
                    ) : (
                      filteredCategoryOptions.map((cat) => {
                        const isSelected = formSelectedCategoryIds.includes(cat.id);
                        return (
                          <div
                            key={cat.id}
                            onClick={() => toggleCategory(cat.id)}
                            className={clx(
                              "flex items-center justify-between px-3 py-1.5 text-xs rounded cursor-pointer transition-colors select-none",
                              isSelected
                                ? "bg-ui-bg-subtle font-medium text-ui-fg-base"
                                : "hover:bg-ui-bg-subtle/50 text-ui-fg-subtle hover:text-ui-fg-base"
                            )}
                          >
                            <span>{cat.name}</span>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="h-4 w-4 rounded border-ui-border-base text-ui-fg-interactive cursor-pointer pointer-events-none accent-ui-fg-interactive"
                            />
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
                <Hint>Assign one or more categories to cross-promote this article across category pages.</Hint>
              </div>

              {/* Image Asset */}
              <div className="flex flex-col gap-y-2">
                <Label size="small" weight="plus">Featured Cover Image</Label>
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
                    <div className="relative w-full h-36 rounded overflow-hidden border border-ui-border-base">
                      <img
                        src={formImagePreview}
                        alt="Cover preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center text-white text-xs font-medium transition-opacity">
                        Click to change cover image
                      </div>
                    </div>
                  ) : (
                    <>
                      <Photo className="w-6 h-6 text-ui-fg-muted" />
                      <Text size="small" className="text-ui-fg-subtle">
                        <span className="font-semibold text-ui-fg-interactive">Upload cover</span> (PNG, JPG, WEBP)
                      </Text>
                    </>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col gap-y-2">
                <div className="flex items-center justify-between">
                  <Label size="small" weight="plus">
                    Article Body (Markdown) <span className="text-ui-fg-error">*</span>
                  </Label>
                  <Text size="xsmall" className="text-ui-fg-muted">
                    Markdown formatting supported
                  </Text>
                </div>
                <Textarea
                  placeholder="Write your article content in Markdown format..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="font-mono text-xs min-h-[220px]"
                  required
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
                ) : editingBlog ? (
                  "Save changes"
                ) : (
                  "Publish article"
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
  label: "Blogs & Articles",
  icon: DocumentText,
});

export default BlogsAdminPage;

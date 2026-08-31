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
  Eye,
  EyeSlash,
  Star,
  Sparkles,
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
  Badge,
  Label,
  Hint,
  usePrompt,
  toast,
  Toaster,
  Textarea,
  clx,
} from "@medusajs/ui";
import { useState, useEffect, useMemo, useRef } from "react";

export interface InstagramPostItem {
  id: string;
  caption?: string | null;
  media_type: string;
  media_url: string;
  thumbnail_url?: string | null;
  permalink?: string | null;
  instagram_id?: string | null;
  likes_count: number;
  comments_count: number;
  is_visible: boolean;
  is_pinned: boolean;
  display_order: number;
  product_id?: string | null;
  product_title?: string | null;
  product_handle?: string | null;
  product_thumbnail?: string | null;
  product_price?: string | null;
  custom_cta_text?: string | null;
  custom_cta_link?: string | null;
  metadata?: Record<string, any> | null;
  created_at?: string;
  updated_at?: string;
}

const SAMPLE_DOLGINS_POSTS = [
  {
    caption: "Custom Old European cut diamond ring in 18k yellow gold with intricate hand milgrain detailing. Handcrafted in our Overland Park workshop.",
    media_url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000&auto=format&fit=crop",
    permalink: "https://www.instagram.com/dolgins_jewelry/",
    is_visible: true,
    is_pinned: true,
    display_order: 1,
    product_title: "Custom Heirloom Diamond Ring",
    product_handle: "custom-jewelry",
    product_price: "Custom Order",
    custom_cta_text: "Inquire Custom Design",
    custom_cta_link: "/t/custom-jewelry",
  },
  {
    caption: "Decades of heirloom restoration experience. Rescuing and restoring a stunning platinum Art Deco diamond eternity band.",
    media_url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop",
    permalink: "https://www.instagram.com/dolgins_jewelry/",
    is_visible: true,
    is_pinned: true,
    display_order: 2,
    product_title: "Fine Jewelry Repair & Restoration",
    product_handle: "jewelry-repair",
    product_price: "Service",
    custom_cta_text: "Learn About Restorations",
    custom_cta_link: "/t/jewelry-repair",
  },
  {
    caption: "A timeless 2.50ct oval diamond solitaire engagement ring set in custom platinum with a delicate hidden halo of melee diamonds.",
    media_url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop",
    permalink: "https://www.instagram.com/dolgins_jewelry/",
    is_visible: true,
    is_pinned: false,
    display_order: 3,
    product_title: "Oval Solitaire Diamond Ring",
    product_handle: "custom-jewelry",
    product_price: "$4,850.00",
    custom_cta_text: "View Design",
    custom_cta_link: "/t/custom-jewelry",
  },
  {
    caption: "Custom handmade yellow gold pendant featuring hand-engraved scrollwork and client's heirloom diamond.",
    media_url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1000&auto=format&fit=crop",
    permalink: "https://www.instagram.com/dolgins_jewelry/",
    is_visible: true,
    is_pinned: false,
    display_order: 4,
    product_title: "Handcrafted Gold Pendant",
    product_handle: "custom-jewelry",
    product_price: "Custom Order",
    custom_cta_text: "Start a Custom Project",
    custom_cta_link: "/t/custom-jewelry",
  },
];

const InstagramFeedPage = () => {
  const [posts, setPosts] = useState<InstagramPostItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"all" | "visible" | "hidden">("all");

  const prompt = usePrompt();

  // Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [editingPost, setEditingPost] = useState<InstagramPostItem | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [embedInput, setEmbedInput] = useState<string>("");

  // Form Fields
  const [formCaption, setFormCaption] = useState<string>("");
  const [formPermalink, setFormPermalink] = useState<string>("https://www.instagram.com/dolgins_jewelry/");
  const [formMediaType, setFormMediaType] = useState<string>("IMAGE");
  const [formMediaUrl, setFormMediaUrl] = useState<string>("");
  const [formThumbnailUrl, setFormThumbnailUrl] = useState<string>("");
  const [formIsVisible, setFormIsVisible] = useState<boolean>(true);
  const [formIsPinned, setFormIsPinned] = useState<boolean>(false);
  const [formDisplayOrder, setFormDisplayOrder] = useState<number>(1);
  const [formLikesCount, setFormLikesCount] = useState<number>(0);
  const [formProductTitle, setFormProductTitle] = useState<string>("");
  const [formProductHandle, setFormProductHandle] = useState<string>("");
  const [formProductPrice, setFormProductPrice] = useState<string>("");
  const [formProductThumbnail, setFormProductThumbnail] = useState<string>("");
  const [formCustomCtaText, setFormCustomCtaText] = useState<string>("");
  const [formCustomCtaLink, setFormCustomCtaLink] = useState<string>("");
  const [formImageFile, setFormImageFile] = useState<File | null>(null);
  const [formImagePreview, setFormImagePreview] = useState<string>("");
  const [formMetadata, setFormMetadata] = useState<Record<string, any> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLiveSync = async () => {
    try {
      setSyncing(true);
      const res = await fetch("/admin/instagram-feed/sync", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || "Synced posts from Instagram!");
        fetchPosts();
      } else if (data.configured === false) {
        toast.info(data.message || "Instagram token not configured in .env yet.");
      } else {
        toast.error(data.error || "Failed to sync posts from Instagram.");
      }
    } catch (err: any) {
      toast.error("Error during Instagram sync: " + err.message);
    } finally {
      setSyncing(false);
    }
  };

  const [extracting, setExtracting] = useState<boolean>(false);

  const handleParseEmbedOrUrl = async (rawInput: string) => {
    if (!rawInput.trim()) return;

    try {
      setExtracting(true);
      toast.info("Fetching original photo & caption from Instagram...");

      const res = await fetch("/admin/instagram-feed/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ url: rawInput }),
      });

      const data = await res.json();

      if (data.success) {
        if (data.media_url) {
          setFormMediaUrl(data.media_url);
          setFormImagePreview(data.thumbnail_url || data.media_url);
          setFormImageFile(null);
        }
        if (data.thumbnail_url) {
          setFormThumbnailUrl(data.thumbnail_url);
        }
        if (data.caption) {
          setFormCaption(data.caption);
        }
        if (data.permalink) {
          setFormPermalink(data.permalink);
        }
        if (data.media_type) {
          setFormMediaType(data.media_type);
        }
        if (data.likes_count !== undefined) {
          setFormLikesCount(data.likes_count);
        }
        if (data.metadata || data.carousel_images) {
          setFormMetadata(data.metadata || { carousel_images: data.carousel_images });
        }
        toast.success("Successfully imported photo & caption from Instagram!");
      } else {
        toast.error(data.message || "Failed to extract Instagram metadata.");
      }
    } catch (err: any) {
      toast.error("Error extracting Instagram post: " + err.message);
    } finally {
      setExtracting(false);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/admin/instagram-feed", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      } else {
        toast.error("Failed to load Instagram feed posts");
      }
    } catch (err: any) {
      toast.error("Error loading Instagram posts: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const resetFormState = () => {
    setEditingPost(null);
    setFormCaption("");
    setFormPermalink("https://www.instagram.com/dolgins_jewelry/");
    setFormMediaType("IMAGE");
    setFormMediaUrl("");
    setFormThumbnailUrl("");
    setFormIsVisible(true);
    setFormIsPinned(false);
    const nextOrder = posts.reduce((max, p) => Math.max(max, Number(p.display_order) || 0), 0) + 1;
    setFormDisplayOrder(nextOrder);
    setFormLikesCount(0);
    setFormProductTitle("");
    setFormProductHandle("");
    setFormProductPrice("");
    setFormProductThumbnail("");
    setFormCustomCtaText("");
    setFormCustomCtaLink("");
    setFormImageFile(null);
    setFormImagePreview("");
    setFormMetadata(null);
    setEmbedInput("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openCreateDrawer = () => {
    resetFormState();
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (post: InstagramPostItem) => {
    setEditingPost(post);
    setFormCaption(post.caption || "");
    setFormPermalink(post.permalink || "https://www.instagram.com/dolgins_jewelry/");
    setFormMediaType(post.media_type || "IMAGE");
    setFormMediaUrl(post.media_url || "");
    setFormThumbnailUrl(post.thumbnail_url || "");
    setFormIsVisible(post.is_visible);
    setFormIsPinned(post.is_pinned);
    setFormDisplayOrder(post.display_order || 1);
    setFormLikesCount(post.likes_count || 0);
    setFormProductTitle(post.product_title || "");
    setFormProductHandle(post.product_handle || "");
    setFormProductPrice(post.product_price || "");
    setFormProductThumbnail(post.product_thumbnail || "");
    setFormCustomCtaText(post.custom_cta_text || "");
    setFormCustomCtaLink(post.custom_cta_link || "");
    setFormImageFile(null);
    setFormImagePreview(post.thumbnail_url || post.media_url || "");
    setFormMetadata(post.metadata || null);
    setEmbedInput(post.permalink || "");
    setIsDrawerOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormImageFile(file);
      setFormImagePreview(URL.createObjectURL(file));
      setFormMediaUrl("");
    }
  };

  const handleToggleVisibility = async (post: InstagramPostItem) => {
    try {
      const res = await fetch(`/admin/instagram-feed/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ is_visible: !post.is_visible }),
      });
      if (res.ok) {
        toast.success(
          !post.is_visible
            ? "Post published to storefront feed"
            : "Post hidden from storefront"
        );
        fetchPosts();
      } else {
        toast.error("Failed to update post status");
      }
    } catch (err: any) {
      toast.error("Error updating status: " + err.message);
    }
  };

  const handleTogglePinned = async (post: InstagramPostItem) => {
    try {
      const res = await fetch(`/admin/instagram-feed/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ is_pinned: !post.is_pinned }),
      });
      if (res.ok) {
        toast.success(!post.is_pinned ? "Post pinned to top" : "Post unpinned");
        fetchPosts();
      } else {
        toast.error("Failed to update pinned status");
      }
    } catch (err: any) {
      toast.error("Error updating pin: " + err.message);
    }
  };

  const handleDeletePost = async (post: InstagramPostItem) => {
    const confirmed = await prompt({
      title: "Delete Instagram Post",
      description: "Are you sure you want to remove this post from your storefront Instagram feed?",
      confirmText: "Delete",
      cancelText: "Cancel",
    });

    if (!confirmed) return;

    try {
      const res = await fetch(`/admin/instagram-feed/${post.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        toast.success("Post removed successfully");
        fetchPosts();
      } else {
        toast.error("Failed to delete post");
      }
    } catch (err: any) {
      toast.error("Error deleting post: " + err.message);
    }
  };

  const handleQuickSeed = async () => {
    const confirmed = await prompt({
      title: "Populate Curated @dolgins_jewelry Posts",
      description: "This will add 4 curated fine jewelry showcase posts for @dolgins_jewelry to your feed. Continue?",
      confirmText: "Populate Feed",
      cancelText: "Cancel",
    });

    if (!confirmed) return;

    try {
      setLoading(true);
      for (const sample of SAMPLE_DOLGINS_POSTS) {
        const formData = new FormData();
        formData.append("caption", sample.caption);
        formData.append("media_url", sample.media_url);
        formData.append("permalink", sample.permalink);
        formData.append("is_visible", String(sample.is_visible));
        formData.append("is_pinned", String(sample.is_pinned));
        formData.append("display_order", String(sample.display_order));
        formData.append("product_title", sample.product_title);
        formData.append("product_handle", sample.product_handle);
        formData.append("product_price", sample.product_price);
        formData.append("custom_cta_text", sample.custom_cta_text);
        formData.append("custom_cta_link", sample.custom_cta_link);

        await fetch("/admin/instagram-feed", {
          method: "POST",
          credentials: "include",
          body: formData,
        });
      }
      toast.success("Successfully populated curated @dolgins_jewelry posts!");
      fetchPosts();
    } catch (err: any) {
      toast.error("Failed to seed sample posts: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formImageFile && !formMediaUrl && !editingPost?.media_url) {
      toast.error("Please provide an image file or a valid media URL.");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();
      if (formImageFile) {
        formData.append("files", formImageFile);
      }
      if (formMediaUrl) {
        formData.append("media_url", formMediaUrl);
      }
      if (formThumbnailUrl) {
        formData.append("thumbnail_url", formThumbnailUrl);
      }
      formData.append("caption", formCaption);
      formData.append("permalink", formPermalink);
      formData.append("media_type", formMediaType);
      formData.append("likes_count", String(formLikesCount));
      formData.append("is_visible", String(formIsVisible));
      formData.append("is_pinned", String(formIsPinned));
      formData.append("display_order", String(formDisplayOrder));
      formData.append("product_title", formProductTitle);
      formData.append("product_handle", formProductHandle);
      formData.append("product_price", formProductPrice);
      formData.append("product_thumbnail", formProductThumbnail);
      formData.append("custom_cta_text", formCustomCtaText);
      formData.append("custom_cta_link", formCustomCtaLink);
      if (formMetadata) {
        formData.append("metadata", JSON.stringify(formMetadata));
      }

      const url = editingPost
        ? `/admin/instagram-feed/${editingPost.id}`
        : "/admin/instagram-feed";
      const method = editingPost ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        credentials: "include",
        body: formData,
      });

      if (res.ok) {
        toast.success(editingPost ? "Post updated successfully" : "Post added to Instagram feed");
        setIsDrawerOpen(false);
        resetFormState();
        fetchPosts();
      } else {
        const errorData = await res.json().catch(() => ({}));
        toast.error(errorData.message || "Failed to save Instagram post");
      }
    } catch (err: any) {
      toast.error("Error saving post: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchSearch =
        search === "" ||
        (p.caption && p.caption.toLowerCase().includes(search.toLowerCase())) ||
        (p.product_title && p.product_title.toLowerCase().includes(search.toLowerCase())) ||
        (p.permalink && p.permalink.toLowerCase().includes(search.toLowerCase()));

      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "visible" && p.is_visible) ||
        (statusFilter === "hidden" && !p.is_visible);

      return matchSearch && matchStatus;
    });
  }, [posts, search, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: posts.length,
      visible: posts.filter((p) => p.is_visible).length,
      pinned: posts.filter((p) => p.is_pinned).length,
      shoppable: posts.filter((p) => p.product_title || p.product_handle).length,
    };
  }, [posts]);

  return (
    <div className="flex flex-col gap-y-2">
      <Toaster />

      {/* Main Container Card */}
      <Container className="divide-y p-0 overflow-hidden shadow-xs">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 gap-4">
          <div>
            <div className="flex items-center gap-x-2.5">
              <Heading level="h1" className="text-lg font-semibold text-ui-fg-base">
                Instagram Feed & Lookbook
              </Heading>
              <Badge color="purple" size="small">
                @dolgins_jewelry
              </Badge>
            </div>
            <Text size="small" className="text-ui-fg-subtle mt-0.5">
              Curate Instagram posts and link catalog products for the storefront home page lookbook.
            </Text>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-x-2 flex-wrap sm:flex-nowrap">
            <Button
              variant="secondary"
              size="small"
              onClick={handleLiveSync}
              disabled={syncing}
            >
              <ArrowPath className={clx("w-3.5 h-3.5", syncing && "animate-spin")} />
              Sync from Instagram
            </Button>
            <Button
              variant="secondary"
              size="small"
              onClick={fetchPosts}
              disabled={loading}
            >
              <ArrowPath className={clx("w-3.5 h-3.5", loading && "animate-spin")} />
              Refresh
            </Button>
            <Button variant="secondary" size="small" onClick={openCreateDrawer}>
              <Plus className="w-3.5 h-3.5" />
              Add Post
            </Button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-3 gap-3 bg-ui-bg-subtle/40">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Input
              size="small"
              placeholder="Search posts or products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
            <MagnifyingGlass className="w-4 h-4 text-ui-fg-muted absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-x-1.5 w-full sm:w-auto justify-start sm:justify-end">
            <div className="flex items-center gap-x-1 bg-ui-bg-subtle p-0.5 rounded-lg border border-ui-border-base">
              <Button
                size="small"
                variant={statusFilter === "all" ? "primary" : "transparent"}
                onClick={() => setStatusFilter("all")}
                className="text-xs h-6 px-2.5"
              >
                All ({stats.total})
              </Button>
              <Button
                size="small"
                variant={statusFilter === "visible" ? "primary" : "transparent"}
                onClick={() => setStatusFilter("visible")}
                className="text-xs h-6 px-2.5"
              >
                Live ({stats.visible})
              </Button>
              <Button
                size="small"
                variant={statusFilter === "hidden" ? "primary" : "transparent"}
                onClick={() => setStatusFilter("hidden")}
                className="text-xs h-6 px-2.5"
              >
                Hidden ({stats.total - stats.visible})
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area - Streamlined Table / List View */}
        {loading ? (
          <div className="py-16 text-center text-ui-fg-muted flex flex-col items-center justify-center gap-2">
            <ArrowPath className="w-5 h-5 animate-spin text-ui-fg-interactive" />
            <Text size="small">Loading Instagram posts...</Text>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="py-16 text-center flex flex-col items-center justify-center gap-3 px-4">
            <div className="p-3 bg-ui-bg-subtle rounded-full border border-ui-border-base">
              <Photo className="w-6 h-6 text-ui-fg-muted" />
            </div>
            <div>
              <Heading level="h3" className="text-base font-semibold text-ui-fg-base">
                {search ? "No matching posts" : "No Instagram posts added yet"}
              </Heading>
              <Text size="small" className="text-ui-fg-subtle max-w-sm mt-1">
                {search
                  ? `No posts match "${search}".`
                  : "Add your first @dolgins_jewelry showcase post or click Populate Demo Posts to start."}
              </Text>
            </div>
            <div className="flex items-center gap-2 mt-2">
              {posts.length === 0 && (
                <Button size="small" variant="secondary" onClick={handleQuickSeed}>
                  <Sparkles className="w-3.5 h-3.5" />
                  Populate Demo Posts
                </Button>
              )}
              <Button size="small" variant="primary" onClick={openCreateDrawer}>
                <Plus className="w-3.5 h-3.5" />
                Add Instagram Post
              </Button>
            </div>
          </div>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell className="w-24 pl-4 pr-3 py-3">Preview</Table.HeaderCell>
                <Table.HeaderCell className="px-3 py-3">Caption & Link</Table.HeaderCell>
                <Table.HeaderCell className="px-3 py-3">Tagged Product</Table.HeaderCell>
                <Table.HeaderCell className="w-20 px-3 py-3 text-center">Order</Table.HeaderCell>
                <Table.HeaderCell className="w-28 px-3 py-3 text-center">Status</Table.HeaderCell>
                <Table.HeaderCell className="w-24 px-3 py-3 text-center">Pinned</Table.HeaderCell>
                <Table.HeaderCell className="w-16 px-3 py-3 text-right pr-4">Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredPosts.map((post) => {
                const cleanCaption = (post.caption || "")
                  .replace(/&#064;/g, "@")
                  .replace(/&amp;/g, "&")
                  .replace(/&quot;/g, '"')
                  .replace(/&#039;/g, "'")
                  .replace(/&lt;/g, "<")
                  .replace(/&gt;/g, ">");

                const isVideo = post.media_type === "VIDEO" || post.media_url?.includes(".mp4");
                const previewImg = post.thumbnail_url || post.media_url;

                return (
                  <Table.Row key={post.id} className={clx(!post.is_visible && "opacity-60")}>
                    <Table.Cell className="w-24 pl-4 pr-3 py-3 align-middle">
                      <div className="w-14 h-14 rounded-lg bg-ui-bg-subtle overflow-hidden border border-ui-border-base flex-shrink-0 relative shadow-sm">
                        {isVideo ? (
                          <video
                            src={post.media_url}
                            poster={previewImg}
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                          />
                        ) : post.media_url?.includes("instagram.com/p/") && post.media_url?.includes("/embed") ? (
                          <div className="w-full h-full bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-600 flex items-center justify-center text-white">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                          </div>
                        ) : (
                          <img src={previewImg} alt="" className="w-full h-full object-cover" />
                        )}
                      </div>
                    </Table.Cell>
                    <Table.Cell className="px-3 py-3 align-middle">
                      <div className="max-w-md">
                        <p className="text-xs text-ui-fg-base line-clamp-2 font-normal leading-relaxed">
                          {cleanCaption || <span className="italic text-ui-fg-muted">No caption</span>}
                        </p>
                        {post.permalink && (
                          <a
                            href={post.permalink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-ui-fg-interactive hover:underline inline-flex items-center gap-0.5 mt-1 font-medium"
                          >
                            View on Instagram <ArrowUpRightOnBox className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </Table.Cell>
                    <Table.Cell className="px-3 py-3 align-middle">
                      {post.product_title ? (
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-ui-fg-base truncate max-w-[180px]">
                            {post.product_title}
                          </span>
                          {post.product_price && (
                            <span className="text-[11px] text-ui-fg-subtle">
                              {post.product_price}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-ui-fg-muted text-xs">—</span>
                      )}
                    </Table.Cell>
                    <Table.Cell className="w-20 px-3 py-3 text-center align-middle">
                      <span className="text-xs font-mono text-ui-fg-subtle">
                        #{post.display_order}
                      </span>
                    </Table.Cell>
                    <Table.Cell className="w-28 px-3 py-3 text-center align-middle">
                      <StatusBadge color={post.is_visible ? "green" : "grey"}>
                        {post.is_visible ? "Live" : "Hidden"}
                      </StatusBadge>
                    </Table.Cell>
                    <Table.Cell className="w-24 px-3 py-3 text-center align-middle">
                      {post.is_pinned ? (
                        <Badge color="orange" size="small">
                          Pinned
                        </Badge>
                      ) : (
                        <span className="text-ui-fg-muted text-xs">—</span>
                      )}
                    </Table.Cell>
                    <Table.Cell className="w-16 px-3 py-3 text-right align-middle pr-4">
                      <DropdownMenu>
                        <DropdownMenu.Trigger asChild>
                          <IconButton size="small" variant="transparent">
                            <EllipsisHorizontal className="w-4 h-4" />
                          </IconButton>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content align="end">
                          <DropdownMenu.Item onClick={() => openEditDrawer(post)}>
                            <PencilSquare className="w-4 h-4 mr-2" />
                            Edit Post
                          </DropdownMenu.Item>
                          <DropdownMenu.Item onClick={() => handleToggleVisibility(post)}>
                            {post.is_visible ? (
                              <>
                                <EyeSlash className="w-4 h-4 mr-2" />
                                Hide from Store
                              </>
                            ) : (
                              <>
                                <Eye className="w-4 h-4 mr-2" />
                                Show on Store
                              </>
                            )}
                          </DropdownMenu.Item>
                          <DropdownMenu.Item onClick={() => handleTogglePinned(post)}>
                            <Star className="w-4 h-4 mr-2" />
                            {post.is_pinned ? "Unpin Post" : "Pin to Top"}
                          </DropdownMenu.Item>
                          {post.permalink && (
                            <DropdownMenu.Item
                              onClick={() => window.open(post.permalink || "https://instagram.com/dolgins_jewelry", "_blank")}
                            >
                              <ArrowUpRightOnBox className="w-4 h-4 mr-2" />
                              Open on Instagram
                            </DropdownMenu.Item>
                          )}
                          <DropdownMenu.Separator />
                          <DropdownMenu.Item
                            onClick={() => handleDeletePost(post)}
                            className="text-ui-fg-error focus:text-ui-fg-error"
                          >
                            <Trash className="w-4 h-4 mr-2" />
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

      {/* Add / Edit Drawer */}
      <Drawer
        open={isDrawerOpen}
        onOpenChange={(open) => {
          setIsDrawerOpen(open);
          if (!open) {
            resetFormState();
          }
        }}
      >
        <Drawer.Content className="flex flex-col h-full overflow-hidden">
          <Drawer.Header>
            <Drawer.Title>
              {editingPost ? "Edit Instagram Post" : "Add Instagram Post"}
            </Drawer.Title>
            <Drawer.Description>
              Curate jewelry pieces, captions, and shoppable products for your storefront lookbook.
            </Drawer.Description>
          </Drawer.Header>

          <form onSubmit={handleSubmit} className="flex flex-col h-full flex-1 overflow-hidden">
            <Drawer.Body className="p-6 space-y-4 overflow-y-auto flex-1">
              {/* Instagram Auto-Fetcher Card */}
              <div className="p-4 bg-ui-bg-subtle rounded-xl border border-ui-border-base space-y-3">
                <div className="flex items-center justify-between">
                  <Label size="small" className="text-ui-fg-base font-semibold flex items-center gap-1.5">
                    <ArrowUpRightOnBox className="w-3.5 h-3.5 text-ui-fg-interactive" />
                    Instagram Post URL or Embed Code
                  </Label>
                  <Badge color="purple" size="small">Auto-Fetcher</Badge>
                </div>
                <Text size="small" className="text-ui-fg-subtle text-xs">
                  Paste any Instagram URL (e.g. <code>https://www.instagram.com/p/...</code> or <code>/reel/...</code>) to auto-extract the master photo and caption.
                </Text>

                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Input
                      size="small"
                      placeholder="https://www.instagram.com/p/... or embed snippet"
                      value={embedInput}
                      onChange={(e) => setEmbedInput(e.target.value)}
                      className="font-mono text-xs w-full"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="small"
                    disabled={extracting || !embedInput.trim()}
                    onClick={() => handleParseEmbedOrUrl(embedInput)}
                    className="flex-shrink-0 whitespace-nowrap"
                  >
                    <ArrowPath className={clx("w-3.5 h-3.5 mr-1.5", extracting && "animate-spin")} />
                    {extracting ? "Fetching..." : "Auto-Fetch"}
                  </Button>
                </div>
              </div>

              {/* Media File & Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label size="small" className="text-ui-fg-base font-medium">
                    Jewelry Photo / Media *
                  </Label>
                  <div className="flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="small"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Photo className="w-3.5 h-3.5 mr-1" />
                      Upload File
                    </Button>
                  </div>
                </div>

                <Input
                  size="small"
                  placeholder="Or paste media URL (e.g. https://...)"
                  value={formMediaUrl}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val.includes("<blockquote") || val.includes("data-instgrm-permalink")) {
                      handleParseEmbedOrUrl(val);
                    } else {
                      setFormMediaUrl(val);
                      if (val) setFormImagePreview(val);
                    }
                  }}
                />

                {(formImagePreview || formMediaUrl) && (
                  <div className="mt-2 flex items-center gap-3 p-2.5 bg-ui-bg-subtle rounded-lg border border-ui-border-base">
                    <div className="w-20 h-20 rounded-md overflow-hidden bg-black flex-shrink-0 border border-ui-border-base relative">
                      {formMediaType === "VIDEO" || (formMediaUrl && formMediaUrl.includes(".mp4")) ? (
                        <video
                          src={formMediaUrl || formImagePreview}
                          poster={formThumbnailUrl || formImagePreview}
                          muted
                          autoPlay
                          loop
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={formThumbnailUrl || formImagePreview || formMediaUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 space-y-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <Badge color="green" size="small">Ready</Badge>
                        {formMediaType === "VIDEO" && <Badge color="blue" size="small">Video Reel</Badge>}
                        {formMetadata?.carousel_images && <Badge color="purple" size="small">{formMetadata.carousel_images.length} Slides</Badge>}
                      </div>
                      <p className="text-xs text-ui-fg-subtle truncate font-mono">
                        {formImageFile ? formImageFile.name : (formImagePreview || formMediaUrl)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Caption */}
              <div className="space-y-1.5">
                <Label size="small" className="text-ui-fg-base font-medium">
                  Caption
                </Label>
                <Textarea
                  placeholder="Describe the jewelry piece, diamond setting, metal, or artisan work..."
                  value={formCaption}
                  onChange={(e) => setFormCaption(e.target.value)}
                  rows={3}
                  className="text-xs"
                />
              </div>

              {/* Shoppable Tagging */}
              <div className="p-3.5 bg-ui-bg-subtle/60 rounded-lg border border-ui-border-base space-y-3">
                <Label size="small" className="text-ui-fg-base font-semibold flex items-center gap-1.5">
                  <span className="text-ui-fg-interactive">🏷</span> Shoppable Product Tag (Optional)
                </Label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label size="xsmall" className="text-ui-fg-subtle">Product Title</Label>
                    <Input
                      size="small"
                      placeholder="e.g. Custom Solitaire Ring"
                      value={formProductTitle}
                      onChange={(e) => setFormProductTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label size="xsmall" className="text-ui-fg-subtle">Price / Subtitle</Label>
                    <Input
                      size="small"
                      placeholder="e.g. $3,250.00 or Custom"
                      value={formProductPrice}
                      onChange={(e) => setFormProductPrice(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label size="xsmall" className="text-ui-fg-subtle">Catalog Handle / Slug</Label>
                    <Input
                      size="small"
                      placeholder="e.g. custom-jewelry"
                      value={formProductHandle}
                      onChange={(e) => setFormProductHandle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label size="xsmall" className="text-ui-fg-subtle">CTA Button Text</Label>
                    <Input
                      size="small"
                      placeholder="e.g. Inquire Custom Design"
                      value={formCustomCtaText}
                      onChange={(e) => setFormCustomCtaText(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Display Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="space-y-1">
                  <Label size="small" className="text-ui-fg-base">Display Order</Label>
                  <Input
                    type="number"
                    size="small"
                    value={formDisplayOrder}
                    onChange={(e) => setFormDisplayOrder(Number(e.target.value))}
                  />
                  <Hint className="text-[10px]">Lower numbers appear first</Hint>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg border border-ui-border-base bg-ui-bg-subtle sm:col-span-2">
                  <div className="space-y-0.5">
                    <Text size="small" className="font-medium text-ui-fg-base">
                      Publish to Storefront Feed
                    </Text>
                    <Text size="xsmall" className="text-ui-fg-subtle">
                      Make this post visible in the Lookbook
                    </Text>
                  </div>
                  <Switch
                    checked={formIsVisible}
                    onCheckedChange={setFormIsVisible}
                  />
                </div>
              </div>
            </Drawer.Body>

            <Drawer.Footer className="flex items-center justify-end gap-x-2 border-t border-ui-border-base p-4 bg-ui-bg-base">
              <Button
                variant="secondary"
                size="small"
                type="button"
                onClick={() => setIsDrawerOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="small"
                type="submit"
                disabled={saving}
              >
                {saving ? "Saving..." : editingPost ? "Save Changes" : "Add to Feed"}
              </Button>
            </Drawer.Footer>
          </form>
        </Drawer.Content>
      </Drawer>
    </div>
  );
};

export const config = defineRouteConfig({
  label: "Instagram Feed",
  icon: Photo,
});

export default InstagramFeedPage;

import { defineRouteConfig } from "@medusajs/admin-sdk";
import { PlaySolid, ArrowPath } from "@medusajs/icons";
import {
  Container,
  Heading,
  Text,
  Button,
  Input,
  Switch,
  Label,
  StatusBadge,
  toast,
  Toaster,
  Textarea,
  clx,
} from "@medusajs/ui";
import { useState, useEffect } from "react";

export interface HomeVideoConfig {
  id?: string;
  title: string | null;
  subtitle: string | null;
  video_url: string;
  provider: string;
  thumbnail_url?: string | null;
  is_active: boolean;
  autoplay: boolean;
  muted: boolean;
  loop: boolean;
}

const HomeVideoAdminPage = () => {
  const [video, setVideo] = useState<HomeVideoConfig>({
    title: "Handcrafted With Heritage & Care",
    subtitle:
      "Decades of custom fine jewelry design, diamond setting, and restoration in Overland Park & Kansas City.",
    video_url: "https://vimeo.com/1151439885/8c19318c2b",
    provider: "vimeo",
    is_active: true,
    autoplay: false,
    muted: true,
    loop: false,
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  const fetchVideoConfig = async () => {
    try {
      setLoading(true);
      const res = await fetch("/admin/home-video", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.video) {
          setVideo(data.video);
        }
      }
    } catch (err: any) {
      toast.error("Failed to load video configuration: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideoConfig();
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch("/admin/home-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(video),
      });

      if (res.ok) {
        toast.success("Homepage video settings updated successfully!");
        fetchVideoConfig();
      } else {
        const errData = await res.json();
        toast.error("Failed to update: " + (errData.message || "Unknown error"));
      }
    } catch (err: any) {
      toast.error("Error saving video settings: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Helper to extract embed preview URL
  const getEmbedPreviewUrl = (url: string) => {
    if (!url) return null;

    // Vimeo format: vimeo.com/1151439885/8c19318c2b
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)(?:\/([a-zA-Z0-9]+))?/);
    if (vimeoMatch) {
      const id = vimeoMatch[1];
      const hash = vimeoMatch[2];
      return `https://player.vimeo.com/video/${id}${hash ? `?h=${hash}` : ""}`;
    }

    // YouTube format: youtube.com/watch?v=xxx or youtu.be/xxx
    const ytMatch = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    if (ytMatch) {
      return `https://www.youtube.com/embed/${ytMatch[1]}`;
    }

    return null;
  };

  const previewEmbedUrl = getEmbedPreviewUrl(video.video_url);

  return (
    <div className="flex flex-col gap-y-3">
      <Toaster />

      {/* Main Container Card matching Medusa theme */}
      <Container className="divide-y divide-ui-border-base p-0 overflow-hidden shadow-xs">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4">
          <div>
            <div className="flex items-center gap-x-3">
              <Heading level="h1" className="text-lg font-semibold text-ui-fg-base">
                Homepage Video
              </Heading>
              <StatusBadge color={video.is_active ? "green" : "grey"}>
                {video.is_active ? "Active" : "Disabled"}
              </StatusBadge>
            </div>
            <Text size="small" className="text-ui-fg-subtle mt-0.5">
              Configure and preview the video featured on the storefront homepage.
            </Text>
          </div>

          <div className="flex items-center gap-x-2 shrink-0 self-start sm:self-auto">
            <Button
              variant="secondary"
              size="small"
              type="button"
              onClick={fetchVideoConfig}
              disabled={loading || saving}
            >
              <ArrowPath className={clx("w-3.5 h-3.5", loading && "animate-spin")} />
              Refresh
            </Button>
            <Button
              variant="primary"
              size="small"
              type="button"
              onClick={() => handleSave()}
              disabled={saving}
            >
              {saving ? (
                <>
                  <ArrowPath className="w-3.5 h-3.5 animate-spin mr-1" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>

        {/* Content Body */}
        {loading ? (
          <div className="py-20 text-center text-ui-fg-muted flex flex-col items-center justify-center gap-2">
            <ArrowPath className="w-5 h-5 animate-spin text-ui-fg-interactive" />
            <Text size="small">Loading video configuration...</Text>
          </div>
        ) : (
          <form id="home-video-form" onSubmit={handleSave} className="p-6 space-y-6">
            {/* Video URL */}
            <div>
              <Label htmlFor="video_url" className="text-sm font-medium text-ui-fg-base">
                Video URL (Vimeo or YouTube) <span className="text-ui-fg-error">*</span>
              </Label>
              <Input
                id="video_url"
                name="video_url"
                size="small"
                value={video.video_url}
                onChange={(e) => {
                  const url = e.target.value;
                  const isYt = url.includes("youtube.com") || url.includes("youtu.be");
                  setVideo({
                    ...video,
                    video_url: url,
                    provider: isYt ? "youtube" : "vimeo",
                  });
                }}
                placeholder="https://vimeo.com/1151439885/8c19318c2b"
                className="mt-1.5"
                required
              />
              <Text size="small" className="text-xs text-ui-fg-muted mt-1">
                Paste the full Vimeo URL (with privacy hash if unlisted) or YouTube video URL.
              </Text>
            </div>

            {/* Title & Provider */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title" className="text-sm font-medium text-ui-fg-base">
                  Section Title (Optional)
                </Label>
                <Input
                  id="title"
                  name="title"
                  size="small"
                  value={video.title || ""}
                  onChange={(e) => setVideo({ ...video, title: e.target.value })}
                  placeholder="Handcrafted With Heritage & Care"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="provider" className="text-sm font-medium text-ui-fg-base">
                  Provider (Auto-detected)
                </Label>
                <Input
                  id="provider"
                  name="provider"
                  size="small"
                  value={video.provider.toUpperCase()}
                  disabled
                  className="mt-1.5"
                />
              </div>
            </div>

            {/* Subtitle / Description */}
            <div>
              <Label htmlFor="subtitle" className="text-sm font-medium text-ui-fg-base">
                Section Subtitle / Description (Optional)
              </Label>
              <Textarea
                id="subtitle"
                name="subtitle"
                value={video.subtitle || ""}
                onChange={(e) => setVideo({ ...video, subtitle: e.target.value })}
                placeholder="Brief description appearing above the video player..."
                rows={2}
                className="mt-1.5"
              />
            </div>

            {/* Playback & Visibility Toggles - Spacious Card Layout with guaranteed spacing */}
            <div className="pt-2">
              <Label className="text-sm font-medium text-ui-fg-base mb-2.5 block">
                Playback & Display Settings
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {/* 1. Show on Homepage */}
                <div className="p-4 rounded-lg border border-ui-border-base bg-ui-bg-subtle/50 flex items-center justify-between gap-x-4">
                  <div className="flex flex-col gap-y-0.5 min-w-0 pr-1">
                    <Label
                      htmlFor="is_active"
                      className="text-sm font-medium text-ui-fg-base cursor-pointer"
                    >
                      Show on Homepage
                    </Label>
                    <Text size="small" className="text-xs text-ui-fg-muted truncate">
                      Display section to visitors
                    </Text>
                  </div>
                  <Switch
                    id="is_active"
                    checked={video.is_active}
                    onCheckedChange={(checked) =>
                      setVideo({ ...video, is_active: checked })
                    }
                    className="shrink-0"
                  />
                </div>

                {/* 2. Autoplay */}
                <div className="p-4 rounded-lg border border-ui-border-base bg-ui-bg-subtle/50 flex items-center justify-between gap-x-4">
                  <div className="flex flex-col gap-y-0.5 min-w-0 pr-1">
                    <Label
                      htmlFor="autoplay"
                      className="text-sm font-medium text-ui-fg-base cursor-pointer"
                    >
                      Autoplay Video
                    </Label>
                    <Text size="small" className="text-xs text-ui-fg-muted truncate">
                      Muted playback on load
                    </Text>
                  </div>
                  <Switch
                    id="autoplay"
                    checked={video.autoplay}
                    onCheckedChange={(checked) =>
                      setVideo({ ...video, autoplay: checked })
                    }
                    className="shrink-0"
                  />
                </div>

                {/* 3. Loop Playback */}
                <div className="p-4 rounded-lg border border-ui-border-base bg-ui-bg-subtle/50 flex items-center justify-between gap-x-4">
                  <div className="flex flex-col gap-y-0.5 min-w-0 pr-1">
                    <Label
                      htmlFor="loop"
                      className="text-sm font-medium text-ui-fg-base cursor-pointer"
                    >
                      Loop Playback
                    </Label>
                    <Text size="small" className="text-xs text-ui-fg-muted truncate">
                      Replay when finished
                    </Text>
                  </div>
                  <Switch
                    id="loop"
                    checked={video.loop}
                    onCheckedChange={(checked) =>
                      setVideo({ ...video, loop: checked })
                    }
                    className="shrink-0"
                  />
                </div>
              </div>
            </div>

            {/* Live Video Preview Box */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center justify-between">
                <Heading level="h2" className="text-sm font-medium text-ui-fg-base">
                  Live Video Preview
                </Heading>
                {previewEmbedUrl && (
                  <Text size="small" className="text-xs text-ui-fg-muted">
                    16:9 Aspect Ratio
                  </Text>
                )}
              </div>

              {previewEmbedUrl ? (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-ui-border-base shadow-xs bg-black">
                  <iframe
                    src={previewEmbedUrl}
                    className="absolute inset-0 w-full h-full"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    title="Homepage Video Preview"
                  />
                </div>
              ) : (
                <div className="py-12 text-center bg-ui-bg-subtle/40 border border-dashed border-ui-border-base rounded-lg text-ui-fg-muted text-sm">
                  Enter a valid Vimeo or YouTube URL above to view the live preview.
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-x-2 pt-4 border-t border-ui-border-base">
              <Button
                variant="secondary"
                size="small"
                type="button"
                onClick={fetchVideoConfig}
                disabled={loading || saving}
              >
                Discard Changes
              </Button>
              <Button
                variant="primary"
                size="small"
                type="submit"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <ArrowPath className="w-3.5 h-3.5 animate-spin mr-1" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        )}
      </Container>
    </div>
  );
};

export const config = defineRouteConfig({
  label: "Home Video",
  icon: PlaySolid,
});

export default HomeVideoAdminPage;

import { defineRouteConfig } from "@medusajs/admin-sdk";
import { IdBadge, ArrowPath } from "@medusajs/icons";
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

export interface BusinessCardConfig {
  id?: string;
  first_name: string;
  last_name: string;
  company: string;
  bio: string;
  phone: string;
  email: string;
  website: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  color_primary: string;
  color_accent: string;
  avatar_url?: string | null;
  is_active: boolean;
}

const BusinessCardAdminPage = () => {
  const [card, setCard] = useState<BusinessCardConfig>({
    first_name: "Joseph",
    last_name: "Dolginow",
    company: "Joseph Dolgin Jeweler LLC",
    bio: "Custom Fine Jewelry, Jewelry Repair, Appraisals",
    phone: "(913) 228-2808",
    email: "joseph@dolgins.com",
    website: "dolgins.com",
    street: "West 119th Street 4901",
    city: "Leawood",
    state: "KS",
    zip: "66209",
    country: "United States",
    color_primary: "#222943",
    color_accent: "#C7A88C",
    avatar_url: "https://qrcgcustomers.s3-eu-west-1.amazonaws.com/account51902472/59042606_1.png?0.2004734367969231",
    is_active: true,
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  const fetchCardConfig = async () => {
    try {
      setLoading(true);
      const res = await fetch("/admin/business-card", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.card) {
          setCard((prev) => ({
            ...prev,
            ...data.card,
          }));
        }
      }
    } catch (err: any) {
      console.error("Failed to load business card configuration:", err);
      toast.error("Error", {
        description: "Failed to load business card settings.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCardConfig();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch("/admin/business-card", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(card),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update business card");
      }

      const data = await res.json();
      if (data.card) {
        setCard((prev) => ({
          ...prev,
          ...data.card,
        }));
      }

      toast.success("Success", {
        description: "Digital Business Card settings saved successfully.",
      });
    } catch (err: any) {
      console.error("Save failed:", err);
      toast.error("Error", {
        description: err.message || "Could not save business card configuration.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-y-4 max-w-4xl mx-auto py-6">
      <Toaster />
      <Container className="p-6">
        <div className="flex items-center justify-between pb-6 border-b border-ui-border-base">
          <div>
            <div className="flex items-center gap-x-3">
              <Heading level="h1">Digital Business Card</Heading>
              <StatusBadge color={card.is_active ? "green" : "grey"}>
                {card.is_active ? "Active" : "Disabled"}
              </StatusBadge>
            </div>
            <Text className="text-ui-fg-subtle text-sm mt-1">
              Configure the digital business card contact details, colors, and address displayed on the storefront (/card).
            </Text>
          </div>
          <Button
            variant="secondary"
            size="small"
            onClick={fetchCardConfig}
            disabled={loading || saving}
          >
            <ArrowPath className={clx("w-3.5 h-3.5 mr-1", loading && "animate-spin")} />
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16 text-ui-fg-subtle text-sm">
            <ArrowPath className="w-5 h-5 animate-spin mr-2" />
            Loading configuration...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-y-8 mt-6">
            {/* Status Card */}
            <div className="p-4 rounded-xl border border-ui-border-base bg-ui-bg-subtle/40 flex items-center justify-between">
              <div>
                <Label className="font-semibold text-ui-fg-base text-sm">
                  Enable Digital Business Card Page
                </Label>
                <Text className="text-xs text-ui-fg-subtle mt-0.5">
                  Controls whether the /card URL displays the business card.
                </Text>
              </div>
              <Switch
                checked={card.is_active}
                onCheckedChange={(val) => setCard({ ...card, is_active: val })}
              />
            </div>

            {/* Personal Information */}
            <div className="space-y-4">
              <Heading level="h2" className="text-base font-semibold border-b pb-2">
                Personal & Company Information
              </Heading>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-medium text-ui-fg-subtle">First Name</Label>
                  <Input
                    className="mt-1"
                    value={card.first_name}
                    onChange={(e) => setCard({ ...card, first_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium text-ui-fg-subtle">Last Name</Label>
                  <Input
                    className="mt-1"
                    value={card.last_name}
                    onChange={(e) => setCard({ ...card, last_name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-medium text-ui-fg-subtle">Company Name</Label>
                <Input
                  className="mt-1"
                  value={card.company}
                  onChange={(e) => setCard({ ...card, company: e.target.value })}
                />
              </div>

              <div>
                <Label className="text-xs font-medium text-ui-fg-subtle">Bio / Specialties</Label>
                <Textarea
                  className="mt-1"
                  rows={2}
                  value={card.bio}
                  onChange={(e) => setCard({ ...card, bio: e.target.value })}
                  placeholder="e.g. Custom Fine Jewelry, Jewelry Repair, Appraisals"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <Heading level="h2" className="text-base font-semibold border-b pb-2">
                Contact Details
              </Heading>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs font-medium text-ui-fg-subtle">Phone (Mobile)</Label>
                  <Input
                    className="mt-1"
                    value={card.phone}
                    onChange={(e) => setCard({ ...card, phone: e.target.value })}
                    placeholder="(913) 228-2808"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium text-ui-fg-subtle">Email Address</Label>
                  <Input
                    type="email"
                    className="mt-1"
                    value={card.email}
                    onChange={(e) => setCard({ ...card, email: e.target.value })}
                    placeholder="joseph@dolgins.com"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium text-ui-fg-subtle">Website</Label>
                  <Input
                    className="mt-1"
                    value={card.website}
                    onChange={(e) => setCard({ ...card, website: e.target.value })}
                    placeholder="dolgins.com"
                  />
                </div>
              </div>
            </div>

            {/* Physical Location */}
            <div className="space-y-4">
              <Heading level="h2" className="text-base font-semibold border-b pb-2">
                Physical Location / Address
              </Heading>
              <div>
                <Label className="text-xs font-medium text-ui-fg-subtle">Street Address</Label>
                <Input
                  className="mt-1"
                  value={card.street}
                  onChange={(e) => setCard({ ...card, street: e.target.value })}
                  placeholder="West 119th Street 4901"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <Label className="text-xs font-medium text-ui-fg-subtle">City</Label>
                  <Input
                    className="mt-1"
                    value={card.city}
                    onChange={(e) => setCard({ ...card, city: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium text-ui-fg-subtle">State</Label>
                  <Input
                    className="mt-1"
                    value={card.state}
                    onChange={(e) => setCard({ ...card, state: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium text-ui-fg-subtle">Zip Code</Label>
                  <Input
                    className="mt-1"
                    value={card.zip}
                    onChange={(e) => setCard({ ...card, zip: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium text-ui-fg-subtle">Country</Label>
                  <Input
                    className="mt-1"
                    value={card.country}
                    onChange={(e) => setCard({ ...card, country: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Theme & Branding and Preview (commented out for future reference)
            <div className="space-y-4">
              <Heading level="h2" className="text-base font-semibold border-b pb-2">
                Theme & Branding
              </Heading>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs font-medium text-ui-fg-subtle">Primary Color (Header)</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="color"
                      value={card.color_primary}
                      onChange={(e) => setCard({ ...card, color_primary: e.target.value })}
                      className="w-9 h-9 rounded border border-ui-border-base cursor-pointer"
                    />
                    <Input
                      value={card.color_primary}
                      onChange={(e) => setCard({ ...card, color_primary: e.target.value })}
                      placeholder="#222943"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-medium text-ui-fg-subtle">Accent Color (Buttons)</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="color"
                      value={card.color_accent}
                      onChange={(e) => setCard({ ...card, color_accent: e.target.value })}
                      className="w-9 h-9 rounded border border-ui-border-base cursor-pointer"
                    />
                    <Input
                      value={card.color_accent}
                      onChange={(e) => setCard({ ...card, color_accent: e.target.value })}
                      placeholder="#C7A88C"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-medium text-ui-fg-subtle">Avatar / Logo URL</Label>
                  <Input
                    className="mt-1"
                    value={card.avatar_url || ""}
                    onChange={(e) => setCard({ ...card, avatar_url: e.target.value })}
                    placeholder="https://... or /images/card-avatar.png"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-ui-border-base bg-ui-bg-subtle/20 flex flex-col items-center">
              <Text className="text-xs text-ui-fg-subtle mb-3 uppercase tracking-wider font-semibold">
                Card Preview (Color Palette)
              </Text>
              <div
                style={{ backgroundColor: card.color_primary }}
                className="w-full max-w-sm rounded-t-xl p-5 text-center text-white shadow-md"
              >
                <div className="w-14 h-14 mx-auto mb-2 rounded-full overflow-hidden flex items-center justify-center bg-white/10">
                  {card.avatar_url ? (
                    <img src={card.avatar_url} alt="Avatar" className="w-full h-full object-contain" />
                  ) : (
                    <IdBadge className="w-8 h-8 text-white" />
                  )}
                </div>
                <div className="font-semibold text-base">{card.first_name} {card.last_name}</div>
                <div className="text-xs text-gray-300 mt-0.5">{card.company}</div>
              </div>
              <div className="w-full max-w-sm rounded-b-xl p-4 bg-white text-gray-800 shadow-md border-x border-b border-gray-100 flex flex-col gap-2 text-xs">
                <div className="text-gray-600 font-medium text-center">{card.bio}</div>
                <div className="border-t border-gray-100 pt-2 flex justify-between">
                  <span className="text-gray-400">Phone:</span>
                  <span className="font-medium">{card.phone}</span>
                </div>
                <div className="border-t border-gray-100 pt-2 flex justify-between">
                  <span className="text-gray-400">Email:</span>
                  <span className="font-medium">{card.email}</span>
                </div>
                <div
                  style={{ backgroundColor: card.color_accent }}
                  className="mt-3 py-2 text-center text-white font-semibold rounded-lg shadow-sm"
                >
                  DOWNLOAD VCARD
                </div>
              </div>
            </div>
            */}

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t border-ui-border-base">
              <Button
                variant="primary"
                size="base"
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
  label: "Business Card",
  icon: IdBadge,
});

export default BusinessCardAdminPage;

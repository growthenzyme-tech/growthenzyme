
"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import {
  Save,
  Globe,
  Mail,
  Share2,
  FileText,
  LayoutDashboard,
  Megaphone,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

import {
  getGeneralSettings,
  updateGeneralSettings,
  defaultGeneralSettings,
  type GeneralSettings,
} from "@/app/lib/settings";

import MediaPickerModal from "@/app/components/cms/MediaPickerModal";

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#405C48] focus:ring-2 focus:ring-[#405C48]/10";

const labelClass = "mb-2 block text-sm font-medium text-gray-700";

function Section({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="flex items-start gap-4 border-b border-gray-100 px-6 py-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#405C48]/10 text-[#405C48]">
          <Icon size={19} />
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
      </div>

      <div className="grid gap-5 p-6">{children}</div>
    </section>
  );
}

function Field({
  label,
  children,
  description,
}: {
  label: string;
  children: ReactNode;
  description?: string;
}) {
  return (
    <div className="min-w-0">
      <label className={labelClass}>{label}</label>
      {children}
      {description && (
        <p className="mt-2 text-xs leading-5 text-gray-400">{description}</p>
      )}
    </div>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-5 rounded-xl border border-gray-100 p-4">
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        <p className="mt-1 text-xs leading-5 text-gray-500">{description}</p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-[#405C48]" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<GeneralSettings>(
    defaultGeneralSettings
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadSettings() {
      try {
        setLoading(true);
        setError("");

        const data = await getGeneralSettings();

        if (active) {
          setSettings(data);
        }
      } catch (err) {
        console.error("Unable to load settings:", err);

        if (active) {
          setError("Unable to load settings. Please check your connection and try again.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadSettings();

    return () => {
      active = false;
    };
  }, []);

  function updateField<K extends keyof GeneralSettings>(
    key: K,
    value: GeneralSettings[K]
  ) {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));

    setSuccess("");
  }

  function updateSocialLink(
    key: keyof GeneralSettings["socialLinks"],
    value: string
  ) {
    setSettings((previous) => ({
      ...previous,
      socialLinks: {
        ...previous.socialLinks,
        [key]: value,
      },
    }));

    setSuccess("");
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await updateGeneralSettings(settings);

      setSuccess("Your website settings have been saved successfully.");
    } catch (err) {
      console.error("Settings save error:", err);

      setError(
        "Unable to save settings. Please check your permissions and try again."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto animate-spin text-[#405C48]" size={30} />
          <p className="mt-3 text-sm text-gray-500">Loading website settings...</p>
        </div>
      </div>
    );
  }


return (
  <div className="mx-auto max-w-6xl space-y-8 bg-[#FFFDF8] pb-14">

    {/* Page Header */}
    <div className="relative isolate overflow-hidden rounded-2xl bg-[#B6CBA9] px-6 py-8 text-[#29382F] sm:px-9 sm:py-10">
      <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#A5B59F]/30 blur-3xl" />

      <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#29382F]">
            <span className="h-2 w-2 rounded-full bg-[#D78359]" />
            Website Configuration
          </div>

          <h1 className="mt-5 font-heading text-4xl font-bold leading-tight tracking-tight text-[#29382F] sm:text-5xl lg:text-6xl">General <span className="text-[#6F9259]">Settings</span></h1>

          <p className="mt-3 max-w-xl text-sm leading-7 text-[#29382F]/80">
            Manage your website identity, public contact details, publishing
            preferences and homepage features.
          </p>
        </div>

        <button
          form="general-settings-form"
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-3 rounded-xl border border-[#D5E1CC] bg-gradient-to-b from-[#B9D99C] via-[#A5CC83] to-[#8DB76D] px-6 py-3.5 text-sm font-bold text-[#29382F] shadow-[0_5px_0_#6F9259,0_9px_18px_rgba(41,56,47,0.13)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_7px_0_#6F9259,0_12px_22px_rgba(41,56,47,0.18)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? (
            <Loader2 size={17} className="animate-spin" />
          ) : (
            <Save size={17} />
          )}
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      <div className="relative mt-7 flex flex-wrap items-center gap-2 border-t border-[#29382F]/15 pt-5">
        <span className="rounded-full bg-[#29382F] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#FFFDF8]">
          Admin Panel
        </span>
        <span className="text-xs font-medium text-[#29382F]/70">
          Website preferences and configuration
        </span>
      </div>
    </div>

    {/* Feedback */}
    {error && (
      <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        <AlertCircle size={18} className="mt-0.5 shrink-0" />
        {error}
      </div>
    )}

    {success && (
      <div className="flex items-start gap-3 rounded-xl border border-[#A5B59F] bg-[#EAF0E5] p-4 text-sm font-medium text-[#29382F]">
        <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#506B59]" />
        {success}
      </div>
    )}

    <form
      id="general-settings-form"
      onSubmit={handleSave}
      className="space-y-6"
    >

      {/* 1. Brand & Identity */}
      <Section
        title="Brand & Identity"
        description="Manage your website name, branding and default SEO information."
        icon={Globe}
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Website Name">
            <input
              className={inputClass}
              value={settings.websiteName}
              onChange={(e) => updateField("websiteName", e.target.value)}
              placeholder="GrowthEnzyme"
            />
          </Field>
        </div>

        <Field label="Default SEO Meta Description">
          <textarea
            className={inputClass}
            rows={3}
            value={settings.defaultMetaDescription}
            onChange={(e) =>
              updateField("defaultMetaDescription", e.target.value)
            }
            placeholder="Describe your website for search engines..."
          />
        </Field>

        <Field
          label="Default Social Share Image"
          description="This image will be used as the default Open Graph image when a page does not have its own social sharing image."
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            {settings.defaultSocialImage ? (
              <img
                src={settings.defaultSocialImage}
                alt="Default social sharing image"
                className="h-28 w-48 rounded-xl border border-[#DDE4D9] bg-[#F5F0E5] object-cover"
              />
            ) : (
              <div className="flex h-28 w-48 items-center justify-center rounded-xl border border-dashed border-[#A5B59F] bg-[#F5F0E5] text-[#506B59]">
                <ImageIcon size={30} />
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setMediaPickerOpen(true)}
                className="rounded-xl border border-[#A5B59F] bg-[#F5F0E5] px-4 py-2.5 text-sm font-semibold text-[#29382F] transition hover:border-[#506B59] hover:bg-[#EAE6DA]"
              >
                Choose from Media Library
              </button>

              {settings.defaultSocialImage && (
                <button
                  type="button"
                  onClick={() => updateField("defaultSocialImage", "")}
                  className="rounded-xl px-4 py-2.5 text-sm font-medium text-[#D78359] transition hover:bg-[#D78359]/10"
                >
                  Remove Image
                </button>
              )}
            </div>
          </div>
        </Field>

        <Field label="Footer Copyright Text">
          <input
            className={inputClass}
            value={settings.footerCopyright}
            onChange={(e) => updateField("footerCopyright", e.target.value)}
            placeholder="© 2026 GrowthEnzyme. All rights reserved."
          />
        </Field>
      </Section>

      {/* 2. Contact & Social */}
      <Section
        title="Public Contact & Social Links"
        description="Set the contact information and social profiles displayed on your website."
        icon={Share2}
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Public Contact Email">
            <input
              type="email"
              className={inputClass}
              value={settings.contactEmail}
              onChange={(e) => updateField("contactEmail", e.target.value)}
              placeholder="hello@example.com"
            />
          </Field>

          <Field label="Business Phone / WhatsApp Number">
            <input
              type="tel"
              className={inputClass}
              value={settings.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="+91 98765 43210"
            />
          </Field>
        </div>

        <Field label="Office Address / Location">
          <textarea
            className={inputClass}
            rows={2}
            value={settings.address}
            onChange={(e) => updateField("address", e.target.value)}
            placeholder="Enter your business address..."
          />
        </Field>

        <div className="border-t border-[#E5E4DC] pt-5">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-5 w-1 rounded-full bg-[#D78359]" />
            <h3 className="text-sm font-bold text-[#29382F]">
              Social Media Profiles
            </h3>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="LinkedIn URL">
              <input
                type="url"
                className={inputClass}
                value={settings.socialLinks.linkedin}
                onChange={(e) => updateSocialLink("linkedin", e.target.value)}
                placeholder="https://linkedin.com/company/..."
              />
            </Field>

            <Field label="Instagram URL">
              <input
                type="url"
                className={inputClass}
                value={settings.socialLinks.instagram}
                onChange={(e) => updateSocialLink("instagram", e.target.value)}
                placeholder="https://instagram.com/..."
              />
            </Field>

            <Field label="Facebook URL">
              <input
                type="url"
                className={inputClass}
                value={settings.socialLinks.facebook}
                onChange={(e) => updateSocialLink("facebook", e.target.value)}
                placeholder="https://facebook.com/..."
              />
            </Field>

            <Field label="Threads URL">
              <input
                type="url"
                className={inputClass}
                value={settings.socialLinks.threads}
                onChange={(e) => updateSocialLink("threads", e.target.value)}
                placeholder="https://www.threads.net/@..."
              />
            </Field>

            <Field label="X / Twitter URL">
              <input
                type="url"
                className={inputClass}
                value={settings.socialLinks.x}
                onChange={(e) => updateSocialLink("x", e.target.value)}
                placeholder="https://x.com/..."
              />
            </Field>
          </div>
        </div>
      </Section>

      {/* 3. Content & Publishing */}
      <Section
        title="Content & Publishing"
        description="Control comment moderation and content listing behavior."
        icon={FileText}
      >
        <Toggle
          label="Enable Blog Comments"
          description="Allow visitors to submit comments on blog articles."
          checked={settings.commentsEnabled}
          onChange={(value) => updateField("commentsEnabled", value)}
        />

        <Toggle
          label="Require Manual Comment Approval"
          description="Comments must be approved by an administrator before appearing publicly."
          checked={settings.requireCommentApproval}
          onChange={(value) => updateField("requireCommentApproval", value)}
        />

        <Field
          label="Posts Per Page"
          description="Number of posts displayed on both the Blog and Case Studies listing pages."
        >
          <input
            type="number"
            min={1}
            max={100}
            className={inputClass}
            value={settings.postsPerPage}
            onChange={(e) =>
              updateField(
                "postsPerPage",
                Math.max(1, Math.min(100, Number(e.target.value) || 1))
              )
            }
          />
        </Field>
      </Section>

      {/* 4. Homepage Features */}
      <Section
        title="Homepage Feature Controls"
        description="Choose which content and promotional sections appear on your homepage."
        icon={LayoutDashboard}
      >
        <Field
          label="Maximum Featured Case Studies"
          description="Maximum number of featured case studies displayed in the homepage Work section."
        >
          <input
            type="number"
            min={0}
            max={20}
            className={inputClass}
            value={settings.maxFeaturedCaseStudies}
            onChange={(e) =>
              updateField(
                "maxFeaturedCaseStudies",
                Math.max(0, Math.min(20, Number(e.target.value) || 0))
              )
            }
          />
        </Field>

        <Toggle
          label="Show Homepage Lead Capture / Newsletter Banner"
          description="Display or hide the lead capture or newsletter banner on the homepage."
          checked={settings.showLeadCapture}
          onChange={(value) => updateField("showLeadCapture", value)}
        />
      </Section>

      {/* 5. Announcement */}
      <Section
        title="Site Announcement"
        description="Display an announcement or important message at the top of your website."
        icon={Megaphone}
      >
        <Toggle
          label="Enable Announcement Bar"
          description="Show the announcement bar across the website."
          checked={settings.announcementEnabled}
          onChange={(value) => updateField("announcementEnabled", value)}
        />

        <Field label="Announcement Text">
          <textarea
            className={inputClass}
            rows={2}
            value={settings.announcementText}
            onChange={(e) => updateField("announcementText", e.target.value)}
            placeholder="Enter your announcement..."
          />
        </Field>

        <Field
          label="Optional Announcement Link"
          description="Visitors can use this link to learn more about the announcement."
        >
          <input
            type="url"
            className={inputClass}
            value={settings.announcementLink}
            onChange={(e) => updateField("announcementLink", e.target.value)}
            placeholder="https://example.com/..."
          />
        </Field>
      </Section>

      {/* Bottom Save */}
      <div className="relative overflow-hidden rounded-2xl border border-[#DDE4D9] bg-[#F5F0E5] p-6 sm:flex sm:items-center sm:justify-between sm:gap-5">
        <div className="relative">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#D78359]" />
            <p className="text-sm font-bold text-[#29382F]">
              Ready to update your website?
            </p>
          </div>

          <p className="text-xs leading-6 text-[#29382F]/65">
            Save your changes to update the general settings document.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="relative mt-5 inline-flex w-full items-center justify-center gap-3 rounded-xl border border-[#29382F] bg-[#29382F] px-6 py-3.5 text-sm font-bold text-[#FFFDF8] shadow-[0_5px_0_#17291F,0_9px_18px_rgba(41,56,47,0.14)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#405C48] hover:shadow-[0_7px_0_#17291F,0_12px_22px_rgba(41,56,47,0.18)] disabled:cursor-not-allowed disabled:opacity-60 sm:mt-0 sm:w-auto"
        >
          {saving ? (
            <Loader2 size={17} className="animate-spin" />
          ) : (
            <Save size={17} />
          )}
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>
    </form>

    {/* Existing Media Library Picker */}
    <MediaPickerModal
      isOpen={mediaPickerOpen}
      onClose={() => setMediaPickerOpen(false)}
      allowedType="image"
      title="Choose Default Social Share Image"
      onSelect={(item) => {
        updateField("defaultSocialImage", item.url);
        setMediaPickerOpen(false);
      }}
    />
  </div>
);

}

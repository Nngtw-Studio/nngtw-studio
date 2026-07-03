import type { AdminSection } from "@/types";

export type AdminSectionGroup = "Content" | "Recruitment" | "Operations";

export interface AdminSectionConfig {
  key: AdminSection;
  label: string;
  description: string;
  href: string;
  group: AdminSectionGroup;
}

/** Group render order in the sidebar and dashboard. */
export const ADMIN_SECTION_GROUPS: AdminSectionGroup[] = [
  "Content",
  "Recruitment",
  "Operations",
];

// Contact Messages and Navigation were intentionally removed from the admin
// surface — contact enquiries are handled over email directly, and the public
// nav is defined in code (NAV_LINKS). Their routes still exist but are no
// longer linked from the sidebar or dashboard.
export const ADMIN_SECTIONS: AdminSectionConfig[] = [
  { key: "homepage", label: "Homepage", description: "Hero content and featured sections", href: "/admin/homepage", group: "Content" },
  { key: "games", label: "Games", description: "Manage active and planned game projects", href: "/admin/games", group: "Content" },
  { key: "news", label: "News", description: "Development logs, updates, and announcements", href: "/admin/news", group: "Content" },
  { key: "team", label: "Team", description: "Team member profiles", href: "/admin/team", group: "Content" },
  { key: "technology", label: "Technology", description: "Technology categories and items", href: "/admin/technology", group: "Content" },
  { key: "careers", label: "Careers", description: "Job listings and role management", href: "/admin/careers", group: "Recruitment" },
  { key: "applications", label: "Applications", description: "Review career applications", href: "/admin/applications", group: "Recruitment" },
  { key: "media", label: "Media", description: "Upload and manage images and video assets", href: "/admin/media", group: "Operations" },
  { key: "discord", label: "Discord", description: "Discord integration settings", href: "/admin/discord", group: "Operations" },
  { key: "settings", label: "Settings", description: "Global site configuration", href: "/admin/settings", group: "Operations" },
];

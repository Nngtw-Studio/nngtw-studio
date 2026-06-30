import type { AdminSection } from "@/types";

export const ADMIN_SECTIONS: {
  key: AdminSection;
  label: string;
  description: string;
  href: string;
}[] = [
  { key: "games", label: "Games", description: "Manage active and planned game projects", href: "/admin/games" },
  { key: "news", label: "News", description: "Development logs, updates, and announcements", href: "/admin/news" },
  { key: "careers", label: "Careers", description: "Job listings and role management", href: "/admin/careers" },
  { key: "applications", label: "Applications", description: "Review career applications", href: "/admin/applications" },
  { key: "homepage", label: "Homepage", description: "Hero content and featured sections", href: "/admin/homepage" },
  { key: "team", label: "Team", description: "Team member profiles", href: "/admin/team" },
  { key: "technology", label: "Technology", description: "Technology categories and items", href: "/admin/technology" },
  { key: "media", label: "Media", description: "Uploaded files and assets", href: "/admin/media" },
  { key: "gallery", label: "Gallery", description: "Game and studio gallery images", href: "/admin/gallery" },
  { key: "seo", label: "SEO", description: "Page titles, descriptions, and OG images", href: "/admin/seo" },
  { key: "contact-messages", label: "Contact Messages", description: "Incoming contact form submissions", href: "/admin/contact-messages" },
  { key: "settings", label: "Settings", description: "Global site configuration", href: "/admin/settings" },
  { key: "uploads", label: "Uploads", description: "File upload management", href: "/admin/uploads" },
  { key: "discord", label: "Discord Links", description: "Discord integration settings", href: "/admin/discord" },
  { key: "navigation", label: "Navigation", description: "Site navigation items", href: "/admin/navigation" },
];

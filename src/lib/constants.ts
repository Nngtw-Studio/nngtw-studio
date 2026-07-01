export const BRAND = {
  name: "Nngtw Studio",
  tagline: "Imagine. Explore. Evolve.",
  description:
    "Nngtw Studio is an independent game development studio creating original games for PC, Mobile, XR and Virtual Reality.",
  url: "https://nngtw.studio",
  email: "hello@nngtw.studio",
} as const;

export const COLORS = {
  orange: "#F58A1F",
  background: "#0C0C0C",
  black: "#090909",
  white: "#F2EFE7",
  grey: "#8B8B8B",
} as const;

export const SOCIAL = {
  discord: "https://discord.gg/z3fpVJZkD",
  linkedin: "https://linkedin.com/company/nngtw-studio",
  github: "https://github.com/nngtw-studio",
} as const;

export const NAV_LINKS = [
  { href: "/games", label: "Games" },
  { href: "/studio", label: "Studio" },
  { href: "/technology", label: "Technology" },
  { href: "/news", label: "News" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
] as const;

/** Future products — not exposed in navigation until populated */
export const FUTURE_PRODUCT_CATEGORIES = [
  "games",
  "applications",
  "digital-assets",
  "developer-tools",
  "merchandise",
] as const;

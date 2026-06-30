export type GameStatus = "in-development" | "planned" | "released" | "concept";
export type CareerStatus = "open" | "internship" | "future" | "closed";
export type NewsCategory =
  | "development-log"
  | "game-update"
  | "studio-news"
  | "technology"
  | "announcement";

export interface Game {
  id: string;
  slug: string;
  title: string;
  genre: string;
  platforms: string[];
  engine: string;
  status: GameStatus;
  description: string;
  concept?: string;
  overview?: string;
  featured: boolean;
  activeDevelopment: boolean;
  featuredOrder?: number;
  trailerUrl?: string | null;
  bannerImageUrl?: string | null;
  projectLink?: string;
  followLink?: string;
  gallery?: string[];
  roadmap?: { phase: string; description: string }[];
  createdAt: string;
  updatedAt: string;
}

/** Featured showcase slide — sourced from Supabase games where featured = true */
export type FeaturedGame = Pick<
  Game,
  | "id"
  | "slug"
  | "title"
  | "genre"
  | "platforms"
  | "engine"
  | "status"
  | "description"
  | "trailerUrl"
  | "bannerImageUrl"
  | "projectLink"
  | "followLink"
  | "featuredOrder"
>;

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  order: number;
}

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: NewsCategory;
  publishedAt: string;
  featured?: boolean;
}

export interface Career {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  type: string;
  status: CareerStatus;
  description: string;
  requirements: string[];
}

export interface PhilosophyValue {
  id: string;
  title: string;
  description: string;
}

export interface TechnologyCategory {
  id: string;
  title: string;
  items: string[];
  description?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  type: "business" | "general";
  createdAt: string;
  read: boolean;
}

export interface SiteSettings {
  discordUrl: string;
  heroHeadline: string;
  heroSubtitle: string;
  seoTitle: string;
  seoDescription: string;
}

/** Admin dashboard section keys */
export type AdminSection =
  | "games"
  | "news"
  | "careers"
  | "applications"
  | "homepage"
  | "team"
  | "technology"
  | "media"
  | "gallery"
  | "seo"
  | "contact-messages"
  | "settings"
  | "uploads"
  | "discord"
  | "navigation";

export interface FutureProduct {
  id: string;
  category: "games" | "applications" | "digital-assets" | "developer-tools" | "merchandise";
  title: string;
  slug: string;
  published: boolean;
}

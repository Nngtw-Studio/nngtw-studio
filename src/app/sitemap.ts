import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/constants";
import { allGames, newsArticles, careers } from "@/lib/data/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = BRAND.url;

  const staticPages = ["", "/games", "/studio", "/technology", "/news", "/careers", "/contact"].map(
    (path) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    })
  );

  const gamePages = allGames.map((game) => ({
    url: `${baseUrl}/games/${game.slug}`,
    lastModified: new Date(game.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const newsPages = newsArticles.map((article) => ({
    url: `${baseUrl}/news/${article.slug}`,
    lastModified: new Date(article.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const careerPages = careers.map((career) => ({
    url: `${baseUrl}/careers/${career.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...gamePages, ...newsPages, ...careerPages];
}

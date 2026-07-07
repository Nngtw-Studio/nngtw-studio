import type { FeaturedGame } from "@/types";
import { SOCIAL } from "@/lib/constants";

export const SLIDE_DURATION_MS = 7000;

export const fallbackFeaturedGames: FeaturedGame[] = [
  {
    id: "1",
    slug: "arithmetic-destination",
    title: "Arithmetic Destination",
    genre: "Educational Adventure",
    platforms: ["PC", "Mobile"],
    engine: "Unity",
    status: "in-development",
    description:
      "An immersive educational journey where mathematics becomes exploration. Navigate abstract worlds built from numbers, patterns, and logic.",
    trailerUrl: "/videos/arithmetic-destination-trailer.mp4",
    bannerImageUrl: "/banners/arithmetic-destination.svg",
    projectLink: "/games/arithmetic-destination",
    followLink: SOCIAL.discord,
    featuredOrder: 1,
  },
  {
    id: "2",
    slug: "king-summon",
    title: "King Summon",
    genre: "Strategy / Summoning",
    platforms: ["PC", "Mobile"],
    engine: "Unity",
    status: "in-development",
    description:
      "Command armies of summoned creatures in tactical battles. Build your kingdom, forge alliances, and master the art of summoning.",
    trailerUrl: "/videos/king-summon-trailer.mp4",
    bannerImageUrl: "/banners/king-summon.svg",
    projectLink: "/games/king-summon",
    followLink: SOCIAL.discord,
    featuredOrder: 2,
  },
];

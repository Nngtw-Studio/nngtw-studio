/** @format */

export type GameArtAccent = "orange" | "pink";

export interface GameArt {
  /** Poster-style key art — the game's world/hero shot, ~square source. */
  thumbnail: string;
  /** Wordmark lockup rendered on a black canvas — composited with mix-blend-mode: screen so the canvas disappears against the section background. */
  logo: string;
  accent: GameArtAccent;
}

/**
 * Curated key art for the homepage showcase, keyed by game slug. Any
 * featured game not listed here falls back to whatever Supabase/admin has
 * on file (or the generic placeholder), so new titles render immediately
 * without bespoke art.
 */
export const GAME_ART: Record<string, GameArt> = {
  "arithmetic-destination": {
    thumbnail: "/games/arithmetic-destination/thumbnail.png",
    logo: "/games/arithmetic-destination/logo.png",
    accent: "pink",
  },
  "king-summon": {
    thumbnail: "/games/king-summon/thumbnail.png",
    logo: "/games/king-summon/logo.png",
    accent: "orange",
  },
};

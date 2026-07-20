/** @format */

import { getStorageUrl } from "@/lib/brand";

export type GameArtAccent = "orange" | "pink";

export interface GameRating {
  /** 0–5 average. */
  value: number;
  count: number;
  /** True while the game hasn't launched — renders "Playtest Reviews" instead of "Reviews". */
  isPlaytest?: boolean;
}

export type GameGalleryKind =
  | "gameplay"
  | "ui"
  | "character"
  | "map"
  | "boss"
  | "screenshot";

export interface GameGalleryItem {
  kind: GameGalleryKind;
  label: string;
  /** Landscape (16:9) still — shown in the media strip and in the idle slideshow. */
  src: string;
}

export interface GameArt {
  /** 16:9 hero art — the card's default hero-media state and the poster the trailer fades from/to. */
  thumbnail: string;
  /** Wordmark lockup rendered on a black canvas — composited with mix-blend-mode: screen so the canvas disappears against the section background. */
  logo: string;
  accent: GameArtAccent;
  /** Square mark for the storefront-style icon slot. Falls back to `thumbnail` (cropped square) when absent. */
  icon?: string;
  /** Overrides the default genre/platforms tag row when a bespoke set reads better (e.g. "Strategy • Multiplayer • Mobile"). */
  tags?: string[];
  /** Only render the rating row when real numbers exist — never fabricate review counts. */
  rating?: GameRating;
  /** Additional stills for the media strip and idle slideshow, beyond the hero thumbnail. Trailer is added automatically when `trailerUrl` is set on the game. */
  gallery?: GameGalleryItem[];
  /** Overrides the status-based secondary CTA default (see GameShowcaseCard). */
  secondaryCta?: { label: string; href?: string; external?: boolean };
}

/**
 * Curated key art for the homepage showcase, keyed by game slug. Any
 * featured game not listed here falls back to whatever Supabase/admin has
 * on file (or the generic placeholder), so new titles render immediately
 * without bespoke art.
 */
export const GAME_ART: Record<string, GameArt> = {
  "arithmetic-destination": {
    thumbnail: getStorageUrl("games/arithmetic-destination/thumbnail.png"),
    logo: getStorageUrl("games/arithmetic-destination/logo.png"),
    accent: "pink",
  },
  "king-summon": {
    thumbnail: getStorageUrl("games/king-summon/thumbnail.png"),
    logo: getStorageUrl("games/king-summon/logo.png"),
    accent: "orange",
  },
};

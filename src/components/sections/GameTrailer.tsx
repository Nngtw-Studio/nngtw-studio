"use client";

import { useState } from "react";

interface GameTrailerProps {
  title: string;
  trailerUrl: string;
  posterUrl?: string | null;
}

/**
 * Dedicated trailer player for a game detail page. Falls back to the
 * caller's placeholder (by rendering nothing) if the video 404s, so a
 * missing asset never shows a broken video icon.
 */
export function GameTrailer({ title, trailerUrl, posterUrl }: GameTrailerProps) {
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-brand-white/10 bg-brand-black shadow-[0_50px_100px_-30px_rgba(0,0,0,0.7)]">
      <video
        src={trailerUrl}
        poster={posterUrl ?? undefined}
        controls
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-label={`${title} official trailer`}
        onError={() => setFailed(true)}
        className="aspect-video w-full object-cover"
      />
      <div className="glass-panel pointer-events-none absolute inset-x-0 top-0 h-16 rounded-t-[28px] mask-[linear-gradient(to_bottom,black,transparent)]" />
    </div>
  );
}

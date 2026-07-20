'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { GalleryAlbum, GalleryImage } from '@/lib/supabase/queries/gallery';

/** Prettify a folder slug ("aug30" → "Aug 30", "april5" → "April 5") for headings. */
function formatAlbum(slug: string): string {
  const match = slug.match(/^([a-z]+)(\d+)$/i);
  if (!match) return slug;
  const [, month, day] = match;
  const label = month.charAt(0).toUpperCase() + month.slice(1);
  return `${label} ${day}`;
}

export function GalleryGrid({ albums }: { albums: GalleryAlbum[] }) {
  const [active, setActive] = useState<GalleryImage | null>(null);

  if (albums.length === 0) {
    return (
      <p className="py-24 text-center text-[#8B8B8B]">
        No gallery images available yet.
      </p>
    );
  }

  return (
    <div className="space-y-16">
      {albums.map((album) => (
        <section key={album.slug}>
          <h2 className="mb-6 font-[family-name:var(--font-display)] text-2xl text-[#F2EFE7]">
            {formatAlbum(album.slug)}
          </h2>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {album.images.map((img, index) => (
              <button
                key={img.path}
                type="button"
                onClick={() => setActive(img)}
                className="group relative aspect-square overflow-hidden rounded-lg bg-[#151515] focus:outline-none focus:ring-2 focus:ring-[#F58A1F]"
                aria-label={`View ${img.name}`}
              >
                <Image
                  src={img.url}
                  alt={img.name.replace(/\.[^.]+$/, '')}
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  // First few images in the first album carry the LCP — hint the browser.
                  fetchPriority={album === albums[0] && index < 4 ? 'high' : 'auto'}
                />
              </button>
            ))}
          </div>
        </section>
      ))}

      {active && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setActive(null)}
        >
          <div
            className="relative h-[85vh] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={active.url}
              alt={active.name.replace(/\.[^.]+$/, '')}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>
          <button
            type="button"
            onClick={() => setActive(null)}
            className="absolute right-5 top-5 text-3xl leading-none text-[#F2EFE7] hover:text-[#F58A1F]"
            aria-label="Close"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

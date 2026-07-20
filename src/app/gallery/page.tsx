/** @format */

import type { Metadata } from 'next';
import { getGalleryAlbums } from '@/lib/supabase/queries/gallery';
import { GalleryGrid } from '@/components/sections/GalleryGrid';

// Revalidate hourly so newly uploaded images appear without a redeploy.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Gallery',
  description:
    'A visual archive of Nngtw Studio — concept art, screenshots, and moments from across our projects.',
};

export default async function GalleryPage() {
  const albums = await getGalleryAlbums();

  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-32 sm:px-8">
      <header className="mb-12">
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-[#F2EFE7] sm:text-5xl">
          Gallery
        </h1>
        <p className="mt-3 max-w-2xl text-[#8B8B8B]">
          Concept art, screenshots, and moments from across our projects.
        </p>
      </header>

      <GalleryGrid albums={albums} />
    </div>
  );
}

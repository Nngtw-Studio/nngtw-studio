import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getStorageUrl } from "@/lib/brand";

const GALLERY_ROOT = "gallery";

/** Fallback folder list if root-listing is unavailable — matches the known bucket layout. */
const KNOWN_ALBUMS = ["aug30", "jan3", "jan11", "april5"];

const IMAGE_EXT = /\.(jpe?g|png|webp|avif|gif|svg)$/i;

export interface GalleryImage {
  /** Storage path relative to the bucket, e.g. "gallery/aug30/shot-01.jpg" */
  path: string;
  /** Public, ready-to-render URL. */
  url: string;
  /** Filename only, used for alt text. */
  name: string;
}

export interface GalleryAlbum {
  /** Folder name under gallery/, e.g. "aug30" */
  slug: string;
  images: GalleryImage[];
}

function isImage(name: string): boolean {
  return IMAGE_EXT.test(name);
}

/** Discover album folders under gallery/. Storage folders come back with a null id. */
async function listAlbumSlugs(
  supabase: ReturnType<typeof createPublicClient>
): Promise<string[]> {
  const { data, error } = await supabase.storage
    .from("nngtw-assets")
    .list(GALLERY_ROOT, { limit: 1000, sortBy: { column: "name", order: "asc" } });

  if (error || !data?.length) return KNOWN_ALBUMS;

  const folders = data.filter((entry) => entry.id === null).map((entry) => entry.name);
  return folders.length ? folders : KNOWN_ALBUMS;
}

/** List every image inside a single album folder, newest-first, as public URLs. */
async function listAlbumImages(
  supabase: ReturnType<typeof createPublicClient>,
  slug: string
): Promise<GalleryImage[]> {
  const prefix = `${GALLERY_ROOT}/${slug}`;
  const { data, error } = await supabase.storage
    .from("nngtw-assets")
    .list(prefix, {
      limit: 1000,
      sortBy: { column: "created_at", order: "desc" },
    });

  if (error || !data?.length) return [];

  return data
    .filter((entry) => entry.id !== null && isImage(entry.name))
    .map((entry) => {
      const path = `${prefix}/${entry.name}`;
      return { path, url: getStorageUrl(path), name: entry.name };
    });
}

/**
 * Fetch every gallery album with all of its images, resolved to public URLs.
 * Folders and filenames are discovered dynamically — nothing is hardcoded.
 * Empty albums are dropped so the page never renders a bare heading.
 */
export async function getGalleryAlbums(): Promise<GalleryAlbum[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = createPublicClient();
    const slugs = await listAlbumSlugs(supabase);

    const albums = await Promise.all(
      slugs.map(async (slug) => ({ slug, images: await listAlbumImages(supabase, slug) }))
    );

    return albums.filter((album) => album.images.length > 0);
  } catch {
    return [];
  }
}

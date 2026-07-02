"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

export type ActionResult = { error: string } | { error?: undefined };

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_PREFIXES = ["image/", "video/mp4"];
const BUCKET = "nngtw-assets";

function isAllowedMime(mimeType: string) {
  return ALLOWED_MIME_PREFIXES.some((prefix) => mimeType.startsWith(prefix));
}

function storagePathFromPublicUrl(url: string): string | null {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return url.slice(index + marker.length);
}

export async function uploadMedia(
  _prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient();

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) return { error: "Choose a file to upload." };
  if (file.size > MAX_SIZE_BYTES) return { error: "File is too large (max 10MB)." };
  if (!isAllowedMime(file.type)) return { error: `File type "${file.type}" is not allowed.` };

  const path = `gallery/${Date.now()}-${slugify(file.name)}`;

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
  });
  if (uploadError) return { error: uploadError.message };

  const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(path);

  const { error: insertError } = await supabase.from("studio_media").insert({
    filename: file.name,
    url: publicUrlData.publicUrl,
    alt_text: String(formData.get("altText") ?? ""),
    mime_type: file.type,
    size_bytes: file.size,
    context: String(formData.get("context") ?? "general"),
  });
  if (insertError) return { error: insertError.message };

  revalidatePath("/admin/media");
  return {};
}

export async function updateMediaAltText(id: string, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const altText = String(formData.get("altText") ?? "");

  const { error } = await supabase.from("studio_media").update({ alt_text: altText }).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/media");
  return {};
}

export async function deleteMedia(id: string, url: string): Promise<ActionResult> {
  const supabase = await createClient();

  const path = storagePathFromPublicUrl(url);
  if (path) {
    const { error: storageError } = await supabase.storage.from(BUCKET).remove([path]);
    if (storageError) {
      console.error(`Failed to remove storage object at ${path}:`, storageError.message);
    }
  }

  const { error } = await supabase.from("studio_media").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/media");
  return {};
}

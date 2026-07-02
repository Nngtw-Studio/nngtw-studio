"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ActionResult = { error: string } | { error?: undefined };

export async function createNavItem(
  _prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient();
  const label = String(formData.get("label") ?? "").trim();
  const href = String(formData.get("href") ?? "").trim();
  if (!label || !href) return { error: "Label and href are required." };

  const { data: maxRow } = await supabase
    .from("studio_navigation_items")
    .select("order")
    .order("order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("studio_navigation_items").insert({
    label,
    href,
    order: (maxRow?.order ?? 0) + 1,
    visible: true,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/navigation");
  redirect("/admin/navigation");
}

export async function updateNavItem(
  id: string,
  _prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient();
  const label = String(formData.get("label") ?? "").trim();
  const href = String(formData.get("href") ?? "").trim();
  if (!label || !href) return { error: "Label and href are required." };

  const { error } = await supabase
    .from("studio_navigation_items")
    .update({ label, href, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/navigation");
  redirect("/admin/navigation");
}

export async function deleteNavItem(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("studio_navigation_items").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/navigation");
  return {};
}

export async function toggleNavItemVisible(id: string, current: boolean): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("studio_navigation_items")
    .update({ visible: !current })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/navigation");
  return {};
}

export async function reorderNavItem(id: string, direction: "up" | "down"): Promise<ActionResult> {
  const supabase = await createClient();

  const { data: items, error: listError } = await supabase
    .from("studio_navigation_items")
    .select("id, order")
    .order("order", { ascending: true });

  if (listError) return { error: listError.message };
  if (!items) return {};

  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return {};

  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= items.length) return {};

  const current = items[index];
  const swapWith = items[swapIndex];

  const { error: error1 } = await supabase
    .from("studio_navigation_items")
    .update({ order: swapWith.order })
    .eq("id", current.id);
  const { error: error2 } = await supabase
    .from("studio_navigation_items")
    .update({ order: current.order })
    .eq("id", swapWith.id);

  if (error1 || error2) return { error: (error1 ?? error2)?.message ?? "Failed to reorder." };

  revalidatePath("/admin/navigation");
  return {};
}

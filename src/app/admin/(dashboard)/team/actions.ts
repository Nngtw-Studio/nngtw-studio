"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ActionResult = { error: string } | { error?: undefined };

function teamFieldsFromFormData(formData: FormData) {
  return {
    role: String(formData.get("role") ?? ""),
    contribution: String(formData.get("contribution") ?? "") || null,
    bio: String(formData.get("bio") ?? ""),
    avatar_url: String(formData.get("avatar_url") ?? "") || null,
    profile_url: String(formData.get("profile_url") ?? "") || null,
    contribution_weight: Number(formData.get("contribution_weight") ?? 50),
    order: Number(formData.get("order") ?? 0),
    visible: formData.get("visible") === "on",
  };
}

function revalidateTeamPaths() {
  revalidatePath("/admin/team");
  revalidatePath("/");
  revalidatePath("/studio");
}

export async function createTeamMember(
  _prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Name is required." };

  const { error } = await supabase.from("studio_team_members").insert({
    name,
    ...teamFieldsFromFormData(formData),
  });

  if (error) return { error: error.message };

  revalidateTeamPaths();
  redirect("/admin/team");
}

export async function updateTeamMember(
  id: string,
  _prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Name is required." };

  const { error } = await supabase
    .from("studio_team_members")
    .update({
      name,
      ...teamFieldsFromFormData(formData),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidateTeamPaths();
  redirect("/admin/team");
}

export async function deleteTeamMember(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("studio_team_members").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidateTeamPaths();
  return {};
}

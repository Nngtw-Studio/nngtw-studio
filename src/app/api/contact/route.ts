import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message, type } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      const { error } = await supabase.from("contact_messages").insert({
        name,
        email,
        subject,
        message,
        type: type ?? "general",
        read: false,
      });

      if (error) {
        console.error("Supabase insert error:", error);
        return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
      }
    } else {
      console.log("[Contact Form]", { name, email, subject, message, type });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

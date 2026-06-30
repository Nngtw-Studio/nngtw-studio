"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ADMIN_SECTIONS } from "@/lib/admin/sections";
import { BRAND_ASSETS } from "@/lib/brand";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="fixed top-0 left-0 z-40 flex h-screen w-64 flex-col border-r border-brand-white/5 bg-brand-black">
      <div className="border-b border-brand-white/5 p-6">
        <Link href="/admin" className="flex items-center gap-3">
          <img
            src={BRAND_ASSETS.compactLogo}
            alt="NNGTW Studio"
            className="h-8 w-auto shrink-0"
          />
          <span className="text-[10px] tracking-[0.3em] text-brand-grey uppercase">
            Admin Panel
          </span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {ADMIN_SECTIONS.map((section) => (
            <li key={section.key}>
              <Link
                href={section.href}
                className={cn(
                  "block rounded px-3 py-2 text-sm transition-colors",
                  pathname === section.href
                    ? "bg-brand-orange/10 text-brand-orange"
                    : "text-brand-grey hover:bg-brand-white/5 hover:text-brand-white"
                )}
              >
                {section.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-brand-white/5 p-4">
        <Link
          href="/"
          className="mb-2 block px-3 py-2 text-xs text-brand-grey transition-colors hover:text-brand-white"
        >
          &larr; View Site
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full rounded px-3 py-2 text-left text-xs text-brand-grey transition-colors hover:bg-brand-white/5 hover:text-brand-white"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}

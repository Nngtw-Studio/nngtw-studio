"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ADMIN_SECTIONS } from "@/lib/admin/sections";
import { BRAND_ASSETS } from "@/lib/brand";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, startSignOut] = useTransition();
  const [signOutError, setSignOutError] = useState("");

  const handleSignOut = () => {
    setSignOutError("");
    startSignOut(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) {
        setSignOutError(error.message);
        return;
      }
      router.push("/admin/login");
      router.refresh();
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open admin menu"
        className="fixed top-4 left-4 z-30 border border-brand-white/10 bg-brand-black px-3 py-2 text-brand-white lg:hidden"
      >
        ☰
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 flex h-screen w-64 flex-col border-r border-brand-white/5 bg-brand-black transition-transform duration-200 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="border-b border-brand-white/5 p-6">
          <Link href="/admin" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
            <img
              src={BRAND_ASSETS.compactLogo}
              alt="Nngtw Studio"
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
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block rounded px-3 py-2 text-sm transition-colors",
                    pathname === section.href || pathname.startsWith(`${section.href}/`)
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
          {signOutError && <p className="mb-2 text-xs text-red-400">{signOutError}</p>}
          <Link
            href="/"
            className="mb-2 block px-3 py-2 text-xs text-brand-grey transition-colors hover:text-brand-white"
          >
            &larr; View Site
          </Link>
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="w-full rounded px-3 py-2 text-left text-xs text-brand-grey transition-colors hover:bg-brand-white/5 hover:text-brand-white disabled:opacity-50"
          >
            {isSigningOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </aside>
    </>
  );
}

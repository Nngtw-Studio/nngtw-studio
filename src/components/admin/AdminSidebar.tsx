"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  ADMIN_SECTIONS,
  ADMIN_SECTION_GROUPS,
  type AdminSectionGroup,
} from "@/lib/admin/sections";
import { ADMIN_ICONS } from "@/components/admin/AdminIcons";
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

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open admin menu"
        className="fixed top-4 left-4 z-30 rounded-md border border-brand-white/10 bg-brand-black px-3 py-2 text-brand-white lg:hidden"
      >
        ☰
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 flex h-screen w-64 flex-col border-r border-brand-white/8 bg-brand-black transition-transform duration-200 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand header */}
        <div className="border-b border-brand-white/8 px-6 py-5">
          <Link
            href="/admin"
            className="group flex items-center gap-3"
            onClick={() => setIsOpen(false)}
          >
            <img
              src={BRAND_ASSETS.compactLogo}
              alt="Nngtw Studio"
              className="h-8 w-auto shrink-0 transition-opacity group-hover:opacity-80"
            />
            <span className="flex flex-col leading-tight">
              <span className="font-display text-sm font-semibold tracking-wide text-brand-white">
                Nngtw Studio
              </span>
              <span className="font-accent text-[9px] tracking-[0.35em] text-brand-orange/80 uppercase">
                Admin
              </span>
            </span>
          </Link>
        </div>

        {/* Grouped navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          {ADMIN_SECTION_GROUPS.map((group: AdminSectionGroup) => {
            const items = ADMIN_SECTIONS.filter((s) => s.group === group);
            if (items.length === 0) return null;
            return (
              <div key={group} className="mb-6 last:mb-0">
                <p className="mb-2 px-3 font-accent text-[9px] tracking-[0.3em] text-brand-grey/40 uppercase">
                  {group}
                </p>
                <ul className="space-y-0.5">
                  {items.map((section) => {
                    const Icon = ADMIN_ICONS[section.key];
                    const active = isActive(section.href);
                    return (
                      <li key={section.key}>
                        <Link
                          href={section.href}
                          onClick={() => setIsOpen(false)}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                            active
                              ? "bg-brand-orange/10 text-brand-orange"
                              : "text-brand-grey hover:bg-brand-white/5 hover:text-brand-white"
                          )}
                        >
                          {/* Active accent bar */}
                          <span
                            className={cn(
                              "absolute top-1/2 left-0 h-4 w-0.5 -translate-y-1/2 rounded-full bg-brand-orange transition-opacity",
                              active ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <Icon
                            className={cn(
                              "h-4 w-4 shrink-0 transition-colors",
                              active
                                ? "text-brand-orange"
                                : "text-brand-grey/60 group-hover:text-brand-white"
                            )}
                          />
                          {section.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="border-t border-brand-white/8 p-3">
          {signOutError && (
            <p className="mb-2 px-3 text-xs text-red-400">{signOutError}</p>
          )}
          <Link
            href="/"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-xs text-brand-grey transition-colors hover:bg-brand-white/5 hover:text-brand-white"
          >
            <span aria-hidden="true">&larr;</span> View Site
          </Link>
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="mt-0.5 flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs text-brand-grey transition-colors hover:bg-brand-white/5 hover:text-brand-white disabled:opacity-50"
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3.5 w-3.5 shrink-0"
              aria-hidden="true"
            >
              <path d="M6 13.5H3.5A1 1 0 0 1 2.5 12.5V3.5A1 1 0 0 1 3.5 2.5H6" />
              <path d="M10 11 13 8 10 5M13 8H6" />
            </svg>
            {isSigningOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </aside>
    </>
  );
}

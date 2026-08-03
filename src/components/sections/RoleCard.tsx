/** @format */

import Link from 'next/link';
import { careerStatusLabels } from '@/lib/data/content';
import type { Career } from '@/types';
import { cn } from '@/lib/utils';

const statusStyles: Record<string, string> = {
  open: 'border-green-500/25 bg-green-500/8 text-green-400 inline-block border px-2.5 py-0.5 label-overline',
  internship: 'selected-pills',
  future: 'border-brand-white/12 bg-brand-white/4 text-brand-grey/50 inline-block border px-2.5 py-0.5 label-overline',
  closed: 'border-red-500/15 bg-red-500/5 text-red-400/50 inline-block border px-2.5 py-0.5 label-overline',
};

/**
 * The card used across the full roster grid. Whole card is one link
 * (a candidate shouldn't have to find the small "View" target), and the
 * hover treatment is layered rather than a single colour swap: the border
 * warms, a corner glow fades up, the title shifts to orange, and the
 * arrow slides. Cheap to render — all transforms and opacity, no layout.
 */
export function RoleCard({ role }: { role: Career }) {
  const isOpen = role.status === 'open' || role.status === 'internship';

  return (
    <Link
      href={`/careers/${role.slug}`}
      className={cn(
        'group relative flex w-full flex-col overflow-hidden rounded-[28px] border p-7 transition-all duration-500 md:p-10',
        isOpen
          ? 'border-brand-orange/20 bg-brand-orange/3 hover:border-brand-orange/45 hover:bg-brand-orange/5'
          : 'border-brand-white/7 bg-brand-white/2 hover:border-brand-white/18 hover:bg-brand-white/[0.04]',
      )}
    >
      {/* Corner glow — warm for a live role, neutral for a future one, so
          the grid still reads at a glance when scanned quickly. */}
      <div
        className={cn(
          'pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full opacity-0 blur-[70px] transition-opacity duration-700 group-hover:opacity-100',
          isOpen ? 'bg-brand-orange/25' : 'bg-brand-white/10',
        )}
      />

      <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 w-full">
        <div className="flex-1">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span
              className={cn(
                statusStyles[role.status],
              )}
            >
              {careerStatusLabels[role.status]}
            </span>
            <p className="font-accent text-[10px] tracking-[0.2em] uppercase text-brand-grey/35">
              {role.department}
            </p>
          </div>

          <h3 className="font-display text-xl font-semibold tracking-tight text-brand-white/90 transition-colors duration-300 group-hover:text-brand-orange md:text-2xl">
            {role.title}
          </h3>

          <p className="mt-3 line-clamp-2 max-w-4xl body-description">
            {role.description}
          </p>
        </div>

        <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-end gap-6 shrink-0 border-t border-brand-white/10 lg:border-t-0 pt-6 lg:pt-0">
          <p className="font-accent text-[10px] leading-relaxed tracking-[0.2em] uppercase text-brand-grey/35 text-left lg:text-right">
            {role.location}
            <br className="hidden lg:block" />
            <span className="lg:hidden"> · </span>
            {role.type}
          </p>
          <span className="font-accent text-[10px] tracking-[0.25em] uppercase text-brand-grey/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-brand-orange">
            {isOpen ? 'Apply' : 'View'} &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}

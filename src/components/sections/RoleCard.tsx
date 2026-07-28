/** @format */

import Link from 'next/link';
import { careerStatusLabels } from '@/lib/data/content';
import type { Career } from '@/types';
import { cn } from '@/lib/utils';

const statusStyles: Record<string, string> = {
  open: 'border-green-500/25 bg-green-500/8 text-green-400',
  internship: 'border-brand-orange/25 bg-brand-orange/8 text-brand-orange',
  future: 'border-brand-white/12 bg-brand-white/4 text-brand-grey/50',
  closed: 'border-red-500/15 bg-red-500/5 text-red-400/50',
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
        'group relative flex h-full flex-col overflow-hidden rounded-2xl border p-7 transition-all duration-500',
        isOpen
          ? 'border-brand-orange/20 bg-brand-orange/3 hover:border-brand-orange/45'
          : 'border-brand-white/7 bg-brand-white/2 hover:border-brand-white/18',
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

      <div className="relative flex h-full flex-col">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <span
            className={cn(
              'inline-block border px-2.5 py-0.5 label-overline',
              statusStyles[role.status],
            )}
          >
            {careerStatusLabels[role.status]}
          </span>
          <p className="font-accent text-[10px] tracking-[0.2em] uppercase text-brand-grey/35">
            {role.department}
          </p>
        </div>

        <h3 className="font-display text-lg font-semibold tracking-tight text-brand-white/90 transition-colors duration-300 group-hover:text-brand-orange md:text-xl">
          {role.title}
        </h3>

        <p className="mt-3 line-clamp-3 text-sm leading-7 text-brand-grey/55">
          {role.description}
        </p>

        {/* mt-auto pins the footer to the card bottom so a 2-line and a
            4-line description still produce aligned rows in the grid. */}
        <div className="mt-auto flex items-end justify-between gap-4 pt-6">
          <p className="font-accent text-[10px] leading-relaxed tracking-[0.2em] uppercase text-brand-grey/35">
            {role.location}
            <br />
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

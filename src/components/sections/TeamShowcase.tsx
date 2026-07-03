/** @format */

'use client';

import { useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, LayoutGroup, MotionConfig } from 'framer-motion';
import type { TeamMember } from '@/types';
import { cn } from '@/lib/utils';

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
const SPRING = { type: 'spring' as const, stiffness: 210, damping: 28, mass: 1 };

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

/** Splits `row` members side-by-side across [left, left+width] by weight. */
function fillRow(
  rects: Map<string, Rect>,
  row: TeamMember[],
  left: number,
  width: number,
  top: number,
  height: number,
) {
  const totalWeight = row.reduce((sum, m) => sum + Math.max(m.contributionWeight, 1), 0);
  let cursor = left;
  row.forEach((member) => {
    const share = Math.max(member.contributionWeight, 1) / totalWeight;
    const w = width * share;
    rects.set(member.id, { top, left: cursor, width: w, height });
    cursor += w;
  });
}

/**
 * Pure layout math: given members ranked by contributionWeight and whichever
 * card (if any) is hovered, returns each member's rect as percentages of the
 * bento container. Three states:
 *
 * Rest      — founder (highest weight) anchors a 30% left column; the rest
 *             stack right as [featured-top, weighted bottom row].
 * Founder   — his column widens to ~50%; the right stack compresses.
 * Member    — the hovered member becomes a full-height ~50% right column;
 *             the founder holds the top-left and everyone else shares the
 *             row beneath him, split by weight.
 *
 * Nothing is hardcoded to four people: rows split by contributionWeight, so
 * a fifth member just makes the shared rows split one more way.
 */
function computeLayout(members: TeamMember[], hoveredId: string | null): Map<string, Rect> {
  const rects = new Map<string, Rect>();
  if (members.length === 0) return rects;

  const anchor = members[0];
  const rest = members.slice(1);
  const hovered = rest.find((m) => m.id === hoveredId);

  /* Member hover — hovered card owns the right half, founder shifts to the
     top-left, the remaining members share the row under him. An even 50/50
     split keeps the pointer inside the hovered card's destination for every
     default-layout position, so the morph lands under the cursor. */
  if (hovered && rest.length > 1) {
    rects.set(hovered.id, { top: 0, left: 50, width: 50, height: 100 });
    rects.set(anchor.id, { top: 0, left: 0, width: 50, height: 54 });
    fillRow(rects, rest.filter((m) => m.id !== hovered.id), 0, 50, 54, 46);
    return rects;
  }

  /* Rest / founder hover — founder anchors left at 30% (48% when hovered),
     the rest stack right as featured-top + weighted bottom row. */
  const leftWidth = hoveredId === anchor.id ? 48 : 30;
  rects.set(anchor.id, { top: 0, left: 0, width: leftWidth, height: 100 });

  const rightWidth = 100 - leftWidth;
  if (rest.length === 0) return rects;

  const [featured, ...bottomRow] = rest;
  const topHeight = bottomRow.length > 0 ? 58 : 100;
  rects.set(featured.id, { top: 0, left: leftWidth, width: rightWidth, height: topHeight });

  if (bottomRow.length > 0) {
    fillRow(rects, bottomRow, leftWidth, rightWidth, topHeight, 100 - topHeight);
  }

  return rects;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function TeamPortrait({
  image,
  name,
  isHovered,
  priority,
}: {
  image?: string | null;
  name: string;
  isHovered: boolean;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(image) && !failed;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {showImage ? (
        <motion.div
          animate={{ scale: isHovered ? 1.08 : 1 }}
          transition={{ duration: 0.9, ease: EASE_OUT }}
          className="absolute inset-0"
        >
          <Image
            src={image!}
            alt={name}
            fill
            priority={priority}
            onError={() => setFailed(true)}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
            // Rule-of-thirds bias toward the eyes rather than dead-center —
            // keeps faces readable across both the tall anchor slot and the
            // very wide featured/bottom-row slots, regardless of how tightly
            // any given portrait was originally framed.
            style={{ objectPosition: '50% 30%' }}
          />
        </motion.div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-brand-white/6 via-brand-black to-brand-bg">
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              background:
                'radial-gradient(ellipse 60% 50% at 35% 30%, rgba(245,138,31,0.14), transparent 70%)',
            }}
          />
          <span className="editorial-heading relative text-4xl text-brand-white/15 md:text-6xl">
            {getInitials(name)}
          </span>
        </div>
      )}
    </div>
  );
}

interface TeamCardProps {
  member: TeamMember;
  isAnchor: boolean;
  isHovered: boolean;
  isDimmed: boolean;
  /** Whether the contribution copy + "View Profile" row is shown — hover-gated
   *  on the desktop bento grid, always true on the mobile stacked list. */
  expanded: boolean;
  onHover: (id: string | null) => void;
  priority?: boolean;
}

function TeamCard({
  member,
  isAnchor,
  isHovered,
  isDimmed,
  expanded,
  onHover,
  priority,
}: TeamCardProps) {
  const external = member.profileUrl?.startsWith('http');
  const href = member.profileUrl ?? '#';

  const sharedProps = {
    /* Mouse hover is resolved by the grid container from pointer position —
       card-level enter/leave would re-fire as cards fly beneath a stationary
       cursor and thrash the layout. Focus keeps keyboard users first-class. */
    onFocus: () => onHover(member.id),
    onBlur: () => onHover(null),
    'aria-label': `${member.name} — ${member.role}`,
    className:
      'cursor-target group relative block h-full w-full overflow-hidden rounded-2xl border border-brand-white/10 bg-brand-black transition-colors duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/60',
  };

  const body = (
    <>
      <TeamPortrait
        image={member.image}
        name={member.name}
        isHovered={isHovered}
        priority={priority}
      />

      {/* Readability gradient — darkens further on hover */}
      <div
        className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-transparent transition-opacity duration-500"
        style={{ opacity: isHovered ? 1 : isDimmed ? 0.75 : 0.9 }}
      />

      {/* Soft orange accent glow on hover */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_0_70px_rgba(245,138,31,0.28)] transition-opacity duration-500',
          isHovered ? 'opacity-100' : 'opacity-0',
        )}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-7">
        <motion.div
          animate={{ y: expanded ? -4 : 0 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
        >
          <div className="mb-3 flex items-center gap-3">
            <span
              className={cn(
                'h-px bg-brand-orange transition-all duration-500',
                expanded ? 'w-10 opacity-100' : 'w-6 opacity-60',
              )}
            />
            <p className="label-overline text-brand-orange">{member.role}</p>
          </div>

          <h3
            className={cn(
              'editorial-heading text-brand-white',
              isAnchor
                ? 'text-3xl md:text-4xl lg:text-5xl'
                : expanded
                  ? 'text-2xl md:text-3xl'
                  : 'text-xl md:text-2xl',
            )}
          >
            {member.name}
          </h3>

          <motion.div
            initial={false}
            animate={{ opacity: expanded ? 1 : 0, height: expanded ? 'auto' : 0 }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
            className="overflow-hidden"
          >
            <p className="mt-3 max-w-md pr-4 text-sm leading-relaxed text-brand-white/70 md:text-[15px]">
              {member.contribution}
            </p>
            <span className="mt-4 flex items-center gap-2 font-accent text-[10px] tracking-[0.3em] text-brand-white/50 uppercase">
              View Profile
              <svg
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
                className="h-3 w-3 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
              >
                <path
                  d="M2.5 8h11M9.5 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </motion.div>
        </motion.div>
      </div>
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...sharedProps}>
        {body}
      </a>
    );
  }

  return (
    <Link href={href} {...sharedProps}>
      {body}
    </Link>
  );
}

function TeamBentoGrid({ members }: { members: TeamMember[] }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const lastSwitchRef = useRef(0);

  const ranked = useMemo(
    () => [...members].sort((a, b) => b.contributionWeight - a.contributionWeight),
    [members],
  );
  const layout = useMemo(() => computeLayout(ranked, hoveredId), [ranked, hoveredId]);
  const anchorId = ranked[0]?.id;

  /* Hover from real pointer movement only. Two guards keep the morph calm:
     the hovered card is sticky while the pointer stays inside its rect, and
     switches are rate-limited so a pointer travelling through the reflow
     can't ping-pong the layout mid-animation. */
  const onGridMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const inRect = (r?: Rect) =>
      !!r && x >= r.left && x <= r.left + r.width && y >= r.top && y <= r.top + r.height;

    if (hoveredId && inRect(layout.get(hoveredId))) return;
    if (performance.now() - lastSwitchRef.current < 350) return;

    const next = ranked.find((m) => inRect(layout.get(m.id)));
    if ((next?.id ?? null) !== hoveredId) {
      lastSwitchRef.current = performance.now();
      setHoveredId(next?.id ?? null);
    }
  };

  return (
    // reducedMotion="user" strips the transform-driven parts of layout/scale
    // animations for prefers-reduced-motion users (cards snap instead of
    // sliding) while leaving opacity fades intact — and critically, it does
    // this at the framer-motion runtime level rather than by branching our
    // own JSX on a hook value, which is what caused a real SSR/CSR hydration
    // mismatch here (server has no matchMedia; a reduced-motion client's
    // very first render already resolves true, unlike the deferred-effect
    // pattern this hook uses elsewhere).
    <MotionConfig reducedMotion="user">
      <LayoutGroup>
        <div
          onMouseMove={onGridMouseMove}
          onMouseLeave={() => setHoveredId(null)}
          className="relative hidden h-140 w-full lg:block xl:h-180"
        >
          {ranked.map((member, index) => {
            const rect = layout.get(member.id);
            if (!rect) return null;
            return (
              <motion.div
                key={member.id}
                layout
                transition={SPRING}
                style={{
                  position: 'absolute',
                  top: `${rect.top}%`,
                  left: `${rect.left}%`,
                  width: `${rect.width}%`,
                  height: `${rect.height}%`,
                }}
                className="p-1.5 xl:p-2"
              >
                <TeamCard
                  member={member}
                  isAnchor={member.id === anchorId}
                  isHovered={hoveredId === member.id}
                  isDimmed={hoveredId !== null && hoveredId !== member.id}
                  expanded={hoveredId === member.id}
                  onHover={setHoveredId}
                  priority={index === 0}
                />
              </motion.div>
            );
          })}
        </div>
      </LayoutGroup>
    </MotionConfig>
  );
}

function TeamMobileList({ members }: { members: TeamMember[] }) {
  const ranked = useMemo(
    () => [...members].sort((a, b) => b.contributionWeight - a.contributionWeight),
    [members],
  );

  return (
    <div className="flex flex-col gap-4 lg:hidden">
      {ranked.map((member, index) => (
        <div key={member.id} className="h-85 w-full sm:h-100">
          <TeamCard
            member={member}
            isAnchor={index === 0}
            isHovered={false}
            isDimmed={false}
            expanded
            onHover={() => {}}
            priority={index === 0}
          />
        </div>
      ))}
    </div>
  );
}

export function TeamShowcase({ members }: { members: TeamMember[] }) {
  if (members.length === 0) return null;

  return (
    <>
      <TeamBentoGrid members={members} />
      <TeamMobileList members={members} />
    </>
  );
}

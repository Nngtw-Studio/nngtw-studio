/** @format */

'use client';

import { useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, MotionConfig } from 'framer-motion';
import type { TeamMember } from '@/types';
import { cn } from '@/lib/utils';

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
const SPRING = { type: 'spring' as const, stiffness: 210, damping: 28, mass: 1 };
/** Minimum time a grid-hovered card keeps hover before another can take it. */
const HOVER_HOLD_MS = 1000;
/** How long an index-rail hover keeps its card expanded (and held) before
 *  auto-releasing if the pointer never reaches the grid. */
const LIST_HOVER_MS = 3000;

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

  /* Rest / founder hover — founder anchors left at 35% (50% when hovered),
     the rest stack right as featured-top + weighted bottom row. The anchor
     share is tuned for the grid sitting beside the index rail: the rail eats
     ~20% of the section width, so 30% here rendered visibly narrower than
     the old full-width layout did. */
  const leftWidth = hoveredId === anchor.id ? 50 : 35;
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

function rankMembers(members: TeamMember[]): TeamMember[] {
  return [...members].sort((a, b) => b.contributionWeight - a.contributionWeight);
}

function TeamHeading() {
  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        <div className="accent-line" />
        <p className="label-overline text-brand-orange">The Team</p>
      </div>
      <h3 className="editorial-heading text-3xl text-brand-white md:text-4xl">
        Small team.
        <br />
        Big vision.
      </h3>
      <p className="mt-5 max-w-xs text-sm leading-7 text-brand-grey/60">
        The people behind every world we ship.
      </p>
    </div>
  );
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
  /** Whether the role, contribution copy + "View Profile" row is shown —
   *  hover-gated on the desktop bento grid, always true on mobile. */
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

      {/* Content — name only at rest; role + contribution reveal on hover */}
      <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-7">
        <motion.div
          animate={{ y: expanded ? -4 : 0 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
        >
          <motion.div
            initial={false}
            animate={{ opacity: expanded ? 1 : 0, height: expanded ? 'auto' : 0 }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
            className="overflow-hidden"
          >
            <div className="mb-3 flex items-center gap-3">
              <span className="h-px w-10 bg-brand-orange" />
              <p className="label-overline text-brand-orange">{member.role}</p>
            </div>
          </motion.div>

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

/** Desktop layout — heading + member index in a left rail, bento grid right. */
function TeamDesktop({ members }: { members: TeamMember[] }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  /* When the current hover engaged — a hovered card holds its expanded state
     for a minimum of HOVER_HOLD_MS regardless of where the morph slides the
     cards, which both prevents the reflow ping-pong and gives each profile a
     beat to actually be read. */
  const hoverStartRef = useRef(0);
  /* Hold duration of the CURRENT hover — 1s for grid hovers, 3s for
     index-rail hovers (rail hovers deserve a longer read since the pointer
     is nowhere near the card). */
  const holdMsRef = useRef(HOVER_HOLD_MS);
  /* Auto-release timer for rail hovers — without it, a rail-engaged card
     stayed expanded forever until the pointer happened to enter the grid. */
  const releaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const ranked = useMemo(() => rankMembers(members), [members]);
  const layout = useMemo(() => computeLayout(ranked, hoveredId), [ranked, hoveredId]);
  const anchorId = ranked[0]?.id;

  const clearReleaseTimer = () => {
    if (releaseTimerRef.current) {
      clearTimeout(releaseTimerRef.current);
      releaseTimerRef.current = null;
    }
  };

  /* Deliberate hover (index rail, keyboard focus) engages immediately,
     holds for LIST_HOVER_MS, then auto-releases if the grid pointer never
     took over. */
  const engage = (id: string | null) => {
    clearReleaseTimer();
    hoverStartRef.current = performance.now();
    holdMsRef.current = LIST_HOVER_MS;
    setHoveredId(id);
    if (id) {
      releaseTimerRef.current = setTimeout(() => {
        setHoveredId((current) => (current === id ? null : current));
      }, LIST_HOVER_MS);
    }
  };

  /* Hover from real pointer movement only. Two rules keep the morph calm:
     the hovered card is sticky while the pointer stays inside its rect, and
     once a card engages it HOLDS hover for HOVER_HOLD_MS — during the hold,
     the layout ignores the pointer entirely, so a reflow sliding cards under
     a stationary cursor can never ping-pong the grid. After the hold, the
     card the pointer currently sits on takes over. */
  const onGridMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const inRect = (r?: Rect) =>
      !!r && x >= r.left && x <= r.left + r.width && y >= r.top && y <= r.top + r.height;

    if (hoveredId) {
      if (inRect(layout.get(hoveredId))) {
        // Grid pointer reached the card — it owns the hover now, so cancel
        // any pending rail auto-release.
        clearReleaseTimer();
        return;
      }
      if (performance.now() - hoverStartRef.current < holdMsRef.current) return; // hold
    }

    const next = ranked.find((m) => inRect(layout.get(m.id)));
    if ((next?.id ?? null) !== hoveredId) {
      clearReleaseTimer();
      hoverStartRef.current = performance.now();
      holdMsRef.current = HOVER_HOLD_MS;
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
      <div className="hidden gap-12 lg:flex lg:items-stretch xl:gap-16">
        {/* Left rail — heading + member index */}
        <aside className="flex w-60 shrink-0 flex-col xl:w-72">
          <TeamHeading />

          <nav aria-label="Team members" className="mt-10 flex flex-col border-t border-brand-white/10">
            {ranked.map((member) => {
              const active = hoveredId === member.id;
              return (
                <button
                  key={member.id}
                  type="button"
                  onMouseEnter={() => engage(member.id)}
                  onFocus={() => engage(member.id)}
                  className={cn(
                    'cursor-target group/index flex flex-col border-b border-brand-white/10 py-4 text-left transition-colors duration-300 focus-visible:outline-none',
                    active ? 'text-brand-orange' : 'text-brand-white/75 hover:text-brand-white',
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={cn(
                        'h-px bg-brand-orange transition-all duration-300',
                        active ? 'w-6 opacity-100' : 'w-0 opacity-0',
                      )}
                    />
                    <span className="font-display text-lg font-semibold tracking-tight">
                      {member.name}
                    </span>
                  </span>
                  <span className="mt-1 font-accent text-[10px] tracking-[0.25em] text-brand-grey/50 uppercase">
                    {member.role}
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Bento grid */}
        <div
          onMouseMove={onGridMouseMove}
          onMouseLeave={() => {
            clearReleaseTimer();
            setHoveredId(null);
          }}
          className="relative h-140 min-w-0 flex-1 xl:h-180"
        >
          {ranked.map((member, index) => {
            const rect = layout.get(member.id);
            if (!rect) return null;
            return (
              <motion.div
                key={member.id}
                /* Animate the real box (top/left/width/height) instead of a
                   `layout` transform morph — layout animations scale the whole
                   subtree while interpolating, which visibly stretched the
                   portraits whenever a card changed aspect ratio on hover. */
                initial={false}
                animate={{
                  top: `${rect.top}%`,
                  left: `${rect.left}%`,
                  width: `${rect.width}%`,
                  height: `${rect.height}%`,
                }}
                transition={SPRING}
                style={{ position: 'absolute' }}
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
      </div>
    </MotionConfig>
  );
}

function TeamMobileList({ members }: { members: TeamMember[] }) {
  const ranked = useMemo(() => rankMembers(members), [members]);

  return (
    <div className="lg:hidden">
      <div className="mb-12">
        <TeamHeading />
      </div>
      <div className="flex flex-col gap-4">
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
    </div>
  );
}

export function TeamShowcase({ members }: { members: TeamMember[] }) {
  if (members.length === 0) return null;

  return (
    <>
      <TeamDesktop members={members} />
      <TeamMobileList members={members} />
    </>
  );
}

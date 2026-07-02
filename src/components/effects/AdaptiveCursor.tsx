'use client';

import { useEffect, useRef, useState } from 'react';
import { SmoothCursor } from '@/registry/magicui/smooth-cursor';
import TargetCursor from '@/registry/reactbits/TargetCursor';

const IDLE_TIMEOUT_MS = 3000;
const PROXIMITY_PX = 8;
const TARGET_SELECTOR = '.cursor-target';
const SPAWN_ANCHOR_SELECTOR = '[data-cursor-spawn-anchor]';
const CURSOR_ORANGE = '#f58a1f';
const CURSOR_PINK = '#df138a';

function distanceToRect(px: number, py: number, rect: DOMRect) {
  const dx = Math.max(rect.left - px, 0, px - rect.right);
  const dy = Math.max(rect.top - py, 0, py - rect.bottom);
  return Math.hypot(dx, dy);
}

function isNearAnyTarget(px: number, py: number) {
  const targets = document.querySelectorAll(TARGET_SELECTOR);
  for (const target of targets) {
    if (distanceToRect(px, py, target.getBoundingClientRect()) <= PROXIMITY_PX) return true;
  }
  return false;
}

function getSpawnAnchorPosition(): { x: number; y: number } | undefined {
  if (typeof document === 'undefined') return undefined;
  const anchor = document.querySelector(SPAWN_ANCHOR_SELECTOR);
  if (!anchor) return undefined;
  const rect = anchor.getBoundingClientRect();
  // The wrapping span's box spans the full line-height, but the visible
  // "hole" of the g glyph sits in the lower-middle of that box — nudge down
  // and slightly left to land inside the bowl rather than above/right of it.
  return { x: rect.left + rect.width * 0.4, y: rect.top + rect.height * 0.8 };
}

/**
 * Runs both cursor systems permanently mounted (never unmount/remount) so
 * neither one's internal position state resets when swapping visibility —
 * TargetCursor keeps tracking mousemove even while hidden, so by the time it
 * needs to show, it's already sitting at the correct spot. Only the visible
 * one changes: SmoothCursor is the default, TargetCursor takes over either
 * after IDLE_TIMEOUT_MS of no movement, or immediately whenever the cursor
 * comes within PROXIMITY_PX of any `.cursor-target` element — reverting to
 * SmoothCursor the instant neither condition holds anymore.
 *
 * Colors are fixed, not blend-mode driven: orange while idle/resting, pink
 * only while locked onto a `.cursor-target` element on hover.
 *
 * If the very first idle-timeout fires before the mouse has ever moved at
 * all, TargetCursor spawns at the `data-cursor-spawn-anchor` marker (the "g"
 * in the homepage headline) instead of screen-center.
 */
export function AdaptiveCursor() {
  const [showTargetCursor, setShowTargetCursor] = useState(false);
  const [spawnAnchorPos] = useState(getSpawnAnchorPosition);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const armIdleTimer = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => setShowTargetCursor(true), IDLE_TIMEOUT_MS);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const near = isNearAnyTarget(e.clientX, e.clientY);

      if (near) {
        setShowTargetCursor(true);
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        return;
      }

      setShowTargetCursor(false);
      armIdleTimer();
    };

    armIdleTimer();
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  return (
    <>
      <div style={{ opacity: showTargetCursor ? 0 : 1, transition: 'opacity 0.15s ease-out' }}>
        <SmoothCursor />
      </div>
      <div style={{ opacity: showTargetCursor ? 1 : 0, transition: 'opacity 0.15s ease-out' }}>
        <TargetCursor
          spinDuration={2}
          hideDefaultCursor
          parallaxOn
          cursorColor={CURSOR_ORANGE}
          cursorColorOnTarget={CURSOR_PINK}
          initialPosition={spawnAnchorPos}
        />
      </div>
    </>
  );
}

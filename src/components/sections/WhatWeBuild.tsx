/** @format */

import Link from 'next/link';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/motion/FadeIn';
import { Button } from '@/components/ui/Button';

const TAGS = ['Unity', 'Unreal', 'PC · Mobile'];

/**
 * Bento grid of the studio's three offerings. The big card carries the
 * current focus (original games); the two smaller cards flag what's next
 * (XR, apps/tools) without overselling work that hasn't shipped yet.
 */
export function WhatWeBuild() {
  return (
    <section
      id="what-we-build"
      className="relative snap-start overflow-hidden border-t border-brand-white/5 "
    >
      <div className="section-padding relative mx-auto max-w-[1600px]">
        <FadeIn className="mb-14 max-w-2xl md:mb-16">
          <div className="mb-6 flex items-center gap-4">
            <div className="accent-line" />
            <p className="label-overline text-brand-orange">What We Build</p>
          </div>
          <h2 className="editorial-heading text-4xl text-brand-white md:text-5xl">
            Three ways we make worlds.
          </h2>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 gap-5 sm:[grid-template-columns:1.4fr_1fr_1fr] sm:[grid-auto-rows:minmax(230px,auto)]">
          {/* Original games — the big card */}
          <StaggerItem className="sm:row-span-2">
            <Link
              href="/games"
              className="group flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-brand-white/10 bg-[linear-gradient(160deg,rgba(245,138,31,0.12),transparent_55%)] bg-brand-muted/40 p-9 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-brand-orange/50 md:p-11"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="font-accent text-[10px] tracking-[0.26em] text-brand-orange uppercase">
                  01 — Core
                </span>
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-white/15 text-brand-white/65 transition-colors duration-300 group-hover:border-brand-orange/50 group-hover:text-brand-orange"
                >
                  <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
                    <path
                      d="M4 12L12 4M6 4h6v6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
              <div>
                <h3 className="editorial-heading text-4xl text-brand-white md:text-5xl">
                  Original games
                </h3>
                <p className="mt-4 max-w-sm text-sm leading-7 text-brand-grey/80 md:text-base">
                  Worlds for PC and mobile, built to be returned to. Two titles in active
                  development.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {TAGS.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg border border-brand-white/12 px-3 py-1.5 font-accent text-[10px] tracking-[0.18em] text-brand-white/55 uppercase"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </StaggerItem>

          {/* XR & immersive */}
          <StaggerItem>
            <Link
              href="/technology"
              className="group flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-brand-white/10 bg-[linear-gradient(160deg,rgba(223,19,138,0.14),transparent_60%)] bg-brand-muted/40 p-8 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-brand-secondary/50"
            >
              <span className="font-accent text-[10px] tracking-[0.26em] text-brand-secondary uppercase">
                02 — Next
              </span>
              <div>
                <h3 className="editorial-heading text-2xl text-brand-white md:text-[1.875rem]">
                  XR &amp; immersive
                </h3>
                <p className="mt-3.5 text-sm leading-7 text-brand-grey/75">
                  VR, AR, and mixed reality — prototyping with OpenXR today.
                </p>
              </div>
            </Link>
          </StaggerItem>

          {/* Apps & tools */}
          <StaggerItem>
            <Link
              href="/technology"
              className="group flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-brand-white/10 bg-brand-muted/40 p-8 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-brand-white/32"
            >
              <span className="font-accent text-[10px] tracking-[0.26em] text-brand-white/50 uppercase">
                03 — Also
              </span>
              <div>
                <h3 className="editorial-heading text-2xl text-brand-white md:text-[1.875rem]">
                  Apps &amp; tools
                </h3>
                <p className="mt-3.5 text-sm leading-7 text-brand-grey/75">
                  Interactive products and the internal tooling that ships our games.
                </p>
              </div>
            </Link>
          </StaggerItem>

          {/* Wide CTA strip */}
          <StaggerItem className="sm:col-span-2">
            <div className="glass-panel flex h-full flex-wrap items-center justify-between gap-8 rounded-3xl px-9 py-9 md:px-10">
              <p className="max-w-md font-display text-xl leading-relaxed font-medium tracking-tight text-brand-white/90 md:text-[1.375rem]">
                One small team, one standard: craft over scale.
              </p>
              <Button href="/studio" variant="secondary">
                How We Work
              </Button>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  );
}

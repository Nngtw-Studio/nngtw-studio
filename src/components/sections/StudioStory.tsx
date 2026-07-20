/** @format */

import { FadeIn } from '@/components/motion/FadeIn';
import { studioContent } from '@/lib/data/content';

/**
 * Who we are — the vision rendered as an oversized editorial statement with
 * the motto words picked out in brand orange, grounded by the mission as
 * supporting copy.
 */
export function StudioStory() {
  return (
    <section className="relative snap-start overflow-hidden border-t border-brand-white/5 bg-brand-black">
      {/* Ambient treatment — a faint brand-orange bloom, mirroring sibling sections */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 h-140 w-140 rounded-full bg-brand-orange/5 blur-[140px]"
      />

      <div className="section-padding relative mx-auto max-w-[1600px]">
        <FadeIn>
          <div className="mb-16 flex items-center gap-4">
            <div className="accent-line" />
            <p className="label-overline text-brand-orange">Who We Are</p>
          </div>
        </FadeIn>

        {/* 01 — Vision, as a statement rather than a paragraph */}
        <FadeIn>
          <p className="label-overline text-brand-grey/40">
            <span className="text-brand-orange/70">01</span>
            <span className="mx-3">·</span>Vision
          </p>
          <blockquote className="mt-8 max-w-5xl font-display text-3xl leading-tight font-medium tracking-tight text-brand-white/90 md:text-4xl lg:text-5xl lg:leading-[1.15]">
            Original interactive worlds that inspire players to{' '}
            <em className="text-brand-orange not-italic">imagine</em>,{' '}
            <em className="text-brand-orange not-italic">explore</em>, and{' '}
            <em className="text-brand-orange not-italic">evolve</em> — from
            screens to immersive realities.
          </blockquote>
        </FadeIn>

        {/* 02 — Mission, offset right as the grounded answer to the vision */}
        <div className="mt-20 grid gap-10 lg:grid-cols-12 lg:gap-8">
          <FadeIn delay={0.15} className="lg:col-span-6 lg:col-start-6">
            <p className="label-overline text-brand-grey/40">
              <span className="text-brand-orange/70">02</span>
              <span className="mx-3">·</span>Mission
            </p>
            <p className="mt-6 border-l border-brand-orange/40 pl-8 text-base leading-9 text-brand-grey">
              {studioContent.mission}
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

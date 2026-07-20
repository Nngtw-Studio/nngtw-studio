/** @format */

import { FadeIn } from '@/components/motion/FadeIn';
import { CtaButton } from '@/components/ui/CtaButton';

/** Closing beat — after who we are and where we're going: come with us. */
export function StudioCTA() {
  return (
    <section className="relative snap-start overflow-hidden border-t border-brand-white/5">
      <div className="absolute inset-0 bg-linear-to-b from-brand-black to-brand-bg" />

      <div className="section-padding relative mx-auto max-w-[1600px]">
        <FadeIn>
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-6">
              <div className="mb-8 flex items-center gap-4">
                <div className="accent-line" />
                <p className="label-overline text-brand-orange">Join Us</p>
              </div>
              <h2 className="editorial-heading text-4xl text-brand-white md:text-5xl lg:text-6xl">
                Help build
                <br />
                what&apos;s next.
              </h2>
              <p className="mt-8 max-w-md text-base leading-9 text-brand-grey/70">
                We&apos;re growing thoughtfully — looking for people who care
                about craft, players, and worlds that last. If that sounds like
                you, we&apos;d love to talk.
              </p>
            </div>

            <div className="lg:col-span-5 lg:col-start-8 lg:self-end">
              <div className="flex flex-col gap-4 sm:flex-row sm:gap-2">
                <CtaButton href="/careers" variant="primary">
                  View Open Roles
                </CtaButton>
                <CtaButton href="/connect" variant="secondary">
                  Get in Touch
                </CtaButton>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

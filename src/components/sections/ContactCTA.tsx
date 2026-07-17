/** @format */

import Link from 'next/link';
import { FadeIn } from '@/components/motion/FadeIn';
import { CtaButton } from '@/components/ui/CtaButton';
import { BRAND, SOCIAL } from '@/lib/constants';

export function ContactCTA() {
  return (
    <section className="relative overflow-hidden border-t border-brand-white/5">
      <div className="absolute inset-0 bg-linear-to-b from-brand-black to-brand-bg" />
      <div className="section-padding relative mx-auto max-w-[1600px]">
        <FadeIn>
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-6">
              <div className="mb-8 flex items-center gap-4">
                <div className="accent-line" />
                <p className="label-overline text-brand-orange">Get in touch</p>
              </div>
              <h2 className="editorial-heading text-4xl text-brand-white md:text-5xl lg:text-6xl">
                Let&apos;s talk.
              </h2>
              <p className="mt-8 max-w-md text-base leading-9 text-brand-grey/70">
                Business enquiries, partnerships, or general contact — we&apos;d
                love to hear from you.
              </p>
            </div>

            <div className="lg:col-span-5 lg:col-start-8 lg:self-end">
              <div className="flex flex-col gap-4 sm:flex-row sm:gap-2">
                <CtaButton href="/contact" variant="primary">
                  Contact Us
                </CtaButton>
                <CtaButton href={SOCIAL.discord} variant="secondary" external>
                  Join Discord
                </CtaButton>
              </div>
            </div>
          </div>

          {/* Contact links */}
          <div className="mt-20 grid gap-10 border-t border-brand-white/4 pt-14 sm:grid-cols-3">
            {[
              { label: 'Email', href: `mailto:${BRAND.email}`, value: BRAND.email },
              { label: 'LinkedIn', href: SOCIAL.linkedin, value: 'Nngtw Studio' },
              { label: 'Facebook', href: SOCIAL.facebook, value: 'Nngtw Studio' },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                target={link.label === 'Email' ? undefined : '_blank'}
                rel={link.label === 'Email' ? undefined : 'noopener noreferrer'}
                className="group"
              >
                <p className="label-overline text-brand-grey/40">
                  {link.label}
                </p>
                <p className="mt-3 inline-block text-sm text-brand-white/70 transition-all duration-300 group-hover:translate-x-1 group-hover:text-brand-white">
                  {link.value}
                </p>
              </Link>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

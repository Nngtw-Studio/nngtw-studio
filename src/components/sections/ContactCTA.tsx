/** @format */

import Link from 'next/link';
import { FadeIn } from '@/components/motion/FadeIn';
import { Button } from '@/components/ui/Button';
import { BRAND, SOCIAL } from '@/lib/constants';

export function ContactCTA() {
  return (
    <section className="relative overflow-hidden border-t border-brand-white/4">
      <div className="absolute inset-0 bg-linear-to-b from-brand-black to-brand-bg" />
      <div className="section-padding relative mx-auto max-w-[1600px]">
        <FadeIn>
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-6">
              <p className="label-overline mb-8 text-brand-grey/60">Get in touch</p>
              <h2 className="editorial-heading text-4xl text-brand-white md:text-5xl lg:text-6xl">
                Let&apos;s talk.
              </h2>
              <p className="mt-8 max-w-md text-base leading-9 text-brand-grey/70">
                Business enquiries, partnerships, or general contact — we&apos;d
                love to hear from you.
              </p>
            </div>

            <div className="lg:col-span-5 lg:col-start-8 lg:self-end">
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button href="/contact" variant="primary" size="lg">
                  Contact Us
                </Button>
                <Button href={SOCIAL.discord} variant="secondary" size="lg" external>
                  Join Discord
                </Button>
              </div>
            </div>
          </div>

          {/* Contact links */}
          <div className="mt-20 grid gap-10 border-t border-brand-white/4 pt-14 sm:grid-cols-3">
            {[
              { label: 'Email', href: `mailto:${BRAND.email}`, value: BRAND.email },
              { label: 'LinkedIn', href: SOCIAL.linkedin, value: 'Nngtw Studio' },
              { label: 'GitHub', href: SOCIAL.github, value: 'nngtw-studio' },
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
                <p className="mt-3 text-sm text-brand-white/70 transition-colors duration-300 group-hover:text-brand-white">
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

/** @format */

import Link from 'next/link';
import { NAV_LINKS, SOCIAL, BRAND } from '@/lib/constants';
import { BRAND_ASSETS } from '@/lib/brand';

export function Footer() {
  return (
    <footer className="border-t border-brand-white/4 bg-brand-black">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 lg:px-20 xl:px-28 py-20 md:py-28">
        <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand column */}
          <div className="lg:col-span-4">
            <p className="label-overline text-brand-grey/50">
              Brand Statement
            </p>
            <p className="mt-8 max-w-xs text-sm leading-8 text-brand-grey/70">
              An independent game studio building original worlds for PC, mobile, and XR.
            </p>
            <p className="mt-6 label-overline text-brand-grey/40">
              {BRAND.tagline}
            </p>
          </div>

          {/* Navigate */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h4 className="label-overline mb-8 text-brand-white/50">
              Navigate
            </h4>
            <ul className="space-y-4">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-grey/70 transition-colors duration-300 hover:text-brand-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="lg:col-span-2 lg:col-start-9">
            <h4 className="label-overline mb-8 text-brand-white/50">
              Connect
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href={SOCIAL.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2.5 text-sm text-brand-grey/70 transition-colors duration-300 hover:text-[#5865F2]"
                >
                  <svg
                    className="h-3.5 w-3.5 opacity-50 transition-opacity group-hover:opacity-100"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                  </svg>
                  Discord
                </a>
              </li>
              <li>
                <a
                  href={SOCIAL.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-brand-grey/70 transition-colors duration-300 hover:text-brand-white"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={SOCIAL.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-brand-grey/70 transition-colors duration-300 hover:text-brand-white"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          {/* Community CTA */}
          <div className="lg:col-span-3 lg:col-start-11">
            <h4 className="label-overline mb-8 text-brand-white/50">
              Community
            </h4>
            <p className="mb-6 text-sm leading-7 text-brand-grey/70">
              Follow development, share ideas, and be part of what we&apos;re building.
            </p>
            <a
              href={SOCIAL.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-[#5865F2]/30 bg-[#5865F2]/10 px-5 py-2.5 font-secondary text-xs text-[#5865F2] transition-all duration-300 hover:border-[#5865F2]/60 hover:bg-[#5865F2]/20"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
              </svg>
              Join Discord
            </a>
          </div>
        </div>

        {/* Big logo strip */}
        <Link
          href="/"
          className="mt-20 block border-t border-brand-white/4 pt-16 transition-opacity duration-300 hover:opacity-80 md:pt-20"
        >
          <img
            src={BRAND_ASSETS.primaryLogoTagline}
            alt="Nngtw Studio"
            className="w-full max-w-xl md:hidden"
          />
          <img
            src={BRAND_ASSETS.horizontalLogo}
            alt="Nngtw Studio"
            className="hidden w-full max-w-5xl md:block"
          />
        </Link>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <p className="label-overline text-brand-grey/30">
            &copy; {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </p>
          <p className="label-overline text-brand-grey/30">
            Imagine. Explore. Evolve.
          </p>
        </div>
      </div>
    </footer>
  );
}

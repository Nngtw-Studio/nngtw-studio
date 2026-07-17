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
                    viewBox="0 0 33.867 33.867"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M11.343 5.177c-1.076 0-4.32 1.316-4.902 1.579-.582.263-1.228 1.084-1.961 2.439-.734 1.355-1.323 2.939-2.28 5.269-.956 2.33-1.179 6.822-1.147 8.193.032 1.371.189 2.442 1.594 3.253 1.404.81 2.646 1.658 3.953 2.168 1.308.51 2.2.877 2.806.367.606-.51 1.005-1.403 1.005-1.403s.574-.797-.51-1.275c-1.084-.479-1.626-.814-1.579-1.308.048-.494.127-.765.398-.701.271.064.91 1.211 3.365 1.737s4.848.447 4.848.447 2.394.08 4.849-.447c2.455-.526 3.093-1.673 3.364-1.737.271-.064.35.207.398.7.048.495-.494.83-1.578 1.309-1.084.478-.51 1.275-.51 1.275s.399.892 1.005 1.403c.605.51 1.498.143 2.805-.367 1.307-.51 2.55-1.357 3.954-2.168 1.405-.811 1.562-1.882 1.594-3.253.032-1.37-.191-5.863-1.148-8.193-.956-2.33-1.546-3.914-2.28-5.269-.732-1.355-1.379-2.176-1.96-2.44-.582-.262-3.827-1.578-4.903-1.578-1.076 0-1.394.75-1.394.75l-.375.829s-2.52-.479-3.804-.48c-1.284 0-3.837.48-3.837.48l-.375-.83s-.318-.749-1.395-.749zm.117 9.948h.04c1.569 0 2.84 1.373 2.84 3.066 0 1.694-1.271 3.066-2.84 3.066s-2.84-1.372-2.84-3.066c-.001-1.677 1.247-3.043 2.8-3.066zm10.907 0h.04c1.553.023 2.8 1.39 2.8 3.066 0 1.694-1.271 3.066-2.84 3.066-1.57 0-2.84-1.372-2.84-3.066 0-1.693 1.27-3.066 2.84-3.066z" />
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
                  href={SOCIAL.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-brand-grey/70 transition-colors duration-300 hover:text-brand-white"
                >
                  Facebook
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
              <svg className="h-3.5 w-3.5" viewBox="0 0 33.867 33.867" fill="currentColor" aria-hidden="true">
                <path d="M11.343 5.177c-1.076 0-4.32 1.316-4.902 1.579-.582.263-1.228 1.084-1.961 2.439-.734 1.355-1.323 2.939-2.28 5.269-.956 2.33-1.179 6.822-1.147 8.193.032 1.371.189 2.442 1.594 3.253 1.404.81 2.646 1.658 3.953 2.168 1.308.51 2.2.877 2.806.367.606-.51 1.005-1.403 1.005-1.403s.574-.797-.51-1.275c-1.084-.479-1.626-.814-1.579-1.308.048-.494.127-.765.398-.701.271.064.91 1.211 3.365 1.737s4.848.447 4.848.447 2.394.08 4.849-.447c2.455-.526 3.093-1.673 3.364-1.737.271-.064.35.207.398.7.048.495-.494.83-1.578 1.309-1.084.478-.51 1.275-.51 1.275s.399.892 1.005 1.403c.605.51 1.498.143 2.805-.367 1.307-.51 2.55-1.357 3.954-2.168 1.405-.811 1.562-1.882 1.594-3.253.032-1.37-.191-5.863-1.148-8.193-.956-2.33-1.546-3.914-2.28-5.269-.732-1.355-1.379-2.176-1.96-2.44-.582-.262-3.827-1.578-4.903-1.578-1.076 0-1.394.75-1.394.75l-.375.829s-2.52-.479-3.804-.48c-1.284 0-3.837.48-3.837.48l-.375-.83s-.318-.749-1.395-.749zm.117 9.948h.04c1.569 0 2.84 1.373 2.84 3.066 0 1.694-1.271 3.066-2.84 3.066s-2.84-1.372-2.84-3.066c-.001-1.677 1.247-3.043 2.8-3.066zm10.907 0h.04c1.553.023 2.8 1.39 2.8 3.066 0 1.694-1.271 3.066-2.84 3.066-1.57 0-2.84-1.372-2.84-3.066 0-1.693 1.27-3.066 2.84-3.066z" />
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
          <a
            href="/credits"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-brand-grey/30 underline transition-colors duration-300 hover:text-brand-grey/60"
          >
            Credits
          </a>
          <p className="label-overline text-brand-grey/30">
            Imagine. Explore. Evolve.
          </p>
        </div>
      </div>
    </footer>
  );
}

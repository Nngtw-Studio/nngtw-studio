/** @format */

import Link from 'next/link';
import { FadeIn } from '@/components/motion/FadeIn';

/** Closing beat — after who we are and where we're going: come with us. */
export function StudioCTA() {
  return (
    <section className="relative snap-start overflow-hidden border-t border-brand-white/5 ">
      <Link href="/careers" className="block w-full cursor-pointer group transition-colors duration-300 hover:bg-brand-white/5">
        <div className="py-12 md:py-16">
          <div className="relative mx-auto max-w-[1600px] px-6 md:px-12">
            <FadeIn>
              <div className="flex flex-row items-center justify-center gap-4 text-brand-white">
                <h2 className="editorial-heading text-3xl md:text-5xl lg:text-6xl text-center group-hover:text-brand-orange transition-colors duration-300">
                  Help us build whats next
                </h2>
                <span className="text-3xl md:text-5xl lg:text-6xl text-brand-orange transform group-hover:translate-x-4 transition-transform duration-300">
                  &rarr;
                </span>
              </div>
            </FadeIn>
          </div>
        </div>
      </Link>
    </section>
  );
}

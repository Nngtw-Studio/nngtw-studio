/** @format */

import Link from 'next/link';
import { cn } from '@/lib/utils';

type HeroButtonVariant = 'primary' | 'secondary';

interface HeroButtonProps {
  href: string;
  variant?: HeroButtonVariant;
  children: React.ReactNode;
  className?: string;
}

const variants: Record<HeroButtonVariant, { box: string; bracket: string }> = {
  primary: {
    box: 'border-brand-orange/40 bg-brand-orange/[0.07] text-brand-white group-hover:border-brand-orange group-hover:bg-brand-orange/[0.14]',
    bracket: 'border-brand-orange/70',
  },
  secondary: {
    box: 'border-brand-white/20 bg-transparent text-brand-white/80 group-hover:border-brand-white/60 group-hover:text-brand-white',
    bracket: 'border-brand-white/50',
  },
};

/** Corner-bracket reticle — tightens on hover, like a unit-select frame in a strategy game UI. */
function Brackets({ tone }: { tone: string }) {
  const base = 'absolute h-3 w-3 border-brand-white/0 opacity-40 transition-all duration-500 ease-out group-hover:opacity-100';
  return (
    <>
      <span className={cn(base, tone, 'top-0 left-0 -translate-x-1.5 -translate-y-1.5 border-t border-l group-hover:-translate-x-1 group-hover:-translate-y-1')} />
      <span className={cn(base, tone, 'top-0 right-0 translate-x-1.5 -translate-y-1.5 border-t border-r group-hover:translate-x-1 group-hover:-translate-y-1')} />
      <span className={cn(base, tone, 'bottom-0 left-0 -translate-x-1.5 translate-y-1.5 border-b border-l group-hover:-translate-x-1 group-hover:translate-y-1')} />
      <span className={cn(base, tone, 'bottom-0 right-0 translate-x-1.5 translate-y-1.5 border-b border-r group-hover:translate-x-1 group-hover:translate-y-1')} />
    </>
  );
}

export function HeroButton({ href, variant = 'primary', children, className }: HeroButtonProps) {
  const { box, bracket } = variants[variant];

  return (
    <Link
      href={href}
      className={cn(
        'group relative inline-flex items-center gap-4 border px-10 py-4 font-secondary text-xs tracking-[0.22em] uppercase transition-all duration-300 active:scale-[0.97]',
        box,
        className,
      )}
    >
      <Brackets tone={bracket} />
      <span className="transition-[letter-spacing] duration-300 group-hover:tracking-[0.26em]">
        {children}
      </span>
      <span className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1" aria-hidden="true">
        &rarr;
      </span>
    </Link>
  );
}

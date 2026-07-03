/** @format */

'use client';

import type { MouseEvent } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useRipple } from '@/hooks/useRipple';
import { RippleLayer } from '@/components/ui/RippleLayer';

type HeroButtonVariant = 'primary' | 'secondary';

interface HeroButtonProps {
  href: string;
  variant?: HeroButtonVariant;
  children: React.ReactNode;
  className?: string;
}

const variants: Record<HeroButtonVariant, string> = {
  primary:
    'bg-brand-orange/15 text-brand-orange border-brand-orange shadow-[inset_0_0_12px_var(--color-brand-orange)] hover:shadow-[inset_0_0_20px_var(--color-brand-orange)] focus-visible:ring-brand-orange/70',
  secondary:
    'bg-brand-white/15 text-brand-white/60 border-brand-white/60 shadow-[inset_0_0_12px_rgba(242,239,231,0.6)] hover:shadow-[inset_0_0_20px_rgba(242,239,231,0.6)] hover:text-brand-white/80 focus-visible:ring-brand-white/50',
};

export function HeroButton({ href, variant = 'primary', children, className }: HeroButtonProps) {
  const { ripples, addRipple } = useRipple();

  return (
    <Link
      href={href}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => addRipple(event)}
      className={cn(
        'group cursor-target relative isolate inline-flex w-62.5 items-center justify-center overflow-hidden rounded-xl border-[0.5px] py-4 font-secondary text-[18px] font-normal',
        'transition-all duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black',
        variants[variant],
        className,
      )}
    >
      {/* Label eases left as the arrow arrives, keeping the pair optically centered */}
      <span className="relative z-10 transition-transform duration-300 ease-out group-hover:-translate-x-2">
        {children}
        <svg
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          className="absolute top-1/2 left-full ml-2 h-4 w-4 -translate-x-2 -translate-y-1/2 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100"
        >
          <path
            d="M2.5 8h11M9.5 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      {/* Sheen — a single light pass across the surface on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-0 w-full -translate-x-full skew-x-12 bg-linear-to-r from-transparent via-brand-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
      />

      <RippleLayer ripples={ripples} />
    </Link>
  );
}

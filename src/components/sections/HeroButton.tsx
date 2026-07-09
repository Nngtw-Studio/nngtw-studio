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
    'bg-brand-orange-dark text-brand-white border-brand-orange-dark/60 hover:bg-[#e07a10] shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_0_10px_rgba(255,255,255,0.08),0_0_8px_rgba(212,107,8,0.2)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),inset_0_0_12px_rgba(255,255,255,0.12),0_0_14px_rgba(212,107,8,0.35)] focus-visible:ring-brand-orange-dark/70',
  secondary:
    'bg-transparent text-brand-secondary/80 hover:text-brand-secondary border-brand-secondary/30 hover:border-brand-secondary/60 shadow-[inset_0_0_10px_rgba(245,138,31,0.15),0_0_6px_rgba(223,19,138,0.1)] hover:shadow-[inset_0_0_14px_rgba(245,138,31,0.28),0_0_10px_rgba(223,19,138,0.25)] focus-visible:ring-brand-secondary/50',
};

export function HeroButton({ href, variant = 'primary', children, className }: HeroButtonProps) {
  const { ripples, addRipple } = useRipple();

  const shimmerGradient =
    variant === 'primary'
      ? 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.12), transparent, rgba(245, 138, 31, 0.15), transparent)'
      : 'linear-gradient(90deg, transparent, rgba(223, 19, 138, 0.1), transparent, rgba(245, 138, 31, 0.1), transparent)';

  return (
    <Link
      href={href}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => addRipple(event)}
      className={cn(
        'group cursor-target relative isolate inline-flex w-50 items-center justify-center overflow-hidden rounded-lg border-[0.5px] py-3 font-secondary text-[15px] font-normal',
        'transition-all duration-300 ease-out hover:-translate-y-[3px] active:translate-y-0 active:scale-[0.98]',
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

      {/* Subtle edge shimmer (CSS-only outline mask) */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-xl z-0 animate-edge-shimmer opacity-60"
        style={{
          padding: '0.5px',
          background: shimmerGradient,
          backgroundSize: '200% 100%',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      <RippleLayer ripples={ripples} />
    </Link>
  );
}

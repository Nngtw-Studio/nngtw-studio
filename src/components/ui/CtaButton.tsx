/** @format */

'use client';

import type { MouseEvent } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useRipple } from '@/hooks/useRipple';
import { RippleLayer } from '@/components/ui/RippleLayer';

type CtaButtonVariant = 'primary' | 'secondary' | 'discord';

interface CtaButtonProps {
  href: string;
  variant?: CtaButtonVariant;
  external?: boolean;
  children: React.ReactNode;
  className?: string;
}

const variants: Record<CtaButtonVariant, string> = {
  primary: 'border-0 bg-brand-orange-dark text-brand-white focus-visible:ring-brand-orange/60',
  secondary:
    'border border-brand-secondary bg-transparent text-brand-secondary shadow-[0_0_6px_rgba(223,19,138,0.1)] hover:shadow-[0_0_10px_rgba(223,19,138,0.25)] focus-visible:ring-brand-secondary/50',
  discord: 'border-0 bg-[#5865F2] text-white hover:bg-[#6B77F5] focus-visible:ring-[#5865F2]/70',
};

/**
 * The hero CTA treatment, minus the icon choreography: 280x56 idle grows to
 * 320x64 on hover, corners flatten to 0, the label's tracking widens, and
 * clicks ripple — all on the same elastic curve as the hero buttons.
 */
export function CtaButton({
  href,
  variant = 'primary',
  external,
  children,
  className,
}: CtaButtonProps) {
  const { ripples, addRipple } = useRipple();

  const classes = cn(
    'group cursor-target relative isolate inline-flex items-center justify-center overflow-hidden',
    'w-[280px] h-[56px] rounded-[16px] hover:w-[320px] hover:h-[64px] hover:rounded-none',
    'font-secondary text-[18px] font-semibold',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black',
    variants[variant],
  );

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => addRipple(event);

  const style = {
    transition: 'all 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  };

  const content = (
    <>
      <span className="relative z-10 leading-none whitespace-nowrap tracking-[0.01em] transition-[letter-spacing] duration-300 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] group-hover:tracking-[0.1em]">
        {children}
      </span>
      <RippleLayer ripples={ripples} />
    </>
  );

  /* Slot reserves the hover footprint so growth never nudges neighbours. */
  const slot = cn('inline-flex h-16 w-80 items-center justify-center', className);

  if (external) {
    return (
      <span className={slot}>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={style}
          className={classes}
          onClick={handleClick}
        >
          {content}
        </a>
      </span>
    );
  }

  return (
    <span className={slot}>
      <Link href={href} style={style} className={classes} onClick={handleClick}>
        {content}
      </Link>
    </span>
  );
}

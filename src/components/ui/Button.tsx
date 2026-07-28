/** @format */

'use client';

import type { MouseEvent } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useRipple } from '@/hooks/useRipple';
import { RippleLayer } from '@/components/ui/RippleLayer';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'discord';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize; // Keeping size prop for compatibility, though we ignore it for styling now
  external?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

const variants: Record<ButtonVariant, string> = {
  primary: 'border-0 bg-brand-orange-dark text-brand-white focus-visible:ring-brand-orange/60',
  secondary:
    'border border-brand-secondary bg-transparent text-brand-secondary shadow-[0_0_6px_rgba(223,19,138,0.1)] hover:shadow-[0_0_10px_rgba(223,19,138,0.25)] focus-visible:ring-brand-secondary/50',
  ghost:
    'bg-transparent text-brand-white/70 hover:text-brand-white border border-transparent hover:border-brand-white/10 focus-visible:ring-brand-white/40',
  discord: 'border-0 bg-[#5865F2] text-white hover:bg-[#6B77F5] focus-visible:ring-[#5865F2]/70',
};

/**
 * The hero CTA treatment applied universally: 280x56 idle grows to
 * 320x64 on hover, corners flatten to 0, the label's tracking widens, and
 * clicks ripple — all on the same elastic curve as the hero buttons.
 */
export function Button({
  href,
  variant = 'primary',
  size,
  external,
  children,
  className,
  onClick,
}: ButtonProps) {
  const { ripples, addRipple } = useRipple();

  const classes = cn(
    'group/btn cursor-target relative isolate inline-flex items-center justify-center overflow-hidden',
    'w-[280px] h-[56px] rounded-[16px] hover:w-[320px] hover:h-[64px] hover:rounded-none',
    'font-secondary text-[18px] font-semibold',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black',
    variants[variant],
  );

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    addRipple(event);
    if (onClick) onClick(event);
  };

  const style = {
    transition: 'all 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  };

  const content = (
    <>
      <span className="relative z-10 leading-none whitespace-nowrap tracking-[0.01em] transition-[letter-spacing] duration-300 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] group-hover/btn:tracking-[0.1em]">
        {children}
      </span>
      <RippleLayer ripples={ripples} />
    </>
  );

  /* Slot reserves the hover footprint so growth never nudges neighbours. */
  const slot = cn('inline-flex h-[64px] w-[320px] items-center justify-center', className);

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

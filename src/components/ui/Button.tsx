/** @format */

'use client';

import type { MouseEvent } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useRipple } from '@/hooks/useRipple';
import { RippleLayer } from '@/components/ui/RippleLayer';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'discord';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href: string;
  external?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'rounded-xl bg-brand-orange/15 text-brand-orange border-[0.5px] border-brand-orange text-[18px]! font-normal shadow-[inset_0_0_12px_var(--color-brand-orange)] hover:shadow-[inset_0_0_18px_var(--color-brand-orange)] active:scale-[0.98]',
  secondary:
    'rounded-xl bg-brand-white/15 text-brand-white/60 border-[0.5px] border-brand-white/60 text-[18px]! font-normal shadow-[inset_0_0_12px_rgba(242,239,231,0.6)] hover:shadow-[inset_0_0_18px_rgba(242,239,231,0.6)] active:scale-[0.98]',
  ghost:
    'bg-transparent text-brand-white/70 hover:text-brand-white border border-transparent hover:border-brand-white/10',
  discord:
    'bg-[#5865F2] text-white border border-[#5865F2] hover:bg-[#6B77F5] hover:border-[#6B77F5] active:scale-[0.98]',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'px-5 py-2.5 text-xs tracking-[0.08em]',
  md: 'px-7 py-3 text-sm tracking-[0.06em]',
  lg: 'px-10 py-4 text-sm tracking-[0.06em]',
};

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  href,
  external,
  onClick,
  ...props
}: ButtonProps) {
  const { ripples, addRipple } = useRipple();

  const classes = cn(
    'cursor-target relative isolate inline-flex items-center justify-center overflow-hidden font-secondary transition-all duration-300',
    variants[variant],
    sizes[size],
    className,
  );

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    addRipple(event);
    onClick?.(event);
  };

  const content = (
    <>
      <span className="relative z-10">{children}</span>
      <RippleLayer ripples={ripples} />
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        onClick={handleClick}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} onClick={handleClick} {...props}>
      {content}
    </Link>
  );
}

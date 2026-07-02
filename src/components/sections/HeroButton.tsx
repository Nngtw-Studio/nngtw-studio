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
    'bg-brand-orange/15 text-brand-orange border-brand-orange shadow-[inset_0_0_12px_var(--color-brand-orange)] hover:shadow-[inset_0_0_18px_var(--color-brand-orange)]',
  secondary:
    'bg-brand-white/15 text-brand-white/60 border-brand-white/60 shadow-[inset_0_0_12px_rgba(242,239,231,0.6)] hover:shadow-[inset_0_0_18px_rgba(242,239,231,0.6)]',
};

export function HeroButton({ href, variant = 'primary', children, className }: HeroButtonProps) {
  const { ripples, addRipple } = useRipple();

  return (
    <Link
      href={href}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => addRipple(event)}
      className={cn(
        'cursor-target relative isolate inline-flex w-62.5 items-center justify-center overflow-hidden rounded-xl border-[0.5px] py-4 font-secondary text-[18px] font-normal transition-all duration-300 active:scale-[0.98]',
        variants[variant],
        className,
      )}
    >
      <span className="relative z-10">{children}</span>
      <RippleLayer ripples={ripples} />
    </Link>
  );
}

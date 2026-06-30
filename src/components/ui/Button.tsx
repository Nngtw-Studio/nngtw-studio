/** @format */

import Link from 'next/link';
import { cn } from '@/lib/utils';

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
    'bg-brand-orange text-brand-black border border-brand-orange hover:bg-brand-white hover:border-brand-white active:scale-[0.98]',
  secondary:
    'bg-transparent text-brand-white border border-brand-white/20 hover:border-brand-white/70 hover:bg-brand-white/5 active:scale-[0.98]',
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
  ...props
}: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center font-secondary transition-all duration-300',
    variants[variant],
    sizes[size],
    className,
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...props}>
      {children}
    </Link>
  );
}

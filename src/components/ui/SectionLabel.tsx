import { cn } from '@/lib/utils';

interface SectionLabelProps {
  children: React.ReactNode;
  variant?: 'main' | 'section';
  className?: string;
}

export function SectionLabel({ children, variant = 'section', className }: SectionLabelProps) {
  if (variant === 'main') {
    return (
      <div className={cn("flex items-center gap-4", className)}>
        <div className="accent-line shrink-0" />
        <p className="label-overline text-[14px] tracking-[0.27em] text-brand-orange">{children}</p>
      </div>
    );
  }

  return (
    <p className={cn("label-overline text-[14px] tracking-[0.27em] text-brand-white/40", className)}>
      {children}
    </p>
  );
}

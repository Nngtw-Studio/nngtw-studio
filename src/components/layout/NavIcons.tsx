/** @format */

type IconProps = { className?: string };

const base = {
  viewBox: '0 0 20 20',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

/** Die — play / active titles */
function GamesIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <rect x="4" y="4" width="12" height="12" rx="2.4" />
      <circle cx="7.2" cy="7.2" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="12.8" cy="7.2" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="10" cy="10" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="7.2" cy="12.8" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="12.8" cy="12.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Clapperboard — production / craft */
function StudioIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <rect x="3" y="7.6" width="14" height="9" rx="1" />
      <line x1="3" y1="10.6" x2="17" y2="10.6" />
      <path d="M3 7.6 5.2 3.4h3L6 7.6Z" />
      <path d="M9 7.6 11.2 3.4h3L12 7.6Z" />
    </svg>
  );
}

/** Hex bolt — engineering / systems */
function TechnologyIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M10 3 16.06 6.5v7L10 17 3.94 13.5v-7Z" />
      <circle cx="10" cy="10" r="1.7" />
    </svg>
  );
}

/** Dispatch — articles / updates */
function NewsIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <rect x="3" y="4" width="14" height="12" rx="1" />
      <line x1="6" y1="7.6" x2="14" y2="7.6" />
      <line x1="6" y1="10.1" x2="14" y2="10.1" />
      <line x1="6" y1="12.6" x2="11" y2="12.6" />
    </svg>
  );
}

/** Briefcase — roles / team */
function CareersIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <rect x="3" y="8" width="14" height="8.6" rx="1.2" />
      <path d="M7.5 8V6.2c0-.66.54-1.2 1.2-1.2h2.6c.66 0 1.2.54 1.2 1.2V8" />
      <line x1="3" y1="11.9" x2="17" y2="11.9" />
    </svg>
  );
}

/** Envelope — direct contact */
function ContactIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <rect x="3" y="5.5" width="14" height="9.5" rx="1.2" />
      <path d="M3.5 6.5 10 11.4 16.5 6.5" />
    </svg>
  );
}

export const NAV_ICONS: Record<string, (props: IconProps) => React.ReactElement> = {
  '/games': GamesIcon,
  '/studio': StudioIcon,
  '/technology': TechnologyIcon,
  '/news': NewsIcon,
  '/careers': CareersIcon,
  '/contact': ContactIcon,
};

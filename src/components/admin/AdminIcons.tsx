import type { AdminSection } from "@/types";

type IconProps = { className?: string };

const base = {
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const HomeIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <path d="M2.5 7.5 8 3l5.5 4.5" />
    <path d="M4 6.7V13h8V6.7" />
  </svg>
);

const GamesIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <path d="M5.5 5.5h5a3 3 0 0 1 2.95 2.46l.34 2.06a1.35 1.35 0 0 1-2.43.98L10.2 9.8H5.8l-1.16 1.2a1.35 1.35 0 0 1-2.43-.98l.34-2.06A3 3 0 0 1 5.5 5.5Z" />
    <path d="M5 7.7v1.4M4.3 8.4h1.4" />
    <path d="M10.6 7.7h.01M11.4 8.7h.01" />
  </svg>
);

const NewsIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <path d="M4 2.8h5l3 3v7.4H4Z" />
    <path d="M9 2.8V6h3" />
    <path d="M6 8.5h4M6 10.7h3" />
  </svg>
);

const TeamIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <circle cx="6" cy="6" r="2" />
    <path d="M2.6 12.8c0-2 1.5-3.2 3.4-3.2s3.4 1.2 3.4 3.2" />
    <path d="M10.4 4.2a1.7 1.7 0 0 1 .2 3.35" />
    <path d="M11.2 9.8c1.3.25 2.2 1.2 2.2 3" />
  </svg>
);

const TechIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <rect x="4.5" y="4.5" width="7" height="7" rx="1" />
    <path d="M6.3 4.5V2.6M9.7 4.5V2.6M6.3 13.4v-1.9M9.7 13.4v-1.9M4.5 6.3H2.6M4.5 9.7H2.6M13.4 6.3h-1.9M13.4 9.7h-1.9" />
  </svg>
);

const CareersIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <rect x="2.5" y="5.2" width="11" height="7.3" rx="1.2" />
    <path d="M6 5.2V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1.2" />
    <path d="M2.5 8.6h11" />
  </svg>
);

const ApplicationsIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <path d="M2.6 8.7 4.2 3.6h7.6l1.6 5.1v3.9a.8.8 0 0 1-.8.8H3.4a.8.8 0 0 1-.8-.8Z" />
    <path d="M2.6 8.7h3l1 1.6h2.8l1-1.6h3" />
  </svg>
);

const MediaIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <rect x="2.5" y="3.5" width="11" height="9" rx="1.2" />
    <circle cx="5.8" cy="6.4" r="1" />
    <path d="M3 11.5 6.2 8.7l1.8 1.7 2.6-2.6 2.4 2.3" />
  </svg>
);

const DiscordIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M13.545 3.03a13.2 13.2 0 0 0-3.257-1.01.05.05 0 0 0-.052.025c-.14.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.4 8.4 0 0 0-.412-.833.05.05 0 0 0-.053-.025c-1.132.195-2.214.536-3.257 1.01a.05.05 0 0 0-.021.019C.356 6.163-.213 9.185.066 12.17a.06.06 0 0 0 .021.038 13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.028-.07 8.8 8.8 0 0 1-1.248-.595.05.05 0 0 1-.005-.085q.126-.093.246-.192a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .052.006q.12.099.246.193a.05.05 0 0 1-.004.085 8.3 8.3 0 0 1-1.249.594.05.05 0 0 0-.027.071c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.365-9.106a.04.04 0 0 0-.021-.019M5.343 10.352c-.789 0-1.438-.724-1.438-1.613s.637-1.612 1.438-1.612c.807 0 1.45.73 1.438 1.612 0 .889-.637 1.613-1.438 1.613m5.316 0c-.788 0-1.438-.724-1.438-1.613s.637-1.612 1.438-1.612c.807 0 1.45.73 1.438 1.612 0 .889-.63 1.613-1.438 1.613" />
  </svg>
);

const SettingsIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <circle cx="8" cy="8" r="2.1" />
    <path d="M8 1.6v1.7M8 12.7v1.7M14.4 8h-1.7M3.3 8H1.6M12.53 3.47l-1.2 1.2M4.67 11.33l-1.2 1.2M12.53 12.53l-1.2-1.2M4.67 4.67l-1.2-1.2" />
  </svg>
);

export const ADMIN_ICONS: Record<AdminSection, (props: IconProps) => React.ReactElement> = {
  homepage: HomeIcon,
  games: GamesIcon,
  news: NewsIcon,
  team: TeamIcon,
  technology: TechIcon,
  careers: CareersIcon,
  applications: ApplicationsIcon,
  media: MediaIcon,
  discord: DiscordIcon,
  settings: SettingsIcon,
  // Retained for the AdminSection union; these sections are no longer surfaced.
  "contact-messages": NewsIcon,
  navigation: HomeIcon,
};

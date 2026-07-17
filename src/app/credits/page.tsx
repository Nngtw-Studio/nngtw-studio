import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Credits",
  description: "Icon and asset credits for Nngtw Studio.",
};

interface Credit {
  name: string;
  iconHref: string;
  iconLabel: string;
  contributorHref: string;
  contributorLabel: string;
  /** Defaults to IconScout when omitted */
  platform?: string;
  platformHref?: string;
}

const credits: Credit[] = [
  {
    name: "LinkedIn",
    iconHref: "https://iconscout.com/icons/linkedin",
    iconLabel: "Linkedin",
    contributorHref: "https://iconscout.com/contributors/jagathish",
    contributorLabel: "Jagathish Saravanan",
  },
  {
    name: "Facebook",
    iconHref: "https://iconscout.com/icons/facebook",
    iconLabel: "Facebook",
    contributorHref: "https://iconscout.com/contributors/tanjilmah",
    contributorLabel: "Animaio Studio",
  },
  {
    name: "Instagram",
    iconHref: "https://iconscout.com/icons/instagram-logo",
    iconLabel: "Instagram",
    contributorHref: "https://iconscout.com/contributors/phosphoricons",
    contributorLabel: "Phosphor Icons",
  },
  {
    name: "Discord",
    iconHref: "https://iconscout.com/icons/discord",
    iconLabel: "discord",
    contributorHref: "https://iconscout.com/contributors/bukeicon",
    contributorLabel: "Buke Icon",
  },
  {
    name: "Games (nav icon)",
    iconHref: "https://www.flaticon.com/free-icons/game-pad",
    iconLabel: "Game pad icons",
    contributorHref: "https://www.flaticon.com/authors/anggara",
    contributorLabel: "Anggara",
    platform: "Flaticon",
    platformHref: "https://www.flaticon.com",
  },
  {
    name: "Studio (nav icon)",
    iconHref: "https://iconscout.com/icons/team",
    iconLabel: "Team",
    contributorHref: "https://iconscout.com/contributors/artworkbean",
    contributorLabel: "Baabullah Hasan",
  },
  {
    name: "Technology (nav icon)",
    iconHref: "https://thenounproject.com/browse/icons/term/technology/",
    iconLabel: "Technology",
    contributorHref: "https://thenounproject.com",
    contributorLabel: "Studio Danro",
    platform: "Noun Project (CC BY 3.0)",
    platformHref: "https://thenounproject.com",
  },
  {
    name: "News (nav icon)",
    iconHref: "https://www.flaticon.com/free-icons/call-to-action",
    iconLabel: "Call to action icons",
    contributorHref: "https://www.flaticon.com/authors/tanah-basah",
    contributorLabel: "Tanah Basah",
    platform: "Flaticon",
    platformHref: "https://www.flaticon.com",
  },
  {
    name: "Careers (nav icon)",
    iconHref: "https://www.flaticon.com/free-icons/suitcase",
    iconLabel: "Suitcase icons",
    contributorHref: "https://www.flaticon.com/authors/radhe-icon",
    contributorLabel: "Radhe Icon",
    platform: "Flaticon",
    platformHref: "https://www.flaticon.com",
  },
  {
    name: "Contact (nav icon)",
    iconHref: "https://iconscout.com/icons/telephone",
    iconLabel: "Telephone",
    contributorHref: "https://iconscout.com/contributors/sullivanproject",
    contributorLabel: "Sullivan Project",
  },
];

export default function CreditsPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-brand-white">
      <h1 className="text-xl font-medium">Credits</h1>
      <p className="mt-2 text-sm text-brand-grey">
        Icons used across this site.
      </p>

      <ul className="mt-10 space-y-4 text-sm text-brand-grey">
        {credits.map((c) => (
          <li key={c.name}>
            <a
              href={c.iconHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-white underline"
            >
              {c.iconLabel}
            </a>{" "}
            by{" "}
            <a
              href={c.contributorHref}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {c.contributorLabel}
            </a>{" "}
            on{" "}
            <a
              href={c.platformHref ?? "https://iconscout.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {c.platform ?? "IconScout"}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

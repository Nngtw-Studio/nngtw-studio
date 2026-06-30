/** @format */

import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BRAND } from '@/lib/constants';
import { BRAND_ASSETS } from '@/lib/brand';
import './globals.css';

const chillax = localFont({
  src: [
    {
      path: '../../public/fonts/Chillax/Chillax Variable.woff2',
      style: 'normal',
    },
  ],
  variable: '--font-display',
  display: 'swap',
  fallback: ['Georgia', 'serif'],
});

const cabinetGrotesk = localFont({
  src: [
    {
      path: '../../public/fonts/Cabinet/Cabinet Grotesk Variable.woff2',
      style: 'normal',
    },
  ],
  variable: '--font-body',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
});

const posterama2001 = localFont({
  src: [
    {
      path: '../../public/fonts/Posterama2001W04/Posterama2001W04-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Posterama2001W04/Posterama2001W04-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Posterama2001W04/Posterama2001W04-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Posterama2001W04/Posterama2001W04-Black.woff2',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Posterama2001W04/Posterama2001W04-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Posterama2001W04/Posterama2001W04-Thin.woff2',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Posterama2001W04/Posterama2001W04-UltraBlack.woff2',
      weight: '950',
      style: 'normal',
    },
  ],
  variable: '--font-accent',
  display: 'swap',
  fallback: ['Times New Roman', 'serif'],
});

const posteramaText = localFont({
  src: [
    {
      path: '../../public/fonts/PosteramaText/PosteramaText-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/PosteramaText/PosteramaText-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-secondary',
  display: 'swap',
  fallback: ['Georgia', 'serif'],
});

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.url),
  title: {
    default: `${BRAND.name} — ${BRAND.tagline}`,
    template: `%s | ${BRAND.name}`,
  },
  description: BRAND.description,
  keywords: [
    'game studio',
    'independent games',
    'NNGTW Studio',
    'game development',
    'XR',
    'VR',
    'Unity',
    'Unreal Engine',
  ],
  authors: [{ name: BRAND.name }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: BRAND.name,
    title: BRAND.name,
    description: BRAND.description,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: BRAND.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: BRAND.name,
    description: BRAND.description,
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: BRAND_ASSETS.faviconIcon,
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${chillax.variable} ${cabinetGrotesk.variable} ${posterama2001.variable} ${posteramaText.variable}`}
    >
      <body className="antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

/** @format */

import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { SiteChrome } from '@/components/layout/SiteChrome';
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

const petrovSans = localFont({
  src: [
    { path: '../../public/fonts/Petrov Sans/PetrovSans-Thin.ttf', weight: '100', style: 'normal' },
    { path: '../../public/fonts/Petrov Sans/PetrovSans-ThinItalic.ttf', weight: '100', style: 'italic' },
    { path: '../../public/fonts/Petrov Sans/PetrovSans-ExtraLight.ttf', weight: '200', style: 'normal' },
    { path: '../../public/fonts/Petrov Sans/PetrovSans-ExtraLightItalic.ttf', weight: '200', style: 'italic' },
    { path: '../../public/fonts/Petrov Sans/PetrovSans-Light.ttf', weight: '300', style: 'normal' },
    { path: '../../public/fonts/Petrov Sans/PetrovSans-LightItalic.ttf', weight: '300', style: 'italic' },
    { path: '../../public/fonts/Petrov Sans/PetrovSans-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../../public/fonts/Petrov Sans/PetrovSans-RegularItalic.ttf', weight: '400', style: 'italic' },
    { path: '../../public/fonts/Petrov Sans/PetrovSans-Book.ttf', weight: '500', style: 'normal' },
    { path: '../../public/fonts/Petrov Sans/PetrovSans-BookItalic.ttf', weight: '500', style: 'italic' },
    { path: '../../public/fonts/Petrov Sans/PetrovSans-SemiBold.ttf', weight: '600', style: 'normal' },
    { path: '../../public/fonts/Petrov Sans/PetrovSans-SemiBoldItalic.ttf', weight: '600', style: 'italic' },
    { path: '../../public/fonts/Petrov Sans/PetrovSans-Bold.ttf', weight: '700', style: 'normal' },
    { path: '../../public/fonts/Petrov Sans/PetrovSans-BoldItalic.ttf', weight: '700', style: 'italic' },
    { path: '../../public/fonts/Petrov Sans/PetrovSans-ExtraBold.ttf', weight: '800', style: 'normal' },
    { path: '../../public/fonts/Petrov Sans/PetrovSans-ExtraBoldItalic.ttf', weight: '800', style: 'italic' },
    { path: '../../public/fonts/Petrov Sans/PetrovSans-Black.ttf', weight: '900', style: 'normal' },
    { path: '../../public/fonts/Petrov Sans/PetrovSans-BlackItalic.ttf', weight: '900', style: 'italic' },
  ],
  variable: '--font-body',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
});

const cabinetGrotesk = localFont({
  src: [
    {
      path: '../../public/fonts/Cabinet/Cabinet Grotesk Variable.woff2',
      style: 'normal',
    },
  ],
  variable: '--font-cabinet',
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
      path: '../../public/fonts/PosteramaText/Posterama Text W01 Thin.woff',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../../public/fonts/PosteramaText/Posterama Text W07 Light.woff2',
      weight: '300',
      style: 'normal',
    },
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
    'Nngtw Studio',
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
      className={`${chillax.variable} ${petrovSans.variable} ${cabinetGrotesk.variable} ${posterama2001.variable} ${posteramaText.variable}`}
    >
      <body className="antialiased" suppressHydrationWarning>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}

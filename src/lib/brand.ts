/** @format */

const BUCKET = 'nngtw-assets';
const BRANDS_FOLDER = 'brands';

export function getStorageUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return '';
  return `${base}/storage/v1/object/public/${BUCKET}/${path}`;
}

function brandAsset(filename: string): string {
  return getStorageUrl(`${BRANDS_FOLDER}/${filename}`);
}

export const BRAND_ASSETS = {
  // ─── UI logos ────────────────────────────────────────────────────────────
  // Purpose-built for the website interface. Use these in all navigation and
  // layout contexts. Do NOT substitute marketing logos here.

  /** Desktop navbar, footer, admin header, dashboard. */
  webLogo: brandAsset('nngtw-studio-web-logo.svg'),

  /** Mobile navbar, mobile drawer, compact layouts. */
  compactLogo: brandAsset('nngtw-studio-compact-logo.svg'),

  /** Browser favicon only. Do NOT render inside the UI. Served locally from /public. */
  faviconIcon: '/nngtw-favcon.svg',

  // ─── Marketing logos ─────────────────────────────────────────────────────
  // Official brand assets for content, press, and marketing. Do NOT use
  // inside navigation or any UI chrome.

  /** Authentication pages, loading screen, company info, letterhead. */
  primaryLogo: brandAsset('nngtw-studio-primary-logo.svg'),

  /** About page, brand story, marketing sections, recruitment, press. */
  primaryLogoTagline: brandAsset('nngtw-studio-primary-logo-tagline.svg'),

  /** Wide marketing banners, hero sections, editorial layouts. */
  horizontalLogo: brandAsset('nngtw-studio-horizontal-logo.svg'),

  /** Watermark, social avatar, floating UI, compact marketing contexts. */
  brandMark: brandAsset('nngtw-brand-mark.svg'),

  /** Favicon fallback, Apple touch icon, PWA manifest, app icons. */
  appIcon: brandAsset('nngtw-app-icon.svg'),
} as const;

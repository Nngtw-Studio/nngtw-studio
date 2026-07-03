/** @format */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { NextConfig } from 'next';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Derived from env rather than hardcoded so this keeps working if the
// Supabase project ever changes.
const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  distDir: '.next',
  outputFileTracingRoot: __dirname,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: supabaseHostname
      ? [
          {
            protocol: 'https',
            hostname: supabaseHostname,
            pathname: '/storage/v1/object/public/**',
          },
        ]
      : [],
    // Banner/key-art thumbnails are sometimes SVG (see /public/banners) — the
    // optimizer refuses SVG sources unless explicitly allowed. We only ever
    // render these via <img> (never <iframe>/<object>), so embedded scripts
    // can't execute regardless of disposition — 'inline' is required for
    // next/image's <img src> to actually load them; Next defaults to
    // 'attachment' otherwise, which breaks rendering. The sandboxed CSP
    // still guards the direct-navigation case Next's docs warn about.
    dangerouslyAllowSVG: true,
    contentDispositionType: 'inline',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;

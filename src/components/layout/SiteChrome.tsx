'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AdaptiveCursor } from '@/components/effects/AdaptiveCursor';

/**
 * Public-site chrome (custom cursor, header, footer) wraps every marketing
 * route. The admin panel is a separate productivity surface — it supplies its
 * own layout and the native cursor, so we render its pages bare, without the
 * public header/footer bleeding in or a second <main> nesting inside the
 * dashboard layout's own <main>.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return <>{children}</>;
  }

  return (
    <>
      <AdaptiveCursor />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

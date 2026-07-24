// Portable stand-in for `next/link`, aliased in tsconfig.build.json so the
// bundle renders in Claude Design's plain-React runtime (no Next.js router).
// next/link degrades to a plain anchor outside a Next app anyway; this keeps
// the real Button/CtaButton source unchanged while dropping the router dep.
import * as React from 'react';

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  passHref?: boolean;
  legacyBehavior?: boolean;
};

export default function Link({
  href,
  prefetch: _prefetch,
  replace: _replace,
  scroll: _scroll,
  shallow: _shallow,
  passHref: _passHref,
  legacyBehavior: _legacyBehavior,
  children,
  ...rest
}: LinkProps) {
  return (
    <a href={typeof href === 'string' ? href : '#'} {...rest}>
      {children}
    </a>
  );
}

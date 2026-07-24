import type { ReactNode } from 'react';
import { CtaButton } from 'nngtw-studio';

function Stage({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        background: '#1d1010',
        padding: '48px',
        display: 'flex',
        gap: '28px',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      {children}
    </div>
  );
}

export const Primary = () => (
  <Stage>
    <CtaButton href="#" variant="primary">Get Started</CtaButton>
  </Stage>
);

export const Secondary = () => (
  <Stage>
    <CtaButton href="#" variant="secondary">Wishlist Now</CtaButton>
  </Stage>
);

export const Discord = () => (
  <Stage>
    <CtaButton href="#" variant="discord">Join the Community</CtaButton>
  </Stage>
);

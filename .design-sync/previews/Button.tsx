import type { ReactNode } from 'react';
import { Button } from 'nngtw-studio';

function Stage({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        background: '#1d1010',
        padding: '40px',
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      {children}
    </div>
  );
}

export const Variants = () => (
  <Stage>
    <Button href="#" variant="primary">Play the Demo</Button>
    <Button href="#" variant="secondary">Read the Story</Button>
    <Button href="#" variant="ghost">Skip Intro</Button>
    <Button href="#" variant="discord">Join Discord</Button>
  </Stage>
);

export const Sizes = () => (
  <Stage>
    <Button href="#" variant="primary" size="sm">Small</Button>
    <Button href="#" variant="primary" size="md">Medium</Button>
    <Button href="#" variant="primary" size="lg">Large</Button>
  </Stage>
);

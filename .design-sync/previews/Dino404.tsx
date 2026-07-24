import type { ReactNode } from 'react';
import { Dino404 } from 'nngtw-studio';

function Stage({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        background: '#1d1010',
        padding: '40px',
        display: 'flex',
        gap: '48px',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
    >
      {children}
    </div>
  );
}

export const EyesOpen = () => (
  <Stage>
    <Dino404 style={{ height: 260, width: 'auto' }} />
  </Stage>
);

export const Blinking = () => (
  <Stage>
    <Dino404 blinking style={{ height: 260, width: 'auto' }} />
  </Stage>
);

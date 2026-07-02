'use client';

interface RippleLayerProps {
  ripples: { x: number; y: number; size: number; key: number }[];
  color?: string;
  duration?: string;
}

export function RippleLayer({ ripples, color = '#df138a', duration = '600ms' }: RippleLayerProps) {
  return (
    <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
      {ripples.map((ripple) => (
        <span
          key={ripple.key}
          className="animate-rippling absolute rounded-full opacity-30"
          style={
            {
              width: `${ripple.size}px`,
              height: `${ripple.size}px`,
              top: `${ripple.y}px`,
              left: `${ripple.x}px`,
              backgroundColor: color,
              transform: 'scale(0)',
              '--duration': duration,
            } as React.CSSProperties
          }
        />
      ))}
    </span>
  );
}

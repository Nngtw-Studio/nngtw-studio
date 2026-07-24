// Design-sync bundle entry — re-exports ONLY the reusable-UI subset scoped for
// the Nngtw Studio Claude Design system. Not part of the app; consumed by the
// converter (cfg.entry) to define window.NngtwStudio's export surface.
export { Button } from '@/components/ui/Button';
export { CtaButton } from '@/components/ui/CtaButton';
export { Dino404 } from '@/components/ui/Dino404';
export { Glitch404 } from '@/components/ui/Glitch404';
export { RippleLayer } from '@/components/ui/RippleLayer';

export { AdaptiveCursor } from '@/components/effects/AdaptiveCursor';
export { AmbientField } from '@/components/effects/AmbientField';

export {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  MagneticButton,
  TextReveal,
  ParallaxSection,
} from '@/components/motion/FadeIn';
export { GsapReveal, GsapParallax } from '@/components/motion/GsapReveal';

export { SmoothCursor } from '@/registry/magicui/smooth-cursor';
export { default as TargetCursor } from '@/registry/reactbits/TargetCursor';

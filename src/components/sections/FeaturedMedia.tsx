/** @format */

'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  motion,
  MotionConfig,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';
import gsap from 'gsap';

/**
 * The media contract every showcased project fulfils. `heroVideo` and
 * `heroThumbnail` map 1:1 onto the existing `trailer_url` / `banner_image_url`
 * columns — nothing here changes when an admin uploads real assets later,
 * the fallback chain (video → thumbnail → placeholder) just resolves
 * differently.
 */
export interface MediaProject {
  id: string;
  title: string;
  heroVideo: string | null;
  heroThumbnail: string | null;
}

/**
 * The interactive shell around the media stack — ambient lighting, border,
 * shadow, glass sheen and a mouse-tracked tilt. Slides crossfade inside it
 * via <FeaturedMediaLayer>, so the shell itself never re-mounts between games.
 */
export function FeaturedMediaFrame({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const springX = useSpring(px, { stiffness: 150, damping: 20 });
  const springY = useSpring(py, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(springY, [0, 1], [4, -4]);
  const rotateY = useTransform(springX, [0, 1], [-5, 5]);
  const mediaShiftX = useTransform(springX, [0, 1], [6, -6]);
  const mediaShiftY = useTransform(springY, [0, 1], [4, -4]);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };

  const onMouseLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    /* reducedMotion="user" adapts the tilt/scale at the framer-motion runtime
       level, keeping SSR markup identical for every client. The mouse handler
       is additionally guarded with useReducedMotion — the tilt MotionValues
       simply never leave their rest position for reduced-motion users. */
    <MotionConfig reducedMotion="user">
      <div className="relative">
        {/* Ambient lighting rig — echoes the hero's glow so the card feels part of the same world */}
        <div className="pointer-events-none absolute -inset-8 md:-inset-12" aria-hidden="true">
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 65% 55% at 20% 15%, rgba(245,138,31,0.16), transparent 65%)',
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 55% 50% at 85% 90%, rgba(223,19,138,0.1), transparent 70%)',
            }}
          />
        </div>

        <motion.div
          ref={frameRef}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          style={{ rotateX, rotateY, transformPerspective: 1200 }}
          whileHover={{ scale: 1.012 }}
          transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          className="relative aspect-video w-full overflow-hidden rounded-2xl border border-brand-white/10 bg-brand-black shadow-[0_32px_72px_-30px_rgba(0,0,0,0.72)]"
        >
          {/* Parallax buffer — larger than the frame so the mouse-driven shift never reveals an edge */}
          <motion.div
            style={{ x: mediaShiftX, y: mediaShiftY }}
            className="absolute -inset-4"
          >
            {children}
          </motion.div>

          {/* Glass overlay — a thin light-catching sheen along the top edge */}
          <div className="glass-panel pointer-events-none absolute inset-x-0 top-0 h-16 rounded-t-[28px] mask-[linear-gradient(to_bottom,black,transparent)]" />
        </motion.div>
      </div>
    </MotionConfig>
  );
}

interface FeaturedMediaLayerProps {
  project: MediaProject;
  isActive: boolean;
  shouldLoad: boolean;
  priority?: boolean;
  onEnded?: () => void;
}

/**
 * One project's media: hero video first, hero thumbnail as fallback (or
 * poster/loading state), an elegant placeholder if neither exists. This is
 * the only piece that needs to know about the video/thumbnail/placeholder
 * priority — everything else in the frame is presentation.
 */
export function FeaturedMediaLayer({
  project,
  isActive,
  shouldLoad,
  priority,
  onEnded,
}: FeaturedMediaLayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [thumbnailFailed, setThumbnailFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const hasVideo = Boolean(project.heroVideo) && !videoFailed;
  const hasThumbnail = Boolean(project.heroThumbnail) && !thumbnailFailed;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hasVideo || !shouldLoad) return;
    if (isActive) {
      video.currentTime = 0;
      video.play().catch(() => setVideoFailed(true));
    } else {
      video.pause();
    }
  }, [isActive, hasVideo, shouldLoad]);

  /* Premium reveal — the slide that's becoming active eases in from a soft
     zoom rather than popping in at full scale. */
  useEffect(() => {
    const el = layerRef.current;
    if (!el || !isActive) return;
    gsap.fromTo(
      el,
      { scale: 1.08, opacity: 0.4 },
      { scale: 1, opacity: 1, duration: 1.1, ease: 'power2.out' },
    );
  }, [isActive, project.id]);

  return (
    <div ref={layerRef} className="absolute inset-0">
      {hasVideo && shouldLoad ? (
        <video
          ref={videoRef}
          src={project.heroVideo!}
          poster={project.heroThumbnail ?? undefined}
          muted
          playsInline
          preload={isActive ? 'auto' : 'none'}
          onLoadedData={() => setLoaded(true)}
          onError={() => setVideoFailed(true)}
          onEnded={onEnded}
          className="motion-safe:animate-ken-burns h-full w-full object-cover"
        />
      ) : hasThumbnail ? (
        <Image
          src={project.heroThumbnail!}
          alt=""
          fill
          priority={priority}
          onLoad={() => setLoaded(true)}
          onError={() => setThumbnailFailed(true)}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="motion-safe:animate-ken-burns object-cover"
        />
      ) : (
        <div className="relative flex h-full w-full items-center justify-center bg-linear-to-br from-brand-white/6 via-brand-black to-brand-bg">
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              background:
                'radial-gradient(ellipse 60% 50% at 30% 25%, rgba(245,138,31,0.12), transparent 70%)',
            }}
          />
          <span className="label-overline relative text-brand-white/25">{project.title}</span>
        </div>
      )}

      {/* Loading shimmer — sweeps while the asset resolves, then dissolves */}
      {(hasVideo || hasThumbnail) && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: loaded ? 0 : 1 }}
          transition={{ duration: 0.6 }}
          className="pointer-events-none absolute inset-0 overflow-hidden bg-brand-black"
        >
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="h-full w-1/2 bg-linear-to-r from-transparent via-brand-white/6 to-transparent"
          />
        </motion.div>
      )}

      {/* Cinematic depth overlay — keeps the card readable without going flat */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-brand-black/50 via-transparent to-transparent" />
    </div>
  );
}

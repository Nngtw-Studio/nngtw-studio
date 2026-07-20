'use client';

import { useEffect, useRef, useState } from 'react';
import { getStorageUrl } from '@/lib/brand';

const TRACK_URL = getStorageUrl('music/background.mp3');
const STORAGE_KEY = 'nngtw:music-on';

/**
 * Floating background-music toggle. Autoplay-with-sound is blocked by browsers,
 * so playback only ever starts from a user gesture (the toggle). We remember the
 * listener's choice and try to resume on their next visit — if the browser still
 * refuses without a gesture, we silently fall back to the paused state.
 */
export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);

  // Only mount the control once we know the track URL is resolvable.
  useEffect(() => {
    setReady(Boolean(TRACK_URL));
  }, []);

  // Attempt to resume if the listener had it on last time.
  useEffect(() => {
    if (!ready) return;
    if (typeof window === 'undefined') return;
    if (window.localStorage.getItem(STORAGE_KEY) !== '1') return;

    const audio = audioRef.current;
    if (!audio) return;
    audio.play().then(
      () => setPlaying(true),
      () => setPlaying(false) // gesture required — wait for the toggle
    );
  }, [ready]);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
      window.localStorage.setItem(STORAGE_KEY, '0');
    } else {
      audio.play().then(
        () => {
          setPlaying(true);
          window.localStorage.setItem(STORAGE_KEY, '1');
        },
        () => setPlaying(false)
      );
    }
  }

  if (!ready) return null;

  return (
    <>
      <audio ref={audioRef} src={TRACK_URL} loop preload="none" />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? 'Mute background music' : 'Play background music'}
        aria-pressed={playing}
        className="fixed bottom-5 right-5 z-[90] flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[#0C0C0C]/80 text-[#F2EFE7] backdrop-blur-md transition-colors hover:border-[#F58A1F] hover:text-[#F58A1F]"
      >
        {playing ? (
          // Sound-on: bars
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M11 5 6 9H3v6h3l5 4V5Z" fill="currentColor" />
            <path
              d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8 8 0 0 1 0 12"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          // Muted
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M11 5 6 9H3v6h3l5 4V5Z" fill="currentColor" />
            <path
              d="m16 9 5 6M21 9l-5 6"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>
    </>
  );
}

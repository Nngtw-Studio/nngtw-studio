"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Dino404 } from "@/components/ui/Dino404";
import styles from "@/components/ui/Glitch404.module.css";

export default function NotFound() {
  const [isGlitching, setIsGlitching] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);

  // Mascot eye-blink loop. Normal blinks land every 9 or 14 seconds (picked at
  // random). After a random run of 5–10 normal blinks, a rare quick blink fires
  // just 3 seconds later, then the cycle restarts. Each blink is randomly a
  // single blink or a double blink (two blinks 0.8s apart).
  useEffect(() => {
    let isActive = true;
    const timers: NodeJS.Timeout[] = [];
    const wait = (ms: number, fn: () => void) => {
      const id = setTimeout(() => {
        if (isActive) fn();
      }, ms);
      timers.push(id);
    };

    const CLOSED_MS = 140; // how long the eye stays shut per blink
    const DOUBLE_GAP_MS = 800; // gap between the two blinks of a double
    const randInt = (min: number, max: number) =>
      Math.floor(Math.random() * (max - min + 1)) + min;

    let normalBlinksLeft = randInt(5, 10);

    const runBlink = (onDone: () => void) => {
      const isDouble = Math.random() < 0.35;
      setIsBlinking(true);
      wait(CLOSED_MS, () => {
        setIsBlinking(false);
        if (!isDouble) {
          onDone();
          return;
        }
        wait(DOUBLE_GAP_MS, () => {
          setIsBlinking(true);
          wait(CLOSED_MS, () => {
            setIsBlinking(false);
            onDone();
          });
        });
      });
    };

    const scheduleNext = () => {
      let delaySec: number;
      if (normalBlinksLeft > 0) {
        delaySec = Math.random() < 0.5 ? 9 : 14;
        normalBlinksLeft--;
      } else {
        delaySec = 3;
        normalBlinksLeft = randInt(5, 10);
      }
      wait(delaySec * 1000, () => runBlink(scheduleNext));
    };

    scheduleNext();

    return () => {
      isActive = false;
      timers.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let isActive = true;
    let shortGlitchCount = 0;

    const scheduleNext = () => {
      if (!isActive) return;
      const isShortDelay = Math.random() < 0.5;
      const delayMs = isShortDelay 
        ? Math.random() * 2000 + 1000 // 1 to 3 seconds
        : Math.random() * 5000 + 10000; // 10 to 15 seconds

      timeoutId = setTimeout(() => {
        if (!isActive) return;
        setIsGlitching(true);
        
        let playDurationMs;
        const targetForLong = Math.floor(Math.random() * 6) + 5; // random between 5 and 10

        if (shortGlitchCount >= targetForLong) {
          playDurationMs = 2000; // 2 seconds for a rare long glitch
          shortGlitchCount = 0;
        } else {
          playDurationMs = Math.random() * 600 + 100; // 0.1 to 0.7 seconds
          shortGlitchCount++;
        }

        timeoutId = setTimeout(() => {
          if (!isActive) return;
          setIsGlitching(false);
          scheduleNext();
        }, playDurationMs);
      }, delayMs);
    };

    scheduleNext();

    return () => {
      isActive = false;
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <section data-hero className="flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-brand-bg relative">
      <div className="flex flex-col items-center justify-center w-full px-6 z-10">
        <p 
          className={`relative text-center font-accent font-bold text-brand-white/80 text-[120px] sm:text-[180px] md:text-[260px] lg:text-[320px] xl:text-[380px] leading-none ${isGlitching ? styles.error : ''}`}
        >
          404
        </p>
      </div>

      <div className="relative w-full my-4 md:my-6 z-10 h-2">
        {/* Ground: a soft oval drawn at 150% width but clipped to the viewport,
            so only its flat middle shows and it tapers off past the edges. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center overflow-hidden">
          <div className="h-3 w-[125%] shrink-0 rounded-[50%] bg-[#D6D5D5] sm:h-4 md:h-5 lg:h-6" />
        </div>
        <Dino404
          blinking={isBlinking}
          className="pointer-events-none absolute bottom-0 left-1/2 h-40 w-auto -translate-x-1/2 select-none sm:h-56 md:h-72 lg:h-80 xl:h-88"
        />
      </div>

      <div className="flex flex-col items-center justify-center w-full px-6 z-10">
        <h2 className={`font-secondary font-bold text-brand-white text-[24px] md:text-[28px] lg:text-[32px] ${isGlitching ? styles.info : ''}`}>
          Page Not Found
        </h2>
        
        <p className="mt-6 max-w-md text-center body-description">
          Looks like this page wandered off.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 md:flex-row md:gap-0 md:-space-x-2">
          <Button href="/" variant="primary">
            Return Home
          </Button>
          <Button href="/games" variant="secondary">
            Explore Our Games
          </Button>
        </div>
      </div>
    </section>
  );
}

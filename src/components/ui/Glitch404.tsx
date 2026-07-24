"use client";

import { useEffect, useState } from "react";
import styles from "./Glitch404.module.css";

export function Glitch404({ className = "" }: { className?: string }) {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let isActive = true;

    const scheduleNext = () => {
      if (!isActive) return;
      const isShortDelay = Math.random() < 0.5;
      const delayMs = isShortDelay 
        ? Math.random() * 2000 + 1000 // 1 to 3 seconds
        : Math.random() * 5000 + 10000; // 10 to 15 seconds

      timeoutId = setTimeout(() => {
        if (!isActive) return;
        setIsGlitching(true);
        const playDurationMs = Math.random() * 4000 + 1000; // 1 to 5 seconds
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
    <div className={`${styles.glitchWrapper} flex items-center justify-center`}>
      <p className={`${className} ${isGlitching ? styles.error : ''}`}>
        404
      </p>
    </div>
  );
}

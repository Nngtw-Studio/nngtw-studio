/** @format */

"use client";

import { useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRipple } from "@/hooks/useRipple";
import { RippleLayer } from "@/components/ui/RippleLayer";

type HeroButtonVariant = "primary" | "secondary";

interface HeroButtonProps {
  href: string;
  variant?: HeroButtonVariant;
  children: React.ReactNode;
  className?: string;
  /* Play the circle-in-hesitate clip reveal when this flips true — the hero
     turns it on as its entrance lands so each CTA opens from a tiny centered
     aperture, hesitates, then bursts to full. */
  reveal?: boolean;
  /* Seconds to stagger this button's reveal behind the entrance. */
  revealDelay?: number;
  /* Origin of the reveal circle as a `clip-path` position (e.g. "16% 50%").
     Defaults to the button center. */
  revealOrigin?: string;
}

const variants: Record<HeroButtonVariant, string> = {
  primary: "border-0 bg-brand-orange-dark text-brand-white",
  secondary:
    "bg-transparent text-brand-secondary border-brand-secondary border-[1px] shadow-[0_0_6px_rgba(223,19,138,0.1)] hover:shadow-[0_0_10px_rgba(223,19,138,0.25)] focus-visible:ring-brand-secondary/50",
};

/* Both CTAs: 280x56 idle -> 320x64 hover, corners flatten to 0, btn-189-style elastic zoom. */
const sizing: Record<HeroButtonVariant, string> = {
  primary:
    "w-[280px] h-[56px] rounded-[16px] hover:w-[320px] hover:h-[64px] hover:rounded-none font-secondary text-[18px] font-semibold",
  secondary:
    "w-[280px] h-[56px] rounded-[16px] hover:w-[320px] hover:h-[64px] hover:rounded-none font-secondary text-[18px] font-semibold",
};

export function HeroButton({
  href,
  variant = "primary",
  children,
  className,
  reveal = false,
  revealDelay = 0,
  revealOrigin = "50% 50%",
}: HeroButtonProps) {
  const { ripples, addRipple } = useRipple();
  const labelRef = useRef<HTMLSpanElement>(null);

  /* Hover-exit plays a scripted flight (off right, back in from bottom-left),
     which CSS :hover alone can't express — so it's a state-toggled animation. */
  const [exiting, setExiting] = useState(false);

  /* The label's slide/tracking are driven by state-controlled transitions, not
     a hover animation: removing an animation snaps instantly (no transition
     fires), which caused a visible jump on hover-out. */
  const [hovered, setHovered] = useState(false);

  /* The label slides left by its 28px leading space (icon 20 + gap 8) while the
     icon flies to sit just after the shifted word: labelWidth + trailing gap. */
  const [flyDistance, setFlyDistance] = useState(200);
  useLayoutEffect(() => {
    const label = labelRef.current;
    if (!label) return;
    const measure = () => setFlyDistance(Math.round(label.offsetWidth + 12));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(label);
    return () => observer.disconnect();
  }, []);

  /* Staged content entrance. Primary: background reveals (2s), then icon
     (then word). Secondary: pink fill + stroke reveal WITH hesitate, hold,
     then the fill retracts WITHOUT hesitate leaving the stroke (3.1s total),
     then — after a 0.1s beat — the word, then the arrow springs in. */
  const fillDelay = revealDelay;
  const iconDelay = revealDelay + 1.85;
  const labelDelay =
    variant === "primary" ? revealDelay + 2.3 : revealDelay + 3.2;
  const arrowDelay = revealDelay + 3.65;
  const entranceStyle = (delay: number): React.CSSProperties | undefined =>
    reveal ? { animationDelay: `${delay}s` } : undefined;

  return (
    /* Slot reserves the hover footprint so the button's growth never nudges
       neighbouring hero content. */
    <span
      className={cn(
        "inline-flex items-center justify-center",
        "h-16 w-80",
      )}
    >
      <Link
        href={href}
        onClick={(event: MouseEvent<HTMLAnchorElement>) => addRipple(event)}
        onMouseEnter={() => {
          setExiting(false);
          setHovered(true);
        }}
        onMouseLeave={() => {
          setHovered(false);
          if (variant === "primary") setExiting(true);
        }}
        style={
          {
            transition: "all 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)",
            animationDelay: reveal ? `${revealDelay}s` : undefined,
            "--cta-origin": revealOrigin,
          } as React.CSSProperties
        }
        className={cn(
          "group cursor-target relative isolate inline-flex items-center justify-center gap-2 overflow-hidden",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black",
          sizing[variant],
          variants[variant],
          reveal && "animate-cta-reveal",
          className,
        )}
      >
        {/* Secondary pink fill — reveals in step with the stroke (with
            hesitate), then retracts (no hesitate), leaving just the stroke.
            Inherits --cta-origin from the Link. Sits below the z-10 content. */}
        {variant === "secondary" && reveal && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-brand-secondary animate-cta-fill"
            style={{ animationDelay: `${fillDelay}s` } as React.CSSProperties}
          />
        )}

        {variant === "primary" && (
          /* Entrance wrapper — plays the fly-in once, then rests; the inner
             span keeps the hover slide / exit flight untouched. */
          <span
            className={cn("relative z-10 inline-flex", reveal && "animate-cta-icon")}
            style={entranceStyle(iconDelay)}
          >
          <span
            aria-hidden="true"
            style={
              { "--icon-fly-distance": `${flyDistance}px` } as React.CSSProperties
            }
            onAnimationEnd={(event) => {
              if (event.animationName === "icon-exit") setExiting(false);
            }}
            className={cn(
              "inline-flex",
              exiting
                ? "animate-icon-exit"
                : "transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:animate-icon-slide",
            )}
          >
            <svg
              height="20"
              width="20"
              viewBox="0 0 24 24"
              aria-hidden="true"
              style={{ transform: "rotate(30deg)" }}
              className={cn(
                exiting
                  ? "animate-icon-exit-spin"
                  : "transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:animate-icon-spin",
              )}
            >
              {/* Remix rocket, fill style: solid silhouette with a punched-out window */}
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5 13c0-5.088 2.903-9.436 7-11.182C16.097 3.564 19 7.912 19 13c0 .823-.076 1.626-.22 2.403l1.94 1.832a.5.5 0 0 1 .095.603l-2.495 4.575a.5.5 0 0 1-.793.114l-2.234-2.234a1 1 0 0 0-.707-.293H9.414a1 1 0 0 0-.707.293l-2.234 2.234a.5.5 0 0 1-.793-.114l-2.495-4.575a.5.5 0 0 1 .095-.603l1.94-1.832C5.077 14.626 5 13.823 5 13zm7 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
                fill="currentColor"
              />
            </svg>
          </span>
          </span>
        )}
        <span
          className={cn("relative z-10 inline-flex", reveal && "animate-cta-text")}
          style={entranceStyle(labelDelay)}
        >
        <span
          ref={labelRef}
          style={
            variant === "primary"
              ? {
                  /* In: transform waits for the 0.5s spin then glides 1s with the
                     rocket; tracking widens across the whole 1.5s flight.
                     Out: everything returns on the button's own 300ms elastic
                     curve, settling in step with the scale-down. */
                  transform: hovered ? "translateX(-28px)" : "translateX(0)",
                  letterSpacing: hovered ? "0.1em" : "0.01em",
                  transition: hovered
                    ? "transform 1000ms cubic-bezier(0.65, 0, 0.35, 1) 500ms, letter-spacing 1500ms cubic-bezier(0.65, 0, 0.35, 1)"
                    : "transform 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55), letter-spacing 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)",
                }
              : {
                  transition:
                    "letter-spacing 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)",
                }
          }
          className={cn(
            "leading-none whitespace-nowrap",
            variant === "secondary" && "group-hover:tracking-widest",
          )}
        >
          {children}
        </span>
        </span>

        {variant === "secondary" && (
          /* Entrance wrapper — springs the arrow in after the word; inner span
             keeps the hover jello. */
          <span
            className={cn("relative z-10 inline-flex", reveal && "animate-cta-arrow")}
            style={entranceStyle(arrowDelay)}
          >
          <span
            aria-hidden="true"
            className="inline-flex origin-left pt-0.75 transition-transform group-hover:animate-jello-vertical"
          >
            {/* Exact Uiverse (vinodjangid07) squiggle-to-arrow icon. */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="45"
              height="18"
              viewBox="0 0 38 15"
              fill="none"
            >
              <path
                fill="currentColor"
                d="M10 7.519l-.939-.344h0l.939.344zm14.386-1.205l-.981-.192.981.192zm1.276 5.509l.537.843.148-.094.107-.139-.792-.611zm4.819-4.304l-.385-.923h0l.385.923zm7.227.707a1 1 0 0 0 0-1.414L31.343.448a1 1 0 0 0-1.414 0 1 1 0 0 0 0 1.414l5.657 5.657-5.657 5.657a1 1 0 0 0 1.414 1.414l6.364-6.364zM1 7.519l.554.833.029-.019.094-.061.361-.23 1.277-.77c1.054-.609 2.397-1.32 3.629-1.787.617-.234 1.17-.392 1.623-.455.477-.066.707-.008.788.034.025.013.031.021.039.034a.56.56 0 0 1 .058.235c.029.327-.047.906-.39 1.842l1.878.689c.383-1.044.571-1.949.505-2.705-.072-.815-.45-1.493-1.16-1.865-.627-.329-1.358-.332-1.993-.244-.659.092-1.367.305-2.056.566-1.381.523-2.833 1.297-3.921 1.925l-1.341.808-.385.245-.104.068-.028.018c-.011.007-.011.007.543.84zm8.061-.344c-.198.54-.328 1.038-.36 1.484-.032.441.024.94.325 1.364.319.45.786.64 1.21.697.403.054.824-.001 1.21-.09.775-.179 1.694-.566 2.633-1.014l3.023-1.554c2.115-1.122 4.107-2.168 5.476-2.524.329-.086.573-.117.742-.115s.195.038.161.014c-.15-.105.085-.139-.076.685l1.963.384c.192-.98.152-2.083-.74-2.707-.405-.283-.868-.37-1.28-.376s-.849.069-1.274.179c-1.65.43-3.888 1.621-5.909 2.693l-2.948 1.517c-.92.439-1.673.743-2.221.87-.276.064-.429.065-.492.057-.043-.006.066.003.155.127.07.099.024.131.038-.063.014-.187.078-.49.243-.94l-1.878-.689zm14.343-1.053c-.361 1.844-.474 3.185-.413 4.161.059.95.294 1.72.811 2.215.567.544 1.242.546 1.664.459a2.34 2.34 0 0 0 .502-.167l.15-.076.049-.028.018-.011c.013-.008.013-.008-.524-.852l-.536-.844.019-.012c-.038.018-.064.027-.084.032-.037.008.053-.013.125.056.021.02-.151-.135-.198-.895-.046-.734.034-1.887.38-3.652l-1.963-.384zm2.257 5.701l.791.611.024-.031.08-.101.311-.377 1.093-1.213c.922-.954 2.005-1.894 2.904-2.27l-.771-1.846c-1.31.547-2.637 1.758-3.572 2.725l-1.184 1.314-.341.414-.093.117-.025.032c-.01.013-.01.013.781.624zm5.204-3.381c.989-.413 1.791-.42 2.697-.307.871.108 2.083.385 3.437.385v-2c-1.197 0-2.041-.226-3.19-.369-1.114-.139-2.297-.146-3.715.447l.771 1.846z"
              />
            </svg>
          </span>
          </span>
        )}

        <RippleLayer ripples={ripples} />
      </Link>
    </span>
  );
}

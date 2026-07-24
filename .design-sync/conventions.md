# Nngtw Studio UI — conventions

The reusable UI layer of the Nngtw Studio game-studio website. **These components are built for a dark brand surface.** Every color, glow, and font is tuned for `#1d1010` (`bg-brand-bg`) — place components on a dark section or they will look washed out. There is **no provider to wrap**; components work standalone. React 18/19.

## Dark surface + brand fonts (do this first)

Wrap any composition in a dark, branded shell so the tokens read correctly:

```tsx
import { Button } from '<pkg>'; // window.NngtwStudio.*

<section className="bg-brand-bg text-brand-white font-body px-6 py-20">
  <h2 className="font-display text-5xl">Enter the Arena</h2>
  <div className="mt-8 flex gap-4">
    <Button href="/play" variant="primary">Play the Demo</Button>
    <Button href="/story" variant="secondary">Read the Story</Button>
  </div>
</section>
```

`Button` and `CtaButton` are **link** components — `href` is required.

## Styling idiom: Tailwind v4 utilities + brand tokens

Style with utility classes (the app is Tailwind v4). Use the **brand tokens**, not raw colors:

| Family | Class names | Value |
|---|---|---|
| Orange (primary) | `bg-brand-orange` `text-brand-orange` `border-brand-orange` | `#f58a1f` |
| Orange-dark (on light) | `bg-brand-orange-dark` | `#d46b08` |
| Pink (secondary) | `bg-brand-secondary` `text-brand-secondary` `border-brand-secondary` | `#df138a` |
| Cream (text/ink) | `text-brand-white` `bg-brand-white` | `#f2efe7` |
| Background / ink-black | `bg-brand-bg` `bg-brand-black` | `#1d1010` |
| Grey | `text-brand-grey` | `#8b8b8b` |

Fonts are utilities (brand faces ship with the bundle): `font-display` (Chillax — headings), `font-body` (Cabinet Grotesk — body), `font-secondary` (Posterama Text — buttons/labels), `font-accent` (Posterama 2001 — overlines). Opacity modifiers are idiomatic here — e.g. `border-brand-orange/40`, `text-brand-white/60`. Editorial helpers: `editorial-heading`, `label-overline`, `accent-line`, `glass-panel`, `section-padding`, `text-balance`.

## Component families

- **Actions** — `Button` (`variant`: primary | secondary | ghost | discord; `size`: sm | md | lg), `CtaButton` (larger hero CTA; `variant`: primary | secondary | discord), `MagneticButton` (wrapper that pulls its child toward the cursor). `RippleLayer` is the click-ripple overlay the buttons use internally.
- **Scroll motion** — `FadeIn`, `StaggerContainer` + `StaggerItem`, `TextReveal`, `ParallaxSection` (framer-motion), `GsapReveal`, `GsapParallax` (GSAP ScrollTrigger). These reveal their children **as they scroll into view** — they render nothing until in view, so they only animate in a real scrolling page (that is why their preview cards are floor cards, not a defect).
- **Cursor system** — `AdaptiveCursor` mounts **once near the app root** and hides the OS cursor: it shows `SmoothCursor` (a following arrow) while idle and swaps to `TargetCursor` (spinning corner-brackets) near interactive elements. Mark any element the bracket cursor should lock onto with the **`cursor-target`** class. `SmoothCursor` / `TargetCursor` can also be used directly. All three are `position: fixed`, full-viewport — one instance per app, never inside a card.
- **Ambient** — `AmbientField` renders a full-size `<canvas>` starfield; give it a **positioned parent** (`relative`, sized) as the background of a dark hero.
- **Brand / 404** — `Dino404` (the studio mascot SVG; `blinking` toggles the eye), `Glitch404` (glitching "404" numerals).

## Where the truth lives

Read `_ds/<folder>/styles.css` (and its `@import` closure — `_ds_bundle.css` carries the compiled brand tokens, utilities, and `@font-face`) before styling. Each component's `.d.ts` is its prop contract and its `.prompt.md` its usage notes.

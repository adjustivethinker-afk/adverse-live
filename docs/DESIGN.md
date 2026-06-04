# Design system

**AdVerse Live** is built on a single, consistent design language inspired by iOS 27, Apple HIG, and a Flutter premium-app feel.

## Philosophy

- **Liquid glass** — soft surfaces with blur + saturation, never flat.
- **Aurora** — colored bloom behind every hero surface.
- **Motion has meaning** — animations confirm actions and transitions, never decorate.
- **Typography is hierarchy** — display vs sans, Apple-precision letter-spacing.
- **120 FPS** — springs, not linear curves; physics-based interactions.

## Tokens

### Colors

| Token | Hex / rgba |
|--|--|
| Midnight (background) | `#09090F` |
| Ink (panel) | `#12131A` |
| Graphite (raised) | `#1B1C26` |
| Glass | `rgba(255,255,255,0.08)` |
| Glass strong | `rgba(255,255,255,0.12)` |
| Glass soft | `rgba(255,255,255,0.04)` |
| Cyan accent | `#00E5FF` |
| Indigo accent | `#4F46E5` |
| Violet accent | `#8B5CF6` |
| Premium glow | `#7C3AED` |
| Success | `#00D26A` |
| Warning | `#FFC700` |
| Danger | `#FF4D6D` |

### Aurora gradient

```
linear-gradient(135deg, #00E5FF 0%, #4F46E5 45%, #8B5CF6 100%)
```

### Typography

- **Display** — SF Pro Display fallback to Inter / Manrope
- **Sans** — Inter fallback to Manrope / system-ui
- **Mono** — ui-monospace, SF Mono, Menlo, Consolas
- Weights: 300 / 400 / 500 / 600 / 700 / 800
- Letter-spacing: `-0.011em` body, tighter for display

### Radii

`6 / 10 / 14 / 20 / 28 / 36 / 48`

### Shadows

- `glass` — soft inner highlight + lift
- `glow` — premium violet + cyan halo
- `neon` — cyan + violet halo for CTAs
- `floating` — strong drop for hero panels

## Components

| Component | Purpose |
|--|--|
| `GlassCard` | Surface with `default · strong · soft · neon` variants and optional liquid border |
| `Button` | `neon · glass · ghost · outline · danger · success` × `sm · md · lg · xl · icon` |
| `Input` | Focus ring (violet 18% halo), icon + trailing slot, hint/error |
| `Badge` | `default · neon · success · warning · danger · vip · host · mod` |
| `Avatar` | DiceBear glass fallback, `neon · violet · live` rings |
| `StatCounter` | Framer-motion animated counter, scroll-triggered |
| `StatCard` | Stat with icon, gradient orb, % delta |
| `AuroraBackground` | App-wide animated background |
| `FloatingOrbs` | Hero blob layer |
| `Particles` | Rising dots |

## Motion

| Token | Curve |
|--|--|
| Spring | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Liquid | `cubic-bezier(0.65, 0, 0.35, 1)` |

Animations defined globally:
- `aurora` — 18s ease-in-out infinite drift
- `float` — 6s gentle vertical bob
- `shimmer` — gradient sweep for placeholders
- `sheen` — diagonal highlight on neon CTAs
- `pulseGlow` — radial halo pulse
- `marquee` — testimonial conveyor
- `ping2` — softer ping for live dots

## Patterns

### Glass surface

```css
background: linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.04));
border: 1px solid rgba(255,255,255,0.08);
backdrop-filter: blur(24px) saturate(180%);
```

### Liquid border (animated)

A 1px gradient ring that follows the parent's border-radius via `mask-composite: exclude`.

### Aurora hero pattern

```jsx
<div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-violet-500/30 blur-3xl" />
<div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-cyan-400/25 blur-3xl" />
```

## Accessibility

- Color contrast meets WCAG AA on all primary text.
- `prefers-reduced-motion` disables animations.
- All buttons keyboard-navigable, focus rings preserved.
- Avatars use ARIA-friendly fallback initials.

## Responsiveness

- Mobile-first grids, single column → 2 → 3 → 4.
- Sidebar collapses below `lg` (1024px) to a topbar with a hamburger.
- All hero cards keep their balance through every breakpoint.
- Tested down to 360px width.

## Brand voice

- **Headlines** — bold, confident, emotional. ("Earn. Speak. Belong.")
- **Body** — clear, concise, never marketing-fluff.
- **Microcopy** — friendly and direct. ("+ ₨ 30 added · Your wallet is updated.")

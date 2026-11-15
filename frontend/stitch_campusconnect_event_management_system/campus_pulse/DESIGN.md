---
name: Campus Pulse
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#464555'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#005338'
  on-tertiary: '#ffffff'
  tertiary-container: '#006e4b'
  on-tertiary-container: '#67f4b7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 3rem
    fontWeight: '800'
    lineHeight: '1.15'
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 2.25rem
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.025em
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 2.25rem
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.025em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.75rem
    fontWeight: '700'
    lineHeight: '1.25'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.5rem
    fontWeight: '700'
    lineHeight: '1.3'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: '1.35'
    letterSpacing: -0.015em
  body-lg:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 0.9375rem
    fontWeight: '400'
    lineHeight: '1.55'
    letterSpacing: -0.005em
  body-sm:
    fontFamily: Inter
    fontSize: 0.8125rem
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.875rem
    fontWeight: '600'
    lineHeight: '1.25'
    letterSpacing: -0.005em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.6875rem
    fontWeight: '700'
    lineHeight: '1.15'
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style
The design system establishes an authoritative yet energetic interface tailored for student organizers, university administrators, and campus communities. It bridges modern enterprise-grade operational rigor with the vibrant, social cadence of collegiate life. 

The aesthetic is anchored in **Modern Structural Precision with Subtle Layered Glassmorphism**:
- Crisp, clinical content canvases contrasted against deep midnight navigation chrome.
- Dynamic data density: structured event telemetry, attendance thresholds, and real-time operational feeds presented with air and legibility.
- Polished tactile cues: subtle backdrops, delicate hairline boundaries, fluid hover micro-interactions, and glowing status pills.
- The interface evokes frictionless control, youthful momentum, and academic distinction.

## Colors
The palette balances nocturnal anchor chrome with brilliant, luminous functional accents.

- **Primary (`#4F46E5` / Electric Indigo):** Drives primary calls-to-action, key interactive nodes, brand focal moments, and high-priority selections. Paired with `#6366F1` and `#818CF8` for state transitions, focus rings, and soft aura states.
- **Secondary (`#0F172A` / Slate Midnight):** Surfaces structural chrome, persistent navigation headers, side rails, and high-impact structural containers. Deepened by `#1E1B4B` (Deep Indigo Night) for secondary navigation layers and contextual elevated chrome panels.
- **Tertiary (`#10B981` / Emerald Live):** Denotes active ticketing windows, RSVP availability, operational success states, and live event telemetry.
- **Alert & Capacity Semantics:**
  - *Amber (`#F59E0B`):* Nearing capacity thresholds, waitlist activation, and pending authorization.
  - *Rose (`#F43F5E`):* Sold out, expired passes, cancelled events, and destructive actions.
- **Neutral & Canvas Architecture:**
  - Base canvas: `#F8FAFC` (Slate 50).
  - Elevated cards & modals: `#FFFFFF` (Pure White).
  - Structural divider/borders: `#E2E8F0` (Slate 200) on light canvases; `rgba(255, 255, 255, 0.08)` on dark chrome.
  - Typography: `#0F172A` (900 weight text), `#334155` (700/600 text), `#64748B` (Secondary/Meta body).

## Typography
The system employs a dual-typeface strategy to resolve typographic hierarchy between marketing discovery, dashboard management, and dense tabular schedules:

- **Display & Labels (`Plus Jakarta Sans`):** Provides a contemporary, energetic, geometric voice. Used for prominent numerals, dynamic metrics, component headers, badge pills, and buttons.
- **Body & Data (`Inter`):** Delivers clean readability for operational text, event descriptions, registration metadata, and form inputs.
- All uppercase labels (`label-sm`) require tracking expanded to `0.04em` to preserve clarity against dark backgrounds and vivid status badges.

## Layout & Spacing
The layout adheres to a flexible 12-column responsive fluid grid designed around a persistent dark shell and responsive canvas tiers.

- **Desktop (1280px+):** Fixed 260px navigation drawer or slim 72px icon rail with a fluid main canvas, utilizing 12 columns, 24px gutters, and 32px outer canvas margins. Maximum readable container capped at 1440px for wide displays.
- **Tablet (768px - 1279px):** 8-column layout with 20px gutters and 24px canvas margins. Side navigation collapses to an off-canvas drawer or horizontal top app bar.
- **Mobile (< 768px):** 4-column layout with 16px gutters and 16px outer edge margins. Interactive navigation pivots to a pinned bottom bar or compact header.
- **Vertical Rhythm:** Sections step through explicit 8px multiple scales: `0.5rem` (tight pairings), `1rem` (standard inner component buffers), `1.5rem` (card separations), and `2.5rem` (dashboard section breaks).

## Elevation & Depth
Depth is constructed through high-contrast boundary separation, backdrop diffusion, and soft ambient light shafts rather than heavy dropshadows.

- **Surface Levels:**
  - *Canvas Base:* Flat `#F8FAFC` without shadow.
  - *Card & Table Tiles (Level 1):* `#FFFFFF` bounded by a 1px hairline border in `#E2E8F0` with an ambient shadow: `0 4px 20px -2px rgba(15, 23, 42, 0.04), 0 2px 6px -1px rgba(15, 23, 42, 0.02)`.
  - *Dropdowns, Popovers & Hover Cards (Level 2):* `#FFFFFF` with `0 12px 32px -4px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.03)` and a 1px border of `#CBD5E1`.
  - *Floating Control Pills & Modals (Level 3):* Blurs backdrop using `backdrop-filter: blur(12px)`. On light surfaces: `rgba(255, 255, 255, 0.85)` with `0 20px 40px -8px rgba(15, 23, 42, 0.12)`. On dark chrome: `rgba(30, 27, 75, 0.75)` with a 1px inner light rim of `rgba(255, 255, 255, 0.12)`.
- **Active Ambient Glows:** High-priority elements and active live badges project a faint 8px blurred aura tinted with their functional color at 25% opacity (e.g., `#10B981` for active event telemetry).

## Shapes
The design system pairs expansive, comfortable corners on outer containers with ultra-smooth pill structures for interactive tags and switches.

- **Cards, Panels & Modal Containers:** Utilize `rounded-2xl` (1rem / 16px to 1.5rem / 24px on master containers) to create a relaxed, polished, app-like finish.
- **Controls & Form Elements:** Buttons, inputs, and tab containers use 0.5rem (8px) for crisp operational definition.
- **Badges, Filters & Demo Modifiers:** Fully round pill architecture (`9999px`) across status pills, category tags, avatar clusters, and the Switch User control.

## Components

### Buttons & Interactive Controls
- **Primary Button:** `#4F46E5` fill with `#FFFFFF` text. Hover transitions to `#4338CA` with a subtle elevation shift and a 2px focus ring of `#818CF8`. Rounded to `0.5rem`.
- **Secondary Button:** White surface with 1px hairline `#CBD5E1`, text `#0F172A`. Hover shifts background to `#F1F5F9`.
- **Dark Chrome Action:** On `#0F172A` navbars, actions use translucent white backgrounds (`rgba(255, 255, 255, 0.08)`) with `rgba(255, 255, 255, 0.9)` text, brightening on hover.

### Status Pills & Badges
- Compact pill geometry (`rounded-full`, padding `0.25rem 0.75rem`, `label-sm` uppercase).
- **Active / Open:** Surface `rgba(16, 185, 129, 0.12)`, text `#047857`, 1px border `rgba(16, 185, 129, 0.25)`. Features a pulsing 6px `#10B981` dot.
- **Near Capacity / Waitlist:** Surface `rgba(245, 158, 11, 0.12)`, text `#B45309`, 1px border `rgba(245, 158, 11, 0.25)`.
- **Sold Out / Closed:** Surface `rgba(244, 63, 94, 0.12)`, text `#BE123C`, 1px border `rgba(244, 63, 94, 0.25)`.

### Event Capacity Progress Bars
- Dual-layer track: 6px height, rounded full. Background `#E2E8F0`.
- Indicator fill dynamically tints according to capacity ratio:
  - `< 70%`: `#4F46E5` (Electric Indigo)
  - `70% - 94%`: `#F59E0B` (Amber)
  - `>= 95%`: `#F43F5E` (Rose)
- Paired with right-aligned numeric indicators (`body-sm`, bold percentage).

### Cards & Event Tiles
- Built with `rounded-2xl` (16px), `#FFFFFF` surface, and 1px `#E2E8F0` border.
- Features high-contrast header imagery with an inner gradient scrim for overlay status badges.
- Footer displays an attendee avatar cluster, live capacity progress meter, and registration action button.

### Form Inputs & Select Fields
- Height 42px, `rounded-md` (0.5rem), border 1px `#CBD5E1`, surface `#FFFFFF`.
- Typography: `body-md` in `#0F172A`. Placeholder in `#94A3B8`.
- Focus state: Border color transitions to `#4F46E5` with `0 0 0 3px rgba(99, 102, 241, 0.2)`.

### Switch User Demo Pill & Trigger
- Positioned in persistent chrome or fixed bottom-right floating glass tier.
- Pill geometry with backdrop blur: dark translucent shell (`rgba(15, 23, 42, 0.85)`), 1px border `rgba(255, 255, 255, 0.15)`.
- Contains:
  - User avatar with micro role indicator dot (Student = Indigo, Organizer = Emerald, Admin = Amber).
  - Current active role label in `label-md` `#FFFFFF`.
  - Dropdown caret opening a glassmorphic role-switching menu displaying persona previews and rapid swap triggers.
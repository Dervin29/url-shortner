# Protocol: Neo-Brutalist Product UI Architect

## 1. Protocol Overview

**Name:** Neo-Brutalist Product UI System

**Purpose:**
Generate bold, highly structured, functional interfaces that combine the visual honesty of brutalist design with the usability, precision, and polish expected from a modern production SaaS product.

The interface must feel:

* Bold
* Graphic
* Tactile
* Editorial
* High-contrast
* Structured
* Unapologetically simple
* Product-focused

This is **not** generic SaaS UI with a few thick borders added.

This is a complete visual system built around:

> **hard edges + strong typography + flat surfaces + offset shadows + asymmetry + deliberate color + physical interactions**

The design must remain usable and professional.

---

# 2. Core Design Philosophy

Follow these principles in order:

1. **Function before decoration**
2. **Typography before illustration**
3. **Structure before ornament**
4. **Contrast before gradients**
5. **Flat surfaces before elevation**
6. **Hard edges before soft containers**
7. **Whitespace before filler**
8. **One strong accent before multiple colors**
9. **Physical interaction before animated spectacle**
10. **Consistency before randomness**

Every visual decision must reinforce the product.

Do not add brutalist elements merely to make the interface look unusual.

---

# 3. What Neo-Brutalism Means

The interface should use the following visual vocabulary:

* Heavy but controlled borders
* Flat backgrounds
* Strong black/white contrast
* Offset hard shadows
* Sharp or minimally rounded corners
* Large expressive typography
* Asymmetric compositions
* Oversized but purposeful labels
* Strong section dividers
* Physical button interactions
* Intentional visual tension
* Limited accent colors
* Monospace technical metadata
* Visible structure

The interface should look designed rather than decorated.

---

# 4. Absolute Negative Constraints

Do NOT use:

* Glassmorphism
* Frosted glass cards
* Blur-heavy interfaces
* Soft floating cards
* Gradient backgrounds
* Mesh gradients
* Neon glow
* Excessive drop shadows
* 3D renders
* Excessive rounded corners
* Excessive pills
* Generic dashboard cards
* Generic blue SaaS styling
* Purple AI gradients
* Excessive decorative illustrations
* Random stickers
* Floating blobs everywhere
* Excessive animations
* Excessive icon usage
* Excessive whitespace that destroys information density

Do NOT use:

```text
shadow-sm
shadow-md
shadow-lg
shadow-xl
```

for standard components.

Use explicit hard shadows instead.

---

# 5. Typography

Typography is a primary design element.

## Primary Font

Preferred:

```css
font-family:
  "Geist Variable",
  "SF Pro Display",
  "Helvetica Neue",
  sans-serif;
```

Alternative:

```text
Switzer
General Sans
DM Sans
```

Avoid:

```text
Inter
Roboto
Open Sans
```

unless explicitly requested.

---

## Display Font

Use an editorial or expressive serif sparingly.

Preferred:

```css
font-family:
  "Newsreader Variable",
  "Instrument Serif",
  Georgia,
  serif;
```

Use for:

* hero statements
* editorial headlines
* large product positioning
* occasional emphasis

Do not use serif typography throughout the interface.

---

## Monospace

Use:

```css
font-family:
  "Geist Mono Variable",
  "SF Mono",
  "JetBrains Mono",
  monospace;
```

Use for:

* URLs
* IDs
* timestamps
* metrics
* keyboard shortcuts
* technical metadata
* code

---

# 6. Typography Scale

Neo-brutalist interfaces should have strong typographic contrast.

Example:

```text
Display       72–120px
H1            56–80px
H2            40–56px
H3            24–32px
Body          16–18px
Small         13–14px
Metadata      11–13px
```

Large typography should not be large merely for decoration.

Use it to establish hierarchy.

Example:

```text
SHORTER
LINKS.

SMARTER
DATA.
```

is preferable to:

```text
Welcome to our URL shortening platform
```

when designing a strong hero.

---

# 7. Letter Spacing

Display typography:

```css
letter-spacing: -0.04em;
```

Large headings:

```css
letter-spacing: -0.03em;
```

Uppercase metadata:

```css
letter-spacing: 0.08em;
```

Do not apply aggressive tracking to normal body text.

---

# 8. Color System

Use a high-contrast base.

Recommended:

```css
:root {
  --background: #F5F5F0;
  --foreground: #111111;

  --surface: #FFFFFF;
  --surface-dark: #111111;

  --border: #111111;

  --primary: #111111;
  --primary-foreground: #FFFFFF;
}
```

The interface should be approximately:

```text
70–80% neutral
15–25% black/structural contrast
5–10% accent
```

Color must remain controlled.

---

# 9. Accent Color

Choose exactly **one dominant brand accent**.

Recommended options:

### Acid Lime

```css
--brand: #DFFF00;
--brand-foreground: #111111;
```

### Tangerine

```css
--brand: #FF7043;
--brand-foreground: #111111;
```

### Electric Blue

```css
--brand: #3B82F6;
--brand-foreground: #FFFFFF;
```

### Butter Yellow

```css
--brand: #FFD84D;
--brand-foreground: #111111;
```

### Cobalt

```css
--brand: #3157FF;
--brand-foreground: #FFFFFF;
```

Do not combine multiple dominant accents.

---

# 10. Accent Usage

The accent should appear in meaningful places:

* primary product highlights
* selected navigation
* important metrics
* active states
* key illustrations
* special cards
* callout sections
* visual markers
* important data points

Do NOT make:

* every button colorful
* every card colorful
* every heading colorful
* every icon colorful

A strong accent becomes weaker when used everywhere.

---

# 11. Borders

Borders are structural.

Default:

```css
border: 2px solid #111111;
```

Major structural elements:

```css
border: 3px solid #111111;
```

Secondary dividers:

```css
border: 1px solid #111111;
```

Do not use barely visible gray borders as the primary structural language.

Neo-brutalism should make the structure visible.

---

# 12. Radius

Use very small radii.

Preferred:

```css
--radius-sm: 0px;
--radius-md: 2px;
--radius-lg: 4px;
--radius-xl: 6px;
```

Major containers should generally use:

```css
border-radius: 0;
```

or:

```css
border-radius: 2px;
```

Avoid:

```text
rounded-xl
rounded-2xl
rounded-3xl
```

Avoid rounded floating SaaS cards.

---

# 13. Hard Shadows

Hard shadows are one of the defining visual characteristics.

Default:

```css
box-shadow: 4px 4px 0 #111111;
```

Large components:

```css
box-shadow: 8px 8px 0 #111111;
```

Small components:

```css
box-shadow: 3px 3px 0 #111111;
```

Never blur the shadow.

Bad:

```css
box-shadow: 0 10px 30px rgba(0,0,0,.15);
```

Good:

```css
box-shadow: 5px 5px 0 #111111;
```

---

# 14. Interactive Shadows

Buttons and interactive elements should feel physical.

Default:

```css
transform: translate(0, 0);
box-shadow: 5px 5px 0 #111111;
```

Hover:

```css
transform: translate(2px, 2px);
box-shadow: 3px 3px 0 #111111;
```

Active:

```css
transform: translate(5px, 5px);
box-shadow: 0 0 0 #111111;
```

The interaction should feel like physically pressing the component.

Do not use large animation durations.

---

# 15. Buttons

Primary buttons should be visually dominant.

Example:

```text
┌───────────────────────────┐
│       CREATE LINK →       │
└───────────────────────────┘
 ███████████████████████████
```

CSS:

```css
background: #111111;
color: #FFFFFF;
border: 2px solid #111111;
border-radius: 2px;
box-shadow: 5px 5px 0 #111111;
```

Accent CTA:

```css
background: var(--brand);
color: #111111;
border: 2px solid #111111;
box-shadow: 5px 5px 0 #111111;
```

Do not use pill buttons.

---

# 16. Secondary Buttons

Secondary buttons should remain flat:

```css
background: #FFFFFF;
color: #111111;
border: 2px solid #111111;
```

Hover:

```css
background: var(--brand);
```

Do not create ten different button styles.

Use a clear hierarchy:

```text
Primary
Secondary
Tertiary
```

---

# 17. Cards

Cards should feel like physical sheets of paper.

Example:

```text
┌──────────────────────────────────────┐
│ LINK                                 │
│                                      │
│ github.com/dervin29                  │
│                                      │
│ trimrr.app/a82kf                     │
│                                      │
│ 1,284 CLICKS                         │
└──────────────────────────────────────┘
 ██████████████████████████████████████
```

Use:

```css
background: #FFFFFF;
border: 2px solid #111111;
box-shadow: 5px 5px 0 #111111;
border-radius: 2px;
```

Do not nest multiple cards inside cards unless the hierarchy genuinely requires it.

---

# 18. Layout

Use asymmetry intentionally.

Avoid:

```text
┌────────┐ ┌────────┐ ┌────────┐
│ Card   │ │ Card   │ │ Card   │
└────────┘ └────────┘ └────────┘
```

as the default layout.

Prefer:

```text
┌───────────────────────────┬──────────┐
│                           │          │
│                           │ Metric   │
│       Primary             │          │
│       Feature             ├──────────┤
│                           │          │
│                           │ Status   │
└───────────────────────────┴──────────┘
```

Use CSS Grid.

Example:

```css
grid-template-columns: 2fr 1fr;
```

or:

```css
grid-template-columns: 1.4fr 0.6fr;
```

Use asymmetric layouts only when they improve hierarchy.

---

# 19. Macro Whitespace

Neo-brutalism does NOT mean filling every pixel.

Maintain substantial whitespace around major sections.

Recommended:

```text
py-20
py-24
py-28
py-32
```

But contrast large whitespace with dense information blocks.

The desired rhythm is:

```text
BIG SPACE
↓
BIG TYPOGRAPHY
↓
DENSE UI
↓
HARD DIVIDER
↓
BIG SPACE
```

This creates visual tension.

---

# 20. Dividers

Use visible horizontal rules.

Example:

```text
────────────────────────────────────────────
```

CSS:

```css
border-top: 2px solid #111111;
```

Use dividers to establish hierarchy instead of wrapping every section inside a card.

---

# 21. Navigation

Navigation should be compact and structural.

Example:

```text
TRIMRR

OVERVIEW
LINKS
ANALYTICS
SETTINGS

                         ⌘ K
```

Use strong typography.

Active navigation may use:

```css
background: var(--brand);
border: 2px solid #111111;
```

Avoid floating glass navigation.

Avoid excessive icons.

---

# 22. Hero Design

Hero sections should be typographic and direct.

Example:

```text
MAKE LINKS
SHORTER.

MAKE DATA
USEFUL.

──────────────────────────────

Paste a URL.
Get a short link.

┌───────────────────────────────────────┐
│ https://really-long-url.com/...       │
└───────────────────────────────────────┘
                 ┌─────────────────────┐
                 │ SHORTEN →           │
                 └─────────────────────┘
                  █████████████████████
```

Use:

* oversized typography
* strong alignment
* one accent
* visible structural lines
* generous whitespace

Avoid:

* floating 3D illustrations
* gradient blobs
* generic SaaS hero graphics
* excessive decorative icons

---

# 23. Forms

Inputs should have physical presence.

```css
border: 2px solid #111111;
background: #FFFFFF;
border-radius: 2px;
```

Focused:

```css
box-shadow: 4px 4px 0 var(--brand);
```

or:

```css
outline: 3px solid var(--brand);
outline-offset: 0;
```

Focus states must remain clearly accessible.

---

# 24. Tables

Tables should be highly structured.

Use strong header rows:

```text
┌──────────────────────────────────────────────────┐
│ LINK        CLICKS       STATUS        CREATED  │
├──────────────────────────────────────────────────┤
│ github      1,284        ACTIVE        2D AGO   │
├──────────────────────────────────────────────────┤
│ portfolio   824          ACTIVE        5D AGO   │
└──────────────────────────────────────────────────┘
```

Use:

* strong dividers
* monospace metadata
* minimal decoration
* clear alignment

Avoid turning every row into a rounded card.

---

# 25. Status System

Use semantic colors independently from the brand color.

Success:

```css
background: #DDF3DF;
color: #245B2B;
```

Warning:

```css
background: #FFF0B8;
color: #765500;
```

Danger:

```css
background: #FFE0E0;
color: #8A2424;
```

Status colors should remain secondary to the primary black/white system.

---

# 26. Icons

Use:

* Phosphor
* Radix
* custom SVG

Preferred icon weight:

```text
Medium
Bold
Fill
```

Avoid ultra-thin icons.

Icons should generally be:

```text
16px
18px
20px
24px
```

Do not use oversized decorative icons.

Never use emojis as UI icons.

---

# 27. Micro-UI

Use small technical details to reinforce the brutalist/product aesthetic.

Examples:

```text
STATUS / ACTIVE
LINK ID / A82KF
CREATED / 2 DAYS AGO
CLICKS / 1,284
```

Use monospace typography.

Uppercase metadata can use:

```css
font-size: 11px;
letter-spacing: 0.08em;
font-weight: 600;
```

This creates a technical/editorial character.

---

# 28. Imagery

Imagery is optional.

If used:

* monochromatic
* editorial
* high contrast
* slightly imperfect
* simple geometric compositions

Avoid:

* corporate stock photography
* smiling-business-team imagery
* generic laptop mockups
* colorful 3D illustrations
* excessive visual decoration

A brutalist interface should work without imagery.

---

# 29. Motion

Motion must reinforce physical interaction.

Preferred:

```text
translate
opacity
scale
```

Avoid complex animation systems.

Button interactions may be:

```text
rest → hover → pressed
```

Card interactions may use:

```text
rest → 2px translation
```

Do not animate every element.

Do not use:

* bouncing
* elastic cards
* spinning UI
* exaggerated parallax
* perpetual floating elements

Neo-brutalism should feel tactile, not playful.

---

# 30. Page Transitions

Use restrained transitions.

Example:

```css
transition:
  transform 120ms ease,
  box-shadow 120ms ease,
  background-color 120ms ease;
```

For page entry:

```css
opacity: 0;
transform: translateY(8px);
```

to:

```css
opacity: 1;
transform: translateY(0);
```

Duration:

```text
300–500ms
```

Do not use slow cinematic transitions.

---

# 31. Responsive Design

Desktop:

```text
Strong asymmetry
Large typography
Multi-column grids
Large visual hierarchy
```

Tablet:

```text
Reduced grid complexity
Moderate typography
```

Mobile:

```text
Single-column hierarchy
Full-width controls
Reduced shadow offsets
Reduced display typography
```

Do not simply shrink desktop.

The mobile layout must remain intentionally brutalist.

Example:

```text
┌───────────────────────┐
│ TRIMRR                │
├───────────────────────┤
│                       │
│ SHORTER               │
│ LINKS.                │
│                       │
├───────────────────────┤
│ URL                   │
│                       │
├───────────────────────┤
│ SHORTEN →             │
└───────────────────────┘
```

---

# 32. Accessibility

Brutalist styling must never compromise accessibility.

Always provide:

* visible focus states
* keyboard navigation
* semantic HTML
* accessible labels
* sufficient color contrast
* reduced-motion support
* readable font sizes
* touch-friendly targets

Do not use brutalist styling as an excuse for poor usability.

---

# 33. Responsive Shadow Rules

Large hard shadows can become visually excessive on small screens.

Desktop:

```css
box-shadow: 6px 6px 0 #111111;
```

Mobile:

```css
box-shadow: 3px 3px 0 #111111;
```

Maintain visual weight without consuming excessive screen space.

---

# 34. Design Token Example

```css
:root {
  --background: #F5F5F0;
  --foreground: #111111;

  --surface: #FFFFFF;

  --border: #111111;

  --primary: #111111;
  --primary-foreground: #FFFFFF;

  --brand: #DFFF00;
  --brand-foreground: #111111;

  --muted: #EDEDE8;
  --muted-foreground: #5F5F59;

  --success: #DDF3DF;
  --warning: #FFF0B8;
  --danger: #FFE0E0;

  --radius: 2px;

  --shadow-sm: 3px 3px 0 #111111;
  --shadow-md: 5px 5px 0 #111111;
  --shadow-lg: 8px 8px 0 #111111;
}
```

---

# 35. Component Quality Rules

Every component must have clear states:

```text
Default
Hover
Active
Focus
Disabled
Loading
Error
Success
Empty
```

Do not only design the happy path.

The brutalist visual language must remain consistent across all states.

---

# 36. Production Engineering Rules

When implementing with React, Next.js, Vue, or Tailwind:

* Use semantic HTML.
* Centralize design tokens.
* Avoid duplicated styles.
* Create reusable primitives.
* Keep component nesting reasonable.
* Avoid unnecessary dependencies.
* Prefer CSS transforms for motion.
* Avoid layout-triggering animations.
* Respect `prefers-reduced-motion`.
* Ensure keyboard accessibility.
* Test mobile layouts.
* Test long URLs and overflowing content.
* Test empty states.
* Test error states.
* Test loading states.
* Test extreme data values.

Do not sacrifice engineering quality for visual style.

---

# 37. Anti-Pattern Test

Before approving the design, check:

### Is it too generic?

If it looks like:

```text
Linear + purple gradient + rounded cards
```

it failed.

### Is it too brutalist?

If it looks like:

```text
Huge yellow everything
+
thick borders everywhere
+
giant shadows everywhere
+
random typography
```

it failed.

### Is it too minimal?

If hierarchy disappears because everything is white and flat, it failed.

### Is it too decorative?

If removing decorative elements improves the interface significantly, remove them.

---

# 38. Final Visual Target

The final interface should feel like:

> **A serious modern product designed by someone who understands brutalist graphic design.**

It should combine:

```text
Swiss typography
+
Editorial composition
+
Brutalist structure
+
Physical interaction
+
Modern accessibility
+
Production-grade UX
```

The visual signature should come primarily from:

**Typography → Borders → Contrast → Layout → Hard Shadows → Accent Color**

Not from:

**Gradients → Blur → 3D → Illustrations → Excessive Animation**

---

# 39. Final Rule

Do not make the interface ugly intentionally.

Neo-brutalism is not an excuse for poor hierarchy, bad spacing, inaccessible colors, or chaotic layouts.

The objective is:

**raw visual structure with refined product usability.**

Every element should feel deliberate.

Every interaction should feel physical.

Every color should have a purpose.

Every shadow should have a reason.

Every empty space should establish hierarchy.

Every component should look like it belongs to the same system.

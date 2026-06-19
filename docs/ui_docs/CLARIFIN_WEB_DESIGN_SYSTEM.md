# Clarifin — Web Design System (V2: Cyber-Fintech & Aurora)

> **Version:** 2.0 — Web
> **Style:** Premium Neon Dark Mode / Soft Geometry
> **Mode:** Dark Mode Native
> **Framework:** Next.js (Web), Tailwind CSS v4
> **Brand colors:** `#030334` Navy · `#70AAE4` Sky Blue · `#F5F27A` Accent Yellow
> **This is the single source of truth for all Clarifin Web UI decisions.**

---

## 1. Design Philosophy

**Cyber-Fintech meets Aurora UI.** Moving away from rigid, traditional Swiss grids, the Clarifin Web UI embraces a highly engaging, modern tech aesthetic inspired by the best of Gen-Z and modern fintech platforms. It relies on a deep, rich dark mode foundation, punctuated by vibrant, glowing brand colors.

**Key Principles:**
1. **Dark Mode Native:** The UI is designed primarily for a dark environment (`#01010A` to `#030334`) to make data and glowing accents pop, reducing eye strain and feeling ultra-premium.
2. **Soft Geometry:** Absolutely no sharp 90-degree corners. Everything utilizes extreme border-radius—pill-shaped buttons and heavily rounded floating containers.
3. **Aurora Glows & Glassmorphism:** We use large, soft, multi-stop gradients and glowing drop-shadows to create depth, replacing traditional hard borders or flat backgrounds.
4. **High-Contrast Hierarchy:** Massive typography for account balances and primary actions, with heavily muted secondary text to create a flawless reading flow.

---

## 2. Color System & Glows

We use our existing brand colors, but treat them as light sources rather than flat paint.

### 2.1 Core Brand (The Light Sources)
```css
--color-navy-base: #01010A; /* Deeper than the brand navy, used for the absolute background */
--color-navy-surface: #030334; /* The original brand navy, used for floating elements */
--color-sky-blue: #70AAE4; /* Used for neon glows, charts, and primary positive actions */
--color-accent-yellow: #F5F27A; /* Used for warnings, highlights, and secondary glowing accents */
```

### 2.2 Backgrounds & Surfaces (Soft Geometry)
Surfaces should feel like they are floating in dark space.
```css
--bg-page: #01010A; /* Absolute background */
--bg-container: linear-gradient(180deg, rgba(3,3,52,0.8) 0%, rgba(3,3,52,0.4) 100%);
--bg-container-hover: linear-gradient(180deg, rgba(112,170,228,0.15) 0%, rgba(3,3,52,0.6) 100%);
```

### 2.3 Aurora Effects (Shadows as Light)
Instead of dark shadows, we cast light.
```css
/* Glows to be applied to buttons, active charts, or background orbs */
--glow-primary: 0px 0px 40px rgba(112, 170, 228, 0.3); /* Sky Blue Glow */
--glow-accent: 0px 0px 40px rgba(245, 242, 122, 0.2); /* Yellow Glow */
```

---

## 3. Typography Scale

Shifting to a purely modern, tech-forward Sans-Serif approach to match the sleek UI reference.

### Font Families
- **Primary UI & Headings:** Inter or SF Pro Display (Clean, geometric, highly legible).
- **Data (Numbers):** Inter (Tabular Nums enabled) or DM Mono.

### Responsive Type Scale (Desktop)
| Token | Size | Weight | Color | Use Case |
|---|---|---|---|---|
| `display-hero` | 84px | 700 (Bold) | White | Massive Account Balances / Hero Text |
| `title-lg` | 32px | 600 (Semibold)| White | Section Headers |
| `body-base` | 16px | 400 (Regular)| `#94A3B8` (Muted Grey)| Secondary text, labels |
| `body-sm` | 14px | 500 (Medium) | `#70AAE4` (Sky Blue) | Highlighting small statuses |

---

## 4. UI Component Architecture

### 4.1 Buttons (Pill Shapes)
All interactive buttons must be pill-shaped.
- **Primary:** `rounded-full bg-sky-blue text-navy-base font-bold px-8 py-4 shadow-[0_0_20px_rgba(112,170,228,0.4)]`
- **Secondary:** `rounded-full bg-transparent border border-sky-blue text-sky-blue px-8 py-4`

### 4.2 Floating Containers (Reimagining "Cards")
To capture the aesthetic of the reference image, containers are highly rounded and use subtle internal gradients and glows rather than flat solid fills.
- **Styling:** `rounded-[32px] bg-gradient-to-b from-[#030334]/80 to-[#030334]/30 border border-white/5 backdrop-blur-md p-8`

### 4.3 Data Visualization (Charts)
- Lines are thick (3px-4px) and use `drop-shadow` to create a neon tubing effect (e.g., glowing Sky Blue).
- Under-chart area uses a fading gradient down to transparency.

---

## 5. Trust & Premium Feel (Audit Alignment)
To satisfy the requirements of the `WEBSITE_DESIGN_AUDIT.md`:
1. **Instant Clarity:** The massive hero typography ensures the user's account value or the platform's primary value prop is the undisputed focal point.
2. **Modernity Score (10/10):** By adopting Aurora glows and Glassmorphism, the site matches industry leaders in the modern fintech space.
3. **Motion Design:** Hovering over any container should subtly increase its internal Aurora glow, providing instant, premium feedback without layout shift.

# Clarifin — Design System

> **Version:** 5.0 — Final
> **Style:** Swiss Modern with Editorial Serif
> **Mode:** Light mode only
> **Framework:** React Native Expo
> **Brand colors:** `#030334` Navy · `#70AAE4` Sky Blue
> **Reference:** Misso Swiss UI dashboard — sky gradient background, white floating cards,
>   serif display typography, oversized hero numbers, bold yellow accent card,
>   dark navy pill CTAs, two-tier label system inside cards
> **This is the single source of truth for all Clarifin UI decisions.
>   Load this file at the start of every UI development session.
>   All previous versions (v1 dark purple, v2 royal blue, v3 sage green, v4 sans-serif Swiss) are superseded.**

---

## 1. Design Philosophy

**Swiss Modern with Editorial Serif** — Clarifin uses the Swiss/International design
philosophy: typography IS the design. Massive, bold serif numbers do the heavy lifting.
White cards float effortlessly on a soft sky gradient. One bold yellow card anchors
the most important metric on every screen. Dark navy pill buttons create sharp,
confident CTAs.

**What this design achieves simultaneously:**
1. **Trust** — clean, structured, professional layout
2. **Warmth** — Playfair serif gives an editorial, premium, human feel
3. **Energy** — oversized display numbers, bold yellow accents
4. **Approachability** — soft sky background, generous spacing, rounded corners

**The one thing every user must feel:** *"I finally understand investments."*

---

## 2. Brand Colors

```
Navy Primary     #030334    Brand anchor — CTAs, headings, dark cards, AI bubbles
                            Never dilute this. Most important color in the system.

Sky Blue         #70AAE4    Brand accent — labels, secondary CTAs, badges, chart lines
                            What makes Clarifin feel distinct from other fintech apps.
```

These two colors carry the entire brand. Everything else (yellow accent, return
colors, semantic badge colors) supports these two.

---

## 3. Full Color Palette

### 3.1 Core Brand & Accent

```
navy-primary     #030334    Brand navy
sky-blue         #70AAE4    Brand sky blue
accent-yellow    #F5F27A    Hero metric card background (ONE per screen max)
```

### 3.2 Return Color System

Applied consistently across all percentage values everywhere in the app —
tables, cards, charts, list items, chat responses. No exceptions.

```
> +15%       #16A34A    return-strong-positive    great years (FY2021 equity)
+1% to +15%  #22C55E    return-positive           normal positive years
-1% to +1%   #8AAAB8    return-neutral            flat years
-1% to -15%  #EF4444    return-negative           bad years
< -15%       #DC2626    return-strong-negative    crash years (FY2020)
```

### 3.3 Semantic Colors (badges, alerts, states)

```
warning          #F59E0B    Moderate-risk indicators, caution states
info             #1E4D8C    SEBI regulated badge text, info icons
success          #166534    Tax saving / govt backed text on green pills
```

### 3.4 Background System

```
bg-app           App-level sky gradient
                 linear-gradient(150deg, #EBF4FF 0%, #F0F7FF 50%, #E8F2FF 100%)
                 Always visible behind floating cards. Signature look.

bg-screen        #F4F8FE    Slightly more muted screen background
                            (use on data-dense screens like comparison)

bg-card          #FFFFFF    All standard white cards, list items, modals

bg-input         #F4F8FE    Input fields, secondary surfaces

bg-navy-card     #030334    Navy card variant (AI insights, dark callouts)

bg-blue-card     linear-gradient(135deg, #70AAE4, #4A8ED4)
                 Blue gradient card variant (secondary metrics, volatility)

bg-yellow-card   #F5F27A    Yellow hero accent card
```

### 3.5 Border System

```
border-light     rgba(112,170,228,0.20)    Standard card border (subtle)
border-default   #C5DCEF                   Input borders, dividers
border-focus     #70AAE4                   Active/focused input border
border-navy      rgba(3,3,52,0.20)         Subtle border on white surfaces
border-outline   rgba(3,3,52,0.20)         Outline button border
```

### 3.6 Text System

```
text-primary     #030334    All headings, primary content, numbers
text-secondary   #4A6A8A    Subtext, card descriptions
text-tertiary    #7A8BAA    Timestamps, placeholders, disabled, captions
text-label       #7A8BAA    Two-tier label system labels ("When:", "Team:")
text-on-navy     #FFFFFF    Text on navy cards and dark buttons
text-on-blue     #FFFFFF    Text on blue gradient cards
text-on-yellow   #030334    Text on yellow accent cards (navy, NOT black)
text-sky-label   #70AAE4    ALL CAPS section labels ("INSTRUMENTS")
```

---

## 4. Typography

### 4.1 Font Stack

```
Display (hero/serif)    Playfair Display 900    Greeting + ALL big numbers
Headings (sans)         Inter SemiBold 600      Card titles, section headers
Body (sans)             Inter Regular 400/500   Paragraphs, list items, value text
Labels (sans, light)    Inter Light 300         Two-tier label values
Tiny labels (sans)      Inter Regular 400       Two-tier label keys
Buttons / Badges        Inter SemiBold 600      All button text and badge text
Section labels          Inter Bold 700          ALL CAPS section labels
Financial data          DM Mono Medium 500      EVERY % and ₹ value, no exceptions
```

### 4.2 Why These Fonts

- **Playfair Display 900** — gives Clarifin its distinctive editorial/warm feel.
  Used ONLY for the greeting ("Hi, Nash!") and large display numbers ("12.9%",
  "+34.6%"). This is what separates Clarifin from generic geometric-sans fintech apps.

- **Inter** — most legible body font on mobile. Universal trust signal. Used for
  every non-financial-number piece of text.

- **DM Mono** — monospaced numbers align perfectly in comparison tables. Financial
  data must NEVER use proportional fonts.

### 4.3 Type Scale (React Native sp units)

| Token | Size | Font | Weight | Tracking | Use case |
|---|---|---|---|---|---|
| `display-2xl` | 72sp | Playfair Display | 900 | -3px | Hero metric (10yr CAGR display) |
| `display-xl` | 56sp | Playfair Display | 900 | -2.5px | Featured number (yellow card) |
| `display-lg` | 44sp | Playfair Display | 900 | -2px | Greeting ("Hi, Nash!") |
| `display-md` | 32sp | Playfair Display | 900 | -1px | Yellow card sub-numbers ("26h") |
| `title-xl` | 22sp | Inter | 700 | -0.3px | Screen title |
| `title-lg` | 18sp | Inter | 600 | 0 | Card title ("Weekly Strategy Sync") |
| `title-md` | 15sp | Inter | 600 | 0 | Sub-section header, list item title |
| `body-lg` | 16sp | Inter | 400 | 0 | Primary body text |
| `body-md` | 14sp | Inter | 400/500 | 0 | Secondary body, value text |
| `body-sm` | 12sp | Inter | 400 | 0 | Captions, descriptions |
| `label-key` | 11sp | Inter | 400 | 0 | Two-tier label key ("When:", "Team:") |
| `label-light` | 11sp | Inter | 300 | 0 | Light weight labels under big numbers |
| `label-cap` | 11sp | Inter | 700 | 1.5-2px | ALL CAPS section labels |
| `button` | 14sp | Inter | 600 | 0.2px | All button text |
| `badge` | 11sp | Inter | 600 | 0.3px | Badge/pill text |
| `mono-xl` | 24sp | DM Mono | 500 | -0.5px | Large return display in cards |
| `mono-lg` | 18sp | DM Mono | 500 | 0 | Card return values |
| `mono-md` | 14sp | DM Mono | 500 | 0 | Table cell data, list item values |
| `mono-sm` | 12sp | DM Mono | 500 | 0 | Small data labels |

### 4.4 Typography Rules

1. **Playfair 900 for all big numbers** — never use Inter for hero numbers
2. **DM Mono for every financial number** — even small ones in lists and tables
3. **Negative letter-spacing on display sizes** (-2px to -3px) — makes large numbers feel premium
4. **Positive values always show "+" explicitly** (e.g. "+12.9%")
5. **Negative values use "−" (minus sign U+2212), never hyphen "-"**
6. **Screen titles: sentence case only** — never ALL CAPS, never Title Case
7. **Section labels: ALL CAPS, letter-spacing 1.5–2px, color `#70AAE4`**
8. **Minimum visible font size: 11sp**
9. **Minimum font weight on white background: 400** (300 only inside yellow card for muted labels)
10. **Two-tier label system inside cards** — see §6.3

### 4.5 Two-Tier Label System (Critical Pattern)

Cards with structured info (when/team/reminder, topic/description/deadline) use a
specific two-line pattern from the reference design:

```
Tier 1 — Label key:    11sp, Inter 400, #7A8BAA, sentence case + colon
Tier 2 — Label value:  14sp, Inter 500, #030334
Vertical gap:          2px between key and value
Horizontal gap:        16-24px between columns
```

Example:
```
When:                  Team:                  Reminder:
Today, 10:00 AM        Marketing & Growth     15 min
```

**Never reverse this hierarchy** — labels are always tiny + muted, values always
larger + bold + dark.

### 4.6 Bold/Light Weight Contrast (Yellow Card Pattern)

Inside the yellow accent card, numbers use heavy serif weight while their labels
use light sans-serif. This contrast is a key signature of the design.

```
Number:    Playfair 900, 32sp, #030334, letter-spacing -1px
Label:     Inter 300 (LIGHT), 11sp, rgba(3,3,52,0.55)
```

Example (yellow card):
```
26h            11h            6h
Sync Calls     Workshops      Reviews
```

The weight contrast between heavy serif numbers and ultra-light labels creates
visual rhythm.

---

## 5. Spacing System

Base unit: 4px. Every value is a multiple of 4.

```
space-1      4px     Icon internal padding, micro gaps
space-2      8px     Badge padding, tight element gaps
space-3     12px     List item gap, compact sections
space-4     16px    Card inner padding (default)
space-5     20px    Screen horizontal padding (default)
space-6     24px    Section gap between cards
space-8     32px    Large section separation
space-10    40px    Screen top padding, hero section gap
space-12    48px    Very large separation
space-16    64px    Screen-level hero breathing room
```

### Layout Constants

```
Screen horizontal padding         20px both sides, always
Card inner padding                16px all four sides
Card gap (vertical stack)         12px between stacked cards
Card gap (grid layout)            10px in 2-column grids
List item height                  64px minimum
List item horizontal padding      16px
Bottom nav height                 72px + safe area inset
Safe area bottom padding          always respect + 16px extra
Hero card padding (yellow)        20px all sides
Yellow card sub-number gap        8px between columns
```

---

## 6. Border Radius

```
radius-xs       6px      Tiny badges, micro elements
radius-sm      10px      Input fields
radius-md      14px      Filter chips, small cards
radius-lg      20px      Standard card (PRIMARY — most common)
radius-xl      26px      Hero card, yellow accent card
radius-2xl     32px      Bottom sheets, modals, drawers
radius-full   9999px     All pill buttons, avatar circles, bottom nav
```

**Rule:** Default to `radius-lg` (20px) for any card unless specified otherwise.
Never go below 14px for any card. This design has notably generous rounding.

---

## 7. Elevation / Shadow System

```
Level 0 — flat:
  No shadow. Used for nested inner elements within a card.

Level 1 — subtle:
  shadow: 0 1px 6px rgba(3,3,52,0.05)
  border: 1px solid rgba(112,170,228,0.20)
  Used for: list items, icon buttons, secondary cards

Level 2 — card default:
  shadow: 0 4px 20px rgba(3,3,52,0.08)
  border: 1px solid rgba(112,170,228,0.20)
  Used for: all standard white cards (most common)

Level 3 — elevated:
  shadow: 0 8px 32px rgba(3,3,52,0.12)
  Used for: modals, bottom sheets

Level 4 — floating:
  shadow: 0 12px 40px rgba(3,3,52,0.16)
  Used for: tooltips, dropdowns, popover elements

Yellow card shadow:
  shadow: 0 4px 20px rgba(245,242,122,0.45)

Navy card shadow:
  shadow: 0 4px 24px rgba(3,3,52,0.30)

Blue gradient card shadow:
  shadow: 0 4px 20px rgba(112,170,228,0.40)

Primary button shadow:
  shadow: 0 4px 16px rgba(3,3,52,0.30)

Sky blue button shadow:
  shadow: 0 4px 16px rgba(112,170,228,0.40)
```

---

## 8. Component Specifications

### 8.1 Card Variants

**Standard White Card** (most used — 80%+ of all cards)
```
background:       #FFFFFF
border:           1px solid rgba(112,170,228,0.20)
border-radius:    20px (radius-lg)
padding:          16px (or 20px for important cards)
shadow:           Level 2
```

**Yellow Hero Card** (featured metric — ONE per screen max)
```
background:       #F5F27A
border:           none
border-radius:    20–26px (radius-lg to radius-xl)
padding:          20px
shadow:           yellow card shadow
text:             #030334 (navy, not black)
use for:          the single most important number/metric on the screen
content pattern:  ALL CAPS section label + Playfair big number + descriptive sub
```

**Navy Card** (AI insights, dark callouts)
```
background:       #030334
border:           none
border-radius:    20px
padding:          16–20px
shadow:           navy card shadow
text primary:     #FFFFFF
text label:       #70AAE4 (ALL CAPS labels)
```

**Blue Gradient Card** (secondary metrics like volatility, std deviation)
```
background:       linear-gradient(135deg, #70AAE4, #4A8ED4)
border:           none
border-radius:    20px
padding:          16–20px
shadow:           blue card shadow
text primary:     #FFFFFF
text label:       rgba(255,255,255,0.70)
```

### 8.2 Buttons

**Primary Dark Pill** (main CTA — most prominent action)
```
background:       #030334
text:             #FFFFFF, Inter 600, 14sp
height:           48px (compact) or 54px (large)
border-radius:    9999px (full pill)
padding:          0 26px
border:           none
shadow:           0 4px 16px rgba(3,3,52,0.30)
press state:      scale 0.97, shadow reduces to 0 2px 8px
use for:          "Compare Now", "Ask AI", primary form submission
```

**Sky Blue Pill** (secondary CTA — supportive action)
```
background:       #70AAE4
text:             #030334, Inter 600, 14sp
height:           48–54px
border-radius:    9999px
padding:          0 26px
border:           none
shadow:           0 4px 16px rgba(112,170,228,0.40)
use for:          "Explore Instruments", "View Details" (non-primary CTAs)
```

**Outline Pill** (tertiary action — like "Join a meeting" in reference)
```
background:       #FFFFFF
text:             #030334, Inter 500, 14sp
height:           48px
border-radius:    9999px
padding:          0 26px
border:           1.5px solid rgba(3,3,52,0.20)
shadow:           none
use for:          secondary actions inside cards, dismissive choices
```

**Ghost Button** (inline text link with arrow)
```
background:       transparent
text:             #70AAE4, Inter 600, 14sp
height:           44px
border:           none
border-radius:    none / 9999px (doesn't matter)
padding:          12px 8px
use for:          "Learn More →", "See All →", inline contextual actions
```

**Icon Button — Circular White**
```
background:       #FFFFFF
border:           1px solid rgba(112,170,228,0.25)
size:             44×44px
border-radius:    9999px
shadow:           0 2px 8px rgba(3,3,52,0.06)
icon:             Lucide outline, 20px, #4A6A8A
```

**Icon Button — Circular Navy**
```
background:       #030334
border:           none
size:             44×44px
border-radius:    9999px
icon:             Lucide outline, 20px, #FFFFFF
use for:          primary actions in compact spaces (mic, send, AI sparkle)
```

**Destructive Button**
```
background:       rgba(239,68,68,0.08)
border:           1.5px solid rgba(239,68,68,0.25)
text:             #DC2626, Inter 600, 14sp
height:           48px
border-radius:    9999px
padding:          0 26px
use for:          remove, delete, dangerous actions
```

### 8.3 Input Fields

**Default**
```
background:       #F4F8FE
border:           1.5px solid #C5DCEF
border-radius:    12px
height:           52px
padding:          0 16px
font:             Inter 400, 15sp, #030334
placeholder:      #7A8BAA
```

**Focused**
```
border:           1.5px solid #70AAE4
shadow:           0 0 0 3px rgba(112,170,228,0.15)
```

**Error**
```
border:           1.5px solid #EF4444
shadow:           0 0 0 3px rgba(239,68,68,0.10)
```

**Disabled**
```
background:       #F8FAFB
border:           1.5px solid rgba(112,170,228,0.20)
text:             #7A8BAA
```

### 8.4 Badges / Pills

**Risk Badges** (SEBI riskometer levels)
```
Low                bg #DCFCE7  text #166534  border #BBF7D0
Low-to-Moderate    bg #D1FAE5  text #065F46  border #A7F3D0
Moderate           bg #FEF9C3  text #854D0E  border #FEF08A
Moderately-High    bg #FFEDD5  text #9A3412  border #FED7AA
High               bg #FEE2E2  text #991B1B  border #FECACA
Very High          bg #FFE4E6  text #9F1239  border #FECDD3
```

**Info / Status Badges**
```
SEBI Regulated     bg #EBF4FF  text #1E4D8C  border #C5DCEF
SIP Available      bg #EBF4FF  text #1E4D8C  border #C5DCEF
Tax Saving 80C     bg #DCFCE7  text #166534  border #BBF7D0
Lock-in (any yr)   bg #FEF9C3  text #854D0E  border #FEF08A
Govt Backed        bg #030334  text #70AAE4  border none
RBI Issued         bg #030334  text #70AAE4  border none
```

**Badge spec**
```
padding:          4px 12px
border-radius:    9999px
font:             Inter 600, 11sp
border-width:     1px (none for navy badges)
letter-spacing:   0.3px
```

### 8.5 Filter Chips (Category Selection)

**Active chip**
```
background:       #030334
text:             #FFFFFF, Inter 600, 13sp
border-radius:    9999px
padding:          8px 18px
border:           none
```

**Inactive chip**
```
background:       #FFFFFF
border:           1px solid rgba(112,170,228,0.30)
text:             #030334, Inter 500, 13sp
border-radius:    9999px
padding:          8px 18px
shadow:           Level 1
```

### 8.6 Return Value Display

```
Strong positive (> +15%):
  color:    #16A34A   font: DM Mono 500   prefix: "+"

Positive (+1% to +15%):
  color:    #22C55E   font: DM Mono 500   prefix: "+"

Neutral (-1% to +1%):
  color:    #8AAAB8   font: DM Mono 500   prefix: "+" or none

Negative (-1% to -15%):
  color:    #EF4444   font: DM Mono 500   prefix: "−"

Strong negative (< -15%):
  color:    #DC2626   font: DM Mono 500   prefix: "−"

Hero display (on yellow card):
  color:    #030334   font: Playfair 900   size: 44–56sp   prefix shown

Hero display (on white card):
  color:    #030334   font: Playfair 900   size: 44–72sp   prefix shown

Table cell:
  font:     DM Mono 500   size: 14sp   align: right always

Card metric (mid-size):
  font:     Playfair 900   size: 24–32sp   color: return color system
```

### 8.7 List Item Row (Instrument List)

```
Container:
  background:        #FFFFFF
  height:            64px minimum
  padding:           12px 16px
  border-radius:     16–20px
  margin-bottom:     8–12px
  shadow:            Level 1

Left icon circle:
  size:              40×40px
  border-radius:     9999px
  background:        #EBF4FF (or category color at 12% opacity)
  icon:              Lucide outline 20px, #70AAE4

Title:               Inter 600, 15sp, #030334
Subtitle:            Inter 400, 11–12sp, #7A8BAA
Right value:         DM Mono 500, 15sp, return color system
Right sub-label:     Inter 400, 10sp, #7A8BAA
```

### 8.8 Comparison Table

```
Container:
  background:       #FFFFFF
  border-radius:    20px
  overflow:         hidden
  shadow:           Level 2

Header row:
  background:       #F4F8FE
  text:             #70AAE4, Inter 700, 10sp, letter-spacing 1.5px, ALL CAPS
  height:           40px
  padding:          0 16px
  border-bottom:    1px solid rgba(112,170,228,0.15)

Data row (odd):     #FFFFFF
Data row (even):    #FAFCFF
Row height:         52px
Cell padding:       0 16px
Divider:            1px solid rgba(112,170,228,0.10)

First column (instrument name):
  font:             Inter 500, 14sp, #030334
  align:            left

Data columns:
  font:             DM Mono 500, 14sp
  align:            right always
  color:            return color system

Highlighted row (selected):
  background:       #EBF4FF
  border-left:      3px solid #70AAE4
```

### 8.9 Charts

```
Primary line:       #70AAE4 (sky blue — brand)
Line width:         2.5px
Area fill:          linear #70AAE440 → transparent (top to bottom)
Grid lines:         rgba(112,170,228,0.15), dashed
Grid text:          DM Mono 400, 10sp, #7A8BAA
Axis text:          DM Mono 400, 11sp, #7A8BAA
Tooltip card:       white, Level 2 shadow, Inter 500, 13sp

Multi-line comparison colors (in order):
  Line 1            #030334    Navy — primary instrument
  Line 2            #70AAE4    Sky blue — second instrument
  Line 3            #F59E0B    Amber — third instrument
  Line 4            #22C55E    Green — fourth instrument
  CPI baseline      #C5DCEF    Dashed, always muted, always shown

Bar chart:
  positive bars     #22C55E
  negative bars     #EF4444
  bar radius        4px top corners only
  bar gap           4px between bars

Data point on line:
  size              8px circle
  fill              #FFFFFF
  stroke            2px, matching line color
```

### 8.10 Bottom Navigation

```
Container:
  background:       #FFFFFF
  border-top:       1px solid rgba(112,170,228,0.15)
  height:           72px + safe area
  shadow:           0 -4px 16px rgba(3,3,52,0.05)

Nav pill container:
  background:       #F4F8FE
  border-radius:    9999px
  padding:          5px
  margin:           8px 16px

Active tab:
  background:       #030334
  border-radius:    9999px
  padding:          8px 18px
  icon:             Lucide outline 22px, #FFFFFF
  label:            Inter 600, 11sp, #FFFFFF

Inactive tab:
  background:       transparent
  icon:             Lucide outline 22px, #7A8BAA
  label:            Inter 400, 11sp, #7A8BAA
```

### 8.11 AI Chat Bubbles

```
Screen background:  #F4F8FE

User bubble:
  background:       #030334
  text:             #FFFFFF, Inter 400, 15sp, line-height 1.5
  border-radius:    20px 20px 4px 20px
  padding:          12px 16px
  max-width:        75%
  align:            right

AI bubble:
  background:       #FFFFFF
  border:           1px solid rgba(112,170,228,0.20)
  text:             #030334, Inter 400, 15sp, line-height 1.6
  border-radius:    20px 20px 20px 4px
  padding:          12px 16px
  max-width:        85%
  shadow:           Level 1

MANDATORY disclaimer footer (below EVERY AI bubble — hardcoded in UI, not from AI):
  text color:       #7A8BAA
  font:             Inter 400, 11sp
  content:          "⚠ Educational only. Not investment advice. We are not a
                     SEBI-Registered Investment Adviser. Consult a qualified
                     adviser before investing."
  padding-top:      7px
  border-top:       1px solid rgba(112,170,228,0.15)
  margin-top:       7px

Report button (below every AI bubble, beside disclaimer):
  icon:             Lucide Flag, 14px, #7A8BAA
  label:            "Report" — Inter 400, 11sp, #7A8BAA
  tap area:         44×44px minimum

Input bar (bottom):
  background:       #FFFFFF
  border:           1.5px solid #C5DCEF
  border-radius:    9999px (full pill)
  height:           52px
  padding:          0 20px
  send button:      navy circle 44×44px, white arrow icon
```

---

## 9. Iconography

```
Library:           Lucide Icons (already in Expo stack via lucide-react-native)
Style:             Outline ONLY (strokeWidth: 1.5)
Default size:      24px
Small size:        20px
Large size:        28px

Colors by context:
  On white background:      #4A6A8A (secondary text)
  On navy background:       #FFFFFF
  On blue gradient:         #FFFFFF
  On yellow card:           #030334
  Active/selected:          #70AAE4 (sky blue)
  Destructive:              #EF4444
  In list item icon circle: #70AAE4

Rules:
  - Never use filled icons (no -filled suffix)
  - Never mix outline and filled icons on same screen
  - Never render icons smaller than 18px (accessibility)
  - Always set strokeWidth: 1.5 explicitly
```

---

## 10. Animation & Motion

### 10.1 Principles
- **Smooth and confident** — animations match the bold typography
- Cards spring into place, not slide mechanically
- Numbers always count up from 0 on first render for hero metrics
- Chart line draws left to right on screen entry
- Staggered card reveals on screen load
- No looping decorative animations — never distract from data

### 10.2 Timing

```
instant            100ms      Button press state change
fast               200ms      Micro-interactions, badge changes
default            300ms      Screen transitions, card entry
slow               500ms      Chart draw animation
counter            800ms      Number count-up (hero metrics)
long              1000ms      Complex staggered layouts
```

### 10.3 Easing

```
spring-default     damping: 18, stiffness: 160     All interactive elements
spring-bouncy      damping: 14, stiffness: 180     Filter chip selection
ease-out           cubic-bezier(0.0, 0, 0.2, 1)    Elements entering screen
ease-in            cubic-bezier(0.4, 0, 1, 1)      Elements leaving screen
```

### 10.4 Stagger Pattern (card list / grid entry)

```
Card 1:   translateY(20) → 0, opacity 0 → 1, delay 0ms
Card 2:   translateY(20) → 0, opacity 0 → 1, delay 60ms
Card 3:   translateY(20) → 0, opacity 0 → 1, delay 120ms
Card 4:   translateY(20) → 0, opacity 0 → 1, delay 180ms
Card 5+:  all at delay 200ms (don't keep staggering past 4)
```

### 10.5 Interactive States

```
Button press:       scale 0.97, shadow reduces, duration 100ms spring
Card tap:           scale 0.99, duration 100ms
List item tap:      background flashes to #EBF4FF, duration 150ms
Tab switch:         active pill slides with spring animation
Chart data hover:   point scales to 12px, tooltip fades in 150ms
```

---

## 11. Screen-Specific Design Notes

### 11.1 Home Screen

```
Background:         sky gradient (visible around all cards)

Top section:
  - Greeting:       "Hi, [Name]!" — Playfair 900, 44sp, #030334
  - No header bar — the greeting IS the header
  - Avatar circle top-left (40×40), notification bell top-right

Yellow hero card (ONE per screen max):
  - Featured metric or comparison highlight
  - ALL CAPS section label at top (Inter 700, 11sp, opacity 0.55)
  - Big Playfair 900 number, 48–56sp
  - Sub-text below explaining the number
  - Takes full width

Quick action row (below hero):
  - 3-4 circular icon buttons (44×44, white, shadow Level 1)
  - Icons in #70AAE4

Section: "Instruments"
  - Section label: "INSTRUMENTS" — Inter 700, 11sp, #70AAE4, letter-spacing 1.5px
  - Filter chips horizontal scroll (All / Equity / Debt / Gold / Government / Alternative)
  - List items below

AI Entry Card:
  - White card at bottom of home
  - Navy pill button: "✦ Ask Clarifin AI"
  - Sub-text: "Educational questions only" — #7A8BAA
```

### 11.2 Instrument Explorer Screen

```
Background:         sky gradient
Search bar:         full-width rounded pill (#F4F8FE bg, #C5DCEF border)
Filter chips:       horizontal scroll below search
Instrument display: 2-column grid OR 1-column list (user toggleable)

Each card:
  - Left: category icon circle (40×40, light blue bg)
  - Center: instrument name (Inter 600), regulator/tags (Inter 400, muted)
  - Right: CAGR in DM Mono, risk badge above
  - Border radius 20px, shadow Level 2
```

### 11.3 Comparison Screen

```
Background:         #F4F8FE (cleaner for data density)
Instrument selector: horizontal scroll pills at top (max 4 instruments)
Period toggle:       "3yr / 5yr / 10yr" segmented control, navy active
Chart:               40% screen height, multi-line, sky blue primary
Table below chart:   inside white card, scrollable

CPI inflation line:  always shown as dashed #C5DCEF
Disclaimer banner:   pinned at absolute bottom, #7A8BAA text
```

### 11.4 AI Chat Screen

```
Background:         #F4F8FE
Top bar:            "Clarifin AI" title centered, navy color
Subtitle:           "Educational assistant only" — small, #7A8BAA
Messages area:      scrollable, alternating user (navy) + AI (white) bubbles

Every AI message:   includes disclaimer footer + Report flag button
Input bar:          full-width pill at bottom, navy circular send button
```

### 11.5 Profile / Filter Screen

```
Background:         sky gradient
Cards:              white sections for each filter group

Toggles:            active #70AAE4, inactive track #C5DCEF
Risk selector:      5-option pill row, active = navy fill
Horizon slider:     sky blue track and thumb
Bottom CTA:         full-width navy pill button "Show matching instruments"
```

---

## 12. Accessibility

```
- Minimum touch target:           44×44px on all interactive elements
- All body text on white:         meets WCAG AA (4.5:1 minimum contrast)
- Navy #030334 on white:          ratio 18.1:1 — WCAG AAA ✓
- Sky blue #70AAE4 on white:      ratio 2.8:1 — use ONLY for large text/labels
                                  (never for body text on white)
- Navy on yellow #F5F27A:         ratio 13.4:1 — WCAG AAA ✓
- White on navy:                  ratio 18.1:1 — WCAG AAA ✓
- Risk badges:                    always color + text label, never color alone
- Return values:                  always color + sign prefix (+ or −), never color alone
- Minimum font size:              11sp for any user-visible text
```

---

## 13. What to Avoid

```
❌ Dark mode anywhere — light mode only
❌ Solid dark or grey screen backgrounds
❌ Sans-serif for hero numbers — always Playfair Display 900
❌ Proportional fonts for financial numbers — always DM Mono
❌ More than ONE yellow hero card per screen
❌ Font weight below 400 on white background
   (300 only inside yellow card for muted labels)
❌ Border radius smaller than 14px on any card
❌ Return numbers without explicit "+" or "−" prefix
❌ Return numbers without color coding
❌ AI responses without the mandatory disclaimer footer
❌ Overcrowded screens — this design needs breathing room
❌ Dark or heavy shadows — only soft diffused
❌ More than 4 instruments on comparison chart at once
❌ Solid white app background without the sky gradient
❌ Purple, pink, or warm-toned accents — navy + sky blue only
❌ Sky blue #70AAE4 used as primary CTA button color
   (navy #030334 is the primary CTA color)
❌ Hero numbers without negative letter-spacing
❌ Using "-" (hyphen) for negative returns — always use "−" (minus sign)
```

---

## 14. React Native / Expo Implementation

### 14.1 theme.ts — Source of truth

```typescript
export const colors = {
  // Brand
  navy: '#030334',
  skyBlue: '#70AAE4',
  accentYellow: '#F5F27A',

  // Returns
  positiveStrong: '#16A34A',
  positive: '#22C55E',
  neutral: '#8AAAB8',
  negative: '#EF4444',
  negativeStrong: '#DC2626',
  warning: '#F59E0B',

  // Backgrounds
  bgCard: '#FFFFFF',
  bgScreen: '#F4F8FE',
  bgInput: '#F4F8FE',

  // Borders
  borderLight: 'rgba(112,170,228,0.20)',
  borderDefault: '#C5DCEF',
  borderFocus: '#70AAE4',
  borderOutline: 'rgba(3,3,52,0.20)',

  // Text
  textPrimary: '#030334',
  textSecondary: '#4A6A8A',
  textTertiary: '#7A8BAA',
  textLabel: '#7A8BAA',
  textOnNavy: '#FFFFFF',
  textOnBlue: '#FFFFFF',
  textOnYellow: '#030334',
  textSkyLabel: '#70AAE4',
}

// App background gradient
// Use with expo-linear-gradient:
// <LinearGradient colors={appBackground.colors}
//   start={appBackground.start} end={appBackground.end} />
export const appBackground = {
  colors: ['#EBF4FF', '#F0F7FF', '#E8F2FF'],
  start: { x: 0.1, y: 0 },
  end: { x: 0.9, y: 1 },
}

// Return color helper
export const getReturnColor = (value: number): string => {
  if (value > 15) return colors.positiveStrong
  if (value > 0) return colors.positive
  if (value >= -1 && value <= 1) return colors.neutral
  if (value > -15) return colors.negative
  return colors.negativeStrong
}

// Return formatter — always uses proper minus sign
export const formatReturn = (value: number): string => {
  const abs = Math.abs(value).toFixed(1)
  if (value > 0) return `+${abs}%`
  if (value < 0) return `\u2212${abs}%` // proper minus sign U+2212
  return `${abs}%`
}

// Font families to register
export const fontAssets = {
  'PlayfairDisplay-Black': require('./assets/fonts/PlayfairDisplay-Black.ttf'),
  'PlayfairDisplay-Bold': require('./assets/fonts/PlayfairDisplay-Bold.ttf'),
  'Inter-Light': require('./assets/fonts/Inter-Light.ttf'),
  'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
  'Inter-Medium': require('./assets/fonts/Inter-Medium.ttf'),
  'Inter-SemiBold': require('./assets/fonts/Inter-SemiBold.ttf'),
  'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
  'DMMono-Medium': require('./assets/fonts/DMMono-Medium.ttf'),
}

// Font family references for use in StyleSheet
export const fonts = {
  display: 'PlayfairDisplay-Black',
  displayBold: 'PlayfairDisplay-Bold',
  light: 'Inter-Light',
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semibold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
  mono: 'DMMono-Medium',
}

// Shadow presets
export const shadows = {
  level1: {
    shadowColor: '#030334',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  level2: {
    shadowColor: '#030334',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 3,
  },
  level3: {
    shadowColor: '#030334',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 6,
  },
  yellowCard: {
    shadowColor: '#F5F27A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 5,
  },
  navyCard: {
    shadowColor: '#030334',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 24,
    elevation: 6,
  },
  blueCard: {
    shadowColor: '#70AAE4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.40,
    shadowRadius: 20,
    elevation: 5,
  },
  primaryButton: {
    shadowColor: '#030334',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 16,
    elevation: 4,
  },
  blueButton: {
    shadowColor: '#70AAE4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.40,
    shadowRadius: 16,
    elevation: 4,
  },
}

// Spacing scale
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 48,
  massive: 64,
}

// Border radius scale
export const radius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 26,
  xxl: 32,
  full: 9999,
}

// Type scale tokens (use in StyleSheet)
export const typography = {
  display2xl: { fontFamily: fonts.display, fontSize: 72, letterSpacing: -3, lineHeight: 72 },
  displayXl:  { fontFamily: fonts.display, fontSize: 56, letterSpacing: -2.5, lineHeight: 58 },
  displayLg:  { fontFamily: fonts.display, fontSize: 44, letterSpacing: -2, lineHeight: 46 },
  displayMd:  { fontFamily: fonts.display, fontSize: 32, letterSpacing: -1, lineHeight: 34 },
  titleXl:    { fontFamily: fonts.bold,     fontSize: 22, letterSpacing: -0.3 },
  titleLg:    { fontFamily: fonts.semibold, fontSize: 18 },
  titleMd:    { fontFamily: fonts.semibold, fontSize: 15 },
  bodyLg:     { fontFamily: fonts.regular,  fontSize: 16 },
  bodyMd:     { fontFamily: fonts.regular,  fontSize: 14 },
  bodySm:     { fontFamily: fonts.regular,  fontSize: 12 },
  labelKey:   { fontFamily: fonts.regular,  fontSize: 11 },
  labelLight: { fontFamily: fonts.light,    fontSize: 11 },
  labelCap:   { fontFamily: fonts.bold,     fontSize: 11, letterSpacing: 1.8, textTransform: 'uppercase' as const },
  button:     { fontFamily: fonts.semibold, fontSize: 14, letterSpacing: 0.2 },
  badge:      { fontFamily: fonts.semibold, fontSize: 11, letterSpacing: 0.3 },
  monoXl:     { fontFamily: fonts.mono,     fontSize: 24, letterSpacing: -0.5 },
  monoLg:     { fontFamily: fonts.mono,     fontSize: 18 },
  monoMd:     { fontFamily: fonts.mono,     fontSize: 14 },
  monoSm:     { fontFamily: fonts.mono,     fontSize: 12 },
}
```

### 14.2 Usage Example — Yellow Hero Card

```tsx
import { View, Text } from 'react-native'
import { colors, shadows, radius, spacing, typography } from './theme'

export const YellowHeroCard = ({ label, value, sub }) => (
  <View style={{
    backgroundColor: colors.accentYellow,
    borderRadius: radius.xl,
    padding: spacing.lg,
    ...shadows.yellowCard,
  }}>
    <Text style={{
      ...typography.labelCap,
      color: colors.textOnYellow,
      opacity: 0.55,
      marginBottom: spacing.md,
    }}>
      {label}
    </Text>
    <Text style={{
      ...typography.displayXl,
      color: colors.textOnYellow,
    }}>
      {value}
    </Text>
    <Text style={{
      ...typography.bodySm,
      color: colors.textOnYellow,
      opacity: 0.6,
      marginTop: spacing.xs,
    }}>
      {sub}
    </Text>
  </View>
)
```

---

## 15. Asset Requirements

```
App Icon:
  Size:           1024×1024px
  Background:     navy #030334
  Foreground:     sky blue "C" wordmark or Clarifin logomark
  Style:          clean, minimal, no gradients on icon

Splash Screen:
  Background:     sky gradient (EBF4FF → E8F2FF)
  Center:         Clarifin logomark with fade-in animation
  No text:        logo only on splash

Play Store Feature Graphic:
  Size:           1024×500px
  Show:           yellow hero card + white instrument cards on sky gradient
  Theme:          light, airy — looks premium in store listing

Empty States:
  Style:          minimal line-art illustration, navy + sky blue tones
  Custom:         one per screen for relevant context

Onboarding:
  Screens:        3 maximum
  Layout:         white card on sky gradient, one yellow accent per screen
  Typography:    Playfair 900 for big idea, Inter for description

Fonts to bundle:
  - Playfair Display Black (900) — for display text
  - Playfair Display Bold (700) — backup display weight
  - Inter Light (300) — for yellow card muted labels only
  - Inter Regular (400) — body text
  - Inter Medium (500) — value text in two-tier labels
  - Inter SemiBold (600) — titles, buttons, badges
  - Inter Bold (700) — section labels, screen titles
  - DM Mono Medium (500) — all financial numbers
```

---

## 16. Critical Design Patterns Recap

These patterns must be applied consistently — they define the Clarifin look.

### 16.1 The Three Mandatory Card Types Per Home Screen
1. **One yellow hero card** with the most important metric
2. **Multiple white standard cards** for content
3. **At least one navy or blue gradient card** for AI insight or secondary metric

### 16.2 The Two-Tier Label System
Every structured info card uses tiny muted "label:" + bold dark value pattern.
Three column layout for metrics like When/Team/Reminder or Topic/Description/Deadline.

### 16.3 The Bold/Light Contrast Inside Yellow Cards
Heavy Playfair 900 numbers paired with ultra-light Inter 300 labels.
This contrast is signature.

### 16.4 Sky Gradient Always Visible
The app background gradient is never hidden behind a full-screen card.
Padding always leaves the gradient peeking around cards.

### 16.5 Display Number Hierarchy
- Greeting & screen-level number → Playfair 900 (44–72sp)
- Card-level metric → Playfair 900 (32–48sp)
- Table cell / list item → DM Mono (14–18sp)
- Never substitute one for the other

### 16.6 Disclaimer is Hardcoded in UI
The "Educational only" disclaimer below AI responses is rendered by the
frontend, NOT generated by the AI. Even if the AI hallucinates and removes it,
the UI displays it. Non-negotiable for SEBI compliance.

---

*Version 5.0 — Final · Swiss Modern with Editorial Serif*
*Brand colors: Navy #030334 + Sky Blue #70AAE4*
*Designed May 2026 to match the Misso Swiss UI reference*

*This document is the single source of truth for all Clarifin UI decisions.
Any component, screen, or element not covered here defaults to the nearest
matching specification above. Load this file at the start of every UI
development session in Claude Code, Cursor, or any AI coding assistant.*

# AppFence Figma Design System — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a complete, developer-handoff-ready Figma file for AppFence with 4 pages: Design System, Component Library, Screens, and Design Tokens.

**Architecture:** Modular 4-page Figma file mirroring the spec docs in `docs/design-system/`. Variables are imported from `figma-variables.json` first, then applied throughout. Components are built atomic-design-style (atoms → molecules → organisms) so organisms can reference molecule components. Screens reference organism components.

**Tech Stack:** Figma (figma.com), Figma Variables plugin (free, by Figma), `docs/design-system/figma-variables.json` for token import.

**Spec files:** All values in this plan come from:
- `docs/design-system/design-system.md`
- `docs/design-system/components.md`
- `docs/design-system/screens.md`
- `docs/design-system/tokens-reference.md`
- `docs/design-system/figma-variables.json`

---

## File Structure (Figma pages)

| Page | Purpose |
|------|---------|
| `🎨 Design System` | Color palette, typography specimens, shape system, spacing grid |
| `🧩 Component Library` | 24 components: atoms → molecules → organisms |
| `📱 Screens` | 7 frames: Onboarding, Main (4 states), Settings (2 states) |
| `📦 Design Tokens` | Variables JSON walkthrough + import instructions |

---

## Task 1: Create Figma File and Import Variables

**Files:**
- Create: New Figma file named `AppFence Design System`

- [ ] **Step 1: Create the Figma file**

  Go to figma.com → New design file.
  Rename it: `AppFence Design System`.

- [ ] **Step 2: Create 4 pages in order**

  In the left panel, click `+` next to Pages four times. Name them exactly:
  ```
  🎨 Design System
  🧩 Component Library
  📱 Screens
  📦 Design Tokens
  ```

- [ ] **Step 3: Install the Figma Variables plugin**

  Main menu → Plugins → Browse plugins → search "Variables" → install **"Figma Variables"** by Figma (free).

- [ ] **Step 4: Import the design tokens**

  Main menu → Plugins → Figma Variables → **Import from JSON**.
  Select: `docs/design-system/figma-variables.json`.

  Expected result: 4 collections created in the Variables panel:
  - `Colors` — 22 color variables, "Dark" mode
  - `Typography` — 52 float variables (size/weight/lineHeight/tracking per style)
  - `Spacing` — 9 float variables (4–56)
  - `Radius` — 6 float variables (6–9999)

- [ ] **Step 5: Verify import**

  Open Variables panel (right panel → Local variables).
  Confirm `Colors/primary/default` = `#00E5CC` and `Radius/large` = `16`.

- [ ] **Step 6: Set the file's background color**

  Select the canvas. Set background: `#0D1B2A` (matches `Colors/background/default`).

- [ ] **Step 7: Commit progress note**

  Add a sticky note on page `🎨 Design System`:
  ```
  AppFence Design System v1.0
  Variables imported from figma-variables.json
  Dark theme only | Material Design 3
  Source: /docs/design-system/
  ```

---

## Task 2: Build Page 1 — Design System (Color Section)

**Page:** `🎨 Design System`

- [ ] **Step 1: Create a frame for the color section**

  On `🎨 Design System`, press `F` → draw a frame.
  Name: `Color Palette`. Size: `1200 × 900`. Fill: `#0D1B2A`.

- [ ] **Step 2: Add section label**

  Text: `COLOR PALETTE` | Font: Inter Bold | Size: 11 | Color: `#B0BEC5` | Letter spacing: 100% | All caps.

- [ ] **Step 3: Create Primary group — 4 swatches**

  For each token, create a `160 × 80` rectangle + label below. Apply fill via variable:

  | Swatch label | Variable | Hex |
  |-------------|---------|-----|
  | `primary/default` | `Colors/primary/default` | `#00E5CC` |
  | `primary/variant` | `Colors/primary/variant` | `#00BFA5` |
  | `primary/dark` | `Colors/primary/dark` | `#009688` |
  | `primary/on` | `Colors/primary/on` | `#003731` |

  Each swatch: `160 × 60` rect + Text below showing name + hex. Corner radius: `8`.
  Group into Auto Layout row, gap: `12`. Label group: `Primary (Teal)`.

- [ ] **Step 4: Create Secondary group — 3 swatches**

  Same pattern, 3 swatches:
  | Label | Variable | Hex |
  |-------|---------|-----|
  | `secondary/default` | `Colors/secondary/default` | `#64B5F6` |
  | `secondary/variant` | `Colors/secondary/variant` | `#42A5F5` |
  | `secondary/on` | `Colors/secondary/on` | `#0D1B2A` |

  Group: `Secondary (Electric Blue)`.

- [ ] **Step 5: Create Background/Surface group — 4 swatches**

  | Label | Variable | Hex |
  |-------|---------|-----|
  | `background/default` | `Colors/background/default` | `#0D1B2A` |
  | `surface/default` | `Colors/surface/default` | `#1B2838` |
  | `surface/variant` | `Colors/surface/variant` | `#243447` |
  | `surface/elevated` | `Colors/surface/elevated` | `#2C3E50` |

  Add 1px border (`#37474F`) to `background/default` swatch so it's visible against canvas.
  Group: `Background & Surface`.

- [ ] **Step 6: Create Status Colors group — 4 swatches**

  | Label | Variable | Hex |
  |-------|---------|-----|
  | `status/allowed` | `Colors/status/allowed` | `#4CAF50` |
  | `status/wifi-only` | `Colors/status/wifi-only` | `#42A5F5` |
  | `status/data-only` | `Colors/status/data-only` | `#FF9800` |
  | `status/blocked` | `Colors/status/blocked` | `#EF5350` |

  Group: `Status Colors (Semantic)`.

- [ ] **Step 7: Create Utility group — 4 swatches**

  | Label | Variable | Hex |
  |-------|---------|-----|
  | `utility/error` | `Colors/utility/error` | `#CF6679` |
  | `utility/divider` | `Colors/utility/divider` | `#37474F` |
  | `utility/shimmer-base` | `Colors/utility/shimmer-base` | `#1B2838` |
  | `utility/shimmer-highlight` | `Colors/utility/shimmer-highlight` | `#2C3E50` |

  Group: `Utility`.

- [ ] **Step 8: Arrange all groups vertically**

  Stack: Primary → Secondary → Background/Surface → Status → Utility.
  Vertical gap: `40`. Left-align all groups. Add group labels as `12sp / Bold / #E0E0E0` headings.

---

## Task 3: Build Page 1 — Design System (Typography Section)

**Page:** `🎨 Design System`

- [ ] **Step 1: Create Typography frame**

  Frame name: `Typography Scale`. Size: `1200 × 1000`. Fill: `#0D1B2A`. Place to the right of Color Palette frame (gap: 64).

- [ ] **Step 2: Add 13 text style specimens**

  For each style, create one row: `[Style name label] [Specimen text]`.
  Use the font sizes, weights, and colors below. Apply Inter as the font (closest to system SansSerif for Figma):

  | Style | Specimen text | Size | Weight | Line H | Color |
  |-------|--------------|------|--------|--------|-------|
  | displayLarge | "Welcome to AppFence" | 32 | Bold | 40 | `#00E5CC` |
  | headlineLarge | "Network Firewall" | 28 | Bold | 36 | `#E0E0E0` |
  | headlineMedium | "App Permissions" | 24 | SemiBold | 32 | `#E0E0E0` |
  | headlineSmall | "VPN Settings" | 20 | SemiBold | 28 | `#E0E0E0` |
  | titleLarge | "AppFence" | 18 | SemiBold | 26 | `#E0E0E0` |
  | titleMedium | "Block new apps by default" | 16 | Medium | 24 | `#E0E0E0` |
  | titleSmall | "Camera" | 14 | Medium | 20 | `#E0E0E0` |
  | bodyLarge | "Control which apps can access the internet" | 16 | Regular | 24 | `#E0E0E0` |
  | bodyMedium | "No root required" | 14 | Regular | 20 | `#B0BEC5` |
  | bodySmall | "com.android.camera2" | 12 | Regular | 16 | `#B0BEC5` |
  | labelLarge | "GRANT VPN PERMISSION" | 14 | Medium | 20 | `#003731` |
  | labelMedium | "Allowed" | 12 | Medium | 16 | `#4CAF50` |
  | labelSmall | "A system dialog will appear" | 10 | Medium | 14 | `#B0BEC5` |

  Each row: Auto Layout, horizontal, gap 24. Label in `#37474F`, specimen in specified color.

- [ ] **Step 3: Publish all 13 as Figma Text Styles**

  Right-click each specimen text → Create style → name exactly as in the table (e.g. `displayLarge`, `bodySmall`).

---

## Task 4: Build Page 1 — Design System (Shapes & Spacing)

**Page:** `🎨 Design System`

- [ ] **Step 1: Create Shape System frame**

  Frame name: `Shape System`. Size: `800 × 200`. Fill: `#0D1B2A`. Place below Typography frame.

  Create 6 rectangles `80 × 80`, each with fill `#243447`, applying these corner radii:

  | Label | Radius | Variable |
  |-------|--------|---------|
  | xsmall | 6 | `Radius/xsmall` |
  | small | 12 | `Radius/small` |
  | medium | 14 | `Radius/medium` |
  | large | 16 | `Radius/large` |
  | xlarge | 20 | `Radius/xlarge` |
  | full | 40 (circle) | `Radius/full` |

  Label each below: style name + dp value. Auto Layout row, gap 16.

- [ ] **Step 2: Create Spacing System frame**

  Frame name: `Spacing System`. Size: `800 × 300`. Fill: `#0D1B2A`. Place below Shape System.

  Create 9 horizontal bars showing spacing values. Each bar: `height = spacing value × 2px`, `width = 40`, fill `#00E5CC33`, stroke `1px #00E5CC`.

  | Label | Value | Variable |
  |-------|-------|---------|
  | spacing/1 | 4dp | `Spacing/1` |
  | spacing/2 | 8dp | `Spacing/2` |
  | spacing/3 | 12dp | `Spacing/3` |
  | spacing/4 | 16dp | `Spacing/4` |
  | spacing/5 | 20dp | `Spacing/5` |
  | spacing/6 | 24dp | `Spacing/6` |
  | spacing/8 | 32dp | `Spacing/8` |
  | spacing/12 | 48dp | `Spacing/12` |
  | spacing/14 | 56dp | `Spacing/14` |

  Row below each bar: label + dp value in `bodySmall / #B0BEC5`.

---

## Task 5: Build Page 2 — Atoms (Component Library)

**Page:** `🧩 Component Library`

- [ ] **Step 1: Create the Atoms section frame**

  Frame name: `Atoms`. Size: `1400 × 600`. Fill: `#0D1B2A`.

- [ ] **Step 2: Create `App Icon / Square` component**

  Draw `192 × 192` frame. Corner radius: `38` (scaled from 32dp at 192px).
  Apply background gradient: Left→Right, `#0A1628` → `#1B5CD6`.
  Import `app/src/main/res/mipmap-xxxhdpi/ic_launcher.png` → place inside frame.
  Select frame → right-click → **Create component**. Name: `App Icon / Square`.

- [ ] **Step 3: Create `App Icon / Round` component**

  Same steps but import `ic_launcher_round.png`. Apply circular clip (Clip content on circle shape).
  Component name: `App Icon / Round`.

- [ ] **Step 4: Create `StatusBadge` component with 4 variants**

  Create a base component: Auto Layout `horizontal`, padding `2 × 8`, gap `4`, corner radius `6`.
  Text: `labelMedium` (12sp, Medium).

  Use **Component Properties** → add variant property `Status` with 4 values:

  | Variant | Text | Fill (13% opacity) | Text color |
  |---------|------|--------------------|------------|
  | Allowed | "Allowed" | `#4CAF50` | `#4CAF50` |
  | Wi-Fi Only | "Wi-Fi Only" | `#42A5F5` | `#42A5F5` |
  | Data Only | "Data Only" | `#FF9800` | `#FF9800` |
  | Blocked | "Blocked" | `#EF5350` | `#EF5350` |

  Component name: `StatusBadge`.

- [ ] **Step 5: Create `Button / Primary` component**

  Frame: Auto Layout horizontal, height `56`, horizontal padding `24`, fill `#00E5CC`, corner radius `14`.
  Text: "Grant VPN Permission", `labelLarge`, color `#003731`.
  Width: fixed, but mark as `Fill container` for use in screens.
  Component name: `Button / Primary`.

- [ ] **Step 6: Create `Button / Outlined` component**

  Frame: same size as Primary. Fill: none. Stroke: `1px #EF5350`. Corner radius `14`.
  Text: "Stop VPN", `labelLarge`, color `#EF5350`.
  Component name: `Button / Outlined`.

- [ ] **Step 7: Create `Icon Button` component with 3 variants**

  Frame: `48 × 48`, fill none. Center an icon glyph `24 × 24`.
  Variant property `Type`: Search | Settings | Back.
  Icon color: `#B0BEC5` for all.
  Component name: `Icon Button`.

- [ ] **Step 8: Create `Toggle Switch` component with 2 variants**

  Create pill shape `32 × 16`, corner radius `8`.

  | Variant | Track fill | Thumb position | Thumb fill |
  |---------|-----------|---------------|------------|
  | On | `#00E5CC` | Right (x=17) | `#FFFFFF` |
  | Off | `#37474F` | Left (x=2) | `#B0BEC5` |

  Thumb: `12 × 12` circle. Place inside pill.
  Variant property `State`: On | Off.
  Component name: `Toggle Switch`.

- [ ] **Step 9: Create `Divider` component**

  Line: `400 × 1`, fill `#37474F`. Component name: `Divider`. Width: `Fill container`.

- [ ] **Step 10: Create `App Icon In-List` component**

  Frame: `44 × 44`, corner radius `12`, fill `#243447`.
  Add placeholder icon (grid icon, `24 × 24`, `#B0BEC5`) in center.
  Component name: `App Icon / In-List`.

- [ ] **Step 11: Create `Loading Indicator` component**

  Draw circle `40 × 40`, stroke `3px #00E5CC`, no fill, arc visible ~270°.
  Below: Text "Loading apps…", `bodyMedium`, `#B0BEC5`, center aligned, top margin 8.
  Group into Auto Layout vertical, align center.
  Component name: `Loading Indicator`.

- [ ] **Step 12: Create `VPN Status Dot` component with 2 variants**

  Circle `8 × 8`.
  | Variant | Fill |
  |---------|------|
  | Active | `#4CAF50` |
  | Inactive | `#37474F` |
  Component name: `VPN Status Dot`.

- [ ] **Step 13: Create `Search TextField` component**

  Frame: Auto Layout horizontal, height `40`, padding `0 8`, fill transparent, bottom border `1px #37474F`.
  Left: search icon `16 × 16`, `#B0BEC5`.
  Right: placeholder text "Search apps…", `bodyMedium`, `#B0BEC5`.
  Component name: `Search TextField`.

---

## Task 6: Build Page 2 — Molecules

**Page:** `🧩 Component Library`

- [ ] **Step 1: Create `FilterChip` component with 2 variants**

  Frame: Auto Layout horizontal, padding `3 × 10`, corner radius `12`.

  | Variant | Background | Border | Text color |
  |---------|-----------|--------|------------|
  | Selected | `#00E5CC` @ 12% | `1px #00E5CC` | `#00E5CC` |
  | Unselected | `#2C3E50` | `1px #37474F` | `#B0BEC5` |

  Text: `labelMedium` (12sp, Medium).
  Variant property `State`: Selected | Unselected.
  Component name: `FilterChip`.

- [ ] **Step 2: Create `Toggle Row / Compact` component**

  Auto Layout horizontal, gap `4`, align center.
  Left: icon placeholder `16 × 16`.
  Right: instance of `Toggle Switch` (scaled 0.7 → set to `22 × 11` frame).
  Component name: `Toggle Row / Compact`.

- [ ] **Step 3: Create `Settings Toggle Row` component**

  Auto Layout horizontal, height `56`, padding `0 16`, gap `12`, fill transparent.
  - Icon container: `24 × 24` circle, fill `#243447`, icon `12 × 12` centered.
  - Text column: Auto Layout vertical, gap `2`. Title: `titleSmall / #E0E0E0`. Subtitle: `bodySmall / #B0BEC5`.
  - Spacer: flex grow.
  - Toggle Switch instance.
  Component name: `Settings Toggle Row`.

- [ ] **Step 4: Create `Feature Bullet` component**

  Frame: Auto Layout horizontal, padding `10 12`, gap `10`, corner radius `12`, fill `#1B2838`.
  Left: icon `24 × 24`.
  Right: Auto Layout vertical, gap `2`. Title: `titleSmall / #E0E0E0`. Description: `bodySmall / #B0BEC5`.
  Component name: `Feature Bullet`.

- [ ] **Step 5: Create `Network Status Bar` component with 2 variants**

  Frame: Auto Layout horizontal, height `36`, padding `8 12`, gap `8`, align center.

  | Variant | Background |
  |---------|-----------|
  | Active | Linear gradient `#00E5CC` → `#64B5F6` @ 12% opacity |
  | Inactive | Fill `#1B2838` |

  Contents: VPN Status Dot instance | Text "VPN Active" (`bodySmall / #E0E0E0`) | Spacer | Wi-Fi icon `16 × 16` | Text "Wi-Fi" (`bodySmall / #64B5F6`).
  Variant property `VPN State`: Active | Inactive.
  Component name: `Network Status Bar`.

- [ ] **Step 6: Create `Shield Icon Container` component with 2 variants**

  | Variant | Size | Gradient |
  |---------|------|---------|
  | Onboarding | `64 × 64` circle | Radial `#00E5CC33` → transparent |
  | Settings | `72 × 72` circle | Diagonal `#00E5CC` → `#64B5F6` @ 20% |

  Place shield icon `36 × 36` centered inside.
  Variant property `Context`: Onboarding | Settings.
  Component name: `Shield Icon Container`.

---

## Task 7: Build Page 2 — Organisms

**Page:** `🧩 Component Library`

- [ ] **Step 1: Create `AppListItem` component with 4 variants**

  Frame: Auto Layout horizontal, padding `8 12`, gap `8`, align center, corner radius `16`, fill `#1B2838`.

  Left → right:
  1. `App Icon / In-List` instance (`44 × 44`)
  2. Auto Layout vertical, gap `2`, flex grow: Title `titleSmall / #E0E0E0` + Subtitle `bodySmall / #B0BEC5`
  3. `StatusBadge` instance
  4. `Toggle Row / Compact` instance (Wi-Fi)
  5. `Toggle Row / Compact` instance (Data)

  Add variant property `Status`: Allowed | Wi-Fi Only | Data Only | Blocked.

  | Variant | StatusBadge | Wi-Fi toggle | Data toggle | Opacity |
  |---------|------------|-------------|-------------|---------|
  | Allowed | Allowed | On | On | 100% |
  | Wi-Fi Only | Wi-Fi Only | On | Off | 100% |
  | Data Only | Data Only | Off | On | 100% |
  | Blocked | Blocked | Off | Off | 70% |

  Component name: `AppListItem`.

- [ ] **Step 2: Create `Filter Bar` component**

  Frame: Auto Layout horizontal, padding `8 12`, gap `6`, fill transparent. Clip content off (scrollable implied).
  Add 4 `FilterChip` instances: "All" (Selected), "User Apps", "System", "Blocked" (all Unselected).
  Component name: `Filter Bar`.

- [ ] **Step 3: Create `TopAppBar / Main` component**

  Frame: Auto Layout horizontal, height `56`, padding `0 16`, gap `8`, fill `#0D1B2A`, align center.
  - Teal rect logo: `18 × 14`, fill `#00E5CC`, corner radius `3`.
  - Text "AppFence": `titleLarge / #E0E0E0`.
  - Spacer: flex grow.
  - `Icon Button` instance (Search).
  - `Icon Button` instance (Settings).
  Component name: `TopAppBar / Main`.

- [ ] **Step 4: Create `TopAppBar / Settings` component**

  Frame: Auto Layout horizontal, height `56`, padding `0 16`, gap `8`, fill `#0D1B2A`, align center.
  - `Icon Button` instance (Back).
  - Text "Settings": `titleLarge / #E0E0E0`.
  Component name: `TopAppBar / Settings`.

- [ ] **Step 5: Create `VPN Status Card` component with 2 variants**

  Frame: Auto Layout vertical, padding `20 16`, gap `8`, corner radius `20`, fill `#1B2838`, align center.
  - `Shield Icon Container` instance (Settings, 72dp).
  - Text: `headlineSmall / #E0E0E0` — "Protection Active" or "Protection Off".
  - Row: `VPN Status Dot` + Text `bodySmall / #B0BEC5` "Wi-Fi Connected".
  - Button: Primary ("Start VPN") or Outlined ("Stop VPN").

  Variant property `VPN State`: Active | Inactive.
  Component name: `VPN Status Card`.

- [ ] **Step 6: Create `Preferences Card` component**

  Frame: Auto Layout vertical, padding `0`, corner radius `20`, fill `#1B2838`.
  - `Settings Toggle Row` instance — Lock icon, "Block new apps by default", "Restrict by default".
  - `Divider` instance.
  - `Settings Toggle Row` instance — Refresh icon, "Start on boot", "Auto-start VPN".
  Component name: `Preferences Card`.

- [ ] **Step 7: Create `About Card` component**

  Frame: Auto Layout horizontal, padding `16`, gap `12`, corner radius `20`, fill `#1B2838`, align center.
  - Icon container: `28 × 28` circle, fill `#243447`, info icon `14 × 14` centered.
  - Auto Layout vertical, gap `2`:
    - Text "AppFence v1.0.0": `titleMedium / #E0E0E0`.
    - Text "Per-app network firewall · No root required": `bodySmall / #B0BEC5`.
  Component name: `About Card`.

---

## Task 8: Build Page 3 — Onboarding Screen Frame

**Page:** `📱 Screens`

- [ ] **Step 1: Create Onboarding frame**

  Press `F`. Draw frame `360 × 780`. Name: `Onboarding / Default`. Fill: `#0D1B2A`.

- [ ] **Step 2: Add status bar placeholder**

  Rectangle `360 × 24`, fill `#0D1B2A`. Add text "9:41" right-aligned, `labelSmall / #B0BEC5`.

- [ ] **Step 3: Add Shield Icon Container**

  Instance of `Shield Icon Container / Onboarding`. Center horizontally. Top: 80.

- [ ] **Step 4: Add headline**

  Text: "Welcome to AppFence". Style: `displayLarge` (32/40, Bold). Color: `#E0E0E0`. Center aligned.
  Position: Y = 176. Width: 312 (screen width − 48dp padding).

- [ ] **Step 5: Add subtitle**

  Text: "Control which apps can access the internet — no root required."
  Style: `bodyLarge` (16/24). Color: `#B0BEC5`. Center aligned.
  Position: Y = 224. Width: 312.

- [ ] **Step 6: Add 2 Feature Bullet instances**

  Instance 1: Y = 272. VPN key icon. Title: "Local VPN". Description: "Traffic filtered on-device. Nothing sent to external servers."
  Instance 2: Y = 350. Shield icon. Title: "Per-App Control". Description: "Set Wi-Fi and mobile data access per app, independently."
  Width: 312. Left: 24.

- [ ] **Step 7: Add Primary Button**

  Instance of `Button / Primary`. Text: "Grant VPN Permission".
  Y = 456. Width: 312. Left: 24.

- [ ] **Step 8: Add disclaimer text**

  Text: "A system dialog will appear to approve the VPN connection."
  Style: `labelSmall` (10/14). Color: `#B0BEC5`, opacity 60%. Center aligned.
  Y = 520. Width: 312.

- [ ] **Step 9: Verify layout**

  All elements should be within the 24dp horizontal margin. Scroll-check: total content height ~540dp, well within 780dp frame.

---

## Task 9: Build Page 3 — Main Screen Frames

**Page:** `📱 Screens`

- [ ] **Step 1: Create `Main / Default (VPN On)` frame**

  Frame: `360 × 780`. Fill: `#0D1B2A`. Name: `Main / Default (VPN On)`.

- [ ] **Step 2: Add TopAppBar / Main instance**

  Y = 24 (below status bar). Width: 360.

- [ ] **Step 3: Add Network Status Bar instance (Active)**

  Instance of `Network Status Bar / Active`. Y = 80. Width: 360.

- [ ] **Step 4: Add Filter Bar instance**

  Y = 116. Width: 360. Left: 12.

- [ ] **Step 5: Add 4 AppListItem instances (one per status)**

  All width: 336 (360 − 24dp). Left: 12. Gap: 6.

  | Y pos | Variant | App name | Package |
  |-------|---------|----------|---------|
  | 162 | Allowed | "Camera" | "com.android.camera2" |
  | 228 | Blocked | "Music" | "com.android.music" |
  | 294 | Wi-Fi Only | "Maps" | "com.google.maps" |
  | 360 | Data Only | "Email" | "com.android.email" |

  Add 2 more faded items below (opacity 30%) to imply scrollability.

- [ ] **Step 6: Duplicate frame → rename `Main / Search Active`**

  In the duplicate:
  - Replace TopAppBar title + search icon with `Search TextField` instance (inline, width filling).
  - Show keyboard placeholder: gray rectangle `360 × 300` at bottom, fill `#1B2838`.

- [ ] **Step 7: Duplicate frame → rename `Main / Loading State`**

  Remove app list items. Replace with:
  - `Loading Indicator` instance, centered at Y = 400.

- [ ] **Step 8: Duplicate frame → rename `Main / Empty State`**

  Remove app list items. Replace with:
  - Text "No apps found", `bodyLarge / #B0BEC5`, centered at Y = 400.

---

## Task 10: Build Page 3 — Settings Screen Frames

**Page:** `📱 Screens`

- [ ] **Step 1: Create `Settings / VPN On` frame**

  Frame: `360 × 780`. Fill: `#0D1B2A`. Name: `Settings / VPN On`.

- [ ] **Step 2: Add TopAppBar / Settings instance**

  Y = 24. Width: 360.

- [ ] **Step 3: Add VPN Status Card / Active instance**

  Y = 88. Width: 328. Left: 16.

- [ ] **Step 4: Add Preferences Card instance**

  Y = 288. Width: 328. Left: 16.

- [ ] **Step 5: Add About Card instance**

  Y = 408. Width: 328. Left: 16.

- [ ] **Step 6: Duplicate → rename `Settings / VPN Off`**

  Swap `VPN Status Card / Active` → `VPN Status Card / Inactive`.
  Title becomes "Protection Off". Button becomes `Button / Primary` "Start VPN".

---

## Task 11: Build Page 4 — Design Tokens Reference

**Page:** `📦 Design Tokens`

- [ ] **Step 1: Create intro frame**

  Frame: `1200 × 200`. Name: `Import Instructions`. Fill: `#0D1B2A`.
  Add text block (copy from `docs/design-system/tokens-reference.md` → "How to Import into Figma" section).
  Style: `bodyMedium / #E0E0E0`.

- [ ] **Step 2: Create Collection Structure frame**

  Frame: `1200 × 800`. Name: `Variable Collections`.
  Create 4 column groups, one per collection (Colors, Typography, Spacing, Radius).
  Each group: monospaced text block listing all variable names + values from `figma-variables.json`.
  Background: `#1B2838`, corner radius `12`, padding `20`.

- [ ] **Step 3: Create Android mapping table**

  Frame: `800 × 400`. Name: `Android ↔ Figma Mapping`.
  Reproduce the table from `docs/design-system/tokens-reference.md` → "Android ↔ Figma Token Mapping".
  Use `bodyMedium` text. Table rows: alternating `#1B2838` / `#243447` fill.

- [ ] **Step 4: Add Figma Variables application guide**

  Frame: `800 × 300`. Name: `Applying Variables`.
  Reproduce the "Applying Variables in Figma" table from `tokens-reference.md`.

---

## Task 12: Final Cleanup and Handoff

- [ ] **Step 1: Add component descriptions**

  Select each component in the `🧩 Component Library` page → right panel → add description:
  - Include source file path (e.g., `Source: ui/components/AppListItem.kt`)
  - State the Compose equivalent (e.g., `Compose: Card + Row`)

- [ ] **Step 2: Check all instances link to components**

  In `📱 Screens`, click each element → confirm right panel shows a component instance (not a detached frame).
  Re-attach any detached instances via right-click → Reset instance.

- [ ] **Step 3: Apply Variables to all fills and text**

  For every fill that uses a design token color, bind it to the Variables panel rather than a raw hex:
  - Select element → Fill → click the variable icon → link to appropriate `Colors/*` variable.

- [ ] **Step 4: Export the file for handoff**

  Main menu → File → Save to version history. Message: `v1.0 — Initial design system`.
  Share → set anyone with link → Viewer access.
  Copy the link and paste into `docs/design-system/design-system.md` under a new `## Figma File` section.

- [ ] **Step 5: Final commit**

  ```bash
  git add docs/design-system/design-system.md
  git commit -m "docs: add Figma file link to design system doc"
  ```

---

## Self-Review Checklist

- [x] **Spec coverage:** All 24 components from `components.md` have a creation task. All 7 frames from `screens.md` have a creation task. All 4 Figma pages exist. Color/typography/shape/spacing all covered.
- [x] **Placeholders:** No TBD/TODO. Every step has exact values (hex codes, sizes, names).
- [x] **Consistency:** Component names match exactly across tasks (e.g., `StatusBadge` not `Status Badge`). Instance references in screen tasks match component names defined in Tasks 5–7.
- [x] **Type consistency:** `VPN Status Card / Active` and `VPN Status Card / Inactive` are the variant names used consistently in Tasks 7 and 10.

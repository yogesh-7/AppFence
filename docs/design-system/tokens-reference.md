# AppFence Design Tokens Reference
> Figma Page 4 — Design Tokens

This page explains the structure of `figma-variables.json` and how to import it into Figma.

---

## How to Import into Figma

1. Install the **Figma Variables** plugin (by Figma, free)
2. Open your AppFence Figma file
3. Go to **Plugins → Figma Variables → Import from JSON**
4. Select `docs/design-system/figma-variables.json`
5. All 4 collections will be created with a single "Dark" mode

---

## Collection Structure

### Collection 1 — Colors (16 variables)

```
Colors/
├─ primary/
│   ├─ default      #00E5CC
│   ├─ variant      #00BFA5
│   ├─ dark         #009688
│   └─ on           #003731
├─ secondary/
│   ├─ default      #64B5F6
│   ├─ variant      #42A5F5
│   └─ on           #0D1B2A
├─ background/
│   └─ default      #0D1B2A
├─ surface/
│   ├─ default      #1B2838
│   ├─ variant      #243447
│   └─ elevated     #2C3E50
├─ on-background    #E0E0E0
├─ on-surface       #E0E0E0
├─ on-surface-variant  #B0BEC5
├─ status/
│   ├─ allowed      #4CAF50
│   ├─ wifi-only    #42A5F5
│   ├─ data-only    #FF9800
│   └─ blocked      #EF5350
└─ utility/
    ├─ error        #CF6679
    ├─ divider      #37474F
    ├─ shimmer-base #1B2838
    └─ shimmer-highlight #2C3E50
```

**Type:** COLOR  
**Modes:** Dark (single mode)

---

### Collection 2 — Typography (per-style: size, weight, lineHeight)

```
Typography/
├─ display-large/   size:32  weight:700  lineHeight:40  tracking:-0.5
├─ headline-large/  size:28  weight:700  lineHeight:36
├─ headline-medium/ size:24  weight:600  lineHeight:32
├─ headline-small/  size:20  weight:600  lineHeight:28
├─ title-large/     size:18  weight:600  lineHeight:26
├─ title-medium/    size:16  weight:500  lineHeight:24  tracking:0.15
├─ title-small/     size:14  weight:500  lineHeight:20  tracking:0.10
├─ body-large/      size:16  weight:400  lineHeight:24  tracking:0.5
├─ body-medium/     size:14  weight:400  lineHeight:20  tracking:0.25
├─ body-small/      size:12  weight:400  lineHeight:16  tracking:0.4
├─ label-large/     size:14  weight:500  lineHeight:20  tracking:0.1
├─ label-medium/    size:12  weight:500  lineHeight:16  tracking:0.5
└─ label-small/     size:10  weight:500  lineHeight:14  tracking:0.5
```

**Type:** FLOAT  
Each style has 3–4 variables: `size`, `weight`, `lineHeight`, `letterSpacing`

---

### Collection 3 — Spacing (9 variables)

```
Spacing/
├─ 1    4
├─ 2    8
├─ 3    12
├─ 4    16
├─ 5    20
├─ 6    24
├─ 8    32
├─ 12   48
└─ 14   56
```

**Type:** FLOAT (dp values)

---

### Collection 4 — Radius (6 variables)

```
Radius/
├─ xsmall   6
├─ small     12
├─ medium    14
├─ large     16
├─ xlarge    20
└─ full      9999
```

**Type:** FLOAT (dp values)

---

## Applying Variables in Figma

| Figma property | Variable to apply |
|---------------|------------------|
| Fill (background) | `Colors/background/default` |
| Fill (card) | `Colors/surface/default` |
| Fill (elevated card) | `Colors/surface/variant` |
| Fill (CTA button) | `Colors/primary/default` |
| Text (primary) | `Colors/on-background` |
| Text (secondary) | `Colors/on-surface-variant` |
| Corner radius (card) | `Radius/large` |
| Corner radius (button) | `Radius/medium` |
| Padding (screen edge) | `Spacing/4` |
| Gap (between items) | `Spacing/2` |

---

## Android ↔ Figma Token Mapping

| Android | Figma Variable |
|---------|---------------|
| `Color(0xFF00E5CC)` | `Colors/primary/default` |
| `Color(0xFF0D1B2A)` | `Colors/background/default` |
| `Color(0xFF1B2838)` | `Colors/surface/default` |
| `MaterialTheme.typography.titleLarge` | `Typography/title-large/*` |
| `RoundedCornerShape(16.dp)` | `Radius/large` |
| `16.dp` padding | `Spacing/4` |
| `56.dp` button height | `Spacing/14` |

# AppFence Design System
> Figma Page 1 — Design System

Extracted from `Color.kt`, `Type.kt`, and `Theme.kt`. Dark-theme only. Material Design 3.

---

## Color Palette

### Primary (Teal)
| Token | Hex | Usage |
|-------|-----|-------|
| `primary/default` | `#00E5CC` | CTAs, accents, active toggles |
| `primary/variant` | `#00BFA5` | Pressed / hover state |
| `primary/dark` | `#009688` | Deep teal, gradient end |
| `primary/on` | `#003731` | Text/icon on primary surfaces |

### Secondary (Electric Blue)
| Token | Hex | Usage |
|-------|-----|-------|
| `secondary/default` | `#64B5F6` | Wi-Fi only status, network type label |
| `secondary/variant` | `#42A5F5` | Darker blue variant |
| `secondary/on` | `#0D1B2A` | Text/icon on secondary surfaces |

### Background & Surface (Deep Navy)
| Token | Hex | Usage |
|-------|-----|-------|
| `background/default` | `#0D1B2A` | Primary canvas, screen background |
| `surface/default` | `#1B2838` | Cards, containers |
| `surface/variant` | `#243447` | Elevated sections, chip backgrounds |
| `surface/elevated` | `#2C3E50` | Highest contrast surface, shimmer highlight |
| `on-background` | `#E0E0E0` | Primary text on background |
| `on-surface` | `#E0E0E0` | Primary text on surface |
| `on-surface/variant` | `#B0BEC5` | Secondary/dimmed text |

### Status Colors (Semantic)
| Token | Hex | Meaning |
|-------|-----|---------|
| `status/allowed` | `#4CAF50` | App has full network access |
| `status/wifi-only` | `#42A5F5` | Wi-Fi access only |
| `status/data-only` | `#FF9800` | Mobile data access only |
| `status/blocked` | `#EF5350` | No network access |

### Utility
| Token | Hex | Usage |
|-------|-----|-------|
| `utility/error` | `#CF6679` | Error states |
| `utility/divider` | `#37474F` | Separators, borders |
| `utility/shimmer-base` | `#1B2838` | Loading shimmer base |
| `utility/shimmer-highlight` | `#2C3E50` | Loading shimmer highlight |

---

## Typography

**Font Family:** `FontFamily.SansSerif` (system default sans-serif)

| Style | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| `displayLarge` | 32sp | Bold (700) | 40sp | -0.5sp | Onboarding headline |
| `headlineLarge` | 28sp | Bold (700) | 36sp | — | Section headers |
| `headlineMedium` | 24sp | SemiBold (600) | 32sp | — | Card titles |
| `headlineSmall` | 20sp | SemiBold (600) | 28sp | — | Sub-section headers |
| `titleLarge` | 18sp | SemiBold (600) | 26sp | — | TopAppBar title |
| `titleMedium` | 16sp | Medium (500) | 24sp | +0.15sp | Card titles |
| `titleSmall` | 14sp | Medium (500) | 20sp | +0.10sp | App name in list item |
| `bodyLarge` | 16sp | Regular (400) | 24sp | +0.5sp | Onboarding body text |
| `bodyMedium` | 14sp | Regular (400) | 20sp | +0.25sp | General body text |
| `bodySmall` | 12sp | Regular (400) | 16sp | +0.4sp | Package names, captions |
| `labelLarge` | 14sp | Medium (500) | 20sp | +0.1sp | Button labels |
| `labelMedium` | 12sp | Medium (500) | 16sp | +0.5sp | Status badge text |
| `labelSmall` | 10sp | Medium (500) | 14sp | +0.5sp | Disclaimer text |

---

## Shape System

| Token | Value | Usage |
|-------|-------|-------|
| `shape/xsmall` | `6dp` rounded | StatusBadge, labels |
| `shape/small` | `12dp` rounded | FilterChip, App icon container, FeatureBullet |
| `shape/medium` | `14dp` rounded | Buttons (Primary, Outlined) |
| `shape/large` | `16dp` rounded | AppListItem card |
| `shape/xlarge` | `20dp` rounded | Settings cards (VPN Status, Preferences, About) |
| `shape/full` | `CircleShape` (9999dp) | VPN status dot, icon containers, toggle switch |

---

## Spacing System

**Base unit:** 4dp

| Token | Value | Usage |
|-------|-------|-------|
| `spacing/1` | 4dp | Icon-label gap, tight padding |
| `spacing/2` | 8dp | Internal card padding, chip padding vertical |
| `spacing/3` | 12dp | Component internal padding |
| `spacing/4` | 16dp | Standard horizontal margin, screen edge padding |
| `spacing/5` | 20dp | Section spacing |
| `spacing/6` | 24dp | Card padding |
| `spacing/8` | 32dp | Large section gaps |
| `spacing/12` | 48dp | Screen vertical rhythm |
| `spacing/14` | 56dp | Primary button height |

**Grid:** 360dp minimum width, 16dp horizontal margins.

---

## Elevation & Shadows

All surfaces use **flat design** (elevation 0dp). Depth is conveyed through surface color steps:
- `background/default` → `surface/default` → `surface/variant` → `surface/elevated`

No Material shadows are applied. Gradient overlays (radial/linear) provide visual depth on:
- Onboarding shield icon (radial glow)
- NetworkStatusBar (horizontal gradient)
- VPN Status Card shield container (diagonal gradient)
- App icon background (diagonal gradient)

---

## App Icon (Proposed New Design)

### Visual Elements
- **Outer shield:** Light blue (`#6AB4FF`) stroke with glow, semi-transparent fill
- **Inner shield:** Dark navy (`#0D2A5E`) fill, `#4A9EFF` stroke
- **Wi-Fi arcs:** 3 curved arcs + center dot, white (`#FFFFFF`)
- **Orange slash:** Diagonal band bottom-left → top-right, `#E06000` → `#FFA500` gradient
- **Padlock:** Steel blue-gray (`#B0C4DE`), centered on shield
- **Wordmark:** "AppFence" bold white below shield
- **Background:** Deep navy → medium blue gradient (`#0A1628` → `#1B5CD6`)
- **Border effect:** Blue glow (`#4A9EFF` radial)

### Variants
| Variant | Shape | File |
|---------|-------|------|
| Adaptive square | 32dp corner radius | `ic_launcher.png` |
| Round | Circle (full radius) | `ic_launcher_round.png` |

### Density Map
| Density | Size | Folder |
|---------|------|--------|
| mdpi | 48×48px | `mipmap-mdpi/` |
| hdpi | 72×72px | `mipmap-hdpi/` |
| xhdpi | 96×96px | `mipmap-xhdpi/` |
| xxhdpi | 144×144px | `mipmap-xxhdpi/` |
| xxxhdpi | 192×192px | `mipmap-xxxhdpi/` |
| Play Store | 512×512px | High-res asset |

---

## Theme Configuration

- **Mode:** Dark only (`forceDarkTheme = true`)
- **Status bar:** `background/default` (`#0D1B2A`), icons light
- **Navigation bar:** `background/default` (`#0D1B2A`), icons light
- **Material version:** Material Design 3 (`androidx.compose.material3`)
- **Compose BOM:** `2024.12.01`

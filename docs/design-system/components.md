# AppFence Component Library
> Figma Page 2 — Component Library

Organized by atomic design: Atoms → Molecules → Organisms. Each entry lists source file, props/variants, and Android/Compose mapping.

---

## ⚛️ Atoms

### 1. App Icon (Launcher)
**File:** `mipmap-*/ic_launcher.png`, `ic_launcher_round.png`

| Property | Value |
|----------|-------|
| Variants | Square (adaptive), Round |
| Sizes | 48 / 72 / 96 / 144 / 192 px |
| Background color | `#0D1B2A` (`ic_launcher_background.xml`) |
| Design elements | Shield + Wi-Fi arcs + orange slash + padlock + "AppFence" wordmark |

**Android mapping:** `mipmap` resource, referenced in `AndroidManifest.xml` as `android:icon` and `android:roundIcon`.

---

### 2. StatusBadge
**File:** `ui/components/StatusBadge.kt`

| Variant | Background | Text Color | Label |
|---------|-----------|------------|-------|
| ALLOWED | `#4CAF50` @ 13% | `#4CAF50` | "Allowed" |
| WIFI_ONLY | `#42A5F5` @ 13% | `#42A5F5` | "Wi-Fi Only" |
| DATA_ONLY | `#FF9800` @ 13% | `#FF9800` | "Data Only" |
| BLOCKED | `#EF5350` @ 13% | `#EF5350` | "Blocked" |

- Shape: `6dp` rounded corners (pill)
- Padding: `2dp` vertical, `8dp` horizontal
- Typography: `labelMedium` (12sp, Medium)
- Animation: 300ms tween color transition between variants

**Compose:** `Box` + `Text`, `animateColorAsState(tween(300))`

---

### 3. Primary Button
**File:** `ui/screens/OnboardingScreen.kt`, `SettingsScreen.kt`

| Property | Value |
|----------|-------|
| Background | `primary/default` (`#00E5CC`) |
| Text color | `primary/on` (`#003731`) |
| Height | 56dp |
| Corner radius | 14dp |
| Width | Full width (`fillMaxWidth`) |
| Typography | `labelLarge` (14sp, Medium) |
| Pressed state | `primary/variant` (`#00BFA5`) |

**Compose:** `Button` with custom `colors` and `shape`

---

### 4. Outlined Button
**File:** `ui/screens/SettingsScreen.kt`

| Property | Value |
|----------|-------|
| Border | 1dp, `status/blocked` (`#EF5350`) |
| Text color | `status/blocked` (`#EF5350`) |
| Background | Transparent |
| Corner radius | 14dp |
| Usage | "Stop VPN" action only |

**Compose:** `OutlinedButton` with custom `border` and `colors`

---

### 5. Icon Button
**File:** `ui/screens/MainScreen.kt`, `SettingsScreen.kt`

| Variant | Icon | Action |
|---------|------|--------|
| Search | `Icons.Default.Search` | Toggle search field |
| Settings | `Icons.Default.MoreVert` | Navigate to settings |
| Back | `Icons.AutoMirrored.Default.ArrowBack` | Pop back stack |

- Size: 48dp touch target, 24dp icon
- Background: none (transparent)
- Tint: `on-surface/variant` (`#B0BEC5`)

**Compose:** `IconButton` + `Icon`

---

### 6. Toggle Switch
**File:** `ui/components/AppListItem.kt`, `ui/screens/SettingsScreen.kt`

| State | Track color | Thumb color |
|-------|-------------|-------------|
| ON | `primary/default` (`#00E5CC`) | White |
| OFF | `utility/divider` (`#37474F`) | `on-surface/variant` (`#B0BEC5`) |

- Scale: `0.7f` in AppListItem (compact), `1.0f` in SettingsScreen
- **Compose:** `Switch` with custom `SwitchDefaults.colors()`

---

### 7. Divider
**File:** `ui/screens/SettingsScreen.kt`

- Height: 1dp
- Color: `utility/divider` (`#37474F`)
- **Compose:** `HorizontalDivider`

---

### 8. App Icon (In-List)
**File:** `ui/components/AppListItem.kt`

- Size: 44×44dp
- Corner radius: 12dp
- Renders other apps' `Drawable` via `rememberDrawablePainter`
- Background: `surface/variant` (`#243447`) as fallback

---

### 9. Loading Indicator
**File:** `ui/screens/MainScreen.kt`

- Size: 40dp
- Color: `primary/default` (`#00E5CC`)
- Label: "Loading apps…" in `bodyMedium`, `on-surface/variant`
- **Compose:** `CircularProgressIndicator`

---

### 10. VPN Status Dot
**File:** `ui/screens/MainScreen.kt`, `SettingsScreen.kt`

| State | Color |
|-------|-------|
| Active | `status/allowed` (`#4CAF50`) |
| Inactive | `utility/divider` (`#37474F`) |

- Size: 8×8dp circle

---

### 11. Search TextField
**File:** `ui/screens/MainScreen.kt`

- Background: transparent
- Indicator: none
- Placeholder: "Search apps…" in `on-surface/variant`
- Shown/hidden via `AnimatedVisibility`
- **Compose:** `TextField` with `colors = TextFieldDefaults.colors(...)` all transparent

---

## 🧬 Molecules

### 12. FilterChip
**File:** `ui/components/FilterBar.kt`

| State | Background | Border | Text |
|-------|-----------|--------|------|
| Selected | `primary/default` @ 12% | 1dp `primary/default` | `primary/default` |
| Unselected | `surface/elevated` | 1dp `utility/divider` | `on-surface/variant` |

- Corner radius: 12dp
- Padding: `3dp` vertical, `10dp` horizontal
- Typography: `labelMedium`
- Animation: color animates on selection change
- **Compose:** `FilterChip`

---

### 13. ToggleRow (Compact)
**File:** `ui/components/AppListItem.kt` (internal composable)

Layout: `Icon (tinted) | Switch (0.7x scale)`

| Toggle | Icon | Active tint | Inactive tint |
|--------|------|-------------|---------------|
| Wi-Fi | `Icons.Default.Wifi` | `primary/default` | `utility/divider` |
| Mobile data | `Icons.Default.SignalCellularAlt` | `secondary/default` | `utility/divider` |

---

### 14. SettingsToggleRow
**File:** `ui/screens/SettingsScreen.kt` (internal composable)

Layout: `Icon Container | Title + Subtitle | Switch`

- Icon container: 24dp circle, `surface/variant` background
- Title: `titleSmall` (14sp)
- Subtitle: `bodySmall` (12sp), `on-surface/variant`
- Switch: full scale (1.0x)
- Full width row

---

### 15. FeatureBullet
**File:** `ui/screens/OnboardingScreen.kt` (internal composable)

Layout: `Icon (24dp) | Title + Description`

- Container: `surface/default` background, `12dp` radius, `12dp` padding
- Icon: 24sp emoji/Material icon
- Title: `titleSmall` (14sp, Medium)
- Description: `bodySmall` (12sp), `on-surface/variant`
- Width: full width

---

### 16. NetworkStatusBar
**File:** `ui/screens/MainScreen.kt` (internal composable)

Layout: `VPN Dot | VPN Label | Network Icon | Network Type`

- Background: horizontal gradient `primary/default`→`secondary/default` @ 12% (when active), solid `surface/default` (when inactive)
- Padding: `8dp` vertical, `12dp` horizontal
- VPN label: `bodySmall`, `on-background`
- Network type: `bodySmall`, `secondary/default`

---

### 17. Shield Icon Container
**File:** `ui/screens/OnboardingScreen.kt`, `SettingsScreen.kt`

| Context | Size | Gradient |
|---------|------|---------|
| Onboarding | 64dp | Radial glow, `primary` → transparent |
| Settings card | 72dp | Diagonal, `primary/default` → `secondary/default` @ 20% |

- Shape: Circle
- Inner icon: Shield vector, 36dp (onboarding) / 36dp (settings)

---

## 🏛️ Organisms

### 18. AppListItem
**File:** `ui/components/AppListItem.kt`

Layout (horizontal): `App Icon (44dp) | Name + Package | StatusBadge | ToggleRow(Wi-Fi) | ToggleRow(Data)`

- Card: `surface/default`, `16dp` radius, 0dp elevation
- Horizontal padding: `12dp`, vertical: `8dp`
- App name: `titleSmall` (14sp), single line + ellipsis
- Package: `bodySmall` (12sp), single line + ellipsis, `on-surface/variant`
- Alpha animation: `0.7f` (blocked/inactive) → `1.0f` (active), 300ms tween
- 4 visual variants driven by `AppStatus` enum

---

### 19. FilterBar
**File:** `ui/components/FilterBar.kt`

- Horizontal scrollable `LazyRow`
- 4 `FilterChip` items: ALL, USER, SYSTEM, BLOCKED
- Padding: `8dp` vertical, `12dp` horizontal start
- Gap between chips: `6dp`

---

### 20. TopAppBar — Main
**File:** `ui/screens/MainScreen.kt`

Layout: `[Logo 18×14dp] [Title "AppFence"] [Spacer] [Search IconButton] [Settings IconButton]`

- Background: `background/default`
- Title: `titleLarge` (18sp, SemiBold)
- Logo: teal rounded rectangle (branding mark)
- Search state: `AnimatedVisibility` replaces title with inline `TextField`
- **Compose:** `TopAppBar`

---

### 21. TopAppBar — Settings
**File:** `ui/screens/SettingsScreen.kt`

Layout: `[Back IconButton] [Title "Settings"]`

- Background: `background/default`
- Title: `titleLarge` (18sp, SemiBold)
- No actions
- **Compose:** `TopAppBar`

---

### 22. VPN Status Card
**File:** `ui/screens/SettingsScreen.kt`

Layout (vertical, centered): `Shield Icon Container (72dp) | Status Title | Network Indicator | CTA Button`

- Card: `surface/default`, `20dp` radius
- Status title: `headlineSmall` (20sp, SemiBold)
- Network indicator: VPN dot + label
- CTA: **Primary Button** ("Start VPN") or **Outlined Button** ("Stop VPN", red)

| State | Title | CTA |
|-------|-------|-----|
| Active | "Protection Active" | Outlined "Stop VPN" (red) |
| Inactive | "Protection Off" | Primary "Start VPN" (teal) |

---

### 23. Preferences Card
**File:** `ui/screens/SettingsScreen.kt`

Layout (vertical): `SettingsToggleRow | Divider | SettingsToggleRow`

- Card: `surface/default`, `20dp` radius
- Row 1: Lock icon + "Block new apps by default"
- Row 2: Refresh icon + "Start on boot"

---

### 24. About Card
**File:** `ui/screens/SettingsScreen.kt`

Layout (horizontal): `Info Icon Container (28dp) | Version + Description`

- Card: `surface/default`, `20dp` radius
- Version: `titleMedium` (16sp, Medium)
- Description: `bodySmall` (12sp), `on-surface/variant`
- Content: "AppFence v1.0.0" + "Per-app network firewall"

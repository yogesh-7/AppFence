# AppFence Screen Designs
> Figma Page 3 — Screens

All screens are `360×780dp` (standard Android viewport). Dark theme only. Each section lists the frame name, layout hierarchy, component usage, and spacing annotations.

---

## Screen 1 — Onboarding

**Figma frame:** `Screens/Onboarding/Default`
**Route:** `"onboarding"`
**Source:** `ui/screens/OnboardingScreen.kt`
**Enter animation:** `fadeIn + slideInVertically`, spring (dampingRatio=0.8, stiffness=300), 200ms delay

### Layout Hierarchy

```
Screen (background/default, #0D1B2A)
└─ Column (fillMaxSize, verticalArrangement=SpaceBetween)
   ├─ Spacer (24dp)
   ├─ Box [Shield Icon Container, 64dp circle, radial gradient glow]
   │   └─ Icon (shield vector, 36dp, primary gradient)
   ├─ Spacer (24dp)
   ├─ Text "Welcome to AppFence" [displayLarge, center, on-background]
   ├─ Spacer (8dp)
   ├─ Text [subtitle, bodyLarge, center, on-surface/variant]
   ├─ Spacer (24dp)
   ├─ FeatureBullet [VPN Key icon, "Local VPN", description]
   ├─ Spacer (8dp)
   ├─ FeatureBullet [Shield icon, "Per-App Control", description]
   ├─ Spacer (32dp)
   ├─ Primary Button "Grant VPN Permission" [56dp height, full width]
   ├─ Spacer (12dp)
   └─ Text [disclaimer, labelSmall, center, on-surface/variant @ 60%]
```

### Spacing Annotations
- Screen horizontal padding: `24dp`
- Shield → Title gap: `24dp`
- Title → Subtitle gap: `8dp`
- Subtitle → FeatureBullets gap: `24dp`
- Between FeatureBullets: `8dp`
- FeatureBullets → Button gap: `32dp`
- Button → Disclaimer gap: `12dp`

---

## Screen 2 — Main Screen

### Frame 2a: `Screens/Main/Default (VPN On)`
**Route:** `"main"`
**Source:** `ui/screens/MainScreen.kt`

#### Layout Hierarchy

```
Scaffold (background/default)
├─ TopAppBar [Main variant]
│   ├─ Logo (18×14dp teal rect)
│   ├─ Text "AppFence" [titleLarge]
│   ├─ IconButton [Search]
│   └─ IconButton [Settings → navigate("settings")]
├─ Column
│   ├─ NetworkStatusBar
│   │   ├─ VPN Status Dot (8dp, green)
│   │   ├─ Text "VPN Active" [bodySmall]
│   │   ├─ Network Icon (16dp)
│   │   └─ Text "Wi-Fi" [bodySmall, secondary/default]
│   ├─ FilterBar
│   │   └─ LazyRow: FilterChip × 4 [ALL*, USER, SYSTEM, BLOCKED]
│   └─ LazyColumn [app list]
│       └─ AppListItem × n [each app]
└─ (no FAB, no bottom bar)
```

#### Spacing Annotations
- TopAppBar height: 56dp (Material3 default)
- NetworkStatusBar: `8dp` vertical padding, `12dp` horizontal
- FilterBar: `8dp` vertical padding, `12dp` start, `6dp` chip gap
- AppListItem: `8dp` vertical padding, `12dp` horizontal, `6dp` gap between items
- LazyColumn start padding: `8dp` top

---

### Frame 2b: `Screens/Main/Search Active`
Same as 2a with:
- Title replaced by inline `TextField` via `AnimatedVisibility`
- Search icon replaced by close icon
- Keyboard shown (IME insets applied)

---

### Frame 2c: `Screens/Main/Loading State`
Same structure as 2a, LazyColumn replaced by:
```
Box (fillMaxSize, center)
├─ CircularProgressIndicator (40dp, primary/default)
└─ Text "Loading apps…" [bodyMedium, on-surface/variant, 8dp top]
```

---

### Frame 2d: `Screens/Main/Empty State`
Same structure as 2a, LazyColumn replaced by:
```
Box (fillMaxSize, center)
└─ Text "No apps found" [bodyLarge, on-surface/variant]
```

---

### AppListItem — 4 Status Variants

| Variant | StatusBadge | Wi-Fi toggle | Data toggle | Card alpha |
|---------|-------------|-------------|-------------|------------|
| ALLOWED | Green "Allowed" | ON (teal) | ON (teal) | 1.0 |
| WIFI_ONLY | Blue "Wi-Fi Only" | ON (teal) | OFF (gray) | 1.0 |
| DATA_ONLY | Orange "Data Only" | OFF (gray) | ON (teal) | 1.0 |
| BLOCKED | Red "Blocked" | OFF (gray) | OFF (gray) | 0.7 |

---

## Screen 3 — Settings

### Frame 3a: `Screens/Settings/VPN On`
**Route:** `"settings"`
**Source:** `ui/screens/SettingsScreen.kt`

#### Layout Hierarchy

```
Scaffold (background/default)
├─ TopAppBar [Settings variant]
│   ├─ IconButton [Back arrow → popBackStack()]
│   └─ Text "Settings" [titleLarge]
└─ Column (16dp horizontal padding, 16dp top padding, 12dp gap)
    ├─ VPN Status Card [surface/default, 20dp radius]
    │   ├─ Shield Icon Container (72dp circle, gradient)
    │   │   └─ Icon (shield vector, 36dp)
    │   ├─ Text "Protection Active" [headlineSmall, center]
    │   ├─ Row [VPN Dot (green) + Text network type]
    │   └─ Outlined Button "Stop VPN" [red border+text]
    ├─ Preferences Card [surface/default, 20dp radius]
    │   ├─ SettingsToggleRow [Lock icon, "Block new apps by default", Switch]
    │   ├─ Divider
    │   └─ SettingsToggleRow [Refresh icon, "Start on boot", Switch]
    └─ About Card [surface/default, 20dp radius]
        └─ Row [Info icon container (28dp) + Column[version text, description]]
```

#### Spacing Annotations
- Screen horizontal padding: `16dp`
- Cards gap: `12dp`
- Card internal padding: `16dp`
- Shield container → Title gap: `8dp`
- Title → Network indicator gap: `4dp`
- Network indicator → Button gap: `12dp`
- SettingsToggleRow height: `56dp`
- About card icon size: `28dp` circle, `14dp` icon

---

### Frame 3b: `Screens/Settings/VPN Off`
Same as 3a with VPN Status Card changed:
- Status title: "Protection Off"
- VPN dot: gray (`utility/divider`)
- Network indicator: hidden or "No network"
- CTA: **Primary Button** "Start VPN" (teal, full width)

---

## Navigation Flow

```
App Start
    │
    ├─ onboarding_completed = false
    │       └─► Onboarding/Default
    │               └─ [Grant VPN Permission]
    │                       └─► startVpnService() → completeOnboarding()
    │                                   └─► navigate("main") [clearBackStack]
    │
    └─ onboarding_completed = true
            └─► Main/Default
                    └─ [Settings icon] ──► Settings/VPN On or Off
                                              └─ [Back] ──► Main/Default
```

---

## State Inventory (all Figma frames to create)

| Frame Name | Description |
|------------|-------------|
| `Screens/Onboarding/Default` | Standard first-run screen |
| `Screens/Main/Default (VPN On)` | Active VPN, app list populated |
| `Screens/Main/Search Active` | Search TextField expanded |
| `Screens/Main/Loading State` | Loading spinner, no list |
| `Screens/Main/Empty State` | No apps match filter |
| `Screens/Settings/VPN On` | VPN active, Stop button |
| `Screens/Settings/VPN Off` | VPN inactive, Start button |

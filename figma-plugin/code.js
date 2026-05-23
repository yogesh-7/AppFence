/* eslint-disable */
// AppFence Design System Generator — Figma Plugin
// Builds 4 pages (Design System, Component Library, Screens, Tokens),
// 4 Variable Collections (Colors, Typography, Spacing, Radius), and
// all 7 screen frames at 360x780.
//
// Run: Plugins → Development → "AppFence Design System Generator"
// Run on a NEW empty Figma file. Re-running will create duplicate pages.

(async function main() {
  // dynamic-page mode requires explicit page load before page traversal.
  await figma.loadAllPagesAsync();

  // ── Fonts ─────────────────────────────────────────────────────────────────
  // Material 3 uses the system sans. Inter is Figma's default and matches.
  const FONTS = {
    regular:  { family: "Inter", style: "Regular" },
    medium:   { family: "Inter", style: "Medium" },
    semibold: { family: "Inter", style: "Semi Bold" },
    bold:     { family: "Inter", style: "Bold" },
  };
  for (const f of Object.values(FONTS)) await figma.loadFontAsync(f);
  const FONT_FOR_WEIGHT = { 400: FONTS.regular, 500: FONTS.medium, 600: FONTS.semibold, 700: FONTS.bold };

  // ── Color helpers ─────────────────────────────────────────────────────────
  function hexToRgb(hex) {
    const h = hex.replace("#", "");
    return {
      r: parseInt(h.slice(0, 2), 16) / 255,
      g: parseInt(h.slice(2, 4), 16) / 255,
      b: parseInt(h.slice(4, 6), 16) / 255,
    };
  }
  function solid(hex, opacity) {
    const p = { type: "SOLID", color: hexToRgb(hex) };
    if (opacity != null) p.opacity = opacity;
    return p;
  }
  function linearGradient(stops, angle) {
    // stops: [{ position: 0..1, color: '#hex', opacity?: 0..1 }]
    const a = (angle == null ? 0 : angle) * Math.PI / 180;
    return {
      type: "GRADIENT_LINEAR",
      gradientTransform: [
        [Math.cos(a), Math.sin(a), 0],
        [-Math.sin(a), Math.cos(a), 1]
      ],
      gradientStops: stops.map(s => ({
        position: s.position,
        color: { ...hexToRgb(s.color), a: s.opacity == null ? 1 : s.opacity },
      })),
    };
  }
  function radialGradient(stops) {
    return {
      type: "GRADIENT_RADIAL",
      gradientTransform: [[1, 0, 0], [0, 1, 0]],
      gradientStops: stops.map(s => ({
        position: s.position,
        color: { ...hexToRgb(s.color), a: s.opacity == null ? 1 : s.opacity },
      })),
    };
  }

  // ── Tokens (mirrored from figma-variables.json) ───────────────────────────
  const C = {
    primary:        "#00E5CC",
    primaryVariant: "#00BFA5",
    primaryDark:    "#009688",
    primaryOn:      "#003731",
    secondary:      "#64B5F6",
    secondaryVariant:"#42A5F5",
    secondaryOn:    "#0D1B2A",
    background:     "#0D1B2A",
    surface:        "#1B2838",
    surfaceVariant: "#243447",
    surfaceElevated:"#2C3E50",
    onBackground:   "#E0E0E0",
    onSurface:      "#E0E0E0",
    onSurfaceVariant:"#B0BEC5",
    statusAllowed:  "#4CAF50",
    statusWifiOnly: "#42A5F5",
    statusDataOnly: "#FF9800",
    statusBlocked:  "#EF5350",
    error:          "#CF6679",
    divider:        "#37474F",
  };

  const SPACING = { 1:4, 2:8, 3:12, 4:16, 5:20, 6:24, 8:32, 12:48, 14:56 };
  const RADIUS  = { xsmall:6, small:12, medium:14, large:16, xlarge:20, full:9999 };

  // ── Node helpers ──────────────────────────────────────────────────────────
  function makeText(content, opts) {
    opts = opts || {};
    const t = figma.createText();
    const weight = opts.weight || 400;
    const font = FONT_FOR_WEIGHT[weight] || FONTS.regular;
    t.fontName = font;
    t.characters = content;
    t.fontSize = opts.size || 14;
    if (opts.lineHeight) t.lineHeight = { value: opts.lineHeight, unit: "PIXELS" };
    if (opts.tracking != null) t.letterSpacing = { value: opts.tracking, unit: "PIXELS" };
    t.fills = [solid(opts.color || C.onBackground, opts.opacity)];
    if (opts.align) t.textAlignHorizontal = opts.align;
    if (opts.width) {
      t.textAutoResize = "HEIGHT";
      t.resize(opts.width, t.height);
    }
    if (opts.name) t.name = opts.name;
    return t;
  }

  function makeFrame(opts) {
    opts = opts || {};
    const f = figma.createFrame();
    f.name = opts.name || "Frame";
    f.layoutMode = opts.layout || "NONE";
    if (opts.layout) {
      f.primaryAxisSizingMode = opts.primarySize || "AUTO";
      f.counterAxisSizingMode = opts.counterSize || "AUTO";
      f.primaryAxisAlignItems = opts.primaryAlign || "MIN";
      f.counterAxisAlignItems = opts.counterAlign || "MIN";
      if (opts.gap != null) f.itemSpacing = opts.gap;
      const pT = opts.paddingTop != null ? opts.paddingTop : (opts.paddingV != null ? opts.paddingV : (opts.padding || 0));
      const pB = opts.paddingBottom != null ? opts.paddingBottom : (opts.paddingV != null ? opts.paddingV : (opts.padding || 0));
      const pL = opts.paddingLeft != null ? opts.paddingLeft : (opts.paddingH != null ? opts.paddingH : (opts.padding || 0));
      const pR = opts.paddingRight != null ? opts.paddingRight : (opts.paddingH != null ? opts.paddingH : (opts.padding || 0));
      f.paddingTop = pT; f.paddingBottom = pB; f.paddingLeft = pL; f.paddingRight = pR;
    }
    if (opts.width != null && opts.height != null) {
      f.resize(opts.width, opts.height);
    } else if (opts.width != null) {
      f.resize(opts.width, f.height);
    } else if (opts.height != null) {
      f.resize(f.width, opts.height);
    }
    if (opts.fill) f.fills = Array.isArray(opts.fill) ? opts.fill : [opts.fill];
    if (opts.fills) f.fills = opts.fills;
    if (opts.fill === null) f.fills = [];
    if (opts.cornerRadius != null) f.cornerRadius = opts.cornerRadius;
    if (opts.stroke) {
      f.strokes = [solid(opts.stroke, opts.strokeOpacity)];
      f.strokeWeight = opts.strokeWeight || 1;
    }
    if (opts.clip != null) f.clipsContent = opts.clip;
    return f;
  }

  function makeCircle(diameter, hex, opacity) {
    const e = figma.createEllipse();
    e.resize(diameter, diameter);
    e.fills = [solid(hex, opacity)];
    return e;
  }

  function makeRect(w, h, hex, radius, opacity) {
    const r = figma.createRectangle();
    r.resize(w, h);
    r.fills = [solid(hex, opacity)];
    if (radius != null) r.cornerRadius = radius;
    return r;
  }

  // Section header: a title + caption block used across pages
  function sectionHeader(title, caption) {
    const f = makeFrame({ name: title, layout: "VERTICAL", gap: 4, fill: null });
    f.appendChild(makeText(title, { size: 24, weight: 600, color: C.onBackground }));
    if (caption) f.appendChild(makeText(caption, { size: 14, weight: 400, color: C.onSurfaceVariant }));
    return f;
  }

  // ── Variable Collections ──────────────────────────────────────────────────
  // Mirrors docs/design-system/figma-variables.json exactly.
  async function buildVariables() {
    function ensureCollection(name) {
      const col = figma.variables.createVariableCollection(name);
      const modeId = col.modes[0].modeId;
      col.renameMode(modeId, "Dark");
      return { col, modeId };
    }

    const colors = ensureCollection("Colors");
    const typo   = ensureCollection("Typography");
    const space  = ensureCollection("Spacing");
    const rad    = ensureCollection("Radius");

    function addColorVar(name, hex) {
      const v = figma.variables.createVariable(name, colors.col, "COLOR");
      v.setValueForMode(colors.modeId, hexToRgb(hex));
    }
    function addFloatVar(coll, name, value) {
      const v = figma.variables.createVariable(name, coll.col, "FLOAT");
      v.setValueForMode(coll.modeId, value);
    }

    // Colors
    const colorList = [
      ["primary/default", C.primary],          ["primary/variant", C.primaryVariant],
      ["primary/dark", C.primaryDark],         ["primary/on", C.primaryOn],
      ["secondary/default", C.secondary],      ["secondary/variant", C.secondaryVariant],
      ["secondary/on", C.secondaryOn],
      ["background/default", C.background],
      ["surface/default", C.surface],          ["surface/variant", C.surfaceVariant],
      ["surface/elevated", C.surfaceElevated],
      ["on-background", C.onBackground],       ["on-surface", C.onSurface],
      ["on-surface/variant", C.onSurfaceVariant],
      ["status/allowed", C.statusAllowed],     ["status/wifi-only", C.statusWifiOnly],
      ["status/data-only", C.statusDataOnly],  ["status/blocked", C.statusBlocked],
      ["utility/error", C.error],              ["utility/divider", C.divider],
      ["utility/shimmer-base", C.surface],     ["utility/shimmer-highlight", C.surfaceElevated],
    ];
    for (const [n, h] of colorList) addColorVar(n, h);

    // Typography
    const typoList = [
      ["display-large/size", 32],   ["display-large/weight", 700],   ["display-large/lineHeight", 40],   ["display-large/tracking", -0.5],
      ["headline-large/size", 28],  ["headline-large/weight", 700],  ["headline-large/lineHeight", 36],
      ["headline-medium/size", 24], ["headline-medium/weight", 600], ["headline-medium/lineHeight", 32],
      ["headline-small/size", 20],  ["headline-small/weight", 600],  ["headline-small/lineHeight", 28],
      ["title-large/size", 18],     ["title-large/weight", 600],     ["title-large/lineHeight", 26],
      ["title-medium/size", 16],    ["title-medium/weight", 500],    ["title-medium/lineHeight", 24], ["title-medium/tracking", 0.15],
      ["title-small/size", 14],     ["title-small/weight", 500],     ["title-small/lineHeight", 20],  ["title-small/tracking", 0.10],
      ["body-large/size", 16],      ["body-large/weight", 400],      ["body-large/lineHeight", 24],   ["body-large/tracking", 0.5],
      ["body-medium/size", 14],     ["body-medium/weight", 400],     ["body-medium/lineHeight", 20],  ["body-medium/tracking", 0.25],
      ["body-small/size", 12],      ["body-small/weight", 400],      ["body-small/lineHeight", 16],   ["body-small/tracking", 0.4],
      ["label-large/size", 14],     ["label-large/weight", 500],     ["label-large/lineHeight", 20],  ["label-large/tracking", 0.1],
      ["label-medium/size", 12],    ["label-medium/weight", 500],    ["label-medium/lineHeight", 16], ["label-medium/tracking", 0.5],
      ["label-small/size", 10],     ["label-small/weight", 500],     ["label-small/lineHeight", 14],  ["label-small/tracking", 0.5],
    ];
    for (const [n, v] of typoList) addFloatVar(typo, n, v);

    // Spacing
    for (const [k, v] of Object.entries(SPACING)) addFloatVar(space, k, v);

    // Radius
    for (const [k, v] of Object.entries(RADIUS)) addFloatVar(rad, k, v);

    return { colors, typo, space, rad };
  }

  // ── Page builders ─────────────────────────────────────────────────────────
  function newPage(name) {
    const p = figma.createPage();
    p.name = name;
    return p;
  }

  // PAGE 1: Design System ──────────────────────────────────────────────────
  function buildDesignSystemPage() {
    const page = newPage("1 — Design System");
    const root = makeFrame({
      name: "Design System",
      layout: "VERTICAL",
      gap: 56,
      padding: 64,
      fill: solid(C.background),
      counterAlign: "MIN",
    });
    page.appendChild(root);

    // Title
    const title = makeFrame({ name: "Page Title", layout: "VERTICAL", gap: 8, fill: null });
    title.appendChild(makeText("AppFence Design System", { size: 48, weight: 700, color: C.onBackground }));
    title.appendChild(makeText("Material Design 3 · Dark theme · Compose BOM 2024.12.01", { size: 16, weight: 400, color: C.onSurfaceVariant }));
    root.appendChild(title);

    // Colors section
    const colorSec = makeFrame({ name: "Colors", layout: "VERTICAL", gap: 20, fill: null });
    colorSec.appendChild(sectionHeader("Color Palette", "22 tokens · semantic and surface roles"));

    const colorGroups = [
      { name: "Primary (Teal)", swatches: [
        { token: "primary/default", hex: C.primary },
        { token: "primary/variant", hex: C.primaryVariant },
        { token: "primary/dark",    hex: C.primaryDark },
        { token: "primary/on",      hex: C.primaryOn },
      ]},
      { name: "Secondary (Electric Blue)", swatches: [
        { token: "secondary/default", hex: C.secondary },
        { token: "secondary/variant", hex: C.secondaryVariant },
        { token: "secondary/on",      hex: C.secondaryOn },
      ]},
      { name: "Background & Surface (Deep Navy)", swatches: [
        { token: "background/default", hex: C.background },
        { token: "surface/default",    hex: C.surface },
        { token: "surface/variant",    hex: C.surfaceVariant },
        { token: "surface/elevated",   hex: C.surfaceElevated },
        { token: "on-background",      hex: C.onBackground },
        { token: "on-surface",         hex: C.onSurface },
        { token: "on-surface/variant", hex: C.onSurfaceVariant },
      ]},
      { name: "Status (Semantic)", swatches: [
        { token: "status/allowed",   hex: C.statusAllowed },
        { token: "status/wifi-only", hex: C.statusWifiOnly },
        { token: "status/data-only", hex: C.statusDataOnly },
        { token: "status/blocked",   hex: C.statusBlocked },
      ]},
      { name: "Utility", swatches: [
        { token: "utility/error",   hex: C.error },
        { token: "utility/divider", hex: C.divider },
      ]},
    ];

    for (const group of colorGroups) {
      const gf = makeFrame({ name: group.name, layout: "VERTICAL", gap: 12, fill: null });
      gf.appendChild(makeText(group.name, { size: 16, weight: 600, color: C.onBackground }));
      const row = makeFrame({ name: group.name + " row", layout: "HORIZONTAL", gap: 16, fill: null });
      for (const s of group.swatches) {
        const card = makeFrame({
          name: s.token, layout: "VERTICAL", gap: 8, padding: 12,
          fill: solid(C.surface), cornerRadius: RADIUS.medium, width: 180, primarySize:"FIXED", counterSize:"FIXED", height: 140,
        });
        const swatch = makeFrame({
          name: "swatch", layout: "NONE",
          fill: solid(s.hex), cornerRadius: RADIUS.small,
          width: 156, height: 64,
        });
        // Outline lighter swatches with a subtle stroke for visibility
        if (s.hex.toUpperCase() === C.background || s.hex.toUpperCase() === C.surface) {
          swatch.strokes = [solid(C.divider)];
          swatch.strokeWeight = 1;
        }
        card.appendChild(swatch);
        card.appendChild(makeText(s.token, { size: 12, weight: 500, color: C.onBackground }));
        card.appendChild(makeText(s.hex.toUpperCase(), { size: 11, weight: 400, color: C.onSurfaceVariant }));
        row.appendChild(card);
      }
      gf.appendChild(row);
      colorSec.appendChild(gf);
    }
    root.appendChild(colorSec);

    // Typography section
    const typoSec = makeFrame({ name: "Typography", layout: "VERTICAL", gap: 12, fill: null });
    typoSec.appendChild(sectionHeader("Typography", "13 styles · Font: System sans-serif (Inter render)"));
    const styles = [
      { token: "displayLarge",   size: 32, weight: 700, lh: 40, tracking: -0.5 },
      { token: "headlineLarge",  size: 28, weight: 700, lh: 36 },
      { token: "headlineMedium", size: 24, weight: 600, lh: 32 },
      { token: "headlineSmall",  size: 20, weight: 600, lh: 28 },
      { token: "titleLarge",     size: 18, weight: 600, lh: 26 },
      { token: "titleMedium",    size: 16, weight: 500, lh: 24, tracking: 0.15 },
      { token: "titleSmall",     size: 14, weight: 500, lh: 20, tracking: 0.10 },
      { token: "bodyLarge",      size: 16, weight: 400, lh: 24, tracking: 0.5 },
      { token: "bodyMedium",     size: 14, weight: 400, lh: 20, tracking: 0.25 },
      { token: "bodySmall",      size: 12, weight: 400, lh: 16, tracking: 0.4 },
      { token: "labelLarge",     size: 14, weight: 500, lh: 20, tracking: 0.1 },
      { token: "labelMedium",    size: 12, weight: 500, lh: 16, tracking: 0.5 },
      { token: "labelSmall",     size: 10, weight: 500, lh: 14, tracking: 0.5 },
    ];
    for (const s of styles) {
      const row = makeFrame({
        name: s.token, layout: "HORIZONTAL", gap: 24, paddingV: 12, paddingH: 16,
        fill: solid(C.surface), cornerRadius: RADIUS.small,
      });
      const meta = makeFrame({ name: "meta", layout: "VERTICAL", gap: 2, fill: null, width: 200, primarySize:"FIXED", counterSize:"FIXED", height: 56 });
      meta.appendChild(makeText(s.token, { size: 14, weight: 600, color: C.primary }));
      meta.appendChild(makeText(s.size + "sp · " + s.weight + " · " + s.lh + "sp" + (s.tracking != null ? " · "+s.tracking+"sp" : ""), { size: 11, weight: 400, color: C.onSurfaceVariant }));
      row.appendChild(meta);
      row.appendChild(makeText("AppFence " + s.token, { size: s.size, weight: s.weight, lineHeight: s.lh, tracking: s.tracking, color: C.onBackground }));
      typoSec.appendChild(row);
    }
    root.appendChild(typoSec);

    // Shape section
    const shapeSec = makeFrame({ name: "Shape", layout: "VERTICAL", gap: 12, fill: null });
    shapeSec.appendChild(sectionHeader("Shape System", "6 corner radius tokens"));
    const shapeRow = makeFrame({ name: "shapes", layout: "HORIZONTAL", gap: 16, fill: null });
    for (const [k, v] of Object.entries(RADIUS)) {
      const card = makeFrame({ name: "shape/"+k, layout: "VERTICAL", gap: 8, padding: 12, fill: solid(C.surface), cornerRadius: RADIUS.small, width: 130, height: 140, primarySize:"FIXED", counterSize:"FIXED", counterAlign:"CENTER" });
      const display = makeFrame({ name: "display", layout: "NONE", fill: solid(C.primary), cornerRadius: Math.min(v, 40), width: 80, height: 80 });
      card.appendChild(display);
      card.appendChild(makeText("shape/"+k, { size: 12, weight: 500, color: C.onBackground, align: "CENTER" }));
      card.appendChild(makeText(v === 9999 ? "full" : v + "dp", { size: 11, weight: 400, color: C.onSurfaceVariant, align: "CENTER" }));
      shapeRow.appendChild(card);
    }
    shapeSec.appendChild(shapeRow);
    root.appendChild(shapeSec);

    // Spacing section
    const spaceSec = makeFrame({ name: "Spacing", layout: "VERTICAL", gap: 12, fill: null });
    spaceSec.appendChild(sectionHeader("Spacing System", "Base unit 4dp"));
    for (const [k, v] of Object.entries(SPACING)) {
      const row = makeFrame({ name: "spacing/"+k, layout: "HORIZONTAL", gap: 16, paddingV: 8, paddingH: 12, fill: solid(C.surface), cornerRadius: RADIUS.small, counterAlign:"CENTER" });
      row.appendChild(makeText("spacing/"+k, { size: 13, weight: 600, color: C.primary, width: 110 }));
      row.appendChild(makeText(v+"dp", { size: 13, weight: 400, color: C.onSurfaceVariant, width: 60 }));
      const bar = makeRect(v, 16, C.primary, 2);
      row.appendChild(bar);
      spaceSec.appendChild(row);
    }
    root.appendChild(spaceSec);

    // Theme notes
    const themeSec = makeFrame({ name: "Theme", layout: "VERTICAL", gap: 12, fill: null });
    themeSec.appendChild(sectionHeader("Theme Configuration", null));
    const list = makeFrame({ name: "list", layout: "VERTICAL", gap: 8, padding: 16, fill: solid(C.surface), cornerRadius: RADIUS.medium, width: 720, primarySize:"FIXED", counterSize:"FIXED", height: 160 });
    list.appendChild(makeText("• Mode: Dark only (forceDarkTheme = true)", { size: 14, color: C.onBackground }));
    list.appendChild(makeText("• Status bar: background/default (#0D1B2A), icons light", { size: 14, color: C.onBackground }));
    list.appendChild(makeText("• Navigation bar: background/default (#0D1B2A), icons light", { size: 14, color: C.onBackground }));
    list.appendChild(makeText("• Material version: Material Design 3 (androidx.compose.material3)", { size: 14, color: C.onBackground }));
    list.appendChild(makeText("• All surfaces use elevation 0dp — depth is conveyed via surface color steps and gradients.", { size: 14, color: C.onBackground }));
    themeSec.appendChild(list);
    root.appendChild(themeSec);

    return page;
  }

  // ── Reusable component primitives (used by component lib + screens) ──────
  function statusBadge(variant) {
    const map = {
      ALLOWED:   { color: C.statusAllowed,  label: "Allowed" },
      WIFI_ONLY: { color: C.statusWifiOnly, label: "Wi-Fi Only" },
      DATA_ONLY: { color: C.statusDataOnly, label: "Data Only" },
      BLOCKED:   { color: C.statusBlocked,  label: "Blocked" },
    };
    const m = map[variant];
    const f = makeFrame({
      name: "StatusBadge/"+variant, layout: "HORIZONTAL",
      paddingV: 2, paddingH: 8, gap: 0,
      fill: solid(m.color, 0.13),
      cornerRadius: RADIUS.xsmall,
      counterAlign: "CENTER",
    });
    f.appendChild(makeText(m.label, { size: 12, weight: 500, color: m.color }));
    return f;
  }

  function primaryButton(label) {
    const f = makeFrame({
      name: "PrimaryButton",
      layout: "HORIZONTAL",
      primarySize:"FIXED", counterSize:"FIXED",
      width: 312, height: 56,
      primaryAlign:"CENTER", counterAlign:"CENTER",
      fill: solid(C.primary), cornerRadius: RADIUS.medium,
    });
    f.appendChild(makeText(label, { size: 14, weight: 500, color: C.primaryOn, tracking: 0.1 }));
    return f;
  }

  function outlinedButton(label) {
    const f = makeFrame({
      name: "OutlinedButton",
      layout: "HORIZONTAL",
      primarySize:"FIXED", counterSize:"FIXED",
      width: 312, height: 56,
      primaryAlign:"CENTER", counterAlign:"CENTER",
      fill: null, cornerRadius: RADIUS.medium,
      stroke: C.statusBlocked, strokeWeight: 1,
    });
    f.appendChild(makeText(label, { size: 14, weight: 500, color: C.statusBlocked, tracking: 0.1 }));
    return f;
  }

  function iconStub(size, hex) {
    // Square placeholder with rounded corners for any Material icon
    return makeRect(size, size, hex || C.onSurfaceVariant, size * 0.2);
  }

  function vpnDot(active) {
    return makeCircle(8, active ? C.statusAllowed : C.divider);
  }

  function toggleSwitch(on, scale) {
    scale = scale || 1;
    const w = 52 * scale, h = 32 * scale;
    const f = makeFrame({
      name: on ? "Switch/On" : "Switch/Off", layout: "NONE",
      width: w, height: h,
      fill: on ? solid(C.primary) : solid(C.divider),
      cornerRadius: h / 2,
    });
    const thumb = makeCircle((h - 4) , on ? "#FFFFFF" : C.onSurfaceVariant);
    thumb.x = on ? (w - h + 2) : 2;
    thumb.y = 2;
    f.appendChild(thumb);
    return f;
  }

  function filterChip(label, selected) {
    const f = makeFrame({
      name: "FilterChip/"+(selected?"Selected":"Unselected"), layout: "HORIZONTAL",
      paddingV: 3, paddingH: 10, gap: 0,
      fill: selected ? solid(C.primary, 0.12) : solid(C.surfaceElevated),
      stroke: selected ? C.primary : C.divider, strokeWeight: 1,
      cornerRadius: RADIUS.small, counterAlign:"CENTER",
    });
    f.appendChild(makeText(label, { size: 12, weight: 500, color: selected ? C.primary : C.onSurfaceVariant }));
    return f;
  }

  function appIconInList() {
    return makeFrame({
      name: "AppIcon", layout: "NONE",
      width: 44, height: 44,
      fill: solid(C.surfaceVariant),
      cornerRadius: RADIUS.small,
    });
  }

  function shieldGlowContainer(size, gradientStops) {
    return makeFrame({
      name: "ShieldContainer", layout: "NONE",
      width: size, height: size,
      fill: { type: "GRADIENT_RADIAL", gradientTransform: [[1,0,0],[0,1,0]],
              gradientStops: gradientStops.map(s => ({ position: s.position, color: { ...hexToRgb(s.color), a: s.opacity == null ? 1 : s.opacity }})) },
      cornerRadius: RADIUS.full,
    });
  }

  // Wi-Fi network status row used in the Main screen
  function networkStatusBar(active) {
    const fill = active
      ? linearGradient([
          { position: 0, color: C.primary, opacity: 0.12 },
          { position: 1, color: C.secondary, opacity: 0.12 },
        ], 90)
      : solid(C.surface);
    const f = makeFrame({
      name: "NetworkStatusBar/"+(active?"Active":"Inactive"),
      layout: "HORIZONTAL",
      paddingV: 8, paddingH: 12, gap: 8,
      fill: fill, counterAlign: "CENTER",
      width: 360, primarySize:"FIXED",
    });
    f.appendChild(vpnDot(active));
    f.appendChild(makeText(active ? "VPN Active" : "VPN Off", { size: 12, weight: 400, color: C.onBackground }));
    // spacer to push network type right
    const spacer = makeFrame({ name: "spacer", layout: "HORIZONTAL", fill: null });
    spacer.layoutGrow = 1;
    f.appendChild(spacer);
    f.appendChild(iconStub(16, C.secondary));
    f.appendChild(makeText("Wi-Fi", { size: 12, weight: 400, color: C.secondary }));
    return f;
  }

  // App list item (one row in the Main screen list)
  function appListItem(opts) {
    const variant = opts.variant; // ALLOWED | WIFI_ONLY | DATA_ONLY | BLOCKED
    const wifiOn  = variant === "ALLOWED" || variant === "WIFI_ONLY";
    const dataOn  = variant === "ALLOWED" || variant === "DATA_ONLY";
    const alpha   = variant === "BLOCKED" ? 0.7 : 1.0;

    const card = makeFrame({
      name: "AppListItem/"+variant,
      layout: "HORIZONTAL", gap: 10,
      paddingV: 8, paddingH: 12,
      fill: solid(C.surface), cornerRadius: RADIUS.large,
      counterAlign: "CENTER",
      width: 344, primarySize:"FIXED",
    });
    card.opacity = alpha;
    card.appendChild(appIconInList());

    const meta = makeFrame({ name: "meta", layout: "VERTICAL", gap: 2, fill: null });
    meta.layoutGrow = 1;
    meta.appendChild(makeText(opts.appName || "Sample App", { size: 14, weight: 500, color: C.onBackground, tracking: 0.10 }));
    meta.appendChild(makeText(opts.pkg || "com.example.sample", { size: 11, weight: 400, color: C.onSurfaceVariant, tracking: 0.4 }));
    card.appendChild(meta);

    card.appendChild(statusBadge(variant));

    // ToggleRow Wi-Fi
    const wifi = makeFrame({ name: "Toggle/Wi-Fi", layout: "HORIZONTAL", gap: 4, fill: null, counterAlign: "CENTER" });
    wifi.appendChild(iconStub(16, wifiOn ? C.primary : C.divider));
    wifi.appendChild(toggleSwitch(wifiOn, 0.7));
    card.appendChild(wifi);

    // ToggleRow Data
    const data = makeFrame({ name: "Toggle/Data", layout: "HORIZONTAL", gap: 4, fill: null, counterAlign: "CENTER" });
    data.appendChild(iconStub(16, dataOn ? C.secondary : C.divider));
    data.appendChild(toggleSwitch(dataOn, 0.7));
    card.appendChild(data);

    return card;
  }

  // PAGE 2: Component Library ──────────────────────────────────────────────
  function buildComponentLibraryPage() {
    const page = newPage("2 — Component Library");
    const root = makeFrame({
      name: "Component Library",
      layout: "VERTICAL", gap: 48, padding: 64, fill: solid(C.background),
      counterAlign: "MIN",
    });
    page.appendChild(root);
    const t = makeFrame({ name: "Header", layout: "VERTICAL", gap: 8, fill: null });
    t.appendChild(makeText("Component Library", { size: 48, weight: 700, color: C.onBackground }));
    t.appendChild(makeText("Atoms · Molecules · Organisms — 24 components", { size: 16, color: C.onSurfaceVariant }));
    root.appendChild(t);

    function group(title) {
      const f = makeFrame({ name: title, layout: "VERTICAL", gap: 16, fill: null });
      f.appendChild(makeText(title, { size: 24, weight: 600, color: C.onBackground }));
      return f;
    }
    function compCard(title, child, captions) {
      const card = makeFrame({
        name: title, layout: "VERTICAL", gap: 12, padding: 24,
        fill: solid(C.surface), cornerRadius: RADIUS.large,
      });
      card.appendChild(makeText(title, { size: 14, weight: 600, color: C.primary }));
      const stage = makeFrame({
        name: "stage", layout: "HORIZONTAL", gap: 16, padding: 16,
        fill: solid(C.background), cornerRadius: RADIUS.medium,
        counterAlign: "CENTER",
      });
      if (Array.isArray(child)) child.forEach(n => stage.appendChild(n));
      else stage.appendChild(child);
      card.appendChild(stage);
      if (captions && captions.length) {
        for (const c of captions) card.appendChild(makeText(c, { size: 12, color: C.onSurfaceVariant }));
      }
      return card;
    }
    function row(children, gap) {
      const r = makeFrame({ name: "row", layout: "HORIZONTAL", gap: gap == null ? 16 : gap, fill: null });
      children.forEach(c => r.appendChild(c));
      return r;
    }

    // ── Atoms ───────────────────────────────────────────────────────────────
    const atoms = group("⚛️ Atoms");

    // 1. App Icon (Launcher) — placeholder render
    const launcherStage = makeFrame({ name: "Launcher", layout: "HORIZONTAL", gap: 16, padding: 16, fill: solid(C.background), cornerRadius: RADIUS.medium, counterAlign:"CENTER" });
    const launcherSquare = makeFrame({ name: "ic_launcher", layout: "NONE", width: 72, height: 72, fill: linearGradient([{position:0,color:"#0A1628"},{position:1,color:"#1B5CD6"}], 135), cornerRadius: 16 });
    const launcherInner = makeFrame({ name: "inner", layout: "NONE", width: 40, height: 48, fill: solid("#0D2A5E"), cornerRadius: 8 });
    launcherInner.x = 16; launcherInner.y = 12;
    launcherInner.strokes = [solid("#4A9EFF")]; launcherInner.strokeWeight = 1;
    launcherSquare.appendChild(launcherInner);
    const launcherRound = makeFrame({ name: "ic_launcher_round", layout: "NONE", width: 72, height: 72, fill: linearGradient([{position:0,color:"#0A1628"},{position:1,color:"#1B5CD6"}], 135), cornerRadius: RADIUS.full });
    const launcherInner2 = makeFrame({ name: "inner", layout: "NONE", width: 40, height: 48, fill: solid("#0D2A5E"), cornerRadius: 8 });
    launcherInner2.x = 16; launcherInner2.y = 12;
    launcherInner2.strokes = [solid("#4A9EFF")]; launcherInner2.strokeWeight = 1;
    launcherRound.appendChild(launcherInner2);
    launcherStage.appendChild(launcherSquare); launcherStage.appendChild(launcherRound);
    const launcherCard = makeFrame({ name: "1. App Icon (Launcher)", layout: "VERTICAL", gap: 12, padding: 24, fill: solid(C.surface), cornerRadius: RADIUS.large });
    launcherCard.appendChild(makeText("1. App Icon (Launcher)", { size: 14, weight: 600, color: C.primary }));
    launcherCard.appendChild(launcherStage);
    launcherCard.appendChild(makeText("Square + round adaptive · 48–192px densities · Background #0D1B2A", { size: 12, color: C.onSurfaceVariant }));
    atoms.appendChild(launcherCard);

    // 2. StatusBadge variants
    atoms.appendChild(compCard("2. StatusBadge — 4 variants",
      [statusBadge("ALLOWED"), statusBadge("WIFI_ONLY"), statusBadge("DATA_ONLY"), statusBadge("BLOCKED")],
      ["Pill, 6dp radius · 13% tinted bg · labelMedium · 300ms tween between variants"]
    ));

    // 3. Primary Button
    atoms.appendChild(compCard("3. Primary Button", primaryButton("Grant VPN Permission"),
      ["56dp height · 14dp radius · primary/default fill · primary/on text · labelLarge"]
    ));

    // 4. Outlined Button
    atoms.appendChild(compCard("4. Outlined Button", outlinedButton("Stop VPN"),
      ["1dp status/blocked border · transparent fill · status/blocked text · used for Stop VPN only"]
    ));

    // 5. Icon Button
    const iconBtnRow = makeFrame({ name: "iconbtns", layout: "HORIZONTAL", gap: 12, fill: null });
    for (let i = 0; i < 3; i++) {
      const ib = makeFrame({ name: "IconButton", layout: "NONE", width: 48, height: 48, fill: null, cornerRadius: RADIUS.full });
      const icon = iconStub(24, C.onSurfaceVariant);
      icon.x = 12; icon.y = 12;
      ib.appendChild(icon);
      iconBtnRow.appendChild(ib);
    }
    atoms.appendChild(compCard("5. Icon Button (Search · Settings · Back)", iconBtnRow,
      ["48dp touch target · 24dp icon · transparent bg · tint: on-surface/variant"]
    ));

    // 6. Toggle Switch
    atoms.appendChild(compCard("6. Toggle Switch — On / Off · 1.0x and 0.7x",
      [toggleSwitch(true), toggleSwitch(false), toggleSwitch(true, 0.7), toggleSwitch(false, 0.7)],
      ["ON: primary/default track + white thumb · OFF: divider track + on-surface/variant thumb"]
    ));

    // 7. Divider
    const divider = makeRect(320, 1, C.divider, 0);
    atoms.appendChild(compCard("7. Divider", divider,
      ["1dp · utility/divider · used between settings rows"]
    ));

    // 8. App Icon (in-list)
    atoms.appendChild(compCard("8. App Icon (In-List)", appIconInList(),
      ["44dp · 12dp radius · surface/variant fallback fill · holds rememberDrawablePainter"]
    ));

    // 9. Loading Indicator
    const loadingStage = makeFrame({ name: "loading", layout: "VERTICAL", gap: 8, fill: null, counterAlign: "CENTER" });
    const ring = makeFrame({ name: "ring", layout: "NONE", width: 40, height: 40, fill: null, cornerRadius: RADIUS.full });
    ring.strokes = [solid(C.primary)]; ring.strokeWeight = 4;
    loadingStage.appendChild(ring);
    loadingStage.appendChild(makeText("Loading apps…", { size: 14, color: C.onSurfaceVariant }));
    atoms.appendChild(compCard("9. Loading Indicator", loadingStage,
      ["40dp · primary/default tint · with bodyMedium label below"]
    ));

    // 10. VPN Status Dot
    atoms.appendChild(compCard("10. VPN Status Dot", [vpnDot(true), vpnDot(false)],
      ["8dp circle · status/allowed (active) · utility/divider (inactive)"]
    ));

    // 11. Search TextField
    const search = makeFrame({ name: "Search", layout: "HORIZONTAL", paddingV: 12, paddingH: 16, gap: 8, fill: solid(C.surface), cornerRadius: RADIUS.small, counterAlign: "CENTER", width: 320, primarySize:"FIXED" });
    search.appendChild(iconStub(20, C.onSurfaceVariant));
    search.appendChild(makeText("Search apps…", { size: 14, color: C.onSurfaceVariant }));
    atoms.appendChild(compCard("11. Search TextField", search,
      ["Transparent bg · no indicator · on-surface/variant placeholder · AnimatedVisibility"]
    ));

    root.appendChild(atoms);

    // ── Molecules ───────────────────────────────────────────────────────────
    const molecules = group("🧬 Molecules");

    // 12. FilterChip
    molecules.appendChild(compCard("12. FilterChip — Selected / Unselected",
      [filterChip("ALL", true), filterChip("USER", false), filterChip("SYSTEM", false), filterChip("BLOCKED", false)],
      ["12dp radius · 1dp border · animated on selection change"]
    ));

    // 13. ToggleRow (compact)
    const tr1 = makeFrame({ name: "ToggleRow Wi-Fi", layout: "HORIZONTAL", gap: 4, fill: null, counterAlign: "CENTER" });
    tr1.appendChild(iconStub(16, C.primary)); tr1.appendChild(toggleSwitch(true, 0.7));
    const tr2 = makeFrame({ name: "ToggleRow Data", layout: "HORIZONTAL", gap: 4, fill: null, counterAlign: "CENTER" });
    tr2.appendChild(iconStub(16, C.secondary)); tr2.appendChild(toggleSwitch(true, 0.7));
    molecules.appendChild(compCard("13. ToggleRow (Compact)", [tr1, tr2],
      ["Icon (tinted) | Switch (0.7x scale) · Wi-Fi: primary/default · Mobile data: secondary/default"]
    ));

    // 14. SettingsToggleRow
    const settingsRow = makeFrame({ name: "SettingsToggleRow", layout: "HORIZONTAL", gap: 12, paddingV: 12, paddingH: 16, fill: solid(C.surface), cornerRadius: RADIUS.medium, counterAlign: "CENTER", width: 480, primarySize:"FIXED" });
    const iconC = makeFrame({ name: "iconC", layout: "NONE", width: 24, height: 24, fill: solid(C.surfaceVariant), cornerRadius: RADIUS.full });
    const lockIcon = iconStub(14, C.onBackground); lockIcon.x = 5; lockIcon.y = 5;
    iconC.appendChild(lockIcon);
    settingsRow.appendChild(iconC);
    const titleStack = makeFrame({ name: "ts", layout: "VERTICAL", gap: 2, fill: null });
    titleStack.layoutGrow = 1;
    titleStack.appendChild(makeText("Block new apps by default", { size: 14, weight: 500, color: C.onBackground }));
    titleStack.appendChild(makeText("Newly installed apps are blocked", { size: 12, color: C.onSurfaceVariant }));
    settingsRow.appendChild(titleStack);
    settingsRow.appendChild(toggleSwitch(true));
    molecules.appendChild(compCard("14. SettingsToggleRow", settingsRow,
      ["Icon Container | Title + Subtitle | Switch (1.0x) · 56dp height"]
    ));

    // 15. FeatureBullet
    const fb = makeFrame({ name: "FeatureBullet", layout: "HORIZONTAL", gap: 12, padding: 12, fill: solid(C.surface), cornerRadius: RADIUS.small, counterAlign: "CENTER", width: 480, primarySize:"FIXED" });
    fb.appendChild(iconStub(24, C.primary));
    const fbStack = makeFrame({ name: "fbs", layout: "VERTICAL", gap: 2, fill: null });
    fbStack.layoutGrow = 1;
    fbStack.appendChild(makeText("Local VPN", { size: 14, weight: 500, color: C.onBackground }));
    fbStack.appendChild(makeText("All filtering happens on-device. No traffic leaves your phone.", { size: 12, color: C.onSurfaceVariant }));
    fb.appendChild(fbStack);
    molecules.appendChild(compCard("15. FeatureBullet", fb,
      ["surface/default · 12dp radius · 12dp padding · titleSmall + bodySmall stack"]
    ));

    // 16. NetworkStatusBar
    molecules.appendChild(compCard("16. NetworkStatusBar (active / inactive)",
      [networkStatusBar(true), networkStatusBar(false)],
      ["Active: gradient primary→secondary @ 12% · Inactive: solid surface/default"]
    ));

    // 17. Shield Icon Container
    const shield64 = shieldGlowContainer(64, [{ position: 0, color: C.primary, opacity: 0.4 }, { position: 1, color: C.primary, opacity: 0 }]);
    const sIcon = iconStub(36, C.primary); sIcon.x = 14; sIcon.y = 14; shield64.appendChild(sIcon);
    const shield72 = makeFrame({ name: "Shield/Settings", layout: "NONE", width: 72, height: 72, fill: linearGradient([{position:0,color:C.primary,opacity:0.2},{position:1,color:C.secondary,opacity:0.2}], 135), cornerRadius: RADIUS.full });
    const sIcon2 = iconStub(36, C.primary); sIcon2.x = 18; sIcon2.y = 18; shield72.appendChild(sIcon2);
    molecules.appendChild(compCard("17. Shield Icon Container — 64 / 72",
      [shield64, shield72],
      ["Onboarding: 64dp radial primary glow · Settings: 72dp diagonal primary→secondary @ 20%"]
    ));

    root.appendChild(molecules);

    // ── Organisms ───────────────────────────────────────────────────────────
    const organisms = group("🏛️ Organisms");

    // 18. AppListItem — 4 status variants
    const itemsStack = makeFrame({ name: "items", layout: "VERTICAL", gap: 6, fill: null });
    itemsStack.appendChild(appListItem({ variant: "ALLOWED",   appName: "Chrome",     pkg: "com.android.chrome" }));
    itemsStack.appendChild(appListItem({ variant: "WIFI_ONLY", appName: "YouTube",    pkg: "com.google.android.youtube" }));
    itemsStack.appendChild(appListItem({ variant: "DATA_ONLY", appName: "Maps",       pkg: "com.google.android.apps.maps" }));
    itemsStack.appendChild(appListItem({ variant: "BLOCKED",   appName: "Background Sync", pkg: "com.example.bgsync" }));
    organisms.appendChild(compCard("18. AppListItem — 4 status variants", itemsStack,
      ["surface/default · 16dp radius · 0dp elevation · alpha 0.7 when blocked"]
    ));

    // 19. FilterBar
    const fbar = makeFrame({ name: "FilterBar", layout: "HORIZONTAL", paddingV: 8, paddingH: 12, gap: 6, fill: null, width: 360, primarySize:"FIXED", counterAlign:"CENTER" });
    fbar.appendChild(filterChip("ALL", true));
    fbar.appendChild(filterChip("USER", false));
    fbar.appendChild(filterChip("SYSTEM", false));
    fbar.appendChild(filterChip("BLOCKED", false));
    organisms.appendChild(compCard("19. FilterBar", fbar,
      ["Horizontal scroll LazyRow · 4 chips: ALL · USER · SYSTEM · BLOCKED"]
    ));

    // 20. TopAppBar — Main
    const tabMain = makeFrame({ name: "TopAppBar/Main", layout: "HORIZONTAL", paddingV: 16, paddingH: 16, gap: 8, fill: solid(C.background), counterAlign:"CENTER", width: 360, primarySize:"FIXED", height: 56, counterSize:"FIXED" });
    const logo = makeRect(18, 14, C.primary, 3);
    tabMain.appendChild(logo);
    tabMain.appendChild(makeText("AppFence", { size: 18, weight: 600, color: C.onBackground }));
    const sp = makeFrame({ name: "sp", layout: "HORIZONTAL", fill: null }); sp.layoutGrow = 1; tabMain.appendChild(sp);
    tabMain.appendChild(iconStub(24, C.onSurfaceVariant));
    tabMain.appendChild(iconStub(24, C.onSurfaceVariant));
    organisms.appendChild(compCard("20. TopAppBar — Main", tabMain,
      ["[Logo 18×14] [AppFence] [Spacer] [Search] [Settings] · titleLarge · background/default"]
    ));

    // 21. TopAppBar — Settings
    const tabSet = makeFrame({ name: "TopAppBar/Settings", layout: "HORIZONTAL", paddingV: 16, paddingH: 16, gap: 16, fill: solid(C.background), counterAlign:"CENTER", width: 360, primarySize:"FIXED", height: 56, counterSize:"FIXED" });
    tabSet.appendChild(iconStub(24, C.onSurfaceVariant));
    tabSet.appendChild(makeText("Settings", { size: 18, weight: 600, color: C.onBackground }));
    organisms.appendChild(compCard("21. TopAppBar — Settings", tabSet,
      ["[Back] [Settings] · titleLarge · no actions"]
    ));

    // 22. VPN Status Card — both states
    function vpnStatusCard(active) {
      const c = makeFrame({ name: "VPNStatusCard/"+(active?"Active":"Inactive"), layout: "VERTICAL", gap: 8, padding: 16, fill: solid(C.surface), cornerRadius: RADIUS.xlarge, counterAlign: "CENTER", width: 328, primarySize:"FIXED" });
      const sh = makeFrame({ name: "Shield", layout: "NONE", width: 72, height: 72, fill: linearGradient([{position:0,color:C.primary,opacity:0.2},{position:1,color:C.secondary,opacity:0.2}], 135), cornerRadius: RADIUS.full });
      const sIcon = iconStub(36, active ? C.primary : C.onSurfaceVariant); sIcon.x = 18; sIcon.y = 18; sh.appendChild(sIcon);
      c.appendChild(sh);
      c.appendChild(makeText(active ? "Protection Active" : "Protection Off", { size: 20, weight: 600, color: C.onBackground }));
      const ind = makeFrame({ name: "indicator", layout: "HORIZONTAL", gap: 6, fill: null, counterAlign: "CENTER" });
      ind.appendChild(vpnDot(active));
      ind.appendChild(makeText(active ? "Wi-Fi" : "No network", { size: 12, color: active ? C.secondary : C.onSurfaceVariant }));
      c.appendChild(ind);
      c.appendChild(active ? outlinedButton("Stop VPN") : primaryButton("Start VPN"));
      return c;
    }
    organisms.appendChild(compCard("22. VPN Status Card", [vpnStatusCard(true), vpnStatusCard(false)],
      ["Active: 'Protection Active' + outlined Stop VPN · Inactive: 'Protection Off' + primary Start VPN"]
    ));

    // 23. Preferences Card
    function settingsRowMaker(iconColor, title, subtitle, on) {
      const r = makeFrame({ name: "row", layout: "HORIZONTAL", gap: 12, paddingV: 12, paddingH: 16, fill: null, counterAlign: "CENTER" });
      r.layoutAlign = "STRETCH";
      const ic = makeFrame({ name: "ic", layout: "NONE", width: 24, height: 24, fill: solid(C.surfaceVariant), cornerRadius: RADIUS.full });
      const sub = iconStub(14, iconColor); sub.x = 5; sub.y = 5; ic.appendChild(sub);
      r.appendChild(ic);
      const ts = makeFrame({ name: "ts", layout: "VERTICAL", gap: 2, fill: null });
      ts.layoutGrow = 1;
      ts.appendChild(makeText(title, { size: 14, weight: 500, color: C.onBackground }));
      ts.appendChild(makeText(subtitle, { size: 12, color: C.onSurfaceVariant }));
      r.appendChild(ts);
      r.appendChild(toggleSwitch(on));
      return r;
    }
    const prefs = makeFrame({ name: "PreferencesCard", layout: "VERTICAL", gap: 0, padding: 0, fill: solid(C.surface), cornerRadius: RADIUS.xlarge, width: 328, primarySize:"FIXED" });
    prefs.appendChild(settingsRowMaker(C.primary, "Block new apps by default", "Newly installed apps are blocked", true));
    const div = makeRect(296, 1, C.divider, 0); div.x = 16;
    const divWrap = makeFrame({ name: "divWrap", layout: "HORIZONTAL", paddingH: 16, fill: null });
    divWrap.layoutAlign = "STRETCH";
    divWrap.appendChild(makeRect(296, 1, C.divider, 0));
    prefs.appendChild(divWrap);
    prefs.appendChild(settingsRowMaker(C.secondary, "Start on boot", "Automatically enable VPN at startup", false));
    organisms.appendChild(compCard("23. Preferences Card", prefs,
      ["Two SettingsToggleRows separated by 1dp divider · 20dp radius card"]
    ));

    // 24. About Card
    const about = makeFrame({ name: "AboutCard", layout: "HORIZONTAL", gap: 12, padding: 16, fill: solid(C.surface), cornerRadius: RADIUS.xlarge, width: 328, primarySize:"FIXED", counterAlign: "CENTER" });
    const aboutIc = makeFrame({ name: "ic", layout: "NONE", width: 28, height: 28, fill: solid(C.surfaceVariant), cornerRadius: RADIUS.full });
    const infoIcon = iconStub(14, C.primary); infoIcon.x = 7; infoIcon.y = 7; aboutIc.appendChild(infoIcon);
    about.appendChild(aboutIc);
    const aboutStack = makeFrame({ name: "ts", layout: "VERTICAL", gap: 2, fill: null });
    aboutStack.layoutGrow = 1;
    aboutStack.appendChild(makeText("AppFence v1.0.0", { size: 16, weight: 500, color: C.onBackground }));
    aboutStack.appendChild(makeText("Per-app network firewall", { size: 12, color: C.onSurfaceVariant }));
    about.appendChild(aboutStack);
    organisms.appendChild(compCard("24. About Card", about,
      ["28dp info icon container · titleMedium version · bodySmall description"]
    ));

    root.appendChild(organisms);

    return page;
  }

  // ── Status bar / nav bar (system chrome around screens) ───────────────────
  function statusBar() {
    const f = makeFrame({ name: "Status Bar", layout: "HORIZONTAL", paddingV: 6, paddingH: 16, gap: 0, fill: solid(C.background), counterAlign:"CENTER", width: 360, primarySize:"FIXED", height: 24, counterSize:"FIXED" });
    f.appendChild(makeText("9:41", { size: 12, weight: 500, color: C.onBackground }));
    const sp = makeFrame({ name: "sp", layout: "HORIZONTAL", fill: null }); sp.layoutGrow = 1; f.appendChild(sp);
    f.appendChild(makeText("●●●●", { size: 10, color: C.onBackground }));
    return f;
  }
  function navBar() {
    const f = makeFrame({ name: "Nav Bar", layout: "HORIZONTAL", paddingV: 6, paddingH: 16, gap: 32, fill: solid(C.background), counterAlign:"CENTER", primaryAlign: "CENTER", width: 360, primarySize:"FIXED", height: 24, counterSize:"FIXED" });
    f.appendChild(makeRect(48, 4, C.onBackground, 2));
    return f;
  }

  // PAGE 3: Screens ─────────────────────────────────────────────────────────
  function buildScreensPage() {
    const page = newPage("3 — Screens");

    function screenFrame(name) {
      const s = makeFrame({
        name: name, layout: "VERTICAL", gap: 0,
        fill: solid(C.background),
        width: 360, height: 780,
        primarySize: "FIXED", counterSize: "FIXED",
        clip: true,
      });
      return s;
    }

    // Layout the 7 screens in a row
    const screensRow = makeFrame({ name: "Screens", layout: "HORIZONTAL", gap: 64, padding: 64, fill: solid(C.surfaceVariant), counterAlign: "MIN" });
    page.appendChild(screensRow);

    // ── Screen 1: Onboarding ───────────────────────────────────────────────
    const onboarding = screenFrame("Screens/Onboarding/Default");
    onboarding.appendChild(statusBar());
    const obContent = makeFrame({ name: "Content", layout: "VERTICAL", gap: 0, paddingTop: 24, paddingLeft: 24, paddingRight: 24, paddingBottom: 24, fill: null, counterAlign: "CENTER" });
    obContent.layoutGrow = 1;
    // Shield with radial glow
    const obShield = shieldGlowContainer(96, [
      { position: 0, color: C.primary, opacity: 0.55 },
      { position: 0.5, color: C.primary, opacity: 0.18 },
      { position: 1, color: C.primary, opacity: 0 },
    ]);
    const sIconOb = iconStub(48, C.primary); sIconOb.x = 24; sIconOb.y = 24; obShield.appendChild(sIconOb);
    obContent.appendChild(obShield);
    const obSpacer1 = makeRect(1, 24, C.background, 0); obSpacer1.opacity = 0; obContent.appendChild(obSpacer1);
    obContent.appendChild(makeText("Welcome to AppFence", { size: 32, weight: 700, lineHeight: 40, tracking: -0.5, color: C.onBackground, align: "CENTER", width: 312 }));
    const obSpacer2 = makeRect(1, 8, C.background, 0); obSpacer2.opacity = 0; obContent.appendChild(obSpacer2);
    obContent.appendChild(makeText("Block apps from using mobile data or Wi-Fi. All filtering happens on-device through a local VPN.", { size: 16, weight: 400, lineHeight: 24, tracking: 0.5, color: C.onSurfaceVariant, align: "CENTER", width: 312 }));
    const obSpacer3 = makeRect(1, 24, C.background, 0); obSpacer3.opacity = 0; obContent.appendChild(obSpacer3);
    // Feature bullets
    function makeFB(iconColor, title, desc) {
      const fb = makeFrame({ name: "FeatureBullet", layout: "HORIZONTAL", gap: 12, padding: 12, fill: solid(C.surface), cornerRadius: RADIUS.small, counterAlign:"CENTER", width: 312, primarySize:"FIXED" });
      fb.appendChild(iconStub(24, iconColor));
      const ts = makeFrame({ name: "ts", layout: "VERTICAL", gap: 2, fill: null });
      ts.layoutGrow = 1;
      ts.appendChild(makeText(title, { size: 14, weight: 500, color: C.onBackground }));
      ts.appendChild(makeText(desc, { size: 12, color: C.onSurfaceVariant }));
      fb.appendChild(ts);
      return fb;
    }
    obContent.appendChild(makeFB(C.primary, "Local VPN", "All filtering on-device. No traffic leaves your phone."));
    const obSpacerB = makeRect(1, 8, C.background, 0); obSpacerB.opacity = 0; obContent.appendChild(obSpacerB);
    obContent.appendChild(makeFB(C.secondary, "Per-App Control", "Allow / block Wi-Fi and data per app individually."));
    const obSpacer4 = makeRect(1, 32, C.background, 0); obSpacer4.opacity = 0; obContent.appendChild(obSpacer4);
    obContent.appendChild(primaryButton("Grant VPN Permission"));
    const obSpacer5 = makeRect(1, 12, C.background, 0); obSpacer5.opacity = 0; obContent.appendChild(obSpacer5);
    obContent.appendChild(makeText("AppFence sets up a local VPN to filter traffic. Your data is not sent anywhere.", { size: 10, weight: 500, lineHeight: 14, tracking: 0.5, color: C.onSurfaceVariant, opacity: 0.6, align: "CENTER", width: 312 }));
    onboarding.appendChild(obContent);
    onboarding.appendChild(navBar());
    screensRow.appendChild(onboarding);

    // ── Helper: Main TopAppBar ─────────────────────────────────────────────
    function mainTopAppBar(searchActive) {
      const t = makeFrame({ name: "TopAppBar", layout: "HORIZONTAL", paddingV: 8, paddingH: 16, gap: 8, fill: solid(C.background), counterAlign:"CENTER", width: 360, primarySize:"FIXED", height: 56, counterSize:"FIXED" });
      if (!searchActive) {
        const logo = makeRect(18, 14, C.primary, 3); t.appendChild(logo);
        t.appendChild(makeText("AppFence", { size: 18, weight: 600, color: C.onBackground }));
      } else {
        const sf = makeFrame({ name: "search", layout: "HORIZONTAL", paddingV: 8, paddingH: 12, gap: 8, fill: solid(C.surface), cornerRadius: RADIUS.small, counterAlign: "CENTER" });
        sf.layoutGrow = 1;
        sf.appendChild(iconStub(16, C.onSurfaceVariant));
        sf.appendChild(makeText("Search apps…", { size: 14, color: C.onSurfaceVariant }));
        t.appendChild(sf);
      }
      const sp = makeFrame({ name: "sp", layout: "HORIZONTAL", fill: null }); sp.layoutGrow = 1; if (!searchActive) t.appendChild(sp);
      // Search/Close icon
      t.appendChild(iconStub(24, C.onSurfaceVariant));
      // Settings icon (hidden when search active)
      if (!searchActive) t.appendChild(iconStub(24, C.onSurfaceVariant));
      return t;
    }

    function mainFilterBar() {
      const fb = makeFrame({ name: "FilterBar", layout: "HORIZONTAL", paddingV: 8, paddingH: 12, gap: 6, fill: solid(C.background), counterAlign:"CENTER", width: 360, primarySize:"FIXED" });
      fb.appendChild(filterChip("ALL", true));
      fb.appendChild(filterChip("USER", false));
      fb.appendChild(filterChip("SYSTEM", false));
      fb.appendChild(filterChip("BLOCKED", false));
      return fb;
    }

    function mainListContent() {
      const list = makeFrame({ name: "List", layout: "VERTICAL", gap: 6, paddingV: 8, paddingH: 8, fill: solid(C.background), width: 360, primarySize:"FIXED" });
      list.layoutGrow = 1;
      list.appendChild(appListItem({ variant: "ALLOWED",   appName: "Chrome",        pkg: "com.android.chrome" }));
      list.appendChild(appListItem({ variant: "WIFI_ONLY", appName: "YouTube",       pkg: "com.google.android.youtube" }));
      list.appendChild(appListItem({ variant: "DATA_ONLY", appName: "Maps",          pkg: "com.google.android.apps.maps" }));
      list.appendChild(appListItem({ variant: "ALLOWED",   appName: "Gmail",         pkg: "com.google.android.gm" }));
      list.appendChild(appListItem({ variant: "BLOCKED",   appName: "Background Sync", pkg: "com.example.bgsync" }));
      list.appendChild(appListItem({ variant: "ALLOWED",   appName: "Photos",        pkg: "com.google.android.apps.photos" }));
      list.appendChild(appListItem({ variant: "WIFI_ONLY", appName: "Spotify",       pkg: "com.spotify.music" }));
      return list;
    }

    // ── Screen 2a: Main / Default (VPN On) ─────────────────────────────────
    const main = screenFrame("Screens/Main/Default (VPN On)");
    main.appendChild(statusBar());
    main.appendChild(mainTopAppBar(false));
    main.appendChild(networkStatusBar(true));
    main.appendChild(mainFilterBar());
    main.appendChild(mainListContent());
    main.appendChild(navBar());
    screensRow.appendChild(main);

    // ── Screen 2b: Main / Search Active ────────────────────────────────────
    const mainSearch = screenFrame("Screens/Main/Search Active");
    mainSearch.appendChild(statusBar());
    mainSearch.appendChild(mainTopAppBar(true));
    mainSearch.appendChild(networkStatusBar(true));
    mainSearch.appendChild(mainFilterBar());
    mainSearch.appendChild(mainListContent());
    // Keyboard placeholder
    const kb = makeFrame({ name: "Keyboard", layout: "VERTICAL", gap: 0, fill: solid(C.surfaceElevated), width: 360, primarySize:"FIXED", height: 240, counterSize:"FIXED" });
    mainSearch.appendChild(kb);
    mainSearch.appendChild(navBar());
    screensRow.appendChild(mainSearch);

    // ── Screen 2c: Main / Loading ──────────────────────────────────────────
    const mainLoading = screenFrame("Screens/Main/Loading State");
    mainLoading.appendChild(statusBar());
    mainLoading.appendChild(mainTopAppBar(false));
    mainLoading.appendChild(networkStatusBar(true));
    mainLoading.appendChild(mainFilterBar());
    const loadCenter = makeFrame({ name: "LoadingCenter", layout: "VERTICAL", gap: 12, fill: solid(C.background), counterAlign: "CENTER", primaryAlign: "CENTER", width: 360, primarySize:"FIXED", counterSize:"FIXED" });
    loadCenter.layoutGrow = 1;
    const ringL = makeFrame({ name: "ring", layout: "NONE", width: 40, height: 40, fill: null, cornerRadius: RADIUS.full });
    ringL.strokes = [solid(C.primary)]; ringL.strokeWeight = 4;
    loadCenter.appendChild(ringL);
    loadCenter.appendChild(makeText("Loading apps…", { size: 14, color: C.onSurfaceVariant }));
    mainLoading.appendChild(loadCenter);
    mainLoading.appendChild(navBar());
    screensRow.appendChild(mainLoading);

    // ── Screen 2d: Main / Empty ────────────────────────────────────────────
    const mainEmpty = screenFrame("Screens/Main/Empty State");
    mainEmpty.appendChild(statusBar());
    mainEmpty.appendChild(mainTopAppBar(false));
    mainEmpty.appendChild(networkStatusBar(true));
    mainEmpty.appendChild(mainFilterBar());
    const emptyCenter = makeFrame({ name: "EmptyCenter", layout: "VERTICAL", gap: 8, fill: solid(C.background), counterAlign: "CENTER", primaryAlign: "CENTER", width: 360, primarySize:"FIXED", counterSize:"FIXED" });
    emptyCenter.layoutGrow = 1;
    emptyCenter.appendChild(makeText("No apps found", { size: 16, color: C.onSurfaceVariant }));
    mainEmpty.appendChild(emptyCenter);
    mainEmpty.appendChild(navBar());
    screensRow.appendChild(mainEmpty);

    // ── Screen 3a: Settings / VPN On ───────────────────────────────────────
    function settingsTopBar() {
      const t = makeFrame({ name: "TopAppBar", layout: "HORIZONTAL", paddingV: 8, paddingH: 16, gap: 16, fill: solid(C.background), counterAlign:"CENTER", width: 360, primarySize:"FIXED", height: 56, counterSize:"FIXED" });
      t.appendChild(iconStub(24, C.onSurfaceVariant));
      t.appendChild(makeText("Settings", { size: 18, weight: 600, color: C.onBackground }));
      return t;
    }

    function vpnStatusCardScreen(active) {
      const c = makeFrame({ name: "VPNStatusCard", layout: "VERTICAL", gap: 8, padding: 16, fill: solid(C.surface), cornerRadius: RADIUS.xlarge, counterAlign: "CENTER", width: 328, primarySize:"FIXED" });
      const sh = makeFrame({ name: "Shield", layout: "NONE", width: 72, height: 72, fill: linearGradient([{position:0,color:C.primary,opacity:0.2},{position:1,color:C.secondary,opacity:0.2}], 135), cornerRadius: RADIUS.full });
      const sIcon = iconStub(36, active ? C.primary : C.onSurfaceVariant); sIcon.x = 18; sIcon.y = 18; sh.appendChild(sIcon);
      c.appendChild(sh);
      const sp1 = makeRect(1, 8, C.surface, 0); sp1.opacity = 0; c.appendChild(sp1);
      c.appendChild(makeText(active ? "Protection Active" : "Protection Off", { size: 20, weight: 600, color: C.onBackground }));
      const ind = makeFrame({ name: "indicator", layout: "HORIZONTAL", gap: 6, fill: null, counterAlign: "CENTER" });
      ind.appendChild(vpnDot(active));
      ind.appendChild(makeText(active ? "Wi-Fi" : "No network", { size: 12, color: active ? C.secondary : C.onSurfaceVariant }));
      c.appendChild(ind);
      const sp2 = makeRect(1, 12, C.surface, 0); sp2.opacity = 0; c.appendChild(sp2);
      const cta = active ? outlinedButton("Stop VPN") : primaryButton("Start VPN");
      cta.resize(296, 56);
      c.appendChild(cta);
      return c;
    }

    function preferencesCard() {
      const prefs = makeFrame({ name: "PreferencesCard", layout: "VERTICAL", gap: 0, padding: 0, fill: solid(C.surface), cornerRadius: RADIUS.xlarge, width: 328, primarySize:"FIXED" });
      function rowS(iconColor, title, subtitle, on) {
        const r = makeFrame({ name: "row", layout: "HORIZONTAL", gap: 12, paddingV: 12, paddingH: 16, fill: null, counterAlign: "CENTER" });
        r.layoutAlign = "STRETCH";
        const ic = makeFrame({ name: "ic", layout: "NONE", width: 24, height: 24, fill: solid(C.surfaceVariant), cornerRadius: RADIUS.full });
        const sub = iconStub(14, iconColor); sub.x = 5; sub.y = 5; ic.appendChild(sub);
        r.appendChild(ic);
        const ts = makeFrame({ name: "ts", layout: "VERTICAL", gap: 2, fill: null });
        ts.layoutGrow = 1;
        ts.appendChild(makeText(title, { size: 14, weight: 500, color: C.onBackground }));
        ts.appendChild(makeText(subtitle, { size: 12, color: C.onSurfaceVariant }));
        r.appendChild(ts);
        r.appendChild(toggleSwitch(on));
        return r;
      }
      prefs.appendChild(rowS(C.primary, "Block new apps by default", "Newly installed apps are blocked", true));
      const divWrap = makeFrame({ name: "divWrap", layout: "HORIZONTAL", paddingH: 16, fill: null });
      divWrap.layoutAlign = "STRETCH";
      divWrap.appendChild(makeRect(296, 1, C.divider, 0));
      prefs.appendChild(divWrap);
      prefs.appendChild(rowS(C.secondary, "Start on boot", "Automatically enable VPN at startup", false));
      return prefs;
    }

    function aboutCard() {
      const about = makeFrame({ name: "AboutCard", layout: "HORIZONTAL", gap: 12, padding: 16, fill: solid(C.surface), cornerRadius: RADIUS.xlarge, width: 328, primarySize:"FIXED", counterAlign: "CENTER" });
      const aboutIc = makeFrame({ name: "ic", layout: "NONE", width: 28, height: 28, fill: solid(C.surfaceVariant), cornerRadius: RADIUS.full });
      const infoIcon = iconStub(14, C.primary); infoIcon.x = 7; infoIcon.y = 7; aboutIc.appendChild(infoIcon);
      about.appendChild(aboutIc);
      const ts = makeFrame({ name: "ts", layout: "VERTICAL", gap: 2, fill: null });
      ts.layoutGrow = 1;
      ts.appendChild(makeText("AppFence v1.0.0", { size: 16, weight: 500, color: C.onBackground }));
      ts.appendChild(makeText("Per-app network firewall", { size: 12, color: C.onSurfaceVariant }));
      about.appendChild(ts);
      return about;
    }

    function settingsContent(active) {
      const c = makeFrame({ name: "Content", layout: "VERTICAL", gap: 12, paddingV: 16, paddingH: 16, fill: solid(C.background), width: 360, primarySize:"FIXED", counterAlign:"CENTER" });
      c.layoutGrow = 1;
      c.appendChild(vpnStatusCardScreen(active));
      c.appendChild(preferencesCard());
      c.appendChild(aboutCard());
      return c;
    }

    const settingsOn = screenFrame("Screens/Settings/VPN On");
    settingsOn.appendChild(statusBar());
    settingsOn.appendChild(settingsTopBar());
    settingsOn.appendChild(settingsContent(true));
    settingsOn.appendChild(navBar());
    screensRow.appendChild(settingsOn);

    const settingsOff = screenFrame("Screens/Settings/VPN Off");
    settingsOff.appendChild(statusBar());
    settingsOff.appendChild(settingsTopBar());
    settingsOff.appendChild(settingsContent(false));
    settingsOff.appendChild(navBar());
    screensRow.appendChild(settingsOff);

    return page;
  }

  // PAGE 4: Tokens ──────────────────────────────────────────────────────────
  function buildTokensPage() {
    const page = newPage("4 — Design Tokens");
    const root = makeFrame({
      name: "Design Tokens",
      layout: "VERTICAL", gap: 32, padding: 64, fill: solid(C.background),
      counterAlign: "MIN",
    });
    page.appendChild(root);

    const t = makeFrame({ name: "Header", layout: "VERTICAL", gap: 8, fill: null });
    t.appendChild(makeText("Design Tokens", { size: 48, weight: 700, color: C.onBackground }));
    t.appendChild(makeText("Variable collection reference and Android↔Figma mapping", { size: 16, color: C.onSurfaceVariant }));
    root.appendChild(t);

    function pill(label, color) {
      const p = makeFrame({ name: label, layout: "HORIZONTAL", paddingV: 4, paddingH: 10, gap: 0, fill: solid(color, 0.15), cornerRadius: RADIUS.xsmall, counterAlign: "CENTER" });
      p.appendChild(makeText(label, { size: 11, weight: 500, color: color }));
      return p;
    }

    function collectionCard(title, summary, type, examples) {
      const c = makeFrame({ name: title, layout: "VERTICAL", gap: 12, padding: 24, fill: solid(C.surface), cornerRadius: RADIUS.large });
      const h = makeFrame({ name: "header", layout: "HORIZONTAL", gap: 8, fill: null, counterAlign: "CENTER" });
      h.appendChild(makeText(title, { size: 20, weight: 600, color: C.primary }));
      h.appendChild(pill(type, C.primary));
      c.appendChild(h);
      c.appendChild(makeText(summary, { size: 14, color: C.onSurfaceVariant }));
      const ex = makeFrame({ name: "examples", layout: "VERTICAL", gap: 4, fill: null });
      for (const e of examples) ex.appendChild(makeText("• " + e, { size: 12, color: C.onBackground }));
      c.appendChild(ex);
      return c;
    }

    root.appendChild(collectionCard("Collection 1 — Colors",
      "22 color tokens across primary, secondary, surface, status, and utility roles. Single Dark mode.", "COLOR",
      ["primary/{default, variant, dark, on}",
       "secondary/{default, variant, on}",
       "background/default, surface/{default, variant, elevated}",
       "on-background, on-surface, on-surface/variant",
       "status/{allowed, wifi-only, data-only, blocked}",
       "utility/{error, divider, shimmer-base, shimmer-highlight}"]));

    root.appendChild(collectionCard("Collection 2 — Typography",
      "Per-style FLOAT variables: size, weight, lineHeight, optional tracking. 13 styles total.", "FLOAT",
      ["display-large · headline-{large,medium,small}",
       "title-{large,medium,small}",
       "body-{large,medium,small}",
       "label-{large,medium,small}"]));

    root.appendChild(collectionCard("Collection 3 — Spacing",
      "9 FLOAT variables, 4dp base unit. Spacing/14 = 56dp = primary button height.", "FLOAT",
      ["1=4 · 2=8 · 3=12 · 4=16 · 5=20 · 6=24 · 8=32 · 12=48 · 14=56"]));

    root.appendChild(collectionCard("Collection 4 — Radius",
      "6 FLOAT variables. shape/full = 9999 to express CircleShape.", "FLOAT",
      ["xsmall=6 · small=12 · medium=14 · large=16 · xlarge=20 · full=9999"]));

    // Mapping table
    const mapWrap = makeFrame({ name: "Mapping", layout: "VERTICAL", gap: 8, padding: 24, fill: solid(C.surface), cornerRadius: RADIUS.large });
    mapWrap.appendChild(makeText("Android ↔ Figma Mapping", { size: 20, weight: 600, color: C.primary }));
    const mappings = [
      ["Color(0xFF00E5CC)", "Colors/primary/default"],
      ["Color(0xFF0D1B2A)", "Colors/background/default"],
      ["Color(0xFF1B2838)", "Colors/surface/default"],
      ["MaterialTheme.typography.titleLarge", "Typography/title-large/*"],
      ["RoundedCornerShape(16.dp)", "Radius/large"],
      ["16.dp padding", "Spacing/4"],
      ["56.dp button height", "Spacing/14"],
    ];
    for (const [a, b] of mappings) {
      const r = makeFrame({ name: "row", layout: "HORIZONTAL", gap: 16, paddingV: 6, paddingH: 0, fill: null, counterAlign: "CENTER" });
      r.appendChild(makeText(a, { size: 12, color: C.onBackground, width: 280 }));
      r.appendChild(makeText("→", { size: 12, color: C.onSurfaceVariant }));
      r.appendChild(makeText(b, { size: 12, weight: 500, color: C.primary }));
      mapWrap.appendChild(r);
    }
    root.appendChild(mapWrap);

    return page;
  }

  // ── Run ───────────────────────────────────────────────────────────────────
  figma.notify("Building AppFence design system…", { timeout: 1500 });

  await buildVariables();

  const dsPage    = buildDesignSystemPage();
  const compPage  = buildComponentLibraryPage();
  const screensP  = buildScreensPage();
  const tokensP   = buildTokensPage();

  // Land on the Screens page when finished
  await figma.setCurrentPageAsync(screensP);

  figma.notify("AppFence design system created · 4 pages · 4 variable collections · 7 screens", { timeout: 4500 });
  figma.closePlugin();
})();

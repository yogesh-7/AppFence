# AppFence Figma Plugin — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Figma plugin (TypeScript) that, when run inside Figma, programmatically creates the complete AppFence design system — 4 pages, 24 components, 7 screen frames, all design tokens — in one click.

**Architecture:** Single TypeScript source compiled to `dist/code.js`. Plugin entry is `src/code.ts` which orchestrates 5 modules: `tokens.ts` (constants), `helpers.ts` (node utilities), `design-system.ts` (Page 1), `components.ts` (Page 2), `screens.ts` (Page 3). A minimal `ui.html` shows a "Create Design System" button. All design values come from `docs/design-system/` spec files.

**Tech Stack:** TypeScript, Figma Plugin API (`@figma/plugin-typings`), esbuild (bundler), Node 18+

**Plugin location:** `figma-plugin/` at project root.

**Spec reference:** `docs/design-system/design-system.md`, `docs/design-system/components.md`, `docs/design-system/screens.md`, `docs/design-system/figma-variables.json`

---

## File Structure

```
figma-plugin/
├── manifest.json          # Figma plugin metadata
├── package.json           # deps: @figma/plugin-typings, esbuild
├── tsconfig.json          # TypeScript config for Figma sandbox
├── build.sh               # esbuild compile command
├── src/
│   ├── code.ts            # Entry point — orchestrates all modules
│   ├── ui.html            # Plugin UI: single "Create Design System" button
│   ├── tokens.ts          # All design constants (colors, type, spacing, radius)
│   ├── helpers.ts         # Node creation utilities (createFrame, createText, etc.)
│   ├── design-system.ts   # Builds Page 1: Design System
│   ├── components.ts      # Builds Page 2: Component Library
│   └── screens.ts         # Builds Page 3 & 4: Screens + Tokens reference
└── dist/
    └── code.js            # Compiled output (gitignored, produced by build.sh)
```

---

## Task 1: Scaffold the Plugin Project

**Files:**
- Create: `figma-plugin/manifest.json`
- Create: `figma-plugin/package.json`
- Create: `figma-plugin/tsconfig.json`
- Create: `figma-plugin/build.sh`
- Create: `figma-plugin/src/ui.html`
- Create: `figma-plugin/src/code.ts` (entry stub)
- Create: `figma-plugin/.gitignore`

- [ ] **Step 1: Create manifest.json**

```json
{
  "name": "AppFence Design System",
  "id": "appfence-design-system-001",
  "api": "1.0.0",
  "main": "dist/code.js",
  "ui": "src/ui.html",
  "editorType": ["figma"]
}
```

- [ ] **Step 2: Create package.json**

```json
{
  "name": "appfence-figma-plugin",
  "version": "1.0.0",
  "scripts": {
    "build": "esbuild src/code.ts --bundle --outfile=dist/code.js --target=es6",
    "watch": "esbuild src/code.ts --bundle --outfile=dist/code.js --target=es6 --watch"
  },
  "devDependencies": {
    "@figma/plugin-typings": "^1.90.0",
    "esbuild": "^0.20.0",
    "typescript": "^5.3.0"
  }
}
```

- [ ] **Step 3: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "es6",
    "lib": ["es6"],
    "strict": true,
    "moduleResolution": "node",
    "typeRoots": ["./node_modules/@figma/plugin-typings"],
    "outDir": "dist",
    "skipLibCheck": true
  },
  "include": ["src/**/*.ts"]
}
```

- [ ] **Step 4: Create build.sh**

```bash
#!/bin/bash
mkdir -p dist
npx esbuild src/code.ts --bundle --outfile=dist/code.js --target=es6
echo "Build complete: dist/code.js"
```

Make executable: `chmod +x build.sh`

- [ ] **Step 5: Create src/ui.html**

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: system-ui, sans-serif; padding: 16px; background: #0D1B2A; color: #E0E0E0; margin: 0; }
    h2 { font-size: 14px; font-weight: 700; color: #00E5CC; margin: 0 0 8px; }
    p { font-size: 11px; color: #B0BEC5; margin: 0 0 16px; line-height: 1.5; }
    button {
      width: 100%; padding: 12px; background: #00E5CC; color: #003731;
      border: none; border-radius: 8px; font-size: 13px; font-weight: 700;
      cursor: pointer;
    }
    button:hover { background: #00BFA5; }
    #status { margin-top: 12px; font-size: 11px; color: #B0BEC5; min-height: 16px; }
  </style>
</head>
<body>
  <h2>AppFence Design System</h2>
  <p>Creates 4 pages: Design System, Component Library, Screens, and Design Tokens with all colors, typography, components, and screen frames.</p>
  <button id="create" onclick="onCreate()">Create Design System</button>
  <div id="status"></div>
  <script>
    function onCreate() {
      document.getElementById('create').disabled = true;
      document.getElementById('status').textContent = 'Building design system…';
      parent.postMessage({ pluginMessage: { type: 'create' } }, '*');
    }
    window.onmessage = (event) => {
      const msg = event.data.pluginMessage;
      if (msg && msg.type === 'progress') {
        document.getElementById('status').textContent = msg.text;
      }
      if (msg && msg.type === 'done') {
        document.getElementById('status').textContent = '✓ Done! ' + msg.text;
        document.getElementById('create').disabled = false;
      }
      if (msg && msg.type === 'error') {
        document.getElementById('status').textContent = '✗ Error: ' + msg.text;
        document.getElementById('create').disabled = false;
      }
    };
  </script>
</body>
</html>
```

- [ ] **Step 6: Create src/code.ts entry stub**

```typescript
// AppFence Design System Figma Plugin
// Orchestrates design-system, components, and screens modules

figma.showUI(__html__, { width: 320, height: 220 });

figma.ui.onmessage = async (msg) => {
  if (msg.type !== 'create') return;

  try {
    figma.ui.postMessage({ type: 'progress', text: 'Loading fonts…' });
    await loadFonts();

    figma.ui.postMessage({ type: 'progress', text: 'Creating pages…' });
    setupPages();

    figma.ui.postMessage({ type: 'progress', text: 'Building Design System page…' });
    // buildDesignSystem() — implemented in Task 4

    figma.ui.postMessage({ type: 'progress', text: 'Building Component Library…' });
    // buildComponents() — implemented in Tasks 5-7

    figma.ui.postMessage({ type: 'progress', text: 'Building Screens…' });
    // buildScreens() — implemented in Tasks 8-10

    figma.ui.postMessage({ type: 'done', text: '4 pages created successfully.' });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    figma.ui.postMessage({ type: 'error', text: msg });
  }
};

async function loadFonts() {
  const fonts: FontName[] = [
    { family: 'Inter', style: 'Regular' },
    { family: 'Inter', style: 'Medium' },
    { family: 'Inter', style: 'SemiBold' },
    { family: 'Inter', style: 'Bold' },
  ];
  await Promise.all(fonts.map(f => figma.loadFontAsync(f)));
}

function setupPages() {
  const pageNames = ['🎨 Design System', '🧩 Component Library', '📱 Screens', '📦 Design Tokens'];
  // Remove default pages, add ours
  while (figma.root.children.length > 1) {
    figma.root.children[figma.root.children.length - 1].remove();
  }
  figma.root.children[0].name = pageNames[0];
  for (let i = 1; i < pageNames.length; i++) {
    figma.createPage().name = pageNames[i];
  }
}
```

- [ ] **Step 7: Create .gitignore**

```
node_modules/
dist/
```

- [ ] **Step 8: Install dependencies**

```bash
cd figma-plugin && npm install
```

Expected: `node_modules/@figma/plugin-typings` installed, no errors.

- [ ] **Step 9: Build to verify scaffold compiles**

```bash
cd figma-plugin && npm run build
```

Expected: `dist/code.js` created, no TypeScript errors.

- [ ] **Step 10: Commit**

```bash
git add figma-plugin/
git commit -m "feat: scaffold AppFence Figma plugin"
```

---

## Task 2: Design Tokens Module

**Files:**
- Create: `figma-plugin/src/tokens.ts`

- [ ] **Step 1: Create tokens.ts with all design constants**

```typescript
// All design values from docs/design-system/design-system.md

export const COLORS = {
  primary: { default: { r: 0, g: 0.898, b: 0.8 },       hex: '#00E5CC' },
  primaryVariant: { r: 0, g: 0.749, b: 0.647 },
  primaryDark:    { r: 0, g: 0.588, b: 0.533 },
  primaryOn:      { r: 0, g: 0.216, b: 0.192 },

  secondary:        { r: 0.392, g: 0.710, b: 0.965 },
  secondaryVariant: { r: 0.259, g: 0.647, b: 0.961 },
  secondaryOn:      { r: 0.051, g: 0.106, b: 0.165 },

  background: { r: 0.051, g: 0.106, b: 0.165 },   // #0D1B2A
  surface:    { r: 0.106, g: 0.157, b: 0.220 },   // #1B2838
  surfaceVariant:  { r: 0.141, g: 0.204, b: 0.278 }, // #243447
  surfaceElevated: { r: 0.173, g: 0.243, b: 0.314 }, // #2C3E50

  onBackground:       { r: 0.878, g: 0.878, b: 0.878 }, // #E0E0E0
  onSurface:          { r: 0.878, g: 0.878, b: 0.878 },
  onSurfaceVariant:   { r: 0.690, g: 0.745, b: 0.773 }, // #B0BEC5

  statusAllowed:  { r: 0.298, g: 0.686, b: 0.314 }, // #4CAF50
  statusWifi:     { r: 0.259, g: 0.647, b: 0.961 }, // #42A5F5
  statusData:     { r: 1,     g: 0.596, b: 0 },     // #FF9800
  statusBlocked:  { r: 0.937, g: 0.325, b: 0.314 }, // #EF5350

  error:   { r: 0.808, g: 0.400, b: 0.475 }, // #CF6679
  divider: { r: 0.216, g: 0.278, b: 0.310 }, // #37474F
};

export type RGB = { r: number; g: number; b: number };

export function rgb(color: RGB): Paint[] {
  return [{ type: 'SOLID', color }];
}

export function rgba(color: RGB, opacity: number): Paint[] {
  return [{ type: 'SOLID', color, opacity }];
}

export const SPACING = { s1:4, s2:8, s3:12, s4:16, s5:20, s6:24, s8:32, s12:48, s14:56 };

export const RADIUS = { xsmall:6, small:12, medium:14, large:16, xlarge:20, full:9999 };

export type TypeStyle = {
  size: number; weight: 'Regular'|'Medium'|'SemiBold'|'Bold';
  lineHeight: number; tracking?: number;
};

export const TYPE: Record<string, TypeStyle> = {
  displayLarge:   { size:32, weight:'Bold',     lineHeight:40, tracking:-0.5 },
  headlineLarge:  { size:28, weight:'Bold',     lineHeight:36 },
  headlineMedium: { size:24, weight:'SemiBold', lineHeight:32 },
  headlineSmall:  { size:20, weight:'SemiBold', lineHeight:28 },
  titleLarge:     { size:18, weight:'SemiBold', lineHeight:26 },
  titleMedium:    { size:16, weight:'Medium',   lineHeight:24, tracking:0.15 },
  titleSmall:     { size:14, weight:'Medium',   lineHeight:20, tracking:0.10 },
  bodyLarge:      { size:16, weight:'Regular',  lineHeight:24, tracking:0.5 },
  bodyMedium:     { size:14, weight:'Regular',  lineHeight:20, tracking:0.25 },
  bodySmall:      { size:12, weight:'Regular',  lineHeight:16, tracking:0.4 },
  labelLarge:     { size:14, weight:'Medium',   lineHeight:20, tracking:0.1 },
  labelMedium:    { size:12, weight:'Medium',   lineHeight:16, tracking:0.5 },
  labelSmall:     { size:10, weight:'Medium',   lineHeight:14, tracking:0.5 },
};
```

- [ ] **Step 2: Build to verify no type errors**

```bash
cd figma-plugin && npm run build
```

Expected: exits 0, `dist/code.js` updated.

- [ ] **Step 3: Commit**

```bash
git add figma-plugin/src/tokens.ts
git commit -m "feat(plugin): add design tokens module"
```

---

## Task 3: Helpers Module

**Files:**
- Create: `figma-plugin/src/helpers.ts`

- [ ] **Step 1: Create helpers.ts**

```typescript
import { RGB, TypeStyle, rgb } from './tokens';

export function getPage(name: string): PageNode {
  const page = figma.root.children.find(p => p.name === name) as PageNode | undefined;
  if (!page) throw new Error(`Page not found: ${name}`);
  return page;
}

export function makeFrame(
  name: string, w: number, h: number,
  fillColor?: RGB, parent?: FrameNode | PageNode
): FrameNode {
  const f = figma.createFrame();
  f.name = name;
  f.resize(w, h);
  if (fillColor) f.fills = rgb(fillColor);
  else f.fills = [];
  if (parent) parent.appendChild(f);
  return f;
}

export function makeRect(
  name: string, w: number, h: number, fillColor: RGB,
  cornerRadius = 0, parent?: FrameNode
): RectangleNode {
  const r = figma.createRectangle();
  r.name = name;
  r.resize(w, h);
  r.fills = rgb(fillColor);
  if (cornerRadius > 0) r.cornerRadius = cornerRadius;
  if (parent) parent.appendChild(r);
  return r;
}

export function makeCircle(
  name: string, size: number, fillColor: RGB, parent?: FrameNode
): EllipseNode {
  const e = figma.createEllipse();
  e.name = name;
  e.resize(size, size);
  e.fills = rgb(fillColor);
  if (parent) parent.appendChild(e);
  return e;
}

export function makeText(
  content: string, style: TypeStyle, color: RGB,
  parent?: FrameNode | PageNode
): TextNode {
  const t = figma.createText();
  t.fontName = { family: 'Inter', style: style.weight };
  t.fontSize = style.size;
  t.lineHeight = { value: style.lineHeight, unit: 'PIXELS' };
  if (style.tracking) t.letterSpacing = { value: style.tracking, unit: 'PIXELS' };
  t.fills = rgb(color);
  t.characters = content;
  if (parent) parent.appendChild(t);
  return t;
}

export function applyAutoLayout(
  frame: FrameNode,
  direction: 'HORIZONTAL' | 'VERTICAL',
  gap: number,
  padH = 0, padV = 0
): void {
  frame.layoutMode = direction;
  frame.itemSpacing = gap;
  frame.paddingLeft = padH;
  frame.paddingRight = padH;
  frame.paddingTop = padV;
  frame.paddingBottom = padV;
  frame.primaryAxisSizingMode = 'AUTO';
  frame.counterAxisSizingMode = 'AUTO';
}

export function positionAt(node: SceneNode, x: number, y: number): void {
  node.x = x;
  node.y = y;
}
```

- [ ] **Step 2: Build**

```bash
cd figma-plugin && npm run build
```

Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add figma-plugin/src/helpers.ts
git commit -m "feat(plugin): add node creation helpers"
```

---

## Task 4: Design System Page (Page 1)

**Files:**
- Create: `figma-plugin/src/design-system.ts`
- Modify: `figma-plugin/src/code.ts` (wire in buildDesignSystem)

- [ ] **Step 1: Create design-system.ts**

```typescript
import { COLORS, SPACING, RADIUS, TYPE, rgb, rgba, RGB } from './tokens';
import { getPage, makeFrame, makeRect, makeText, applyAutoLayout, positionAt } from './helpers';

export async function buildDesignSystem(): Promise<void> {
  const page = getPage('🎨 Design System');
  page.fills = rgb(COLORS.background);

  buildColorSection(page);
  buildTypographySection(page);
  buildShapeSection(page);
  buildSpacingSection(page);
}

function buildColorSection(page: PageNode): void {
  const frame = makeFrame('Color Palette', 1200, 900, COLORS.background);
  page.appendChild(frame);
  positionAt(frame, 0, 0);

  const label = makeText('COLOR PALETTE', TYPE.labelSmall, COLORS.onSurfaceVariant, frame);
  label.letterSpacing = { value: 100, unit: 'PERCENT' };
  positionAt(label, 24, 24);

  const groups: Array<{ title: string; swatches: Array<{ name: string; color: RGB; hex: string }> }> = [
    {
      title: 'Primary (Teal)',
      swatches: [
        { name: 'primary/default',  color: COLORS.primary.default, hex: '#00E5CC' },
        { name: 'primary/variant',  color: COLORS.primaryVariant,  hex: '#00BFA5' },
        { name: 'primary/dark',     color: COLORS.primaryDark,     hex: '#009688' },
        { name: 'primary/on',       color: COLORS.primaryOn,       hex: '#003731' },
      ],
    },
    {
      title: 'Secondary (Electric Blue)',
      swatches: [
        { name: 'secondary/default',  color: COLORS.secondary,        hex: '#64B5F6' },
        { name: 'secondary/variant',  color: COLORS.secondaryVariant, hex: '#42A5F5' },
        { name: 'secondary/on',       color: COLORS.secondaryOn,      hex: '#0D1B2A' },
      ],
    },
    {
      title: 'Background & Surface',
      swatches: [
        { name: 'background/default', color: COLORS.background,      hex: '#0D1B2A' },
        { name: 'surface/default',    color: COLORS.surface,         hex: '#1B2838' },
        { name: 'surface/variant',    color: COLORS.surfaceVariant,  hex: '#243447' },
        { name: 'surface/elevated',   color: COLORS.surfaceElevated, hex: '#2C3E50' },
      ],
    },
    {
      title: 'Status Colors',
      swatches: [
        { name: 'status/allowed',   color: COLORS.statusAllowed, hex: '#4CAF50' },
        { name: 'status/wifi-only', color: COLORS.statusWifi,    hex: '#42A5F5' },
        { name: 'status/data-only', color: COLORS.statusData,    hex: '#FF9800' },
        { name: 'status/blocked',   color: COLORS.statusBlocked, hex: '#EF5350' },
      ],
    },
    {
      title: 'Utility',
      swatches: [
        { name: 'utility/error',   color: COLORS.error,   hex: '#CF6679' },
        { name: 'utility/divider', color: COLORS.divider, hex: '#37474F' },
      ],
    },
  ];

  let yOffset = 56;
  for (const group of groups) {
    const heading = makeText(group.title, TYPE.titleSmall, COLORS.onBackground, frame);
    positionAt(heading, 24, yOffset);
    yOffset += 28;

    let xOffset = 24;
    for (const swatch of group.swatches) {
      const swatchRect = makeRect(swatch.name, 160, 60, swatch.color, 8, frame);
      positionAt(swatchRect, xOffset, yOffset);

      const nameLabel = makeText(swatch.name, TYPE.labelSmall, COLORS.onSurfaceVariant, frame);
      positionAt(nameLabel, xOffset, yOffset + 64);

      const hexLabel = makeText(swatch.hex, TYPE.labelSmall, COLORS.onSurfaceVariant, frame);
      positionAt(hexLabel, xOffset, yOffset + 78);

      xOffset += 172;
    }
    yOffset += 110;
  }
}

function buildTypographySection(page: PageNode): void {
  const frame = makeFrame('Typography Scale', 1200, 1000, COLORS.background);
  page.appendChild(frame);
  positionAt(frame, 1264, 0);

  const label = makeText('TYPOGRAPHY SCALE', TYPE.labelSmall, COLORS.onSurfaceVariant, frame);
  label.letterSpacing = { value: 100, unit: 'PERCENT' };
  positionAt(label, 24, 24);

  const specimens: Array<{ style: string; text: string; color: RGB }> = [
    { style: 'displayLarge',   text: 'Welcome to AppFence',                        color: COLORS.primary.default },
    { style: 'headlineLarge',  text: 'Network Firewall',                            color: COLORS.onBackground },
    { style: 'headlineMedium', text: 'App Permissions',                             color: COLORS.onBackground },
    { style: 'headlineSmall',  text: 'VPN Settings',                               color: COLORS.onBackground },
    { style: 'titleLarge',     text: 'AppFence',                                   color: COLORS.onBackground },
    { style: 'titleMedium',    text: 'Block new apps by default',                  color: COLORS.onBackground },
    { style: 'titleSmall',     text: 'Camera',                                     color: COLORS.onBackground },
    { style: 'bodyLarge',      text: 'Control which apps can access the internet', color: COLORS.onBackground },
    { style: 'bodyMedium',     text: 'No root required',                           color: COLORS.onSurfaceVariant },
    { style: 'bodySmall',      text: 'com.android.camera2',                        color: COLORS.onSurfaceVariant },
    { style: 'labelLarge',     text: 'GRANT VPN PERMISSION',                       color: COLORS.primaryOn },
    { style: 'labelMedium',    text: 'Allowed',                                    color: COLORS.statusAllowed },
    { style: 'labelSmall',     text: 'A system dialog will appear',                color: COLORS.onSurfaceVariant },
  ];

  let yOffset = 56;
  for (const s of specimens) {
    const ts = TYPE[s.style];
    const styleLabel = makeText(s.style, TYPE.labelSmall, COLORS.divider, frame);
    positionAt(styleLabel, 24, yOffset + (ts.size - 10) / 2);

    const specimen = makeText(s.text, ts, s.color, frame);
    positionAt(specimen, 220, yOffset);

    yOffset += ts.lineHeight + 16;
  }
}

function buildShapeSection(page: PageNode): void {
  const frame = makeFrame('Shape System', 800, 200, COLORS.background);
  page.appendChild(frame);
  positionAt(frame, 1264, 1064);

  const label = makeText('SHAPE SYSTEM', TYPE.labelSmall, COLORS.onSurfaceVariant, frame);
  label.letterSpacing = { value: 100, unit: 'PERCENT' };
  positionAt(label, 24, 24);

  const shapes = [
    { name: 'xsmall', radius: RADIUS.xsmall, label: '6dp' },
    { name: 'small',  radius: RADIUS.small,  label: '12dp' },
    { name: 'medium', radius: RADIUS.medium, label: '14dp' },
    { name: 'large',  radius: RADIUS.large,  label: '16dp' },
    { name: 'xlarge', radius: RADIUS.xlarge, label: '20dp' },
    { name: 'full',   radius: 40,            label: 'Circle' },
  ];

  let xOffset = 24;
  for (const s of shapes) {
    const rect = makeRect(s.name, 80, 80, COLORS.surfaceVariant, s.radius, frame);
    positionAt(rect, xOffset, 56);
    const lbl = makeText(s.label, TYPE.labelSmall, COLORS.onSurfaceVariant, frame);
    positionAt(lbl, xOffset, 144);
    xOffset += 96;
  }
}

function buildSpacingSection(page: PageNode): void {
  const frame = makeFrame('Spacing System', 800, 300, COLORS.background);
  page.appendChild(frame);
  positionAt(frame, 1264, 1288);

  const label = makeText('SPACING SYSTEM', TYPE.labelSmall, COLORS.onSurfaceVariant, frame);
  label.letterSpacing = { value: 100, unit: 'PERCENT' };
  positionAt(label, 24, 24);

  const spacings = [
    { name: 'spacing/1', value: SPACING.s1 },
    { name: 'spacing/2', value: SPACING.s2 },
    { name: 'spacing/3', value: SPACING.s3 },
    { name: 'spacing/4', value: SPACING.s4 },
    { name: 'spacing/5', value: SPACING.s5 },
    { name: 'spacing/6', value: SPACING.s6 },
    { name: 'spacing/8', value: SPACING.s8 },
    { name: 'spacing/12', value: SPACING.s12 },
    { name: 'spacing/14', value: SPACING.s14 },
  ];

  let xOffset = 24;
  for (const s of spacings) {
    const barHeight = Math.max(s.value * 2, 4);
    const bar = makeRect(s.name, 40, barHeight, COLORS.primary.default, 0, frame);
    bar.fills = rgba(COLORS.primary.default, 0.2);
    bar.strokes = rgb(COLORS.primary.default);
    bar.strokeWeight = 1;
    positionAt(bar, xOffset, 56);

    const lbl = makeText(`${s.value}dp`, TYPE.labelSmall, COLORS.onSurfaceVariant, frame);
    positionAt(lbl, xOffset, 56 + barHeight + 4);

    const name = makeText(s.name.split('/')[1], TYPE.labelSmall, COLORS.divider, frame);
    positionAt(name, xOffset, 56 + barHeight + 18);

    xOffset += 56;
  }
}
```

- [ ] **Step 2: Wire into code.ts — replace the comment placeholder**

In `figma-plugin/src/code.ts`, replace the `// buildDesignSystem()` comment line with:

```typescript
import { buildDesignSystem } from './design-system';
// ... (add at top of file)

// Inside the try block, replace the comment:
await buildDesignSystem();
```

Full updated `code.ts`:

```typescript
import { buildDesignSystem } from './design-system';

figma.showUI(__html__, { width: 320, height: 220 });

figma.ui.onmessage = async (msg) => {
  if (msg.type !== 'create') return;

  try {
    figma.ui.postMessage({ type: 'progress', text: 'Loading fonts…' });
    await loadFonts();

    figma.ui.postMessage({ type: 'progress', text: 'Creating pages…' });
    setupPages();

    figma.ui.postMessage({ type: 'progress', text: 'Building Design System page…' });
    await buildDesignSystem();

    figma.ui.postMessage({ type: 'done', text: '4 pages created successfully.' });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    figma.ui.postMessage({ type: 'error', text: msg });
  }
};

async function loadFonts() {
  const fonts: FontName[] = [
    { family: 'Inter', style: 'Regular' },
    { family: 'Inter', style: 'Medium' },
    { family: 'Inter', style: 'SemiBold' },
    { family: 'Inter', style: 'Bold' },
  ];
  await Promise.all(fonts.map(f => figma.loadFontAsync(f)));
}

function setupPages() {
  const pageNames = ['🎨 Design System', '🧩 Component Library', '📱 Screens', '📦 Design Tokens'];
  while (figma.root.children.length > 1) {
    figma.root.children[figma.root.children.length - 1].remove();
  }
  figma.root.children[0].name = pageNames[0];
  for (let i = 1; i < pageNames.length; i++) {
    figma.createPage().name = pageNames[i];
  }
}
```

- [ ] **Step 3: Build**

```bash
cd figma-plugin && npm run build
```

Expected: exits 0, no errors.

- [ ] **Step 4: Commit**

```bash
git add figma-plugin/src/design-system.ts figma-plugin/src/code.ts
git commit -m "feat(plugin): build Design System page (colors, type, shapes, spacing)"
```

---

## Task 5: Components Module — Atoms

**Files:**
- Create: `figma-plugin/src/components.ts` (atoms section)
- Modify: `figma-plugin/src/code.ts` (wire in buildComponents)

- [ ] **Step 1: Create components.ts with atom builders**

```typescript
import { COLORS, TYPE, RADIUS, rgb, rgba } from './tokens';
import { getPage, makeFrame, makeRect, makeCircle, makeText, positionAt } from './helpers';

// Master component registry — used by molecules/organisms to get references
export const COMPONENTS: Record<string, ComponentNode> = {};

export async function buildComponents(): Promise<void> {
  const page = getPage('🧩 Component Library');
  page.fills = rgb(COLORS.background);
  buildAtoms(page);
  buildMolecules(page);
  buildOrganisms(page);
}

function buildAtoms(page: PageNode): void {
  const section = makeFrame('Atoms', 1400, 800, COLORS.background);
  page.appendChild(section);
  positionAt(section, 0, 0);

  let x = 24;

  // StatusBadge — 4 variants
  const badgeVariants = [
    { name: 'Allowed',   color: COLORS.statusAllowed, text: 'Allowed' },
    { name: 'Wi-Fi Only',color: COLORS.statusWifi,    text: 'Wi-Fi Only' },
    { name: 'Data Only', color: COLORS.statusData,    text: 'Data Only' },
    { name: 'Blocked',   color: COLORS.statusBlocked, text: 'Blocked' },
  ];
  const badgeComponents: ComponentNode[] = [];
  for (const v of badgeVariants) {
    const comp = figma.createComponent();
    comp.name = `StatusBadge/Status=${v.name}`;
    comp.layoutMode = 'HORIZONTAL';
    comp.paddingLeft = 8; comp.paddingRight = 8;
    comp.paddingTop = 2; comp.paddingBottom = 2;
    comp.cornerRadius = RADIUS.xsmall;
    comp.fills = rgba(v.color, 0.13);
    comp.primaryAxisSizingMode = 'AUTO';
    comp.counterAxisSizingMode = 'AUTO';
    const t = makeText(v.text, TYPE.labelMedium, v.color, comp);
    badgeComponents.push(comp);
    section.appendChild(comp);
    positionAt(comp, x, 56);
    x += comp.width + 12;
  }
  const badgeSet = figma.combineAsVariants(badgeComponents, section);
  badgeSet.name = 'StatusBadge';
  COMPONENTS['StatusBadge'] = badgeComponents[0];

  x += 24;

  // Button / Primary
  const btnPrimary = figma.createComponent();
  btnPrimary.name = 'Button/Primary';
  btnPrimary.layoutMode = 'HORIZONTAL';
  btnPrimary.paddingLeft = 24; btnPrimary.paddingRight = 24;
  btnPrimary.paddingTop = 16; btnPrimary.paddingBottom = 16;
  btnPrimary.cornerRadius = RADIUS.medium;
  btnPrimary.fills = rgb(COLORS.primary.default);
  btnPrimary.primaryAxisSizingMode = 'AUTO';
  btnPrimary.counterAxisSizingMode = 'AUTO';
  makeText('Grant VPN Permission', TYPE.labelLarge, COLORS.primaryOn, btnPrimary);
  section.appendChild(btnPrimary);
  positionAt(btnPrimary, x, 56);
  COMPONENTS['Button/Primary'] = btnPrimary;
  x += btnPrimary.width + 24;

  // Button / Outlined
  const btnOutlined = figma.createComponent();
  btnOutlined.name = 'Button/Outlined';
  btnOutlined.layoutMode = 'HORIZONTAL';
  btnOutlined.paddingLeft = 24; btnOutlined.paddingRight = 24;
  btnOutlined.paddingTop = 16; btnOutlined.paddingBottom = 16;
  btnOutlined.cornerRadius = RADIUS.medium;
  btnOutlined.fills = [];
  btnOutlined.strokes = rgb(COLORS.statusBlocked);
  btnOutlined.strokeWeight = 1;
  btnOutlined.primaryAxisSizingMode = 'AUTO';
  btnOutlined.counterAxisSizingMode = 'AUTO';
  makeText('Stop VPN', TYPE.labelLarge, COLORS.statusBlocked, btnOutlined);
  section.appendChild(btnOutlined);
  positionAt(btnOutlined, x, 56);
  COMPONENTS['Button/Outlined'] = btnOutlined;
  x += btnOutlined.width + 24;

  // Toggle Switch — On / Off variants
  const switchOn = figma.createComponent();
  switchOn.name = 'Toggle Switch/State=On';
  switchOn.resize(32, 16);
  switchOn.cornerRadius = 8;
  switchOn.fills = rgb(COLORS.primary.default);
  const thumbOn = makeCircle('Thumb', 12, { r:1, g:1, b:1 }, switchOn);
  positionAt(thumbOn, 18, 2);
  section.appendChild(switchOn);
  positionAt(switchOn, x, 56);

  const switchOff = figma.createComponent();
  switchOff.name = 'Toggle Switch/State=Off';
  switchOff.resize(32, 16);
  switchOff.cornerRadius = 8;
  switchOff.fills = rgb(COLORS.divider);
  const thumbOff = makeCircle('Thumb', 12, COLORS.onSurfaceVariant, switchOff);
  positionAt(thumbOff, 2, 2);
  section.appendChild(switchOff);
  positionAt(switchOff, x, 80);

  const switchSet = figma.combineAsVariants([switchOn, switchOff], section);
  switchSet.name = 'Toggle Switch';
  COMPONENTS['Toggle Switch/On'] = switchOn;
  COMPONENTS['Toggle Switch/Off'] = switchOff;
  x += 56;

  // VPN Status Dot
  const dotActive = figma.createComponent();
  dotActive.name = 'VPN Status Dot/State=Active';
  dotActive.resize(8, 8);
  dotActive.fills = rgb(COLORS.statusAllowed);
  section.appendChild(dotActive);
  positionAt(dotActive, x, 56);

  const dotInactive = figma.createComponent();
  dotInactive.name = 'VPN Status Dot/State=Inactive';
  dotInactive.resize(8, 8);
  dotInactive.fills = rgb(COLORS.divider);
  section.appendChild(dotInactive);
  positionAt(dotInactive, x, 72);

  figma.combineAsVariants([dotActive, dotInactive], section).name = 'VPN Status Dot';
  COMPONENTS['VPN Status Dot/Active'] = dotActive;
  COMPONENTS['VPN Status Dot/Inactive'] = dotInactive;
  x += 32;

  // App Icon / In-List
  const iconInList = figma.createComponent();
  iconInList.name = 'App Icon/In-List';
  iconInList.resize(44, 44);
  iconInList.cornerRadius = RADIUS.small;
  iconInList.fills = rgb(COLORS.surfaceVariant);
  section.appendChild(iconInList);
  positionAt(iconInList, x, 56);
  COMPONENTS['App Icon/In-List'] = iconInList;
  x += 56;

  // Divider
  const divider = figma.createComponent();
  divider.name = 'Divider';
  divider.resize(400, 1);
  divider.fills = rgb(COLORS.divider);
  section.appendChild(divider);
  positionAt(divider, x, 56);
  COMPONENTS['Divider'] = divider;
}

function buildMolecules(page: PageNode): void {
  const section = makeFrame('Molecules', 1400, 500, COLORS.background);
  page.appendChild(section);
  positionAt(section, 0, 830);

  let x = 24;

  // FilterChip — Selected / Unselected
  const chipSelected = figma.createComponent();
  chipSelected.name = 'FilterChip/State=Selected';
  chipSelected.layoutMode = 'HORIZONTAL';
  chipSelected.paddingLeft = 10; chipSelected.paddingRight = 10;
  chipSelected.paddingTop = 3; chipSelected.paddingBottom = 3;
  chipSelected.cornerRadius = RADIUS.small;
  chipSelected.fills = rgba(COLORS.primary.default, 0.12);
  chipSelected.strokes = rgb(COLORS.primary.default);
  chipSelected.strokeWeight = 1;
  chipSelected.primaryAxisSizingMode = 'AUTO';
  chipSelected.counterAxisSizingMode = 'AUTO';
  makeText('All', TYPE.labelMedium, COLORS.primary.default, chipSelected);
  section.appendChild(chipSelected);
  positionAt(chipSelected, x, 56);

  const chipUnselected = figma.createComponent();
  chipUnselected.name = 'FilterChip/State=Unselected';
  chipUnselected.layoutMode = 'HORIZONTAL';
  chipUnselected.paddingLeft = 10; chipUnselected.paddingRight = 10;
  chipUnselected.paddingTop = 3; chipUnselected.paddingBottom = 3;
  chipUnselected.cornerRadius = RADIUS.small;
  chipUnselected.fills = rgb(COLORS.surfaceElevated);
  chipUnselected.strokes = rgb(COLORS.divider);
  chipUnselected.strokeWeight = 1;
  chipUnselected.primaryAxisSizingMode = 'AUTO';
  chipUnselected.counterAxisSizingMode = 'AUTO';
  makeText('User Apps', TYPE.labelMedium, COLORS.onSurfaceVariant, chipUnselected);
  section.appendChild(chipUnselected);
  positionAt(chipUnselected, x, 88);

  figma.combineAsVariants([chipSelected, chipUnselected], section).name = 'FilterChip';
  COMPONENTS['FilterChip/Selected'] = chipSelected;
  x += 150;

  // Feature Bullet
  const bullet = figma.createComponent();
  bullet.name = 'Feature Bullet';
  bullet.layoutMode = 'HORIZONTAL';
  bullet.paddingLeft = 12; bullet.paddingRight = 12;
  bullet.paddingTop = 10; bullet.paddingBottom = 10;
  bullet.itemSpacing = 10;
  bullet.cornerRadius = RADIUS.small;
  bullet.fills = rgb(COLORS.surface);
  bullet.primaryAxisSizingMode = 'AUTO';
  bullet.counterAxisSizingMode = 'AUTO';
  const iconHolder = makeRect('Icon', 24, 24, COLORS.surfaceVariant, 4, bullet);
  const textCol = figma.createFrame();
  textCol.name = 'Text';
  textCol.layoutMode = 'VERTICAL';
  textCol.itemSpacing = 2;
  textCol.fills = [];
  textCol.primaryAxisSizingMode = 'AUTO';
  textCol.counterAxisSizingMode = 'AUTO';
  makeText('Local VPN', TYPE.titleSmall, COLORS.onBackground, textCol);
  makeText('No data leaves your device', TYPE.bodySmall, COLORS.onSurfaceVariant, textCol);
  bullet.appendChild(textCol);
  section.appendChild(bullet);
  positionAt(bullet, x, 56);
  COMPONENTS['Feature Bullet'] = bullet;
  x += bullet.width + 24;

  // Network Status Bar — Active
  const nsBar = figma.createComponent();
  nsBar.name = 'Network Status Bar/VPN State=Active';
  nsBar.layoutMode = 'HORIZONTAL';
  nsBar.paddingLeft = 12; nsBar.paddingRight = 12;
  nsBar.paddingTop = 8; nsBar.paddingBottom = 8;
  nsBar.itemSpacing = 8;
  nsBar.resize(360, 36);
  nsBar.fills = rgba(COLORS.primary.default, 0.12);
  nsBar.counterAxisAlignItems = 'CENTER';
  const dot = makeCircle('Dot', 8, COLORS.statusAllowed, nsBar);
  makeText('VPN Active', TYPE.bodySmall, COLORS.onBackground, nsBar);
  const spacer = figma.createFrame();
  spacer.name = 'Spacer';
  spacer.fills = [];
  spacer.layoutGrow = 1;
  spacer.resize(1, 1);
  nsBar.appendChild(spacer);
  makeText('Wi-Fi', TYPE.bodySmall, COLORS.secondary, nsBar);
  section.appendChild(nsBar);
  positionAt(nsBar, x, 56);
  COMPONENTS['Network Status Bar'] = nsBar;
}

function buildOrganisms(page: PageNode): void {
  const section = makeFrame('Organisms', 1400, 800, COLORS.background);
  page.appendChild(section);
  positionAt(section, 0, 1360);

  let x = 24;

  // AppListItem — Allowed variant
  const item = figma.createComponent();
  item.name = 'AppListItem/Status=Allowed';
  item.layoutMode = 'HORIZONTAL';
  item.paddingLeft = 12; item.paddingRight = 12;
  item.paddingTop = 8; item.paddingBottom = 8;
  item.itemSpacing = 8;
  item.cornerRadius = RADIUS.large;
  item.fills = rgb(COLORS.surface);
  item.counterAxisAlignItems = 'CENTER';
  item.primaryAxisSizingMode = 'AUTO';
  item.counterAxisSizingMode = 'AUTO';

  const appIcon = makeRect('App Icon', 44, 44, COLORS.surfaceVariant, RADIUS.small, item);
  const nameCol = figma.createFrame();
  nameCol.name = 'App Info';
  nameCol.layoutMode = 'VERTICAL';
  nameCol.itemSpacing = 2;
  nameCol.fills = [];
  nameCol.layoutGrow = 1;
  nameCol.primaryAxisSizingMode = 'AUTO';
  nameCol.counterAxisSizingMode = 'AUTO';
  makeText('Camera', TYPE.titleSmall, COLORS.onBackground, nameCol);
  makeText('com.android.camera2', TYPE.bodySmall, COLORS.onSurfaceVariant, nameCol);
  item.appendChild(nameCol);

  const badge = makeRect('Badge', 48, 18, COLORS.statusAllowed, RADIUS.xsmall, item);
  badge.fills = rgba(COLORS.statusAllowed, 0.13);

  const wifiToggle = makeRect('Wi-Fi Toggle', 32, 16, COLORS.primary.default, 8, item);
  const dataToggle = makeRect('Data Toggle', 32, 16, COLORS.primary.default, 8, item);

  section.appendChild(item);
  positionAt(item, x, 56);
  COMPONENTS['AppListItem'] = item;
  x += item.width + 24;

  // TopAppBar / Main
  const topBar = figma.createComponent();
  topBar.name = 'TopAppBar/Main';
  topBar.layoutMode = 'HORIZONTAL';
  topBar.paddingLeft = 16; topBar.paddingRight = 16;
  topBar.paddingTop = 0; topBar.paddingBottom = 0;
  topBar.itemSpacing = 8;
  topBar.resize(360, 56);
  topBar.fills = rgb(COLORS.background);
  topBar.counterAxisAlignItems = 'CENTER';

  const logo = makeRect('Logo', 18, 14, COLORS.primary.default, 3, topBar);
  makeText('AppFence', TYPE.titleLarge, COLORS.onBackground, topBar);
  const spacerBar = figma.createFrame();
  spacerBar.name = 'Spacer';
  spacerBar.fills = [];
  spacerBar.layoutGrow = 1;
  spacerBar.resize(1, 1);
  topBar.appendChild(spacerBar);
  makeRect('Search Icon', 24, 24, COLORS.onSurfaceVariant, 0, topBar);
  makeRect('Settings Icon', 24, 24, COLORS.onSurfaceVariant, 0, topBar);
  section.appendChild(topBar);
  positionAt(topBar, x, 56);
  COMPONENTS['TopAppBar/Main'] = topBar;
  x += 380;

  // VPN Status Card — Active
  const card = figma.createComponent();
  card.name = 'VPN Status Card/VPN State=Active';
  card.layoutMode = 'VERTICAL';
  card.paddingLeft = 16; card.paddingRight = 16;
  card.paddingTop = 20; card.paddingBottom = 20;
  card.itemSpacing = 8;
  card.cornerRadius = RADIUS.xlarge;
  card.fills = rgb(COLORS.surface);
  card.primaryAxisAlignItems = 'CENTER';
  card.counterAxisAlignItems = 'CENTER';
  card.resize(328, 200);

  makeCircle('Shield', 72, COLORS.surfaceVariant, card);
  makeText('Protection Active', TYPE.headlineSmall, COLORS.onBackground, card);
  makeText('Wi-Fi Connected', TYPE.bodySmall, COLORS.onSurfaceVariant, card);

  const stopBtn = figma.createFrame();
  stopBtn.name = 'Stop VPN';
  stopBtn.layoutMode = 'HORIZONTAL';
  stopBtn.paddingLeft = 20; stopBtn.paddingRight = 20;
  stopBtn.paddingTop = 8; stopBtn.paddingBottom = 8;
  stopBtn.cornerRadius = RADIUS.medium;
  stopBtn.fills = [];
  stopBtn.strokes = rgb(COLORS.statusBlocked);
  stopBtn.strokeWeight = 1;
  stopBtn.primaryAxisSizingMode = 'AUTO';
  stopBtn.counterAxisSizingMode = 'AUTO';
  makeText('Stop VPN', TYPE.labelLarge, COLORS.statusBlocked, stopBtn);
  card.appendChild(stopBtn);

  section.appendChild(card);
  positionAt(card, x, 56);
  COMPONENTS['VPN Status Card'] = card;
}
```

- [ ] **Step 2: Wire into code.ts**

Update `code.ts` imports and call:

```typescript
import { buildDesignSystem } from './design-system';
import { buildComponents } from './components';

// In the try block, after buildDesignSystem():
figma.ui.postMessage({ type: 'progress', text: 'Building Component Library…' });
await buildComponents();
```

- [ ] **Step 3: Build**

```bash
cd figma-plugin && npm run build
```

Expected: exits 0.

- [ ] **Step 4: Commit**

```bash
git add figma-plugin/src/components.ts figma-plugin/src/code.ts
git commit -m "feat(plugin): add atoms, molecules, and organisms to Component Library"
```

---

## Task 6: Screens Module

**Files:**
- Create: `figma-plugin/src/screens.ts`
- Modify: `figma-plugin/src/code.ts` (wire in buildScreens)

- [ ] **Step 1: Create screens.ts**

```typescript
import { COLORS, TYPE, RADIUS, rgb, rgba } from './tokens';
import { getPage, makeFrame, makeRect, makeCircle, makeText, positionAt } from './helpers';

const SW = 360;
const SH = 780;

export function buildScreens(): void {
  buildOnboarding();
  buildMainScreens();
  buildSettingsScreens();
  buildTokensPage();
}

function buildOnboarding(): void {
  const page = getPage('📱 Screens');
  const frame = makeFrame('Onboarding/Default', SW, SH, COLORS.background);
  page.appendChild(frame);
  positionAt(frame, 0, 0);

  // Status bar
  const sb = makeRect('Status Bar', SW, 24, COLORS.background, 0, frame);
  const time = makeText('9:41', TYPE.labelSmall, COLORS.onSurfaceVariant, frame);
  positionAt(time, SW - 36, 4);

  // Shield glow container
  const glow = makeCircle('Shield Glow', 96, COLORS.surfaceVariant, frame);
  glow.fills = rgba(COLORS.primary.default, 0.15);
  positionAt(glow, (SW - 96) / 2, 64);

  const shield = makeCircle('Shield Icon', 64, COLORS.surfaceVariant, frame);
  shield.fills = rgba(COLORS.primary.default, 0.25);
  positionAt(shield, (SW - 64) / 2, 80);

  // Title
  const title = makeText('Welcome to AppFence', TYPE.displayLarge, COLORS.onBackground, frame);
  title.textAlignHorizontal = 'CENTER';
  title.resize(312, TYPE.displayLarge.lineHeight * 2);
  positionAt(title, 24, 176);

  // Subtitle
  const sub = makeText('Control which apps can access the internet — no root required.', TYPE.bodyLarge, COLORS.onSurfaceVariant, frame);
  sub.textAlignHorizontal = 'CENTER';
  sub.resize(312, 48);
  positionAt(sub, 24, 232);

  // Feature bullets
  for (let i = 0; i < 2; i++) {
    const bullet = makeFrame(`Feature Bullet ${i + 1}`, 312, 64, COLORS.surface, frame);
    bullet.cornerRadius = RADIUS.small;
    positionAt(bullet, 24, 296 + i * 74);
    const icon = makeRect('Icon', 24, 24, COLORS.surfaceVariant, 4, bullet);
    positionAt(icon, 12, 20);
    const t = makeText(i === 0 ? 'Local VPN' : 'Per-App Control', TYPE.titleSmall, COLORS.onBackground, bullet);
    positionAt(t, 48, 12);
    const d = makeText(i === 0 ? 'Traffic filtered on-device. Nothing sent to external servers.' : 'Set Wi-Fi and mobile data access per app, independently.', TYPE.bodySmall, COLORS.onSurfaceVariant, bullet);
    d.resize(248, 32);
    positionAt(d, 48, 30);
  }

  // CTA Button
  const btn = makeFrame('Button Primary', 312, 56, COLORS.primary.default, frame);
  btn.cornerRadius = RADIUS.medium;
  positionAt(btn, 24, 460);
  const btnText = makeText('Grant VPN Permission', TYPE.labelLarge, COLORS.primaryOn, btn);
  positionAt(btnText, (312 - 180) / 2, (56 - 20) / 2);

  // Disclaimer
  const disc = makeText('A system dialog will appear to approve the VPN connection.', TYPE.labelSmall, COLORS.onSurfaceVariant, frame);
  disc.textAlignHorizontal = 'CENTER';
  disc.opacity = 0.6;
  disc.resize(312, 28);
  positionAt(disc, 24, 530);
}

function buildMainScreens(): void {
  const page = getPage('📱 Screens');

  // Default (VPN On)
  const frame = makeFrame('Main/Default (VPN On)', SW, SH, COLORS.background);
  page.appendChild(frame);
  positionAt(frame, SW + 40, 0);

  // TopAppBar
  const bar = makeFrame('TopAppBar', SW, 56, COLORS.background, frame);
  positionAt(bar, 0, 24);
  const logo = makeRect('Logo', 18, 14, COLORS.primary.default, 3, bar);
  positionAt(logo, 16, 21);
  const title = makeText('AppFence', TYPE.titleLarge, COLORS.onBackground, bar);
  positionAt(title, 42, 16);

  // NetworkStatusBar
  const nsBar = makeFrame('Network Status Bar', SW, 36, COLORS.surface, frame);
  nsBar.fills = rgba(COLORS.primary.default, 0.12);
  positionAt(nsBar, 0, 80);
  const dot = makeCircle('Dot', 8, COLORS.statusAllowed, nsBar);
  positionAt(dot, 12, 14);
  const vpnLabel = makeText('VPN Active', TYPE.bodySmall, COLORS.onBackground, nsBar);
  positionAt(vpnLabel, 28, 10);
  const wifiLabel = makeText('Wi-Fi', TYPE.bodySmall, COLORS.secondary, nsBar);
  positionAt(wifiLabel, SW - 50, 10);

  // FilterBar chips
  const filterBar = makeFrame('Filter Bar', SW, 36, COLORS.background, frame);
  positionAt(filterBar, 0, 116);
  const chipLabels = ['All', 'User Apps', 'System', 'Blocked'];
  let chipX = 12;
  for (let i = 0; i < chipLabels.length; i++) {
    const chip = makeFrame(`Chip ${chipLabels[i]}`, 0, 24, COLORS.surfaceElevated, filterBar);
    chip.cornerRadius = RADIUS.small;
    chip.fills = i === 0 ? rgba(COLORS.primary.default, 0.12) : rgb(COLORS.surfaceElevated);
    chip.strokes = i === 0 ? rgb(COLORS.primary.default) : rgb(COLORS.divider);
    chip.strokeWeight = 1;
    chip.layoutMode = 'HORIZONTAL';
    chip.paddingLeft = 10; chip.paddingRight = 10;
    chip.paddingTop = 3; chip.paddingBottom = 3;
    chip.primaryAxisSizingMode = 'AUTO';
    chip.counterAxisSizingMode = 'AUTO';
    const chipText = makeText(chipLabels[i], TYPE.labelMedium, i === 0 ? COLORS.primary.default : COLORS.onSurfaceVariant, chip);
    filterBar.appendChild(chip);
    positionAt(chip, chipX, 6);
    chipX += chip.width + 6;
  }

  // App list items
  const items = [
    { name: 'Camera', pkg: 'com.android.camera2', status: 'Allowed', color: COLORS.statusAllowed },
    { name: 'Music',  pkg: 'com.android.music',   status: 'Blocked',  color: COLORS.statusBlocked },
    { name: 'Maps',   pkg: 'com.google.maps',     status: 'Wi-Fi',   color: COLORS.statusWifi },
    { name: 'Email',  pkg: 'com.android.email',   status: 'Data',    color: COLORS.statusData },
  ];
  let itemY = 162;
  for (const item of items) {
    const row = makeFrame(item.name, 336, 58, COLORS.surface, frame);
    row.cornerRadius = RADIUS.large;
    positionAt(row, 12, itemY);
    makeRect('Icon', 44, 44, COLORS.surfaceVariant, RADIUS.small, row);
    const nameText = makeText(item.name, TYPE.titleSmall, COLORS.onBackground, row);
    positionAt(nameText, 56, 10);
    const pkgText = makeText(item.pkg, TYPE.bodySmall, COLORS.onSurfaceVariant, row);
    positionAt(pkgText, 56, 28);
    const badge = makeRect('Badge', 44, 16, item.color, RADIUS.xsmall, row);
    badge.fills = rgba(item.color, 0.13);
    positionAt(badge, 220, 21);
    itemY += 66;
  }

  // Loading state
  const loadFrame = makeFrame('Main/Loading State', SW, SH, COLORS.background);
  page.appendChild(loadFrame);
  positionAt(loadFrame, (SW + 40) * 2, 0);
  const spin = makeCircle('Spinner', 40, COLORS.primary.default, loadFrame);
  spin.fills = rgba(COLORS.primary.default, 0);
  spin.strokes = rgb(COLORS.primary.default);
  spin.strokeWeight = 3;
  positionAt(spin, (SW - 40) / 2, 360);
  const loadText = makeText('Loading apps…', TYPE.bodyMedium, COLORS.onSurfaceVariant, loadFrame);
  positionAt(loadText, (SW - 80) / 2, 412);

  // Empty state
  const emptyFrame = makeFrame('Main/Empty State', SW, SH, COLORS.background);
  page.appendChild(emptyFrame);
  positionAt(emptyFrame, (SW + 40) * 3, 0);
  const emptyText = makeText('No apps found', TYPE.bodyLarge, COLORS.onSurfaceVariant, emptyFrame);
  emptyText.textAlignHorizontal = 'CENTER';
  positionAt(emptyText, (SW - 120) / 2, 380);
}

function buildSettingsScreens(): void {
  const page = getPage('📱 Screens');

  const configs = [
    { name: 'Settings/VPN On',  vpnActive: true },
    { name: 'Settings/VPN Off', vpnActive: false },
  ];

  for (let ci = 0; ci < configs.length; ci++) {
    const cfg = configs[ci];
    const frame = makeFrame(cfg.name, SW, SH, COLORS.background);
    page.appendChild(frame);
    positionAt(frame, ci * (SW + 40), SH + 40);

    // TopAppBar
    const bar = makeFrame('TopAppBar', SW, 56, COLORS.background, frame);
    positionAt(bar, 0, 24);
    makeRect('Back Arrow', 24, 24, COLORS.onSurfaceVariant, 0, bar);
    const t = makeText('Settings', TYPE.titleLarge, COLORS.onBackground, bar);
    positionAt(t, 52, 16);

    // VPN Status Card
    const card = makeFrame('VPN Status Card', 328, 200, COLORS.surface, frame);
    card.cornerRadius = RADIUS.xlarge;
    positionAt(card, 16, 88);
    const shieldBg = makeCircle('Shield Container', 72, COLORS.surfaceVariant, card);
    shieldBg.fills = rgba(cfg.vpnActive ? COLORS.primary.default : COLORS.divider, 0.2);
    positionAt(shieldBg, (328 - 72) / 2, 16);
    const statusTitle = makeText(cfg.vpnActive ? 'Protection Active' : 'Protection Off', TYPE.headlineSmall, COLORS.onBackground, card);
    statusTitle.textAlignHorizontal = 'CENTER';
    positionAt(statusTitle, 24, 100);
    const netLabel = makeText('Wi-Fi Connected', TYPE.bodySmall, COLORS.onSurfaceVariant, card);
    positionAt(netLabel, 100, 128);
    const ctaBtn = makeFrame('CTA', 0, 40, cfg.vpnActive ? { r:0,g:0,b:0 } : COLORS.primary.default, card);
    ctaBtn.cornerRadius = RADIUS.medium;
    ctaBtn.layoutMode = 'HORIZONTAL';
    ctaBtn.paddingLeft = 20; ctaBtn.paddingRight = 20;
    ctaBtn.paddingTop = 10; ctaBtn.paddingBottom = 10;
    ctaBtn.primaryAxisSizingMode = 'AUTO';
    ctaBtn.counterAxisSizingMode = 'AUTO';
    if (cfg.vpnActive) {
      ctaBtn.fills = [];
      ctaBtn.strokes = rgb(COLORS.statusBlocked);
      ctaBtn.strokeWeight = 1;
      makeText('Stop VPN', TYPE.labelLarge, COLORS.statusBlocked, ctaBtn);
    } else {
      ctaBtn.fills = rgb(COLORS.primary.default);
      makeText('Start VPN', TYPE.labelLarge, COLORS.primaryOn, ctaBtn);
    }
    card.appendChild(ctaBtn);
    positionAt(ctaBtn, (328 - 120) / 2, 152);

    // Preferences Card
    const prefs = makeFrame('Preferences Card', 328, 112, COLORS.surface, frame);
    prefs.cornerRadius = RADIUS.xlarge;
    positionAt(prefs, 16, 300);
    makeRect('Row 1 BG', 328, 56, COLORS.surface, 0, prefs);
    makeText('Block new apps by default', TYPE.titleSmall, COLORS.onBackground, prefs);
    makeRect('Toggle 1', 32, 16, COLORS.primary.default, 8, prefs);
    makeRect('Divider', 296, 1, COLORS.divider, 0, prefs);
    makeText('Start on boot', TYPE.titleSmall, COLORS.onBackground, prefs);
    makeRect('Toggle 2', 32, 16, COLORS.divider, 8, prefs);

    // About Card
    const about = makeFrame('About Card', 328, 64, COLORS.surface, frame);
    about.cornerRadius = RADIUS.xlarge;
    positionAt(about, 16, 424);
    makeCircle('Info Icon BG', 28, COLORS.surfaceVariant, about);
    const ver = makeText('AppFence v1.0.0', TYPE.titleMedium, COLORS.onBackground, about);
    positionAt(ver, 44, 10);
    const desc = makeText('Per-app network firewall · No root required', TYPE.bodySmall, COLORS.onSurfaceVariant, about);
    positionAt(desc, 44, 32);
  }
}

function buildTokensPage(): void {
  const page = getPage('📦 Design Tokens');
  page.fills = rgb(COLORS.background);

  const intro = makeFrame('Import Instructions', 1200, 240, COLORS.surface);
  intro.cornerRadius = RADIUS.large;
  page.appendChild(intro);
  positionAt(intro, 0, 0);

  const heading = makeText('How to Import Design Tokens into Figma', TYPE.titleLarge, COLORS.primary.default, intro);
  positionAt(heading, 24, 24);

  const steps = [
    '1. Install the "Figma Variables" plugin (by Figma, free)',
    '2. Open your AppFence Figma file',
    '3. Go to Plugins → Figma Variables → Import from JSON',
    '4. Select docs/design-system/figma-variables.json',
    '5. 4 collections created: Colors (22 vars), Typography (52 vars), Spacing (9 vars), Radius (6 vars)',
  ];
  let stepY = 64;
  for (const step of steps) {
    const t = makeText(step, TYPE.bodyMedium, COLORS.onBackground, intro);
    positionAt(t, 24, stepY);
    stepY += 28;
  }

  // Mapping table
  const mapping = makeFrame('Android ↔ Figma Mapping', 800, 400, COLORS.surface);
  mapping.cornerRadius = RADIUS.large;
  page.appendChild(mapping);
  positionAt(mapping, 0, 260);

  const mapTitle = makeText('Android ↔ Figma Token Mapping', TYPE.titleLarge, COLORS.primary.default, mapping);
  positionAt(mapTitle, 24, 24);

  const rows = [
    ['Color(0xFF00E5CC)',            'Colors/primary/default'],
    ['Color(0xFF0D1B2A)',            'Colors/background/default'],
    ['Color(0xFF1B2838)',            'Colors/surface/default'],
    ['MaterialTheme.typography.titleLarge', 'Typography/title-large/*'],
    ['RoundedCornerShape(16.dp)',    'Radius/large'],
    ['16.dp padding',                'Spacing/4'],
    ['56.dp button height',          'Spacing/14'],
  ];
  let rowY = 64;
  for (const [android, figmaVar] of rows) {
    const bg = makeRect('Row', 752, 28, rowY % 56 === 0 ? COLORS.surface : COLORS.surfaceVariant, 0, mapping);
    positionAt(bg, 24, rowY);
    const at = makeText(android, TYPE.bodySmall, COLORS.onSurfaceVariant, mapping);
    positionAt(at, 32, rowY + 6);
    const ft = makeText(figmaVar, TYPE.bodySmall, COLORS.primary.default, mapping);
    positionAt(ft, 432, rowY + 6);
    rowY += 36;
  }
}
```

- [ ] **Step 2: Wire into code.ts**

```typescript
import { buildDesignSystem } from './design-system';
import { buildComponents } from './components';
import { buildScreens } from './screens';

// In try block, after buildComponents():
figma.ui.postMessage({ type: 'progress', text: 'Building Screens…' });
buildScreens();

figma.ui.postMessage({ type: 'done', text: '4 pages created. Open Figma to see the result!' });
```

- [ ] **Step 3: Build**

```bash
cd figma-plugin && npm run build
```

Expected: exits 0.

- [ ] **Step 4: Commit**

```bash
git add figma-plugin/src/screens.ts figma-plugin/src/code.ts
git commit -m "feat(plugin): add all screens and Design Tokens page"
```

---

## Task 7: Final Wiring + How to Run

**Files:**
- Modify: `figma-plugin/src/code.ts` (final full version)
- Create: `figma-plugin/HOW-TO-RUN.md`

- [ ] **Step 1: Write final code.ts (complete, wired)**

```typescript
import { buildDesignSystem } from './design-system';
import { buildComponents } from './components';
import { buildScreens } from './screens';

figma.showUI(__html__, { width: 320, height: 220 });

figma.ui.onmessage = async (msg: { type: string }) => {
  if (msg.type !== 'create') return;

  try {
    figma.ui.postMessage({ type: 'progress', text: 'Loading fonts…' });
    await loadFonts();

    figma.ui.postMessage({ type: 'progress', text: 'Setting up pages…' });
    setupPages();

    figma.ui.postMessage({ type: 'progress', text: 'Building Design System…' });
    await buildDesignSystem();

    figma.ui.postMessage({ type: 'progress', text: 'Building Component Library…' });
    await buildComponents();

    figma.ui.postMessage({ type: 'progress', text: 'Building Screens…' });
    buildScreens();

    figma.ui.postMessage({ type: 'done', text: '4 pages created. Check Figma!' });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    figma.ui.postMessage({ type: 'error', text: msg });
  }
};

async function loadFonts(): Promise<void> {
  await Promise.all([
    figma.loadFontAsync({ family: 'Inter', style: 'Regular' }),
    figma.loadFontAsync({ family: 'Inter', style: 'Medium' }),
    figma.loadFontAsync({ family: 'Inter', style: 'SemiBold' }),
    figma.loadFontAsync({ family: 'Inter', style: 'Bold' }),
  ]);
}

function setupPages(): void {
  const pageNames = ['🎨 Design System', '🧩 Component Library', '📱 Screens', '📦 Design Tokens'];
  while (figma.root.children.length > 1) {
    figma.root.children[figma.root.children.length - 1].remove();
  }
  figma.root.children[0].name = pageNames[0];
  for (let i = 1; i < pageNames.length; i++) {
    figma.createPage().name = pageNames[i];
  }
}
```

- [ ] **Step 2: Build final**

```bash
cd figma-plugin && npm run build
ls -lh dist/code.js
```

Expected: file exists, no errors.

- [ ] **Step 3: Create HOW-TO-RUN.md**

```markdown
# How to Run the AppFence Figma Plugin

## Prerequisites
- Figma desktop app (figma.com/downloads)
- Node.js 18+ installed

## Build
```bash
cd figma-plugin
npm install
npm run build
```

## Load in Figma
1. Open **Figma Desktop App**
2. Create a new design file
3. Main menu → **Plugins** → **Development** → **Import plugin from manifest...**
4. Select: `figma-plugin/manifest.json`
5. Main menu → **Plugins** → **Development** → **AppFence Design System**
6. Click **"Create Design System"**
7. Wait ~10 seconds — all 4 pages will be built automatically

## What Gets Created
- **🎨 Design System** — Color swatches, typography scale, shape tokens, spacing bars
- **🧩 Component Library** — 11 atoms, 6 molecules, 7 organisms as Figma components
- **📱 Screens** — 7 frames: Onboarding, Main (4 states), Settings (2 states)
- **📦 Design Tokens** — Import guide + Android ↔ Figma mapping table

## Import Variables (separate step)
After running the plugin, import variables for token binding:
1. Plugins → search "Figma Variables" → install
2. Plugins → Figma Variables → Import from JSON
3. Select: `docs/design-system/figma-variables.json`
```

- [ ] **Step 4: Final build verification**

```bash
cd figma-plugin && npm run build && echo "SUCCESS"
```

Expected output: `SUCCESS`

- [ ] **Step 5: Final commit**

```bash
git add figma-plugin/
git commit -m "feat(plugin): complete AppFence Figma plugin — runs in one click"
```

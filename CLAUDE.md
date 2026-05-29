# Intelligent Finance Platform — Claude Context

## What this is
A React SPA demo platform for the **Office of the CFO** — showing agentic AI across R2R, O2C, S2P, and FP&A finance processes. Built for client demos and internal thought leadership.

- **Live URL**: https://intelligent-finance-platform-beta.vercel.app
- **GitHub**: https://github.com/bcdguru/intelligent-finance-platform
- **Local path**: `C:\Users\naray\Projects\intelligent-finance-platform\`
- **Stack**: Vite + React 19 + IBM Carbon Design System v11 (`@carbon/react`)
- **Deploy**: GitHub → Vercel auto-deploy on push to `master`

## Module registry

| ID | Label | Wave | Color |
|----|-------|------|-------|
| `r2r` | R2R | 1 (Live) | `#156082` |
| `o2c` | O2C | 3 | `#E97132` |
| `s2p` | S2P | 4 | `#196B24` |
| `fpa` | FP&A | 5 | `#A02B93` |
| `atlas` | Atlas | — | `#0891b2` (cross-module viewer, `isAtlas: true`) |

### Process area colors (all modules — agentstart 6-color pipeline palette)
`#1565C0` → `#1976D2` → `#9B7A00` → `#E06020` → `#C41E3A` → `#1B5E20`

---

## Code architecture

The platform uses a **module registry pattern** with **React.lazy() code splitting**. Each module is self-contained and can be extracted as a standalone project.

```
src/
├── shell/                          # App entry layer
│   ├── App.jsx                     # Reads MODULE_REGISTRY, routes isAtlas flag
│   ├── TopNav.jsx                  # Imports MODULES/MODULE_ORDER from @registry
│   └── ModuleShell.jsx             # Dynamic Suspense dispatch — replaces ModuleView
│
├── registry/
│   └── index.js                    # Aggregates all modules; exports MODULE_REGISTRY,
│                                   # MODULE_ORDER, MODULES (flat compat map)
│
├── modules/                        # One folder per module — self-contained
│   ├── r2r/
│   │   ├── config.js               # Module metadata (processAreas, layers, kpis, personas, skills)
│   │   └── index.js                # Exports config + WORKBENCH_MAP (lazy components)
│   ├── o2c/{config,index}.js
│   ├── s2p/{config,index}.js
│   ├── fpa/{config,index}.js
│   └── atlas/{config,index}.js
│
├── shared/
│   ├── tokens.js                   # Shared C const, MODULE_COLORS, WB_HEADER tokens
│   └── WorkbenchShell.jsx          # Shared workbench chrome (header + close button)
│
├── components/
│   ├── ArchitectureMatrix.jsx      # 5-layer × N-area matrix; colColor tints columns
│   ├── AtlasViewer.jsx             # Cross-module intel viewer (6 lenses)
│   ├── KpiPanel.jsx
│   ├── PersonaSidebar.jsx
│   ├── SkillsPanel.jsx
│   ├── MetricsBar.jsx
│   └── workbenches/                # All workbench components live here
│       ├── ControllerWorkbench.jsx     # R2R
│       ├── JournalWorkbench.jsx        # R2R
│       ├── CapitalWorkbench.jsx        # R2R
│       ├── FluxAgentWorkbench.jsx      # R2R
│       ├── CashLiquidityWorkbench.jsx  # R2R
│       ├── ARWorkbench.jsx             # O2C
│       ├── CollectionsWorkbench.jsx    # O2C
│       ├── BillingWorkbench.jsx        # O2C
│       ├── CashApplicationWorkbench.jsx# O2C
│       ├── FPAAnalystWorkbench.jsx     # FP&A
│       ├── HeadOfFPAWorkbench.jsx      # FP&A
│       └── ForecastWorkbench.jsx       # FP&A
│
└── data/
    ├── modules.js                  # Backwards-compat shim → re-exports from registry
    └── atlas.js                    # Atlas node map, lenses, helpers (do not modify)
```

### Path aliases (vite.config.js + jsconfig.json)
| Alias | Resolves to |
|-------|-------------|
| `@shared` | `src/shared/` |
| `@modules` | `src/modules/` |
| `@registry` | `src/registry/` |
| `@shell` | `src/shell/` |

---

## Adding a new workbench

**Only 3 steps — zero changes to shell or App:**

1. **Create the component** at `src/components/workbenches/XyzWorkbench.jsx`
   - Must follow the Workbench UX standard (see below)
   - Props: `onClose` callback

2. **Register in the module's index.js** (e.g. `src/modules/r2r/index.js`):
   ```js
   const XyzWB = lazy(() => import('../../components/workbenches/XyzWorkbench'))

   export const WORKBENCH_MAP = {
     // ...existing entries...
     'Xyz Workbench': XyzWB,
   }
   ```

3. **Wire the cell in the module's config.js**:
   ```js
   // In layers → the relevant layer → cells → the relevant process area:
   'my-area': { agents: ['Xyz Agent'], workbench: 'Xyz Workbench' }
   ```

That's it. `ModuleShell` picks it up automatically via the registry. No imports or conditionals to add anywhere else. The workbench will be lazy-loaded (separate JS chunk) and wrapped in Suspense automatically.

---

## Workbench UX standard (ALL workbenches must follow this)

```jsx
// Full-screen overlay
position: 'fixed', inset: 0, zIndex: 8000, display: 'flex', flexDirection: 'column'

// Header
background: '#0E2841', borderBottom: '1px solid #393939'

// Icon chip
background: '#156082', symbol: ⬡, width: 32, height: 32, borderRadius: 6

// Body
background: '#f4f4f4'

// Tab active underline
borderBottom: '2px solid [module.color]'

// Status badges
Carbon <Tag type="green|red|blue" size="sm">

// Close button
Carbon <Button size="sm" kind="ghost" renderIcon={Close} hasIconOnly onClick={onClose} />
```

Use `WorkbenchShell` from `@shared/WorkbenchShell` for the outer chrome to avoid duplication.

---

## Shared tokens (`src/shared/tokens.js`)

```js
import { C, MODULE_COLORS, WB_HEADER } from '@shared/tokens'
```

```js
C = {
  blue: '#0072c3', green: '#24a148', red: '#da1e28', amber: '#f1c21b',
  purple: '#6929c4', navy: '#0E2841', slate: '#525252',
  muted: '#8d8d8d', bg: '#f4f4f4', border: '#e0e0e0',
}
MODULE_COLORS = { r2r: '#156082', o2c: '#E97132', s2p: '#196B24', fpa: '#A02B93', atlas: '#0891b2' }
WB_HEADER = { bg: '#0E2841', iconBg: '#156082', borderColor: '#393939' }
```

> **FP&A override:** FP&A workbenches use `purple: '#A02B93'` (not Carbon `#6929c4`). Override locally with `const FPA_C = { ...C, purple: '#A02B93' }`.

---

## Fonts
- **IBM Plex Sans** — body text, labels
- **IBM Plex Mono** — IDs, amounts, code values, monospace data

---

## Atlas viewer
- 6 lenses: `finance / coo / cio / ciso / cdo / sigma`
- Node key: `${moduleId}|${areaId}|${layerId}`
- Node ID: `FIN.R2R.GENERAL_ACCOUNTING.COMPLIANCE`
- Imports `MODULES` from `../data/modules` (shim → registry — do not change this import)
- Do not modify `src/data/atlas.js`

---

## Adding a new module

1. Create `src/modules/{id}/config.js` — full module object (id, label, fullName, tagline, color, accentColor, wave, processAreas, layers, kpis, personas, skills)
2. Create `src/modules/{id}/index.js` — export config + WORKBENCH_MAP
3. Add to `src/registry/index.js` — import the module and add to MODULE_REGISTRY + MODULE_ORDER
4. Add module metrics to `MODULE_METRICS` in `src/shell/ModuleShell.jsx`
5. `src/data/atlas.js` may need updating for Atlas cross-module view

---

## Git workflow
```bash
cd C:/Users/naray/Projects/intelligent-finance-platform
# make changes
git add <files>
git commit -m "description"
gh auth switch --user bcdguru   # REQUIRED before every push
git push origin master          # Vercel auto-deploys
```

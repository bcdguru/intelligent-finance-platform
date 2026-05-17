# Intelligent Finance Platform — Claude Context

## What this is
A React SPA demo platform for the **Office of the CFO** — showing agentic AI across R2R, O2C, S2P, and FP&A finance processes. Built for client demos and internal thought leadership.

- **Live URL**: https://intelligent-finance-platform-beta.vercel.app
- **GitHub**: https://github.com/bcdguru/intelligent-finance-platform
- **Local path**: `C:\Users\naray\Projects\intelligent-finance-platform\`
- **Stack**: Vite + React 18 + IBM Carbon Design System v11 (`@carbon/react`)
- **Deploy**: GitHub → Vercel auto-deploy on push to `master`

## Key architecture

### Navigation modules (TopNav.jsx)
| ID | Label | Wave | Color |
|----|-------|------|-------|
| `r2r` | R2R | 1 (Live) | #156082 |
| `o2c` | O2C | 2 | #E97132 |
| `s2p` | S2P | 3 | #196B24 |
| `fpa` | FP&A | 4 | #A02B93 |
| `atlas` | Atlas | — | teal |

### Process area colors (all modules use agentstart 6-color pipeline palette)
`#1565C0` → `#1976D2` → `#9B7A00` → `#E06020` → `#C41E3A` → `#1B5E20`

### Key files
```
src/
├── App.jsx                          # Root: routes active module, atlas special case
├── data/
│   ├── modules.js                   # All module data: processAreas, layers, cells, agents, KPIs
│   └── atlas.js                     # Finance Atlas node map, lenses, helpers
├── components/
│   ├── TopNav.jsx                   # IBM Carbon Header with module nav
│   ├── ModuleView.jsx               # Main layout: PersonaSidebar + ArchitectureMatrix + KpiPanel
│   ├── ArchitectureMatrix.jsx       # 5-layer × N-area matrix; colColor prop tints columns
│   ├── AtlasViewer.jsx              # 4-module atlas grid, 6 lenses, node detail panel
│   └── workbenches/
│       ├── ControllerWorkbench.jsx  # R2R — deepened (Journal Queue list+detail, Close Cockpit timeline)
│       ├── JournalWorkbench.jsx     # R2R — 4 tabs: Pipeline, Rules, Accrual, Close Sequence
│       ├── CapitalWorkbench.jsx     # R2R — 4 tabs: Asset Register, WIP, Lease (IFRS 16), CapEx
│       ├── FluxAgentWorkbench.jsx   # R2R — Flux variance analysis
│       ├── ARWorkbench.jsx          # O2C — AR director
│       ├── CollectionsWorkbench.jsx # O2C — Collections
│       └── CashLiquidityWorkbench.jsx # Treasury
```

### Workbench UX standard (ALL workbenches must follow this)
- `position: fixed, inset: 0, zIndex: 8000, display: flex, flexDirection: column`
- Header: `background: '#0E2841'`, `borderBottom: '1px solid #393939'`
- Icon: `background: '#156082'`, symbol: `⬡`
- Carbon `Tag` for status badges, Carbon `Button` with `Close` icon for dismiss
- Body: `background: '#f4f4f4'`
- Tab active underline: `2px solid [module color]`

### Carbon color tokens used in `const C`
```js
const C = {
  navy:   '#0E2841',  // workbench header
  iconBg: '#156082',  // icon background
  blue:   '#0072c3',
  green:  '#24a148',
  red:    '#da1e28',
  amber:  '#f1c21b',
  bg:     '#f4f4f4',
  border: '#393939',
  sub:    '#525252',
  muted:  '#8d8d8d',
}
```

### Fonts
- **IBM Plex Sans** — body text, labels
- **IBM Plex Mono** — IDs, amounts, code values, monospace data

## Atlas viewer (AtlasViewer.jsx)
- 6 lenses: finance / coo / cio / ciso / cdo / sigma
- Node key format: `${moduleId}|${areaId}|${layerId}`
- Node ID format: `FIN.R2R.GENERAL_ACCOUNTING.COMPLIANCE`
- Helpers: `buildNodeMap()`, `getAtlasNode()`, `getCellAppearance()`, `getCellText()`
- LAYER_ORDER: `['compliance', 'analysis', 'orchestration', 'action', 'integration']`

## Adding a new workbench
1. Create `src/components/workbenches/XyzWorkbench.jsx` (follow UX standard above)
2. Add to `WORKBENCH_MAP` in `ModuleView.jsx`
3. Add overlay render block in `ModuleView.jsx`
4. Add import in `ModuleView.jsx`
5. Add `workbench: 'Xyz Workbench'` to the relevant cell in `modules.js`

## Git workflow
```bash
cd C:/Users/naray/Projects/intelligent-finance-platform
# make changes
git add <files>
git commit -m "description"
git push origin master   # Vercel auto-deploys
```

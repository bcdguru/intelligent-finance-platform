// ─── Shared design tokens — single source of truth ────────────────────────────
// All workbenches import from here. No more copy-pasting `const C = { ... }`.

export const C = {
  // Carbon Blue — primary action, links
  blue:   '#0072c3',
  // Aliases used by legacy workbenches (same value as blue)
  teal:   '#0072c3',
  orange: '#0072c3',
  // Semantic colours
  green:  '#24a148',
  red:    '#da1e28',
  amber:  '#f1c21b',
  // Carbon purple — used for FP&A module; override per-module as needed
  purple: '#6929c4',
  // Shell / layout
  navy:   '#0E2841',   // header background
  slate:  '#525252',   // body text secondary
  muted:  '#8d8d8d',   // placeholders, labels
  bg:     '#f4f4f4',   // page background
  border: '#e0e0e0',   // dividers
}

// Module accent colours (for per-module overrides where needed)
export const MODULE_COLORS = {
  r2r:   '#156082',
  o2c:   '#E97132',
  s2p:   '#196B24',
  fpa:   '#A02B93',
  atlas: '#0891b2',
}

// Workbench header constants
export const WB_HEADER = {
  bg:          '#0E2841',
  iconBg:      '#156082',
  borderColor: '#393939',
}

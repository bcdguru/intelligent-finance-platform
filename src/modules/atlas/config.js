// Atlas is the cross-module intelligence viewer — not a process module.
// It has no processAreas, layers, or workbenches of its own.
const atlasConfig = {
  id: 'atlas',
  label: 'Atlas',
  fullName: 'Finance Agent Atlas',
  tagline: 'Platform intelligence across all modules',
  color: '#0891b2',
  wave: 1,
  isAtlas: true, // signals shell to render AtlasViewer instead of ModuleShell
}

export default atlasConfig

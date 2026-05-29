// Backwards-compatibility shim.
// atlas.js, AtlasViewer.jsx, and any other legacy consumers can continue
// importing from here — they transparently get data from the module registry.
export { MODULES, MODULE_ORDER } from '../registry'

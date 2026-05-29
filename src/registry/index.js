import * as r2r   from '../modules/r2r/index.js'
import * as o2c   from '../modules/o2c/index.js'
import * as s2p   from '../modules/s2p/index.js'
import * as fpa   from '../modules/fpa/index.js'
import * as atlas from '../modules/atlas/index.js'

export const MODULE_REGISTRY = {
  r2r:   { config: r2r.config,   WORKBENCH_MAP: r2r.WORKBENCH_MAP   },
  o2c:   { config: o2c.config,   WORKBENCH_MAP: o2c.WORKBENCH_MAP   },
  s2p:   { config: s2p.config,   WORKBENCH_MAP: s2p.WORKBENCH_MAP   },
  fpa:   { config: fpa.config,   WORKBENCH_MAP: fpa.WORKBENCH_MAP   },
  atlas: { config: atlas.config, WORKBENCH_MAP: atlas.WORKBENCH_MAP },
}

// Non-atlas modules in render order
export const MODULE_ORDER = ['r2r', 'o2c', 's2p', 'fpa']

// Flat map of id → config (backwards-compat for legacy imports)
export const MODULES = Object.fromEntries(
  MODULE_ORDER.map(id => [id, MODULE_REGISTRY[id].config])
)

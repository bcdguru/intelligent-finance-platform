import { MODULES, MODULE_ORDER } from './modules'

// System ownership by module+area
const SYSTEM_MAP = {
  'r2r|general-accounting': 'SAP S/4',
  'r2r|capital-accounting': 'SAP S/4',
  'r2r|controls':           'BlackLine',
  'r2r|book-close':         'SAP BPC',
  'r2r|intercompany':       'SAP ICM',
  'r2r|cash-mgmt':          'BlackLine',
  'o2c|billing':            'SAP SD',
  'o2c|revenue':            'Zuora',
  'o2c|cash-app':           'HighRadius',
  'o2c|collections':        'HighRadius',
  'o2c|ar-mgmt':            'SAP AR',
  'o2c|contract':           'Salesforce',
  's2p|ap':                 'Coupa',
  's2p|invoice':            'Coupa',
  's2p|vendor':             'SAP MDG',
  's2p|p2p-ops':            'Coupa',
  's2p|supplier-risk':      'Custom',
  's2p|procurement':        'SAP MM',
  'fpa|variance':           'Anaplan',
  'fpa|forecast':           'Anaplan',
  'fpa|reporting':          'Power BI',
  'fpa|planning':           'Anaplan',
  'fpa|bu-partner':         'Anaplan',
  'fpa|strategy':           'Excel',
}

// Default atlas metadata per layer
const LAYER_DEFAULTS = {
  integration:   { maturity: 'Assisted',  risk: 'Low',    sigma: 4, data: 'High Volume'   },
  orchestration: { maturity: 'Automated', risk: 'Low',    sigma: 5, data: 'Event-Driven'  },
  action:        { maturity: 'Assisted',  risk: 'Medium', sigma: 3, data: 'Transactional' },
  analysis:      { maturity: 'Automated', risk: 'Low',    sigma: 5, data: 'Analytical'    },
  compliance:    { maturity: 'Assisted',  risk: 'High',   sigma: 3, data: 'Audit Trail'   },
}

// Manual overrides for high-interest nodes
const OVERRIDES = {
  'r2r|controls|compliance':         { maturity: 'Manual',     risk: 'Critical', sigma: 2 },
  'r2r|book-close|action':           { maturity: 'Manual',     risk: 'High',     sigma: 2 },
  'r2r|cash-mgmt|analysis':          { maturity: 'Automated',  risk: 'Low',      sigma: 6 },
  'r2r|general-accounting|action':   { maturity: 'Autonomous', risk: 'Low',      sigma: 6 },
  'r2r|intercompany|compliance':     { maturity: 'Manual',     risk: 'High',     sigma: 2 },
  'o2c|cash-app|action':             { maturity: 'Automated',  risk: 'Medium',   sigma: 5 },
  'o2c|collections|compliance':      { maturity: 'Assisted',   risk: 'High',     sigma: 3 },
  'o2c|revenue|compliance':          { maturity: 'Manual',     risk: 'Critical', sigma: 2 },
  'o2c|contract|action':             { maturity: 'Manual',     risk: 'High',     sigma: 2 },
  's2p|ap|action':                   { maturity: 'Automated',  risk: 'Low',      sigma: 5 },
  's2p|supplier-risk|compliance':    { maturity: 'Manual',     risk: 'Critical', sigma: 2 },
  's2p|vendor|compliance':           { maturity: 'Assisted',   risk: 'High',     sigma: 3 },
  's2p|ap|compliance':               { maturity: 'Assisted',   risk: 'High',     sigma: 3 },
  'fpa|strategy|action':             { maturity: 'Manual',     risk: 'Medium',   sigma: 2 },
  'fpa|reporting|compliance':        { maturity: 'Automated',  risk: 'Low',      sigma: 5 },
  'fpa|forecast|analysis':           { maturity: 'Autonomous', risk: 'Low',      sigma: 6 },
  'fpa|variance|action':             { maturity: 'Assisted',   risk: 'Medium',   sigma: 3 },
  'fpa|strategy|analysis':           { maturity: 'Manual',     risk: 'Medium',   sigma: 2 },
}

export function getAtlasNode(moduleId, areaId, layerId) {
  const module   = MODULES[moduleId]
  const layer    = module.layers.find(l => l.id === layerId)
  const cell     = layer?.cells[areaId] || { agents: [], workbench: null }
  const defaults = LAYER_DEFAULTS[layerId] || LAYER_DEFAULTS.action
  const override = OVERRIDES[`${moduleId}|${areaId}|${layerId}`] || {}

  return {
    nodeId:      `FIN.${moduleId.toUpperCase()}.${areaId.replace(/-/g, '_').toUpperCase()}.${layerId.toUpperCase()}`,
    moduleId, areaId, layerId,
    moduleColor: module.color,
    moduleLabel: module.label,
    areaLabel:   module.processAreas.find(a => a.id === areaId)?.label || areaId,
    layerLabel:  layerId.charAt(0).toUpperCase() + layerId.slice(1),
    agents:      cell.agents || [],
    workbench:   cell.workbench,
    system:      SYSTEM_MAP[`${moduleId}|${areaId}`] || 'Custom',
    ...defaults,
    ...override,
  }
}

export function buildNodeMap() {
  const map = {}
  MODULE_ORDER.forEach(moduleId => {
    const module = MODULES[moduleId]
    module.layers.forEach(layer => {
      module.processAreas.forEach(area => {
        const key = `${moduleId}|${area.id}|${layer.id}`
        map[key] = getAtlasNode(moduleId, area.id, layer.id)
      })
    })
  })
  return map
}

export const LENSES = {
  finance: { label: 'Finance',    icon: '⬡', description: 'Agent & workbench coverage by module' },
  coo:     { label: 'COO',        icon: '⚙', description: 'Process maturity & automation level' },
  cio:     { label: 'CIO',        icon: '⬡', description: 'System & technology landscape' },
  ciso:    { label: 'CISO',       icon: '⊕', description: 'Risk & control intensity' },
  cdo:     { label: 'CDO',        icon: '≡', description: 'Data flow & lineage type' },
  sigma:   { label: 'Six Sigma',  icon: 'σ', description: 'Process quality & improvement candidates' },
}

export const LENS_ORDER = ['finance', 'coo', 'cio', 'ciso', 'cdo', 'sigma']

export const MATURITY_COLORS = {
  Manual:     { bg: '#dc2626', fg: '#fff', label: 'Manual'     },
  Assisted:   { bg: '#d97706', fg: '#fff', label: 'Assisted'   },
  Automated:  { bg: '#16a34a', fg: '#fff', label: 'Automated'  },
  Autonomous: { bg: '#0284c7', fg: '#fff', label: 'Autonomous' },
}

export const SYSTEM_COLORS = {
  'SAP S/4':   { bg: '#1268b3', fg: '#fff' },
  'SAP BPC':   { bg: '#0057b8', fg: '#fff' },
  'SAP ICM':   { bg: '#004494', fg: '#fff' },
  'SAP SD':    { bg: '#1268b3', fg: '#fff' },
  'SAP AR':    { bg: '#0057b8', fg: '#fff' },
  'SAP MDG':   { bg: '#004494', fg: '#fff' },
  'SAP MM':    { bg: '#1268b3', fg: '#fff' },
  'BlackLine': { bg: '#6c2bd9', fg: '#fff' },
  'Zuora':     { bg: '#be185d', fg: '#fff' },
  'HighRadius':{ bg: '#1e40af', fg: '#fff' },
  'Salesforce':{ bg: '#00A1E0', fg: '#fff' },
  'Coupa':     { bg: '#c2410c', fg: '#fff' },
  'Anaplan':   { bg: '#00897b', fg: '#fff' },
  'Power BI':  { bg: '#b45309', fg: '#fff' },
  'Excel':     { bg: '#15803d', fg: '#fff' },
  'Custom':    { bg: '#525252', fg: '#fff' },
}

export const RISK_COLORS = {
  Low:      { bg: '#16a34a', fg: '#fff', label: 'Low'      },
  Medium:   { bg: '#d97706', fg: '#fff', label: 'Medium'   },
  High:     { bg: '#ea580c', fg: '#fff', label: 'High'     },
  Critical: { bg: '#dc2626', fg: '#fff', label: 'Critical' },
}

export const DATA_COLORS = {
  'High Volume':   { bg: '#0284c7', fg: '#fff', label: 'High Volume'   },
  'Event-Driven':  { bg: '#7c3aed', fg: '#fff', label: 'Event-Driven'  },
  'Transactional': { bg: '#16a34a', fg: '#fff', label: 'Transactional' },
  'Analytical':    { bg: '#A02B93', fg: '#fff', label: 'Analytical'    },
  'Audit Trail':   { bg: '#c2410c', fg: '#fff', label: 'Audit Trail'   },
}

export const SIGMA_COLORS = {
  2: { bg: '#dc2626', fg: '#fff', label: '2σ — Improve' },
  3: { bg: '#ea580c', fg: '#fff', label: '3σ — Candidate' },
  4: { bg: '#d97706', fg: '#fff', label: '4σ — Monitor' },
  5: { bg: '#16a34a', fg: '#fff', label: '5σ — Good'   },
  6: { bg: '#0284c7', fg: '#fff', label: '6σ — World Class' },
}

export function getCellAppearance(node, lens) {
  if (!node) return { bg: '#e0e0e0', fg: '#6f6f6f' }
  switch (lens) {
    case 'finance': return { bg: node.moduleColor + '28', fg: node.moduleColor, border: node.moduleColor }
    case 'coo':     return MATURITY_COLORS[node.maturity] || { bg: '#e0e0e0', fg: '#000' }
    case 'cio':     return SYSTEM_COLORS[node.system] || { bg: '#525252', fg: '#fff' }
    case 'ciso':    return RISK_COLORS[node.risk] || { bg: '#e0e0e0', fg: '#000' }
    case 'cdo':     return DATA_COLORS[node.data] || { bg: '#e0e0e0', fg: '#000' }
    case 'sigma':   return SIGMA_COLORS[node.sigma] || { bg: '#e0e0e0', fg: '#000' }
    default:        return { bg: '#e0e0e0', fg: '#000' }
  }
}

export function getCellText(node, lens) {
  if (!node) return ''
  switch (lens) {
    case 'finance': return node.agents[0]?.replace(' Agent', '').replace(' Workbench', '') || '—'
    case 'coo':     return node.maturity?.charAt(0) || ''
    case 'cio':     return node.system?.split(' ')[0] || ''
    case 'ciso':    return node.risk || ''
    case 'cdo':     return node.data?.split(' ')[0] || ''
    case 'sigma':   return node.sigma ? `${node.sigma}σ` : ''
    default:        return ''
  }
}

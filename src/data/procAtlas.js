// ─── Procurement Agent Atlas — Data & Helpers ────────────────────────────────

// 6 procurement phases (columns) with agentstart palette colors
export const PROC_PHASES = [
  { id: 'spend-intel',  label: 'Spend Intelligence',    sub: 'Spend Analysis · Category Strategy',     color: '#1565C0' },
  { id: 'sourcing',     label: 'Strategic Sourcing',     sub: 'Supplier Discovery · RFx · Bid Mgmt',   color: '#1976D2' },
  { id: 'contract',     label: 'Contract Management',    sub: 'CLM · Obligations · Compliance',         color: '#9B7A00' },
  { id: 'p2p',          label: 'Requisition & PO',       sub: 'PR/PO · Approvals · Catalogue',          color: '#E06020' },
  { id: 'invoice-ap',   label: 'Invoice & AP',           sub: '3-Way Match · Touchless · Payment',      color: '#C41E3A' },
  { id: 'srm',          label: 'Supplier Relationship',  sub: 'SRM · ESG · Sanctions · Performance',    color: '#1B5E20' },
]

export const PROC_PHASE_ORDER = PROC_PHASES.map(p => p.id)
export const PROC_PHASE_MAP   = Object.fromEntries(PROC_PHASES.map(p => [p.id, p]))

// 5 agent layers (rows)
export const PROC_LAYERS = [
  { id: 'compliance',    label: 'Compliance'    },
  { id: 'analysis',      label: 'Analysis'      },
  { id: 'orchestration', label: 'Orchestration' },
  { id: 'action',        label: 'Action'        },
  { id: 'integration',   label: 'Integration'   },
]

// ─── Cell agent assignments ───────────────────────────────────────────────────
const PROC_CELL_MAP = {
  'spend-intel': {
    compliance:    { agents: ['Policy Compliance Agent', 'Budget Authority Agent'], workbench: null },
    analysis:      { agents: ['Spend Analytics Agent', 'Tail Spend Agent', 'Category Intel Agent'], workbench: null },
    orchestration: { agents: ['Spend Intelligence Agent'], workbench: null },
    action:        { agents: ['Category Strategy Agent', 'Savings Tracker Agent'], workbench: null },
    integration:   { agents: ['ERP Extract Agent', 'P-card Data Agent'], workbench: null },
  },
  sourcing: {
    compliance:    { agents: ['Sustainability Agent', 'Trade Compliance Agent'], workbench: null },
    analysis:      { agents: ['Supplier Scoring Agent', 'Market Intel Agent', 'Should-Cost Agent'], workbench: null },
    orchestration: { agents: ['Sourcing Orchestration Agent'], workbench: null },
    action:        { agents: ['RFx Agent', 'Bid Analysis Agent', 'Negotiation Agent'], workbench: null },
    integration:   { agents: ['Supplier Search Agent', 'Market Data Agent'], workbench: null },
  },
  contract: {
    compliance:    { agents: ['Contract Compliance Agent', 'Obligation Monitor Agent'], workbench: null },
    analysis:      { agents: ['Clause Risk Agent', 'Contract Analytics Agent'], workbench: null },
    orchestration: { agents: ['CLM Orchestration Agent'], workbench: null },
    action:        { agents: ['Contract Drafting Agent', 'Redline Agent', 'Renewal Agent'], workbench: null },
    integration:   { agents: ['CLM Integration Agent', 'Signature Agent'], workbench: null },
  },
  p2p: {
    compliance:    { agents: ['PO Compliance Agent', 'Budget Check Agent'], workbench: null },
    analysis:      { agents: ['Demand Forecast Agent', 'Catalogue Optimiser Agent'], workbench: null },
    orchestration: { agents: ['P2P Orchestration Agent'], workbench: null },
    action:        { agents: ['PO Creation Agent', 'Approval Routing Agent'], workbench: null },
    integration:   { agents: ['ERP Write Agent', 'Catalogue Sync Agent'], workbench: null },
  },
  'invoice-ap': {
    compliance:    { agents: ['AP Compliance Agent', 'Fraud Detection Agent'], workbench: null },
    analysis:      { agents: ['DPO Optimizer Agent', 'Early Pay Agent', 'Cash Flow Agent'], workbench: null },
    orchestration: { agents: ['AP Orchestration Agent'], workbench: null },
    action:        { agents: ['3-Way Match Agent', 'Exception Agent', 'Payment Agent'], workbench: 'AP Processing Workbench' },
    integration:   { agents: ['Invoice Capture Agent', 'OCR/IDP Agent'], workbench: null },
  },
  srm: {
    compliance:    { agents: ['Sanctions Screening Agent', 'Supplier Compliance Agent'], workbench: null },
    analysis:      { agents: ['Risk Scoring Agent', 'ESG Analytics Agent', 'Performance Agent'], workbench: null },
    orchestration: { agents: ['SRM Orchestration Agent'], workbench: null },
    action:        { agents: ['Onboarding Agent', 'Performance Review Agent', 'Issue Resolution Agent'], workbench: null },
    integration:   { agents: ['Supplier Data Agent', 'ESG Data Feed Agent'], workbench: null },
  },
}

// ─── System ownership per phase × layer ──────────────────────────────────────
const PROC_SYSTEM_MAP = {
  'spend-intel|compliance':    'SAP Ariba',
  'spend-intel|analysis':      'SAP Ariba',
  'spend-intel|orchestration': 'Custom AI',
  'spend-intel|action':        'SAP Ariba',
  'spend-intel|integration':   'SAP S/4',
  'sourcing|compliance':       'SAP Ariba',
  'sourcing|analysis':         'SAP Ariba',
  'sourcing|orchestration':    'Custom AI',
  'sourcing|action':           'SAP Ariba',
  'sourcing|integration':      'SAP Ariba',
  'contract|compliance':       'Icertis',
  'contract|analysis':         'Icertis',
  'contract|orchestration':    'Custom AI',
  'contract|action':           'Icertis',
  'contract|integration':      'Icertis',
  'p2p|compliance':            'Coupa',
  'p2p|analysis':              'Coupa',
  'p2p|orchestration':         'Custom AI',
  'p2p|action':                'Coupa',
  'p2p|integration':           'SAP MM',
  'invoice-ap|compliance':     'Coupa',
  'invoice-ap|analysis':       'Coupa',
  'invoice-ap|orchestration':  'Custom AI',
  'invoice-ap|action':         'Coupa',
  'invoice-ap|integration':    'SAP AP',
  'srm|compliance':            'SAP MDG',
  'srm|analysis':              'Custom',
  'srm|orchestration':         'Custom AI',
  'srm|action':                'SAP MDG',
  'srm|integration':           'SAP MDG',
}

// ─── Layer defaults ───────────────────────────────────────────────────────────
const PROC_LAYER_DEFAULTS = {
  integration:   { maturity: 'Assisted',  risk: 'Low',    sigma: 4, data: 'High Volume'   },
  orchestration: { maturity: 'Automated', risk: 'Low',    sigma: 5, data: 'Event-Driven'  },
  action:        { maturity: 'Assisted',  risk: 'Medium', sigma: 3, data: 'Transactional' },
  analysis:      { maturity: 'Automated', risk: 'Low',    sigma: 5, data: 'Analytical'    },
  compliance:    { maturity: 'Assisted',  risk: 'High',   sigma: 3, data: 'Audit Trail'   },
}

// ─── Manual overrides for high-interest nodes ─────────────────────────────────
const PROC_OVERRIDES = {
  // Critical risk nodes
  'invoice-ap|compliance':         { maturity: 'Manual',     risk: 'Critical', sigma: 2 }, // AP fraud gate
  'contract|compliance':           { maturity: 'Manual',     risk: 'Critical', sigma: 2 }, // contract obligations
  'srm|compliance':                { maturity: 'Manual',     risk: 'Critical', sigma: 2 }, // sanctions screening
  // High-automation wins
  'invoice-ap|action':             { maturity: 'Automated',  risk: 'Low',      sigma: 5 }, // touchless AP
  'spend-intel|analysis':          { maturity: 'Automated',  risk: 'Low',      sigma: 5 }, // spend analytics
  'srm|analysis':                  { maturity: 'Automated',  risk: 'Low',      sigma: 5 }, // risk scoring
  'spend-intel|orchestration':     { maturity: 'Autonomous', risk: 'Low',      sigma: 6 }, // autonomous spend intel
  // Transformation candidates
  'contract|action':               { maturity: 'Manual',     risk: 'High',     sigma: 2 }, // contract drafting
  'sourcing|compliance':           { maturity: 'Assisted',   risk: 'High',     sigma: 3 }, // trade compliance
  'p2p|compliance':                { maturity: 'Assisted',   risk: 'High',     sigma: 3 }, // PO compliance
  'sourcing|action':               { maturity: 'Assisted',   risk: 'Medium',   sigma: 3 }, // RFx management
  // World-class nodes
  'invoice-ap|integration':        { maturity: 'Automated',  risk: 'Low',      sigma: 6 }, // OCR/IDP automated
  'p2p|integration':               { maturity: 'Automated',  risk: 'Low',      sigma: 5 }, // ERP write-back
}

// ─── Lens definitions ─────────────────────────────────────────────────────────
export const PROC_LENSES = {
  cpo:   { label: 'CPO',        icon: '⬡', description: 'Agent & workbench coverage by phase' },
  coo:   { label: 'COO',        icon: '⚙', description: 'Process maturity & automation level' },
  cio:   { label: 'CIO',        icon: '⬡', description: 'System & technology landscape' },
  ciso:  { label: 'CISO',       icon: '⊕', description: 'Risk & control intensity' },
  cfo:   { label: 'CFO',        icon: '≡', description: 'Cost & financial impact layer' },
  sigma: { label: 'Six Sigma',  icon: 'σ', description: 'Process quality & improvement candidates' },
}

export const PROC_LENS_ORDER = ['cpo', 'coo', 'cio', 'ciso', 'cfo', 'sigma']

// ─── Color maps (shared with Finance Atlas) ───────────────────────────────────
export const MATURITY_COLORS = {
  Manual:     { bg: '#dc2626', fg: '#fff', label: 'Manual'     },
  Assisted:   { bg: '#d97706', fg: '#fff', label: 'Assisted'   },
  Automated:  { bg: '#16a34a', fg: '#fff', label: 'Automated'  },
  Autonomous: { bg: '#0284c7', fg: '#fff', label: 'Autonomous' },
}

export const PROC_SYSTEM_COLORS = {
  'SAP Ariba':  { bg: '#0057b8', fg: '#fff' },
  'SAP S/4':    { bg: '#1268b3', fg: '#fff' },
  'SAP MM':     { bg: '#004494', fg: '#fff' },
  'SAP AP':     { bg: '#1268b3', fg: '#fff' },
  'SAP MDG':    { bg: '#004494', fg: '#fff' },
  'Icertis':    { bg: '#7c3aed', fg: '#fff' },
  'Coupa':      { bg: '#c2410c', fg: '#fff' },
  'Custom AI':  { bg: '#374151', fg: '#fff' },
  'Custom':     { bg: '#525252', fg: '#fff' },
}

export const RISK_COLORS = {
  Low:      { bg: '#16a34a', fg: '#fff', label: 'Low'      },
  Medium:   { bg: '#d97706', fg: '#fff', label: 'Medium'   },
  High:     { bg: '#ea580c', fg: '#fff', label: 'High'     },
  Critical: { bg: '#dc2626', fg: '#fff', label: 'Critical' },
}

// CFO lens — operational cost impact per layer
export const CFO_COLORS = {
  'Cost-Saving':   { bg: '#16a34a', fg: '#fff', label: 'Cost-Saving'   },
  'Value-Add':     { bg: '#0284c7', fg: '#fff', label: 'Value-Add'     },
  'Risk-Reducing': { bg: '#d97706', fg: '#fff', label: 'Risk-Reducing' },
  'Overhead':      { bg: '#94a3b8', fg: '#fff', label: 'Overhead'      },
}

const CFO_LAYER_MAP = {
  integration:   'Overhead',
  orchestration: 'Value-Add',
  action:        'Cost-Saving',
  analysis:      'Value-Add',
  compliance:    'Risk-Reducing',
}

export const DATA_COLORS = {
  'High Volume':   { bg: '#0284c7', fg: '#fff', label: 'High Volume'   },
  'Event-Driven':  { bg: '#7c3aed', fg: '#fff', label: 'Event-Driven'  },
  'Transactional': { bg: '#16a34a', fg: '#fff', label: 'Transactional' },
  'Analytical':    { bg: '#A02B93', fg: '#fff', label: 'Analytical'    },
  'Audit Trail':   { bg: '#c2410c', fg: '#fff', label: 'Audit Trail'   },
}

export const SIGMA_COLORS = {
  2: { bg: '#dc2626', fg: '#fff', label: '2σ — Improve'    },
  3: { bg: '#ea580c', fg: '#fff', label: '3σ — Candidate'  },
  4: { bg: '#d97706', fg: '#fff', label: '4σ — Monitor'    },
  5: { bg: '#16a34a', fg: '#fff', label: '5σ — Good'       },
  6: { bg: '#0284c7', fg: '#fff', label: '6σ — World Class'},
}

// ─── Node factory ─────────────────────────────────────────────────────────────
export function getProcNode(phaseId, layerId) {
  const phase    = PROC_PHASE_MAP[phaseId]
  const cell     = PROC_CELL_MAP[phaseId]?.[layerId] || { agents: [], workbench: null }
  const defaults = PROC_LAYER_DEFAULTS[layerId] || PROC_LAYER_DEFAULTS.action
  const override = PROC_OVERRIDES[`${phaseId}|${layerId}`] || {}

  return {
    nodeId:      `PROC.${phaseId.replace(/-/g, '_').toUpperCase()}.${layerId.toUpperCase()}`,
    phaseId, layerId,
    phaseColor:  phase.color,
    phaseLabel:  phase.label,
    layerLabel:  layerId.charAt(0).toUpperCase() + layerId.slice(1),
    agents:      cell.agents || [],
    workbench:   cell.workbench,
    system:      PROC_SYSTEM_MAP[`${phaseId}|${layerId}`] || 'Custom',
    cfoImpact:   CFO_LAYER_MAP[layerId] || 'Overhead',
    ...defaults,
    ...override,
  }
}

export function buildProcNodeMap() {
  const map = {}
  PROC_PHASE_ORDER.forEach(phaseId => {
    PROC_LAYERS.forEach(layer => {
      const key = `${phaseId}|${layer.id}`
      map[key] = getProcNode(phaseId, layer.id)
    })
  })
  return map
}

// ─── Cell appearance & text per lens ─────────────────────────────────────────
export function getProcCellAppearance(node, lens) {
  if (!node) return { bg: '#e0e0e0', fg: '#6f6f6f' }
  switch (lens) {
    case 'cpo':   return { bg: node.phaseColor + '28', fg: node.phaseColor, border: node.phaseColor }
    case 'coo':   return MATURITY_COLORS[node.maturity] || { bg: '#e0e0e0', fg: '#000' }
    case 'cio':   return PROC_SYSTEM_COLORS[node.system] || { bg: '#525252', fg: '#fff' }
    case 'ciso':  return RISK_COLORS[node.risk] || { bg: '#e0e0e0', fg: '#000' }
    case 'cfo':   return CFO_COLORS[node.cfoImpact] || { bg: '#e0e0e0', fg: '#000' }
    case 'sigma': return SIGMA_COLORS[node.sigma] || { bg: '#e0e0e0', fg: '#000' }
    default:      return { bg: '#e0e0e0', fg: '#000' }
  }
}

export function getProcCellText(node, lens) {
  if (!node) return ''
  switch (lens) {
    case 'cpo':   return node.agents[0]?.replace(' Agent', '').replace(' Workbench', '') || '—'
    case 'coo':   return node.maturity?.charAt(0) || ''
    case 'cio':   return node.system?.split(' ')[0] || ''
    case 'ciso':  return node.risk || ''
    case 'cfo':   return node.cfoImpact?.split('-')[0] || ''
    case 'sigma': return node.sigma ? `${node.sigma}σ` : ''
    default:      return ''
  }
}

// Maturity benchmark data (Hackett Group world-class vs median)
export const PROC_BENCHMARKS = {
  'touchless-rate':    { label: 'AP Touchless Rate',       worldClass: '84%', median: '40%',   unit: '%'  },
  'cost-per-invoice':  { label: 'Cost per Invoice',        worldClass: '$2.18', median: '$10.89', unit: '$'  },
  'cycle-time-po':     { label: 'PO Cycle Time (hrs)',     worldClass: '1.2',  median: '18.4', unit: 'h'  },
  'sourcing-coverage': { label: 'Spend under Mgmt',        worldClass: '93%',  median: '62%',  unit: '%'  },
  'contract-cycle':    { label: 'Contract Cycle (days)',   worldClass: '9',    median: '28',   unit: 'd'  },
  'early-discount':    { label: 'Early Pay Discount Cap.', worldClass: '78%',  median: '31%',  unit: '%'  },
  'supplier-risk-cov': { label: 'Supplier Risk Coverage',  worldClass: '91%',  median: '44%',  unit: '%'  },
  'dpo':               { label: 'Days Payable Outstanding',worldClass: '58',   median: '42',   unit: 'd'  },
}

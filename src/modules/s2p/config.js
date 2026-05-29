const s2pConfig = {
  id: 's2p',
  label: 'S2P',
  fullName: 'Source to Pay',
  tagline: 'Touchless AP. Supplier Risk. Auto matching',
  color: '#196B24',
  accentColor: '#4EA72E',
  wave: 4,
  processAreas: [
    { id: 'ap',            label: 'AP Processing',  sub: 'Invoice Ingestion & Matching', color: '#1565C0' },
    { id: 'invoice',       label: 'Invoice Mgmt',   sub: 'Exception Handling',            color: '#1976D2' },
    { id: 'vendor',        label: 'Vendor Mgmt',    sub: 'Master Data & Onboarding',      color: '#9B7A00' },
    { id: 'p2p-ops',       label: 'P2P Operations', sub: 'SLA & Touchless Rate',          color: '#E06020' },
    { id: 'supplier-risk', label: 'Supplier Risk',  sub: 'Sanctions & ESG',               color: '#C41E3A' },
    { id: 'procurement',   label: 'Procurement',    sub: 'PO & Catalogue',                color: '#1B5E20' },
  ],
  layers: [
    {
      id: 'compliance', label: 'Compliance',
      cells: {
        'ap':            { agents: ['Control Agent'],   workbench: null              },
        'invoice':       { agents: ['Monitor Agent'],   workbench: null              },
        'vendor':        { agents: ['Vendor Agent'],    workbench: null              },
        'p2p-ops':       { agents: ['Reporting Agent'], workbench: 'P2P Operations WB'},
        'supplier-risk': { agents: ['Risk Agent'],      workbench: null              },
        'procurement':   { agents: ['Control Agent'],   workbench: null              },
      },
    },
    {
      id: 'analysis', label: 'Analysis',
      cells: {
        'ap':            { agents: ['Monitor Agent'],      workbench: null },
        'invoice':       { agents: ['Exception Agent'],    workbench: null },
        'vendor':        { agents: ['Performance Agent'],  workbench: null },
        'p2p-ops':       { agents: ['Performance Agent'],  workbench: null },
        'supplier-risk': { agents: ['Risk Agent'],         workbench: null },
        'procurement':   { agents: ['Monitor Agent'],      workbench: null },
      },
    },
    {
      id: 'orchestration', label: 'Orchestration',
      cells: {
        'ap':            { agents: ['Orchestration Agent'], workbench: null },
        'invoice':       { agents: ['Orchestration Agent'], workbench: null },
        'vendor':        { agents: ['Orchestration Agent'], workbench: null },
        'p2p-ops':       { agents: ['Orchestration Agent'], workbench: null },
        'supplier-risk': { agents: ['Orchestration Agent'], workbench: null },
        'procurement':   { agents: ['Orchestration Agent'], workbench: null },
      },
    },
    {
      id: 'action', label: 'Action',
      cells: {
        'ap':            { agents: ['AP Agent'],      workbench: 'AP Specialist WB' },
        'invoice':       { agents: ['Invoice Agent'], workbench: null               },
        'vendor':        { agents: ['Vendor Agent'],  workbench: null               },
        'p2p-ops':       { agents: ['P2P Agent'],     workbench: null               },
        'supplier-risk': { agents: ['Risk Agent'],    workbench: null               },
        'procurement':   { agents: ['PO Agent'],      workbench: null               },
      },
    },
    {
      id: 'integration', label: 'Integration',
      cells: {
        'ap':            { agents: ['Extraction/Data Agent'], workbench: null },
        'invoice':       { agents: ['Extraction/Data Agent'], workbench: null },
        'vendor':        { agents: ['Extraction/Data Agent'], workbench: null },
        'p2p-ops':       { agents: ['Extraction/Data Agent'], workbench: null },
        'supplier-risk': { agents: ['Extraction/Data Agent'], workbench: null },
        'procurement':   { agents: ['Extraction/Data Agent'], workbench: null },
      },
    },
  ],
  kpis: [
    { id: 'k1', label: 'Touchless AP Rate ≥40% under threshold',      icon: '⟳', color: '#196B24' },
    { id: 'k2', label: 'Duplicate payment rate ≤0.05%',               icon: '⊘', color: '#E97132' },
    { id: 'k3', label: 'Zero unauthorised banking-detail changes',     icon: '⛛', color: '#A02B93' },
    { id: 'k4', label: 'Supplier risk continuously screened',          icon: '⊕', color: '#0F9ED5' },
  ],
  personas: [
    { id: 'ap-spec',           label: 'AP Specialist',                   wave: 4, active: false },
    { id: 'invoice-analyst',   label: 'Invoice Processing Analyst',      wave: 4, active: false },
    { id: 'vendor-mgr',        label: 'Vendor Management Analyst',       wave: 4, active: false },
    { id: 'p2p-mgr',           label: 'P2P Operations Manager',          wave: 4, active: false },
    { id: 'supplier-risk-mgr', label: 'Supplier Risk Manager',           wave: 4, active: false },
    { id: 'buyer',             label: 'Procurement Specialist / Buyer',  wave: 4, active: false },
  ],
  skills: [
    '/ingest-invoice', '/three-way-match', '/gl-coding-suggest',
    '/duplicate-invoice-block', '/payment-run-prep', '/onboard-supplier',
    '/banking-change-verify', '/sanctions-rescreen', '/sla-breach-forecast',
    '/touchless-rate-monitor', '/risk-signal-aggregate',
  ],
}

export default s2pConfig

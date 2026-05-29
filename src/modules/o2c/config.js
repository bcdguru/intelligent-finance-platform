const o2cConfig = {
  id: 'o2c',
  label: 'O2C',
  fullName: 'Order to Cash',
  tagline: 'Digital Contracts. Auto matching & settlement',
  color: '#E97132',
  accentColor: '#0F9ED5',
  wave: 3,
  processAreas: [
    { id: 'billing',     label: 'Billing',            sub: 'Invoice & Order Mgmt', color: '#1565C0' },
    { id: 'revenue',     label: 'Revenue Accounting', sub: 'IFRS 15 / ASC 606',    color: '#1976D2' },
    { id: 'cash-app',    label: 'Cash Application',   sub: 'Remittance Matching',   color: '#9B7A00' },
    { id: 'collections', label: 'Collections',        sub: 'Dunning & Credit Risk', color: '#E06020' },
    { id: 'ar-mgmt',     label: 'AR Management',      sub: 'DSO & KPIs',            color: '#C41E3A' },
    { id: 'contract',    label: 'Contract Mgmt',      sub: 'Pricing & Terms',       color: '#1B5E20' },
  ],
  layers: [
    {
      id: 'compliance', label: 'Compliance',
      cells: {
        'billing':     { agents: ['Billing Agent'],        workbench: null                    },
        'revenue':     { agents: ['Contract Agent'],       workbench: null                    },
        'cash-app':    { agents: ['Reconciliation Agent'], workbench: null                    },
        'collections': { agents: ['Control Agent'],        workbench: 'Collections Workbench' },
        'ar-mgmt':     { agents: ['Reporting Agent'],      workbench: 'AR Director Workbench' },
        'contract':    { agents: ['Contract Agent'],       workbench: null                    },
      },
    },
    {
      id: 'analysis', label: 'Analysis',
      cells: {
        'billing':     { agents: ['Monitor Agent'],      workbench: null },
        'revenue':     { agents: ['Forecasting Agent'],  workbench: null },
        'cash-app':    { agents: ['Cash Agent'],         workbench: null },
        'collections': { agents: ['Performance Agent'],  workbench: null },
        'ar-mgmt':     { agents: ['Reporting Agent'],    workbench: null },
        'contract':    { agents: ['Monitor Agent'],      workbench: null },
      },
    },
    {
      id: 'orchestration', label: 'Orchestration',
      cells: {
        'billing':     { agents: ['Orchestration Agent'], workbench: null },
        'revenue':     { agents: ['Orchestration Agent'], workbench: null },
        'cash-app':    { agents: ['Orchestration Agent'], workbench: null },
        'collections': { agents: ['Orchestration Agent'], workbench: null },
        'ar-mgmt':     { agents: ['Orchestration Agent'], workbench: null },
        'contract':    { agents: ['Orchestration Agent'], workbench: null },
      },
    },
    {
      id: 'action', label: 'Action',
      cells: {
        'billing':     { agents: ['Billing Agent'],     workbench: 'Billing Specialist WB' },
        'revenue':     { agents: ['Contract Agent'],    workbench: null                    },
        'cash-app':    { agents: ['Cash App Agent'],    workbench: 'Cash Application WB'   },
        'collections': { agents: ['Collections Agent'], workbench: null                    },
        'ar-mgmt':     { agents: ['AR Agent'],          workbench: null                    },
        'contract':    { agents: ['Contract Agent'],    workbench: null                    },
      },
    },
    {
      id: 'integration', label: 'Integration',
      cells: {
        'billing':     { agents: ['Extraction/Data Agent'], workbench: null },
        'revenue':     { agents: ['Extraction/Data Agent'], workbench: null },
        'cash-app':    { agents: ['Extraction/Data Agent'], workbench: null },
        'collections': { agents: ['Extraction/Data Agent'], workbench: null },
        'ar-mgmt':     { agents: ['Extraction/Data Agent'], workbench: null },
        'contract':    { agents: ['Extraction/Data Agent'], workbench: null },
      },
    },
  ],
  kpis: [
    { id: 'k1', label: 'Digital Contracts & Auto matching',         icon: '≡', color: '#E97132' },
    { id: 'k2', label: 'Cash Application ≥75% auto-match',          icon: '$', color: '#196B24' },
    { id: 'k3', label: 'DSO improvement vs baseline',               icon: '⬇', color: '#0F9ED5' },
    { id: 'k4', label: 'IFRS 15 / ASC 606 evidence per contract',   icon: '⊕', color: '#156082' },
  ],
  personas: [
    { id: 'billing-spec',        label: 'Billing Specialist',              wave: 3, active: false },
    { id: 'cash-app-spec',       label: 'Cash Application Specialist',     wave: 3, active: false },
    { id: 'collections-analyst', label: 'Credit & Collections Analyst',    wave: 3, active: true  },
    { id: 'revenue-accountant',  label: 'Revenue Accountant',              wave: 3, active: false },
    { id: 'ar-director',         label: 'AR Manager / Director of O2C',    wave: 3, active: true  },
    { id: 'pricing-analyst',     label: 'Contract & Pricing Analyst',      wave: 3, active: false },
  ],
  skills: [
    '/draft-invoice', '/apply-pricing-rule', '/resolve-billing-exception',
    '/assess-five-step-model', '/allocate-ssp', '/detect-contract-modification',
    '/auto-match-remittance', '/resolve-short-pay', '/risk-rank-worklist',
    '/dso-forecast', '/o2c-control-dashboard',
  ],
}

export default o2cConfig

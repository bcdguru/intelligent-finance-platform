const fpaConfig = {
  id: 'fpa',
  label: 'FP&A',
  fullName: 'Plan, Forecast, Decide',
  tagline: 'No Touch Reports. ON time Submission',
  color: '#A02B93',
  accentColor: '#0F9ED5',
  wave: 5,
  processAreas: [
    { id: 'variance',   label: 'Variance Analysis',  sub: 'Volume / Price / Mix / FX', color: '#1565C0' },
    { id: 'forecast',   label: 'Forecasting',        sub: 'Driver-Based & Scenario',   color: '#1976D2' },
    { id: 'reporting',  label: 'Reporting',          sub: 'Board Pack & KPI',           color: '#9B7A00' },
    { id: 'planning',   label: 'Planning',           sub: 'Top-down / Bottom-up',       color: '#E06020' },
    { id: 'bu-partner', label: 'BU Finance Partner', sub: 'Flash & Business Q&A',       color: '#C41E3A' },
    { id: 'strategy',   label: 'Strategic Finance',  sub: 'LRP & Capital Allocation',   color: '#1B5E20' },
  ],
  layers: [
    {
      id: 'compliance', label: 'Compliance',
      cells: {
        'variance':   { agents: ['Reporting Agent'],  workbench: null              },
        'forecast':   { agents: ['Monitor Agent'],    workbench: null              },
        'reporting':  { agents: ['Reporting Agent'],  workbench: 'Head of FP&A WB' },
        'planning':   { agents: ['Control Agent'],    workbench: null              },
        'bu-partner': { agents: ['Monitor Agent'],    workbench: null              },
        'strategy':   { agents: ['Reporting Agent'],  workbench: null              },
      },
    },
    {
      id: 'analysis', label: 'Analysis',
      cells: {
        'variance':   { agents: ['Performance Agent'],  workbench: null },
        'forecast':   { agents: ['Forecasting Agent'],  workbench: null },
        'reporting':  { agents: ['Performance Agent'],  workbench: null },
        'planning':   { agents: ['Forecasting Agent'],  workbench: null },
        'bu-partner': { agents: ['Performance Agent'],  workbench: null },
        'strategy':   { agents: ['Forecasting Agent'],  workbench: null },
      },
    },
    {
      id: 'orchestration', label: 'Orchestration',
      cells: {
        'variance':   { agents: ['Orchestration Agent'], workbench: null },
        'forecast':   { agents: ['Orchestration Agent'], workbench: null },
        'reporting':  { agents: ['Orchestration Agent'], workbench: null },
        'planning':   { agents: ['Orchestration Agent'], workbench: null },
        'bu-partner': { agents: ['Orchestration Agent'], workbench: null },
        'strategy':   { agents: ['Orchestration Agent'], workbench: null },
      },
    },
    {
      id: 'action', label: 'Action',
      cells: {
        'variance':   { agents: ['Variance Agent'],    workbench: 'Analyst WB'         },
        'forecast':   { agents: ['Forecasting Agent'], workbench: 'Forecast Workbench' },
        'reporting':  { agents: ['Reporting Agent'],   workbench: null                 },
        'planning':   { agents: ['Planning Agent'],    workbench: null                 },
        'bu-partner': { agents: ['BU Agent'],          workbench: null                 },
        'strategy':   { agents: ['Strategy Agent'],    workbench: null                 },
      },
    },
    {
      id: 'integration', label: 'Integration',
      cells: {
        'variance':   { agents: ['Extraction/Data Agent'], workbench: null },
        'forecast':   { agents: ['Extraction/Data Agent'], workbench: null },
        'reporting':  { agents: ['Extraction/Data Agent'], workbench: null },
        'planning':   { agents: ['Extraction/Data Agent'], workbench: null },
        'bu-partner': { agents: ['Extraction/Data Agent'], workbench: null },
        'strategy':   { agents: ['Extraction/Data Agent'], workbench: null },
      },
    },
  ],
  kpis: [
    { id: 'k1', label: 'No Touch Reports. ON time Submission',                    icon: '⇧', color: '#A02B93' },
    { id: 'k2', label: 'Forecast variance attribution within 24h of close',       icon: '⌚', color: '#156082' },
    { id: 'k3', label: 'Forecast accuracy (MAPE) improves vs trailing 12m',       icon: '↗', color: '#196B24' },
    { id: 'k4', label: 'Board pack drafted by platform, edited by Head of FP&A',  icon: '✎', color: '#0F9ED5' },
  ],
  personas: [
    { id: 'fin-analyst',  label: 'Financial Analyst',          wave: 5, active: false },
    { id: 'sr-analyst',   label: 'Senior Financial Analyst',   wave: 5, active: false },
    { id: 'cost-analyst', label: 'Cost / Margin Analyst',      wave: 5, active: false },
    { id: 'corp-fpa',     label: 'Corporate FP&A Manager',     wave: 5, active: false },
    { id: 'bu-partner',   label: 'BU Finance Partner',         wave: 5, active: false },
    { id: 'head-fpa',     label: 'Head of FP&A',               wave: 5, active: false },
    { id: 'strat-fin',    label: 'Strategic Finance Manager',  wave: 5, active: false },
  ],
  skills: [
    '/variance-explain', '/scenario-build', '/margin-bridge',
    '/consolidate-forecast', '/bu-flash-report', '/enterprise-forecast-view',
    '/board-pack-fpa', '/lrp-model-refresh', '/macro-signal-overlay',
  ],
}

export default fpaConfig

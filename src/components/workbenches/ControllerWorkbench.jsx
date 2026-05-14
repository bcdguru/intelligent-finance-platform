import { useState, useEffect } from 'react'
import {
  CheckCircle, AlertTriangle, Clock, TrendingDown, TrendingUp,
  FileText, Shield, DollarSign, ChevronRight, X, Check, Eye
} from 'lucide-react'

// ─── Demo data ────────────────────────────────────────────────────────────────

const SUBLEDGER_STATUS = [
  { name: 'Accounts Payable',    status: 'reconciled', value: '–$4.2M',  delta: null },
  { name: 'Accounts Receivable', status: 'reconciled', value: '$8.7M',   delta: null },
  { name: 'Fixed Assets',        status: 'warning',    value: '$32.1M',  delta: '2 exceptions' },
  { name: 'Inventory',           status: 'reconciled', value: '$11.4M',  delta: null },
  { name: 'Payroll Accruals',    status: 'pending',    value: '$1.9M',   delta: 'Awaiting sign-off' },
  { name: 'Intercompany',        status: 'reconciled', value: '$0',      delta: null },
]

const JOURNAL_EVENT = {
  id: 'JE-2025-0847',
  description: 'Monthly SaaS subscription accrual — Q2 prepayment amortization',
  amount: '$142,500',
  debit: 'Prepaid Expenses (1240)',
  credit: 'SaaS Subscription Expense (6110)',
  source: 'Vendor Invoice #INV-20250514-Salesforce',
  policy: 'ASC 350-40 / IFRS 15 §B63',
  controlId: 'GL-CTL-0041',
  riskLevel: 'Low',
}

const FLUX_ITEMS = [
  { account: 'SaaS & Software (6110)', actual: '$890K', prior: '$720K', variance: '+$170K', pct: '+23.6%', up: true,  narrative: 'Increase driven by Q2 Salesforce renewal (+$95K) and new Databricks contract activation (+$75K).' },
  { account: 'Professional Services (6210)', actual: '$340K', prior: '$410K', variance: '–$70K', pct: '–17.1%', up: false, narrative: 'Reduction from in-sourcing of audit-prep activities; one-time advisory fee in prior period not repeated.' },
  { account: 'Travel & Entertainment (6320)', actual: '$88K', prior: '$62K', variance: '+$26K', pct: '+41.9%', up: true, narrative: 'Return to pre-pandemic travel normalisation; 3 customer QBRs in period vs. 1 in prior quarter.' },
]

const RECON_STATUS = [
  { area: 'GL ↔ AP Sub-ledger',         status: 'green',  diff: '$0',     last: '2 min ago' },
  { area: 'GL ↔ AR Sub-ledger',         status: 'green',  diff: '$0',     last: '2 min ago' },
  { area: 'GL ↔ Fixed Assets Register', status: 'amber',  diff: '$3,840', last: '14 min ago' },
  { area: 'GL ↔ Payroll System',        status: 'red',    diff: '$19,200',last: '1 hr ago'   },
  { area: 'Bank ↔ Cash GL',             status: 'green',  diff: '$0',     last: '5 min ago' },
]

const EVIDENCE_LOG = [
  { id: 'GL-CTL-0041', action: '/draft-journal',          user: 'K. Patel (GL Accountant)', ts: '09:14:22', hash: 'a3f9c1d2' },
  { id: 'GL-CTL-0041', action: 'Human approval',          user: 'S. Kim (Controller)',       ts: '09:16:08', hash: 'b7e2a9f1' },
  { id: 'GL-CTL-0038', action: '/reconcile-subledger',   user: 'System',                   ts: '08:55:01', hash: 'c1d4b8e7' },
  { id: 'GL-CTL-0037', action: '/control-exception-triage', user: 'System',                ts: '08:30:14', hash: 'd2f5c9a3' },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusDot({ status }) {
  const map = { reconciled: 'bg-green-500', warning: 'bg-amber-400', pending: 'bg-gray-400', green: 'bg-green-500', amber: 'bg-amber-400', red: 'bg-red-500' }
  return <span className={`inline-block w-2 h-2 rounded-full ${map[status] || 'bg-gray-400'}`} />
}

function CloseProgressBar({ pct, color }) {
  return (
    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
      <div className="h-1.5 rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
    </div>
  )
}

// ─── Panels ───────────────────────────────────────────────────────────────────

function CloseCockpit() {
  const items = [
    { label: 'Sub-ledger Close',     pct: 83, status: 'In Progress', color: '#156082' },
    { label: 'Journal Entries',      pct: 91, status: 'In Progress', color: '#0F9ED5' },
    { label: 'Reconciliations',      pct: 75, status: 'In Progress', color: '#196B24' },
    { label: 'Flux Review',          pct: 60, status: 'Pending',     color: '#E97132' },
    { label: 'Control Sign-offs',    pct: 100,status: 'Complete',    color: '#4EA72E' },
    { label: 'Consolidation',        pct: 0,  status: 'Not Started', color: '#C1C7CD' },
  ]
  return (
    <div className="bg-white rounded-xl border border-brand-silver shadow-sm p-4 slide-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-teal/10 flex items-center justify-center">
            <Clock size={14} className="text-brand-teal" />
          </div>
          <div>
            <div className="text-sm font-semibold text-brand-ink">Close Cockpit</div>
            <div className="text-[10px] text-gray-400">May 2025 · Day 3 of 5</div>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
          In Progress
        </span>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {items.map(item => (
          <div key={item.label}>
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-gray-600">{item.label}</span>
              <span className="text-[10px] font-semibold" style={{ color: item.color }}>{item.pct}%</span>
            </div>
            <CloseProgressBar pct={item.pct} color={item.color} />
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-brand-silver grid grid-cols-3 gap-2 text-center">
        {SUBLEDGER_STATUS.map(s => (
          <div key={s.name} className="flex flex-col items-center gap-0.5">
            <StatusDot status={s.status} />
            <span className="text-[9px] text-gray-500 leading-tight text-center">{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function JournalAdvisor() {
  const [state, setState] = useState('draft') // draft | approved | posted
  const [animating, setAnimating] = useState(false)

  const approve = () => {
    setAnimating(true)
    setTimeout(() => { setState('approved'); setAnimating(false) }, 600)
  }

  const post = () => {
    setAnimating(true)
    setTimeout(() => { setState('posted'); setAnimating(false) }, 600)
  }

  return (
    <div className="bg-white rounded-xl border border-brand-silver shadow-sm p-4 slide-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-blue/10 flex items-center justify-center">
            <FileText size={14} className="text-brand-blue" />
          </div>
          <div>
            <div className="text-sm font-semibold text-brand-ink">Journal Advisor</div>
            <div className="text-[10px] text-gray-400">/draft-journal · {JOURNAL_EVENT.id}</div>
          </div>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
          state === 'posted'   ? 'bg-green-50 text-green-700 border-green-200' :
          state === 'approved' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                 'bg-amber-50 text-amber-600 border-amber-200'
        }`}>
          {state === 'posted' ? 'Posted ✓' : state === 'approved' ? 'Approved' : 'Pending Review'}
        </span>
      </div>

      <div className="bg-gray-50 rounded-lg p-3 text-[11px] space-y-1.5 mb-3">
        <div className="font-semibold text-brand-ink">{JOURNAL_EVENT.description}</div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-gray-600 mt-2">
          <div><span className="font-medium text-gray-800">DR</span> {JOURNAL_EVENT.debit}</div>
          <div className="text-right font-mono">{JOURNAL_EVENT.amount}</div>
          <div><span className="font-medium text-gray-800">CR</span> {JOURNAL_EVENT.credit}</div>
          <div className="text-right font-mono">{JOURNAL_EVENT.amount}</div>
        </div>
      </div>

      <div className="space-y-1 text-[10px] mb-3">
        <div className="flex gap-2">
          <span className="text-gray-400 w-16 flex-shrink-0">Source</span>
          <span className="text-brand-teal underline cursor-pointer">{JOURNAL_EVENT.source}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-gray-400 w-16 flex-shrink-0">Policy</span>
          <span className="text-brand-ink">{JOURNAL_EVENT.policy}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-gray-400 w-16 flex-shrink-0">Control</span>
          <span className="font-mono text-brand-purple">{JOURNAL_EVENT.controlId}</span>
        </div>
      </div>

      {state === 'draft' && (
        <div className="flex gap-2">
          <button
            onClick={approve}
            disabled={animating}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-brand-teal text-white text-[11px] font-semibold hover:bg-opacity-90 transition-all"
          >
            <Check size={12} /> Approve
          </button>
          <button className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-brand-silver text-[11px] text-gray-600 hover:bg-gray-50">
            <Eye size={12} /> Review
          </button>
        </div>
      )}
      {state === 'approved' && (
        <div className="flex gap-2">
          <button
            onClick={post}
            disabled={animating}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-green-600 text-white text-[11px] font-semibold hover:bg-opacity-90 transition-all"
          >
            <CheckCircle size={12} /> Post to GL
          </button>
        </div>
      )}
      {state === 'posted' && (
        <div className="text-[10px] text-green-700 font-medium bg-green-50 rounded-lg p-2 text-center">
          Evidence record created · Hash: <span className="font-mono">a3f9c1d2</span>
        </div>
      )}
    </div>
  )
}

function FluxAgent() {
  const [expanded, setExpanded] = useState(0)
  return (
    <div className="bg-white rounded-xl border border-brand-silver shadow-sm p-4 slide-in">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-brand-orange/10 flex items-center justify-center">
          <TrendingUp size={14} className="text-brand-orange" />
        </div>
        <div>
          <div className="text-sm font-semibold text-brand-ink">Flux Agent</div>
          <div className="text-[10px] text-gray-400">/flux-explainer · May 2025 vs Apr 2025</div>
        </div>
      </div>
      <div className="space-y-2">
        {FLUX_ITEMS.map((item, i) => (
          <div
            key={item.account}
            className="border border-brand-silver rounded-lg overflow-hidden cursor-pointer"
            onClick={() => setExpanded(expanded === i ? -1 : i)}
          >
            <div className="flex items-center gap-3 p-2 hover:bg-gray-50 transition-colors">
              <div className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ${item.up ? 'bg-red-50' : 'bg-green-50'}`}>
                {item.up ? <TrendingUp size={12} className="text-red-500" /> : <TrendingDown size={12} className="text-green-600" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-medium text-brand-ink truncate">{item.account}</div>
                <div className="text-[10px] text-gray-400">{item.actual} actual</div>
              </div>
              <div className={`text-[11px] font-bold ${item.up ? 'text-red-500' : 'text-green-600'}`}>{item.variance}</div>
              <ChevronRight size={12} className={`text-gray-400 transition-transform ${expanded === i ? 'rotate-90' : ''}`} />
            </div>
            {expanded === i && (
              <div className="px-3 pb-3 text-[11px] text-gray-600 leading-relaxed bg-gray-50 border-t border-brand-silver">
                {item.narrative}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function ReconciliationAgent() {
  const statusMap = { green: { dot: 'bg-green-500', label: 'Reconciled', bg: 'bg-green-50' }, amber: { dot: 'bg-amber-400', label: 'Exception', bg: 'bg-amber-50' }, red: { dot: 'bg-red-500', label: 'Break', bg: 'bg-red-50' } }
  return (
    <div className="bg-white rounded-xl border border-brand-silver shadow-sm p-4 slide-in">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center">
          <Shield size={14} className="text-green-600" />
        </div>
        <div>
          <div className="text-sm font-semibold text-brand-ink">Reconciliation Agent</div>
          <div className="text-[10px] text-gray-400">/reconcile-subledger · real-time</div>
        </div>
      </div>
      <div className="space-y-1.5">
        {RECON_STATUS.map(r => {
          const s = statusMap[r.status]
          return (
            <div key={r.area} className={`flex items-center gap-2 p-2 rounded-lg ${s.bg}`}>
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${s.dot}`} />
              <span className="text-[11px] text-brand-ink flex-1">{r.area}</span>
              {r.diff !== '$0' && <span className="text-[10px] font-mono text-red-600">{r.diff}</span>}
              <span className="text-[9px] text-gray-400">{r.last}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function AuditAgent({ onClose }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)

  const search = (e) => {
    e.preventDefault()
    if (!query.trim()) return
    setResults(EVIDENCE_LOG.filter(r =>
      r.id.toLowerCase().includes(query.toLowerCase()) ||
      r.action.toLowerCase().includes(query.toLowerCase())
    ))
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl slide-in">
        <div className="flex items-center justify-between p-4 border-b border-brand-silver">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-purple/10 flex items-center justify-center">
              <Shield size={16} className="text-brand-purple" />
            </div>
            <div>
              <div className="text-sm font-bold text-brand-ink">Audit Agent</div>
              <div className="text-[10px] text-gray-400">Control-ID indexed evidence vault</div>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={16} />
          </button>
        </div>

        <div className="p-4">
          <form onSubmit={search} className="flex gap-2 mb-4">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Enter control ID or skill name… e.g. GL-CTL-0041"
              className="flex-1 border border-brand-silver rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-brand-teal text-white rounded-lg text-sm font-semibold hover:bg-opacity-90"
            >
              Query
            </button>
          </form>

          {results === null && (
            <div className="text-center py-6 text-sm text-gray-400">
              Every agent invocation, approver, and source record — queryable by control ID.
            </div>
          )}

          {results !== null && results.length === 0 && (
            <div className="text-center py-4 text-sm text-gray-400">No evidence records found.</div>
          )}

          {results && results.length > 0 && (
            <div className="space-y-2">
              {results.map((r, i) => (
                <div key={i} className="border border-brand-silver rounded-lg p-3 text-[11px] slide-in">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-brand-purple">{r.id}</span>
                    <span className="text-gray-400">{r.ts}</span>
                  </div>
                  <div className="text-brand-ink font-medium">{r.action}</div>
                  <div className="text-gray-500 mt-0.5">{r.user}</div>
                  <div className="text-gray-400 font-mono mt-1 text-[10px]">hash: {r.hash}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function TreasurerTile() {
  return (
    <div className="bg-gradient-to-br from-brand-teal to-brand-navy rounded-xl shadow-sm p-4 slide-in text-white">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
          <DollarSign size={14} className="text-white" />
        </div>
        <div>
          <div className="text-sm font-semibold">Treasurer Workbench</div>
          <div className="text-[10px] opacity-70">Wave 2 Preview · /daily-cash-position</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <div className="text-lg font-bold count-up">$24.3M</div>
          <div className="text-[9px] opacity-70 mt-0.5">Available Cash</div>
        </div>
        <div>
          <div className="text-lg font-bold count-up">$8.1M</div>
          <div className="text-[9px] opacity-70 mt-0.5">14-Day Forecast</div>
        </div>
        <div>
          <div className="text-lg font-bold count-up">2</div>
          <div className="text-[9px] opacity-70 mt-0.5">FX Alerts</div>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-white/20 text-[10px] opacity-70 text-center">
        Optimize Cashflows · Real time Visibility →
      </div>
    </div>
  )
}

// ─── Main workbench ───────────────────────────────────────────────────────────

export default function ControllerWorkbench({ onClose }) {
  const [showAudit, setShowAudit] = useState(false)

  return (
    <div className="fixed inset-0 bg-brand-silver/40 backdrop-blur-sm z-40 flex flex-col">
      {/* Workbench header */}
      <div className="bg-brand-navy text-white px-6 py-3 flex items-center justify-between shadow-lg flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-teal flex items-center justify-center font-bold text-sm">⬡</div>
          <div>
            <div className="font-bold text-sm">Controller Workbench</div>
            <div className="text-[10px] opacity-60">May 2025 Close · Continuous and Compliant Close</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAudit(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-purple/20 text-brand-purple border border-brand-purple/30 text-[11px] font-semibold hover:bg-brand-purple/30 transition-colors"
          >
            <Shield size={12} /> Audit Agent
          </button>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Workbench body */}
      <div className="flex-1 overflow-y-auto p-5">
        <div className="max-w-6xl mx-auto grid grid-cols-12 gap-4">
          {/* Left column */}
          <div className="col-span-5 flex flex-col gap-4">
            <CloseCockpit />
            <ReconciliationAgent />
            <TreasurerTile />
          </div>
          {/* Right column */}
          <div className="col-span-7 flex flex-col gap-4">
            <JournalAdvisor />
            <FluxAgent />
          </div>
        </div>
      </div>

      {showAudit && <AuditAgent onClose={() => setShowAudit(false)} />}
    </div>
  )
}

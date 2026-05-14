import { useState } from 'react'
import {
  Button, Tag, Tile, ProgressBar,
  Accordion, AccordionItem,
  StructuredListWrapper, StructuredListHead, StructuredListBody,
  StructuredListRow, StructuredListCell,
  Modal, Search, InlineNotification,
  Grid, Column,
} from '@carbon/react'
import {
  Close, Security, CheckmarkFilled, Search as SearchIcon,
  ArrowUp, ArrowDown, Launch,
} from '@carbon/icons-react'

// ─── Demo data ───────────────────────────────────────────────────────────────

const CLOSE_TASKS = [
  { label: 'Sub-ledger Close',  pct: 83, status: 'in-progress' },
  { label: 'Journal Entries',   pct: 91, status: 'in-progress' },
  { label: 'Reconciliations',   pct: 75, status: 'in-progress' },
  { label: 'Flux Review',       pct: 60, status: 'pending'     },
  { label: 'Control Sign-offs', pct: 100,status: 'complete'    },
  { label: 'Consolidation',     pct: 0,  status: 'not-started' },
]

const SUBLEDGER_STATUS = [
  { name: 'AP',             status: 'green' },
  { name: 'AR',             status: 'green' },
  { name: 'Fixed Assets',   status: 'amber' },
  { name: 'Inventory',      status: 'green' },
  { name: 'Payroll',        status: 'red'   },
  { name: 'Intercompany',   status: 'green' },
]

const JOURNAL = {
  id: 'JE-2025-0847',
  desc: 'Monthly SaaS subscription accrual — Q2 prepayment amortization',
  amount: '$142,500',
  dr: 'Prepaid Expenses (1240)',
  cr: 'SaaS Subscription Expense (6110)',
  source: 'Vendor Invoice #INV-20250514-Salesforce',
  policy: 'ASC 350-40 / IFRS 15 §B63',
  control: 'GL-CTL-0041',
}

const FLUX_ITEMS = [
  {
    account: 'SaaS & Software (6110)',
    actual: '$890K', prior: '$720K', variance: '+$170K', pct: '+23.6%', up: true,
    narrative: 'Increase driven by Q2 Salesforce renewal (+$95K) and new Databricks contract activation (+$75K).',
  },
  {
    account: 'Professional Services (6210)',
    actual: '$340K', prior: '$410K', variance: '–$70K', pct: '–17.1%', up: false,
    narrative: 'Reduction from in-sourcing of audit-prep activities; prior-period advisory fee not repeated.',
  },
  {
    account: 'Travel & Entertainment (6320)',
    actual: '$88K', prior: '$62K', variance: '+$26K', pct: '+41.9%', up: true,
    narrative: 'Return to pre-pandemic travel normalisation; 3 customer QBRs in period vs. 1 prior quarter.',
  },
]

const RECON_ROWS = [
  { area: 'GL ↔ AP Sub-ledger',         status: 'green', diff: '$0',      last: '2 min ago'  },
  { area: 'GL ↔ AR Sub-ledger',         status: 'green', diff: '$0',      last: '2 min ago'  },
  { area: 'GL ↔ Fixed Assets Register', status: 'amber', diff: '$3,840',  last: '14 min ago' },
  { area: 'GL ↔ Payroll System',        status: 'red',   diff: '$19,200', last: '1 hr ago'   },
  { area: 'Bank ↔ Cash GL',             status: 'green', diff: '$0',      last: '5 min ago'  },
]

const EVIDENCE = [
  { id: 'GL-CTL-0041', action: '/draft-journal',            user: 'K. Patel (GL Accountant)',    ts: '09:14:22', hash: 'a3f9c1d2' },
  { id: 'GL-CTL-0041', action: 'Human approval — approved', user: 'S. Kim (Controller)',          ts: '09:16:08', hash: 'b7e2a9f1' },
  { id: 'GL-CTL-0038', action: '/reconcile-subledger',     user: 'System (Reconciliation Agent)', ts: '08:55:01', hash: 'c1d4b8e7' },
  { id: 'GL-CTL-0037', action: '/control-exception-triage',user: 'System (Control Agent)',        ts: '08:30:14', hash: 'd2f5c9a3' },
]

// ─── Status helpers ───────────────────────────────────────────────────────────

const STATUS_DOT = {
  green: { bg: '#24a148', label: 'Reconciled' },
  amber: { bg: '#f1c21b', label: 'Exception'  },
  red:   { bg: '#da1e28', label: 'Break'       },
}

function Dot({ status }) {
  const s = STATUS_DOT[status] || STATUS_DOT.green
  return (
    <span style={{
      display: 'inline-block', width: 8, height: 8,
      borderRadius: '50%', background: s.bg, flexShrink: 0,
    }} />
  )
}

// ─── Panel: Close Cockpit ─────────────────────────────────────────────────────

function CloseCockpit() {
  const pctDone = Math.round(CLOSE_TASKS.reduce((s, t) => s + t.pct, 0) / CLOSE_TASKS.length)
  return (
    <Tile style={{ height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#161616' }}>Close Cockpit</div>
          <div style={{ fontSize: 11, color: '#8d8d8d', marginTop: 2 }}>May 2025 · Day 3 of 5</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#0072c3', lineHeight: 1 }} className="count-up">{pctDone}%</div>
          <Tag type="blue" size="sm">In Progress</Tag>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1rem' }}>
        {CLOSE_TASKS.map(t => (
          <div key={t.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: '#525252' }}>{t.label}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: t.pct === 100 ? '#24a148' : '#161616' }}>
                {t.pct}%
              </span>
            </div>
            <ProgressBar
              value={t.pct}
              max={100}
              size="sm"
              status={t.pct === 100 ? 'finished' : t.pct === 0 ? 'error' : 'active'}
              hideLabel
            />
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
        {SUBLEDGER_STATUS.map(s => (
          <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Dot status={s.status} />
            <span style={{ fontSize: 10, color: '#525252' }}>{s.name}</span>
          </div>
        ))}
      </div>
    </Tile>
  )
}

// ─── Panel: Journal Advisor ───────────────────────────────────────────────────

function JournalAdvisor() {
  const [state, setState] = useState('draft')

  return (
    <Tile style={{ height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#161616' }}>Journal Advisor</div>
          <div style={{ fontSize: 11, color: '#8d8d8d', marginTop: 2 }}>/draft-journal · {JOURNAL.id}</div>
        </div>
        {state === 'posted'   && <Tag type="green">Posted ✓</Tag>}
        {state === 'approved' && <Tag type="blue">Approved</Tag>}
        {state === 'draft'    && <Tag type="warm-gray">Pending Review</Tag>}
      </div>

      {/* Entry */}
      <div style={{ background: '#f4f4f4', padding: '0.75rem', marginBottom: '0.75rem' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#161616', marginBottom: '0.5rem' }}>{JOURNAL.desc}</div>
        <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ color: '#525252', paddingBottom: 4 }}><strong>DR</strong> {JOURNAL.dr}</td>
              <td style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono, monospace', paddingBottom: 4 }}>{JOURNAL.amount}</td>
            </tr>
            <tr>
              <td style={{ color: '#525252' }}><strong>CR</strong> {JOURNAL.cr}</td>
              <td style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono, monospace' }}>{JOURNAL.amount}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Citations */}
      <div style={{ fontSize: 11, marginBottom: '0.75rem', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span style={{ color: '#8d8d8d', width: 56, flexShrink: 0 }}>Source</span>
          <span style={{ color: '#0072c3', textDecoration: 'underline', cursor: 'pointer' }}>{JOURNAL.source}</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span style={{ color: '#8d8d8d', width: 56, flexShrink: 0 }}>Policy</span>
          <span style={{ color: '#161616' }}>{JOURNAL.policy}</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span style={{ color: '#8d8d8d', width: 56, flexShrink: 0 }}>Control</span>
          <span style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#6929c4' }}>{JOURNAL.control}</span>
        </div>
      </div>

      {/* Evidence notification after posting */}
      {state === 'posted' && (
        <InlineNotification
          kind="success"
          title="Evidence recorded"
          subtitle={`Hash: a3f9c1d2 · Control: ${JOURNAL.control}`}
          hideCloseButton
          lowContrast
          style={{ marginBottom: '0.5rem' }}
        />
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {state === 'draft' && <>
          <Button size="sm" kind="primary" renderIcon={CheckmarkFilled} onClick={() => setState('approved')}>
            Approve
          </Button>
          <Button size="sm" kind="ghost">Review</Button>
        </>}
        {state === 'approved' && (
          <Button size="sm" kind="primary" renderIcon={Launch} onClick={() => setState('posted')}>
            Post to GL
          </Button>
        )}
      </div>
    </Tile>
  )
}

// ─── Panel: Flux Agent ────────────────────────────────────────────────────────

function FluxAgent() {
  return (
    <Tile>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#161616', marginBottom: 2 }}>Flux Agent</div>
      <div style={{ fontSize: 11, color: '#8d8d8d', marginBottom: '0.75rem' }}>/flux-explainer · May 2025 vs Apr 2025</div>
      <Accordion>
        {FLUX_ITEMS.map(item => (
          <AccordionItem
            key={item.account}
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%' }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                  background: item.up ? '#fff1f1' : '#defbe6',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {item.up
                    ? <ArrowUp size={12} color="#da1e28" />
                    : <ArrowDown size={12} color="#24a148" />
                  }
                </div>
                <span style={{ fontSize: 12, fontWeight: 500, flex: 1 }}>{item.account}</span>
                <span style={{
                  fontSize: 12, fontWeight: 700, marginRight: 8,
                  color: item.up ? '#da1e28' : '#24a148',
                }}>
                  {item.variance}
                  <span style={{ fontSize: 10, fontWeight: 400, marginLeft: 4, opacity: 0.7 }}>({item.pct})</span>
                </span>
              </div>
            }
          >
            <p style={{ fontSize: 12, color: '#525252', lineHeight: 1.5, margin: 0 }}>{item.narrative}</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <span style={{ fontSize: 11, color: '#8d8d8d' }}>Actual: <strong style={{ color: '#161616' }}>{item.actual}</strong></span>
              <span style={{ fontSize: 11, color: '#8d8d8d' }}>Prior: <strong style={{ color: '#161616' }}>{item.prior}</strong></span>
            </div>
          </AccordionItem>
        ))}
      </Accordion>
    </Tile>
  )
}

// ─── Panel: Reconciliation Agent ─────────────────────────────────────────────

function ReconciliationAgent() {
  return (
    <Tile>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#161616', marginBottom: 2 }}>Reconciliation Agent</div>
      <div style={{ fontSize: 11, color: '#8d8d8d', marginBottom: '0.75rem' }}>/reconcile-subledger · real-time</div>
      <StructuredListWrapper>
        <StructuredListHead>
          <StructuredListRow head>
            <StructuredListCell head>Sub-ledger</StructuredListCell>
            <StructuredListCell head>Status</StructuredListCell>
            <StructuredListCell head>Break</StructuredListCell>
            <StructuredListCell head>Updated</StructuredListCell>
          </StructuredListRow>
        </StructuredListHead>
        <StructuredListBody>
          {RECON_ROWS.map(r => (
            <StructuredListRow key={r.area}>
              <StructuredListCell style={{ fontSize: 12 }}>{r.area}</StructuredListCell>
              <StructuredListCell>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Dot status={r.status} />
                  <span style={{ fontSize: 11, color: '#525252' }}>{STATUS_DOT[r.status]?.label}</span>
                </div>
              </StructuredListCell>
              <StructuredListCell style={{
                fontSize: 12,
                fontFamily: 'IBM Plex Mono, monospace',
                color: r.diff !== '$0' ? '#da1e28' : '#24a148',
              }}>
                {r.diff}
              </StructuredListCell>
              <StructuredListCell style={{ fontSize: 11, color: '#8d8d8d' }}>{r.last}</StructuredListCell>
            </StructuredListRow>
          ))}
        </StructuredListBody>
      </StructuredListWrapper>
    </Tile>
  )
}

// ─── Panel: Treasurer tile ────────────────────────────────────────────────────

function TreasurerTile() {
  return (
    <Tile style={{ background: 'linear-gradient(135deg, #156082, #0E2841)', color: '#fff' }}>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>Treasurer Workbench</div>
      <div style={{ fontSize: 11, opacity: 0.65, marginBottom: '0.75rem' }}>Wave 2 Preview · /daily-cash-position</div>
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        {[
          { label: 'Available Cash', value: '$24.3M' },
          { label: '14-Day Forecast', value: '$8.1M' },
          { label: 'FX Alerts', value: '2' },
        ].map(m => (
          <div key={m.label}>
            <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1 }} className="count-up">{m.value}</div>
            <div style={{ fontSize: 10, opacity: 0.65, marginTop: 4 }}>{m.label}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 10, opacity: 0.5, marginTop: '0.75rem', paddingTop: '0.625rem', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
        Optimize Cashflows · Real time Visibility →
      </div>
    </Tile>
  )
}

// ─── Audit Agent Modal ────────────────────────────────────────────────────────

function AuditModal({ open, onClose }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)

  const run = () => {
    if (!query.trim()) return
    setResults(EVIDENCE.filter(r =>
      r.id.toLowerCase().includes(query.toLowerCase()) ||
      r.action.toLowerCase().includes(query.toLowerCase())
    ))
  }

  return (
    <Modal
      open={open}
      onRequestClose={onClose}
      modalHeading="Audit Agent — Evidence Vault"
      modalLabel="Control-ID indexed · WORM-grade · hash-chained"
      passiveModal
      size="md"
    >
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <div style={{ flex: 1 }}>
            <Search
              placeholder="Enter control ID or skill name… e.g. GL-CTL-0041"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && run()}
              size="lg"
            />
          </div>
          <Button size="lg" kind="primary" renderIcon={SearchIcon} onClick={run}>
            Query
          </Button>
        </div>
      </div>

      {results === null && (
        <p style={{ color: '#8d8d8d', fontSize: 13, textAlign: 'center', padding: '2rem 0' }}>
          Every agent invocation, approver, and source record — queryable by control ID.
        </p>
      )}

      {results?.length === 0 && (
        <p style={{ color: '#8d8d8d', fontSize: 13, textAlign: 'center', padding: '1rem 0' }}>
          No evidence records found.
        </p>
      )}

      {results?.length > 0 && (
        <StructuredListWrapper>
          <StructuredListHead>
            <StructuredListRow head>
              <StructuredListCell head>Control ID</StructuredListCell>
              <StructuredListCell head>Action</StructuredListCell>
              <StructuredListCell head>User</StructuredListCell>
              <StructuredListCell head>Time</StructuredListCell>
              <StructuredListCell head>Hash</StructuredListCell>
            </StructuredListRow>
          </StructuredListHead>
          <StructuredListBody>
            {results.map((r, i) => (
              <StructuredListRow key={i}>
                <StructuredListCell style={{ fontFamily: 'IBM Plex Mono, monospace', color: '#6929c4', fontSize: 12 }}>
                  {r.id}
                </StructuredListCell>
                <StructuredListCell style={{ fontSize: 12 }}>{r.action}</StructuredListCell>
                <StructuredListCell style={{ fontSize: 12, color: '#525252' }}>{r.user}</StructuredListCell>
                <StructuredListCell style={{ fontSize: 12, color: '#8d8d8d' }}>{r.ts}</StructuredListCell>
                <StructuredListCell style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#0072c3' }}>
                  {r.hash}
                </StructuredListCell>
              </StructuredListRow>
            ))}
          </StructuredListBody>
        </StructuredListWrapper>
      )}
    </Modal>
  )
}

// ─── Main Workbench ───────────────────────────────────────────────────────────

export default function ControllerWorkbench({ onClose }) {
  const [auditOpen, setAuditOpen] = useState(false)

  return (
    <>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 8000,
        display: 'flex', flexDirection: 'column',
        background: '#f4f4f4',
      }}>
        {/* Workbench header */}
        <div style={{
          background: '#0E2841',
          color: '#fff',
          padding: '0.875rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          borderBottom: '1px solid #393939',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 6,
              background: '#156082', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: 16,
            }}>⬡</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Controller Workbench</div>
              <div style={{ fontSize: 11, opacity: 0.55, marginTop: 1 }}>
                May 2025 Close · Continuous and Compliant Close · R2R Wave 1
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Button
              size="sm"
              kind="ghost"
              renderIcon={Security}
              onClick={() => setAuditOpen(true)}
              style={{ color: '#c5a3ff', borderColor: '#c5a3ff4d' }}
            >
              Audit Agent
            </Button>
            <Button size="sm" kind="ghost" renderIcon={Close} iconDescription="Close" hasIconOnly onClick={onClose} />
          </div>
        </div>

        {/* Body */}
        <div className="workbench-body" style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' }}>
          <Grid fullWidth condensed style={{ gap: '1rem' }}>
            {/* Left column */}
            <Column lg={5} md={4} sm={4}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="slide-in"><CloseCockpit /></div>
                <div className="slide-in"><ReconciliationAgent /></div>
                <div className="slide-in"><TreasurerTile /></div>
              </div>
            </Column>
            {/* Right column */}
            <Column lg={11} md={4} sm={4}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="slide-in"><JournalAdvisor /></div>
                <div className="slide-in"><FluxAgent /></div>
              </div>
            </Column>
          </Grid>
        </div>
      </div>

      <AuditModal open={auditOpen} onClose={() => setAuditOpen(false)} />
    </>
  )
}

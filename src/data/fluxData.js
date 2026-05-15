// Balance sheet accounts – all values in $M
export const BS_ACCOUNTS = [
  { code: '1010', desc: 'Cash & Equivalents',       category: 'Asset',     py: 45.2,  actual: 38.9,  budget: 41.0  },
  { code: '1100', desc: 'Trade Receivables',         category: 'Asset',     py: 82.4,  actual: 71.3,  budget: 68.5  },
  { code: '1150', desc: 'Interco Receivable',        category: 'Asset',     py: 28.6,  actual: 31.2,  budget: 29.0  },
  { code: '1200', desc: 'Prepaid & Other Current',   category: 'Asset',     py: 6.8,   actual: 5.4,   budget: 6.0   },
  { code: '1500', desc: 'Fixed Assets (Net)',         category: 'Asset',     py: 124.5, actual: 103.8, budget: 108.0 },
  { code: '1610', desc: 'Lease Right-of-Use',        category: 'Asset',     py: 18.2,  actual: 14.6,  budget: 15.0  },
  { code: '2010', desc: 'Trade Payables',             category: 'Liability', py: 41.3,  actual: 35.2,  budget: 38.0  },
  { code: '2100', desc: 'Accrued Liabilities',        category: 'Liability', py: 28.9,  actual: 22.1,  budget: 24.0  },
  { code: '2150', desc: 'Interco Payable',            category: 'Liability', py: 24.8,  actual: 19.4,  budget: 21.0  },
  { code: '2200', desc: 'Deferred Revenue',           category: 'Liability', py: 8.7,   actual: 6.8,   budget: 7.5   },
]

// Net position = Assets – Liabilities
export function calcTotals(accounts) {
  let netPY = 0, netActual = 0, netBudget = 0
  accounts.forEach(a => {
    const sign = a.category === 'Asset' ? 1 : -1
    netPY     += sign * a.py
    netActual += sign * a.actual
    netBudget += sign * a.budget
  })
  return {
    netPY, netActual, netBudget,
    avb:  netActual - netBudget,
    avpy: netActual - netPY,
  }
}

export const ANOMALIES = [
  {
    id: 'a1', code: '1500', desc: 'Fixed Assets (Net)',
    type: 'High Risk', risk: 'high', sigma: 2.3,
    impact: -20.7,
    finding: 'Fixed assets declined $20.7M (−16.6% vs PY), exceeding 2.3σ from 12-month rolling mean. Unusual depreciation acceleration detected — possible unplanned disposal or accelerated write-down. Review FAR vs GL reconciliation.',
  },
  {
    id: 'a2', code: '1100', desc: 'Trade Receivables',
    type: 'High Risk', risk: 'high', sigma: 1.8,
    impact: -11.1,
    finding: 'AR balance $11.1M below PY against flat revenue. Pattern inconsistent with DSO trend. Possible accelerated collections event, large write-off, or billing timing shift. Validate against AR ageing and collections log.',
  },
  {
    id: 'a3', code: '1150', desc: 'Interco Receivable',
    type: 'Benchmark', risk: 'medium', sigma: 1.4,
    impact: 2.2,
    finding: 'Interco balance $2.2M above budget and $2.6M above PY. ICM automated matching shows 3 unreconciled transactions totalling $2.1M. Settlement expected by Day 5 close.',
  },
  {
    id: 'a4', code: '2100', desc: 'Accrued Liabilities',
    type: 'Seasonal', risk: 'medium', sigma: 1.2,
    impact: -6.8,
    finding: 'Accruals $6.8M below PY. Breaks October seasonal pattern — historically accruals are 15% above September. Possible under-accrual for year-end bonuses or professional fees. Recommend accrual completeness review.',
  },
  {
    id: 'a5', code: '1010', desc: 'Cash & Equivalents',
    type: 'YoY Trend', risk: 'low', sigma: 1.1,
    impact: -6.3,
    finding: 'Cash declined $6.3M (−13.9% vs PY) — third consecutive monthly decline. Cash burn accelerating at 4.2% vs 1.8% prior 3-month average. Monitor against covenant thresholds.',
  },
]

export const AUTO_COMMENTARY = `Balance sheet position as of October 2024 shows a net asset reduction of $20.3M (−10.1%) versus the prior year, driven primarily by Fixed Asset depreciation acceleration (−$20.7M) and Trade Receivables decline (−$11.1M). Intercompany Receivable presents a reconciliation exposure of $2.2M above budget, with 3 unmatched ICM transactions pending settlement.

On the liability side, accrued liabilities are $6.8M below PY — a seasonal anomaly that may indicate under-accrual requiring Q4 catch-up. Cash position shows a third consecutive monthly decline; covenant headroom should be reviewed against Q4 projections.

Overall actual net position of $181.7M is $4.7M favourable to budget (+2.7%), driven by lower-than-planned payables ($2.8M) and accruals ($1.9M). Recommend immediate escalation of Fixed Asset disposal activity and confirmation of ICM settlement timeline.`

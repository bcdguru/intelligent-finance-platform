import { lazy } from 'react'
export { default as config } from './config.js'

const ARWorkbench          = lazy(() => import('../../components/workbenches/ARWorkbench'))
const CollectionsWorkbench = lazy(() => import('../../components/workbenches/CollectionsWorkbench'))
const BillingWorkbench     = lazy(() => import('../../components/workbenches/BillingWorkbench'))
const CashAppWorkbench     = lazy(() => import('../../components/workbenches/CashApplicationWorkbench'))

export const WORKBENCH_MAP = {
  'AR Director Workbench': ARWorkbench,
  'Collections Workbench': CollectionsWorkbench,
  'Billing Specialist WB': BillingWorkbench,
  'Cash Application WB':   CashAppWorkbench,
}

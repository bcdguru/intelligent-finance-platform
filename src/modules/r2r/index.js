import { lazy } from 'react'
export { default as config } from './config.js'

const ControllerWB = lazy(() => import('../../components/workbenches/ControllerWorkbench'))
const TreasuryWB   = lazy(() => import('../../components/workbenches/CashLiquidityWorkbench'))
const CapitalWB    = lazy(() => import('../../components/workbenches/CapitalWorkbench'))
const JournalWB    = lazy(() => import('../../components/workbenches/JournalWorkbench'))
const FluxWB       = lazy(() => import('../../components/workbenches/FluxAgentWorkbench'))

export const WORKBENCH_MAP = {
  'Controller Workbench': ControllerWB,
  'Journal Advisor':      ControllerWB,
  'Audit Agent':          ControllerWB,
  'Treasurer Workbench':  TreasuryWB,
  'Capital Workbench':    CapitalWB,
  'Journal Workbench':    JournalWB,
  'Flux Workbench':       FluxWB,
}

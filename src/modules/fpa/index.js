import { lazy } from 'react'
export { default as config } from './config.js'

const FPAAnalystWB  = lazy(() => import('../../components/workbenches/FPAAnalystWorkbench'))
const HeadOfFPAWB   = lazy(() => import('../../components/workbenches/HeadOfFPAWorkbench'))
const ForecastWB    = lazy(() => import('../../components/workbenches/ForecastWorkbench'))

export const WORKBENCH_MAP = {
  'Analyst WB':         FPAAnalystWB,
  'Head of FP&A WB':    HeadOfFPAWB,
  'Forecast Workbench': ForecastWB,
}

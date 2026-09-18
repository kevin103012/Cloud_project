import type {
  DashboardSummary,
  ResourceStat,
  TrendPoint,
} from '../types/cloud'
import { awsServices } from './awsServices'
import { annualTotal, monthlyTotal } from './costs'
import { securityChecks } from './security'

export const dashboardSummary: DashboardSummary = {
  servicesUsed: awsServices.filter((s) => s.status === 'active').length,
  selectedRegionId: 'us-east-1',
  monthlyCost: monthlyTotal,
  annualCost: annualTotal,
  securityScore: 86,
  totalResources: 48,
  architectureStatus: 'Estable',
}

export const resourceStats: ResourceStat[] = [
  { label: 'Instancias EC2', value: 6 },
  { label: 'Buckets S3', value: 12 },
  { label: 'Bases de datos RDS', value: 2 },
  { label: 'Usuarios IAM', value: 28 },
]

export const costTrend: TrendPoint[] = [
  { month: 'Ene', cost: 892.1 },
  { month: 'Feb', cost: 934.4 },
  { month: 'Mar', cost: 918.0 },
  { month: 'Abr', cost: 975.6 },
  { month: 'May', cost: 1010.2 },
  { month: 'Jun', cost: 1044.8 },
  { month: 'Jul', cost: 1022.5 },
  { month: 'Ago', cost: 1078.3 },
  { month: 'Sep', cost: 1096.7 },
  { month: 'Oct', cost: 1112.0 },
  { month: 'Nov', cost: 1125.9 },
  { month: 'Dic', cost: 1134.35 },
]

export const securitySummary = {
  ok: securityChecks.filter((c) => c.status === 'ok').length,
  warning: securityChecks.filter((c) => c.status === 'warning').length,
  error: securityChecks.filter((c) => c.status === 'error').length,
}

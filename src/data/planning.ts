import type { Proposal } from '../types/cloud'

export const appTypes: string[] = [
  'Aplicación web empresarial',
  'API / Microservicios',
  'E-commerce',
  'Analítica de datos',
  'Backend para app móvil',
]

export const availabilityLevels: string[] = ['99%', '99.9%', '99.99%']

export const migrationGoals: string[] = [
  'Lift & shift',
  'Replatforming',
  'Modernización cloud-native',
  'Respaldo y recuperación',
]

export const proposals: Proposal[] = [
  {
    id: 'prop-001',
    solutionName: 'Portal Empresarial Andina',
    appType: 'Aplicación web empresarial',
    description: 'Portal corporativo con autenticación, reportes y gestión documental.',
    regionId: 'us-east-1',
    estimatedUsers: 15000,
    availability: '99.9%',
    serviceIds: ['ec2', 'rds', 's3', 'cloudfront', 'route53', 'vpc'],
    migrationGoal: 'Modernización cloud-native',
    createdAt: '2026-08-14',
  },
  {
    id: 'prop-002',
    solutionName: 'API de Pagos Móvil',
    appType: 'API / Microservicios',
    description: 'API transaccional de alto rendimiento para pagos desde app móvil.',
    regionId: 'sa-east-1',
    estimatedUsers: 45000,
    availability: '99.99%',
    serviceIds: ['ec2', 'rds', 'iam', 'vpc'],
    migrationGoal: 'Replatforming',
    createdAt: '2026-09-02',
  },
]

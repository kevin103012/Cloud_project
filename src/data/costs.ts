import type { CostByCategory, CostItem } from '../types/cloud'

export const costItems: CostItem[] = [
  {
    id: 'cost-ec2',
    serviceId: 'ec2',
    serviceName: 'EC2',
    scalesWithUsers: true,
    quantity: 6,
    unit: 'instancias t3.medium',
    hours: 730,
    unitCost: 68.75,
    monthlyCost: 412.5,
  },
  {
    id: 'cost-s3',
    serviceId: 's3',
    serviceName: 'S3',
    scalesWithUsers: true,
    quantity: 2400,
    unit: 'GB almacenados',
    hours: 730,
    unitCost: 0.023,
    monthlyCost: 55.2,
  },
  {
    id: 'cost-rds',
    serviceId: 'rds',
    serviceName: 'RDS',
    scalesWithUsers: true,
    quantity: 2,
    unit: 'instancias db.m6g.large Multi-AZ',
    hours: 730,
    unitCost: 243.0,
    monthlyCost: 486.0,
  },
  {
    id: 'cost-cloudfront',
    serviceId: 'cloudfront',
    serviceName: 'CloudFront',
    scalesWithUsers: true,
    quantity: 850,
    unit: 'GB transferidos',
    hours: 730,
    unitCost: 0.085,
    monthlyCost: 72.25,
  },
  {
    id: 'cost-route53',
    serviceId: 'route53',
    serviceName: 'Route 53',
    scalesWithUsers: false,
    quantity: 4,
    unit: 'zonas hospedadas',
    hours: 730,
    unitCost: 3.0,
    monthlyCost: 12.0,
  },
  {
    id: 'cost-vpc',
    serviceId: 'vpc',
    serviceName: 'VPC (NAT Gateway)',
    scalesWithUsers: false,
    quantity: 1,
    unit: 'gateway + transferencia',
    hours: 730,
    unitCost: 96.4,
    monthlyCost: 96.4,
  },
  {
    id: 'cost-iam',
    serviceId: 'iam',
    serviceName: 'IAM',
    scalesWithUsers: false,
    quantity: 28,
    unit: 'usuarios',
    hours: 730,
    unitCost: 0,
    monthlyCost: 0,
  },
]

export const monthlyTotal = 1134.35

export const annualTotal = 13612.2

export const costsByCategory: CostByCategory[] = [
  { category: 'Cómputo', cost: 412.5 },
  { category: 'Base de datos', cost: 486.0 },
  { category: 'Almacenamiento', cost: 55.2 },
  { category: 'Redes', cost: 180.65 },
  { category: 'Seguridad', cost: 0 },
]

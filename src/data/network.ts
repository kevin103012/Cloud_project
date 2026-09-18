import type { NetworkEdge, NetworkNode } from '../types/cloud'

export const networkNodes: NetworkNode[] = [
  {
    id: 'internet',
    label: 'Internet',
    kind: 'internet',
    description: 'Tráfico entrante de los usuarios finales.',
    status: 'ok',
  },
  {
    id: 'route53',
    label: 'Route 53',
    kind: 'dns',
    description: 'Resolución DNS y enrutamiento global.',
    status: 'ok',
  },
  {
    id: 'cloudfront',
    label: 'CloudFront',
    kind: 'cdn',
    description: 'CDN con 400+ edge locations.',
    status: 'ok',
  },
  {
    id: 'vpc',
    label: 'VPC 10.0.0.0/16',
    kind: 'vpc',
    description: 'Red privada con subredes públicas y privadas.',
    status: 'ok',
  },
  {
    id: 'ec2',
    label: 'EC2 Auto Scaling',
    kind: 'compute',
    description: '3–6 instancias en subred pública.',
    status: 'ok',
  },
  {
    id: 'rds',
    label: 'RDS Multi-AZ',
    kind: 'database',
    description: 'PostgreSQL en subred privada, puerto 5432.',
    status: 'ok',
  },
]

export const networkEdges: NetworkEdge[] = [
  { from: 'internet', to: 'route53', label: 'DNS' },
  { from: 'route53', to: 'cloudfront', label: 'Enrutamiento' },
  { from: 'cloudfront', to: 'vpc', label: 'HTTPS' },
  { from: 'vpc', to: 'ec2', label: 'Subred pública' },
  { from: 'ec2', to: 'rds', label: 'Puerto 5432' },
]

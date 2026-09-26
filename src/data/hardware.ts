import type { ServiceHardware } from '../types/cloud'

export const serviceHardware: ServiceHardware[] = [
  {
    serviceId: 'ec2',
    serviceName: 'EC2',
    dimension: 'users',
    tiers: [
      { instanceType: 't3.medium', minUsers: 0, minStorageGb: 0, vcpus: 2, ramGb: 4, note: 'Cómputo básico' },
      { instanceType: 't3.large', minUsers: 5000, minStorageGb: 0, vcpus: 2, ramGb: 8, note: 'Más memoria' },
      { instanceType: 'm5.large', minUsers: 20000, minStorageGb: 0, vcpus: 2, ramGb: 8, note: 'Uso sostenido' },
      { instanceType: 'm5.xlarge', minUsers: 50000, minStorageGb: 0, vcpus: 4, ramGb: 16, note: 'Alto rendimiento' },
    ],
  },
  {
    serviceId: 'rds',
    serviceName: 'RDS',
    dimension: 'users',
    tiers: [
      { instanceType: 'db.m6g.large', minUsers: 0, minStorageGb: 0, vcpus: 2, ramGb: 8, note: 'Hasta ~200 GB' },
      { instanceType: 'db.m6g.xlarge', minUsers: 10000, minStorageGb: 0, vcpus: 4, ramGb: 16, note: 'Hasta ~1 TB' },
      { instanceType: 'db.m6g.2xlarge', minUsers: 50000, minStorageGb: 0, vcpus: 8, ramGb: 32, note: 'Más de 1 TB' },
    ],
  },
  {
    serviceId: 'elasticache',
    serviceName: 'ElastiCache',
    dimension: 'users',
    tiers: [
      { instanceType: 'cache.t4g.micro', minUsers: 0, minStorageGb: 0, vcpus: 2, ramGb: 1, note: 'Caché básico' },
      { instanceType: 'cache.r6g.large', minUsers: 10000, minStorageGb: 0, vcpus: 2, ramGb: 13, note: 'Caché producción' },
      { instanceType: 'cache.r6g.xlarge', minUsers: 50000, minStorageGb: 0, vcpus: 4, ramGb: 26, note: 'Caché alto tráfico' },
    ],
  },
]

export function estimatedStorageGb(users: number): number {
  return Math.max(100, Math.ceil(users / 1000) * 50)
}

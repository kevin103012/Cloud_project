import type { AvailabilityLevel, Proposal } from '../types/cloud'

export const appTypes: string[] = [
  'Aplicación web empresarial',
  'API / Microservicios',
  'E-commerce',
  'Analítica de datos',
  'Backend para app móvil',
  'Aplicación de IA / Machine Learning',
  'Streaming / Contenido multimedia',
  'IoT / Dispositivos conectados',
]

export const recommendedServices: Record<string, string[]> = {
  'Aplicación web empresarial': ['ec2', 'rds', 's3', 'cloudfront', 'route53', 'vpc', 'iam', 'cloudwatch', 'kms'],
  'API / Microservicios': ['ec2', 'rds', 'vpc', 'iam', 'lambda', 'sqs', 'cloudwatch'],
  'E-commerce': ['ec2', 'rds', 's3', 'cloudfront', 'route53', 'vpc', 'elasticache', 'sns', 'cloudwatch'],
  'Analítica de datos': ['s3', 'ec2', 'rds', 'lambda', 'cloudwatch'],
  'Backend para app móvil': ['ec2', 'rds', 's3', 'cloudfront', 'vpc', 'lambda', 'sns', 'cloudwatch'],
  'Aplicación de IA / Machine Learning': ['ec2', 's3', 'rds', 'lambda', 'elasticache', 'cloudwatch'],
  'Streaming / Contenido multimedia': ['cloudfront', 's3', 'ec2', 'sqs', 'cloudwatch'],
  'IoT / Dispositivos conectados': ['ec2', 'rds', 's3', 'route53', 'lambda', 'sqs', 'sns', 'cloudwatch'],
}

/** Descripción predeterminada por tipo de aplicación (editable en el formulario). */
export const appTypeDescriptions: Record<string, string> = {
  'Aplicación web empresarial':
    'Portal corporativo con autenticación, reportes y gestión documental para los colaboradores de la organización.',
  'API / Microservicios':
    'API transaccional de alto rendimiento con arquitectura de microservicios, autenticación y observabilidad.',
  'E-commerce':
    'Tienda en línea con catálogo, carrito de compras, pasarela de pagos y entrega de contenido acelerada.',
  'Analítica de datos':
    'Plataforma de ingesta y análisis de datos con almacenamiento escalable y procesamiento bajo demanda.',
  'Backend para app móvil':
    'Backend escalable para aplicación móvil con autenticación, notificaciones push y sincronización de datos.',
  'Aplicación de IA / Machine Learning':
    'Aplicación de inteligencia artificial con entrenamiento e inferencia de modelos sobre infraestructura acelerada.',
  'Streaming / Contenido multimedia':
    'Plataforma de distribución de contenido multimedia con streaming de baja latencia y entrega global.',
  'IoT / Dispositivos conectados':
    'Plataforma de ingesta y monitoreo de dispositivos IoT con mensajería en tiempo real y almacenamiento de telemetría.',
}

export const availabilityLevels: AvailabilityLevel[] = ['99%', '99.9%', '99.99%']

export const migrationGoals: string[] = [
  'Lift & shift',
  'Replatforming',
  'Modernización cloud-native',
  'Respaldo y recuperación',
]

/** Máximo de servidores secundarios (réplicas) por planificación. */
export const maxReplicaRegions = 3

export const proposals: Proposal[] = [
  {
    id: 'prop-001',
    solutionName: 'Portal Empresarial Andina',
    appType: 'Aplicación web empresarial',
    description: 'Portal corporativo con autenticación, reportes y gestión documental.',
    regionId: 'us-east-1',
    secondaryRegionIds: ['sa-east-1'],
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
    secondaryRegionIds: ['us-east-1'],
    estimatedUsers: 45000,
    availability: '99.99%',
    serviceIds: ['ec2', 'rds', 'iam', 'vpc'],
    migrationGoal: 'Replatforming',
    createdAt: '2026-09-02',
  },
]

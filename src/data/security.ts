import type { ResponsibilityItem, SecurityCheck } from '../types/cloud'

export const securityChecks: SecurityCheck[] = [
  {
    id: 'sec-001',
    area: 'Cuentas',
    title: 'MFA en usuario raíz',
    description: 'La cuenta raíz tiene autenticación multifactor activada.',
    status: 'ok',
  },
  {
    id: 'sec-002',
    area: 'IAM',
    title: 'Rotación de claves de acceso',
    description: '2 claves de usuarios IAM superan los 90 días sin rotar.',
    status: 'warning',
  },
  {
    id: 'sec-003',
    area: 'Datos',
    title: 'Cifrado de buckets S3',
    description: 'Todos los buckets tienen cifrado en reposo habilitado.',
    status: 'ok',
  },
  {
    id: 'sec-004',
    area: 'Cuentas',
    title: 'Security groups expuestos',
    description: 'Un grupo de seguridad permite SSH abierto a 0.0.0.0/0.',
    status: 'error',
  },
  {
    id: 'sec-005',
    area: 'Cumplimiento',
    title: 'CloudTrail habilitado',
    description: 'Registro de auditoría activo en todas las regiones.',
    status: 'ok',
  },
  {
    id: 'sec-006',
    area: 'Datos',
    title: 'Respaldos automatizados RDS',
    description: 'Snapshots diarios con retención de 7 días.',
    status: 'ok',
  },
  {
    id: 'sec-007',
    area: 'IAM',
    title: 'Principio de mínimo privilegio',
    description: '3 políticas otorgan permisos administrativos amplios.',
    status: 'warning',
  },
  {
    id: 'sec-008',
    area: 'Responsabilidad compartida',
    title: 'Modelo de responsabilidad definido',
    description: 'Matriz AWS / Cliente documentada para cada capa.',
    status: 'ok',
  },
]

export const responsibilityItems: ResponsibilityItem[] = [
  { id: 'resp-001', task: 'Seguridad física de los centros de datos', owner: 'AWS' },
  { id: 'resp-002', task: 'Hipervisor y red física', owner: 'AWS' },
  { id: 'resp-003', task: 'Cifrado de los datos almacenados', owner: 'Cliente' },
  { id: 'resp-004', task: 'Parches del sistema operativo invitado', owner: 'Cliente' },
  { id: 'resp-005', task: 'Gestión de identidades y accesos (IAM)', owner: 'Cliente' },
  { id: 'resp-006', task: 'Configuración de security groups', owner: 'Compartido' },
]

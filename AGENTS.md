# Contexto para agentes de IA — CloudOps Dashboard

## 1. Fuente de verdad

Este proyecto corresponde a la **Práctica Integrativa Cloud Foundations – Semanas 5 y 6: Diseño de una solución Cloud con React**.

El PDF de esta práctica es la fuente de verdad funcional y académica. No usar como requerimiento principal la guía empresarial analizada anteriormente. Si una decisión previa contradice el PDF, priorizar el PDF y explicar la corrección.

Nombre solicitado por el documento: **CloudOps Dashboard – Sistema web para la planificación y visualización de una solución Cloud**.

Estado actual del branding: la interfaz y el paquete usan **CloudOpus**. Esto es una desviación pendiente; antes de renombrar, confirmar si se conservará CloudOpus como marca visual o se adoptará literalmente CloudOps Dashboard.

## 2. Propósito

Frontend profesional que simula la planificación y el análisis de una solución AWS. No se requiere desplegar infraestructura real ni conectarse a APIs reales de AWS. Se permiten y esperan datos locales/mock.

La aplicación debe demostrar conceptos de:

- Planificación Cloud.
- Economía y costos Cloud.
- Infraestructura global de AWS.
- Seguridad e IAM.
- Modelo de responsabilidad compartida.
- Arquitectura de red, VPC, Route 53, CloudFront, EC2 y RDS.
- Componentes reutilizables en React.

## 3. Stack obligatorio y stack actual

Obligatorio por el PDF:

- React.
- TypeScript.
- HTML5 y CSS.
- Tailwind CSS.
- React Router o equivalente.
- Lucide React o equivalente.

Implementado actualmente:

- React 19 + TypeScript + Vite.
- Tailwind CSS 4.
- React Router 7 con lazy loading por módulo.
- Lucide React.
- Recharts para gráficos.
- React Simple Maps + TopoJSON local para el mapa mundial.
- Vitest para validaciones de consistencia.

No añadir backend, base de datos, autenticación real ni AWS SDK salvo que el usuario amplíe expresamente el alcance.

## 4. Módulos y rutas obligatorias

| Ruta | Módulo | Estado actual |
|---|---|---|
| `/dashboard` | Dashboard | Implementado |
| `/planning` | Planificación Cloud | Implementado |
| `/costs` | Costos y economía Cloud | Implementado con una brecha en horas estimadas |
| `/infrastructure` | Infraestructura Global | Implementado, mapa interactivo |
| `/security` | Seguridad e IAM | Implementado y alineado con el PDF |
| `/network` | Arquitectura de Red | Implementado con flujo completo y VPC visual |
| `/services` | Servicios AWS | Implementado con todos los campos obligatorios |

También existen landing, Sobre nosotros, Contacto y página 404. Son complementarios, no requisitos centrales.

## 5. Requisitos obligatorios por módulo

### Dashboard

Debe mostrar:

- Servicios utilizados.
- Región seleccionada.
- Costo mensual y anual estimado.
- Estado de seguridad.
- Recursos Cloud.
- Estado de arquitectura.
- Tarjetas KPI, al menos un gráfico y resumen de seguridad.

Nota: actualmente existe “Servicios estimados” en lugar de un conteo real de “Recursos Cloud”. Revisar este punto antes de la entrega para ajustarlo literalmente al PDF.

### Planificación

El formulario debe registrar y visualizar:

- Nombre.
- Tipo de aplicación.
- Descripción.
- Región.
- Usuarios estimados.
- Disponibilidad.
- Servicios seleccionados.
- Objetivo de migración.

Las propuestas se guardan en `localStorage`, se validan y comparten globalmente entre módulos.

### Costos

Debe incluir:

- Selección de servicio.
- Cantidad.
- Horas estimadas.
- Costo estimado.
- Costo mensual.
- Costo anual.
- Gráfico de distribución.

Brecha actual importante: se retiró la visualización de horas porque no todas las unidades son horarias. El PDF sí exige horas estimadas. La solución recomendada es modelar horas solo para servicios basados en tiempo (por ejemplo, EC2/RDS) y mostrar “No aplica” o una unidad equivalente para S3, CloudFront, Route 53, IAM y VPC. No volver a etiquetar todos los servicios con 730 horas de forma incorrecta.

### Infraestructura Global

Mostrar región, ubicación, servicios desplegados y estado. El mapa usa coordenadas geográficas reales y datos locales en `public/maps/countries-110m.json`.

### Seguridad

Debe representar:

- Responsabilidad compartida.
- IAM.
- Protección de cuentas.
- Protección de datos.
- Cumplimiento.
- Estados verde/amarillo/rojo.

### Red

Arquitectura mínima visible dentro de la interfaz, no como imagen pegada:

`Internet → Route 53 → CloudFront → VPC → EC2/RDS`

Los elementos no seleccionados pueden mostrarse atenuados, pero la cadena conceptual mínima debe seguir siendo comprensible.

Estado actual: cumple. La pantalla muestra Internet, Route 53 y CloudFront antes de un contenedor VPC. Dentro de la VPC se representan EC2 en una subred pública y RDS en una subred privada, conectados mediante el puerto 5432. La representación está construida con componentes React, no con una imagen.

### Servicios AWS

Cada servicio debe mostrar nombre, categoría, descripción, función principal y estado de utilización. Mínimo obligatorio: EC2, S3, RDS, IAM, VPC, Route 53 y CloudFront.

Estado actual: cumple. El catálogo muestra los siete servicios obligatorios, diferencia descripción y función principal, calcula el estado de utilización según la propuesta y añade costo mensual y disponibilidad regional como información complementaria.

### Verificación de los tres módulos finales

- **Seguridad:** cumple con responsabilidad compartida, IAM, protección de cuentas, protección de datos, cumplimiento y estados correcto/revisión/problema.
- **Red:** cumple con la arquitectura mínima dentro de la interfaz y representa los recursos internos de la VPC por tipo de subred.
- **Servicios:** cumple con nombre, categoría, descripción, función principal, estado de utilización y los siete servicios mínimos.

## 6. Diseño exigido por el PDF

Paleta clara oficial:

- Fondo principal: `#F8FAFC`.
- Sidebar: `#0F172A`.
- Principal: `#2563EB`.
- Seguridad: `#16A34A`.
- Costos: `#F59E0B`.
- Alertas: `#DC2626`.
- Texto principal: `#1E293B`.
- Texto secundario: `#64748B`.
- Bordes: `#E2E8F0`.
- Cards: `#FFFFFF`.

Dimensiones sugeridas:

- Título principal: 28–32 px, peso 700.
- Subtítulo: 18–20 px, peso 600.
- Texto: 14–16 px.
- Texto secundario: 12–14 px.
- Cards: radio 12–16 px, sombra ligera y borde suave.

Brecha actual: `src/index.css` usa una paleta azul pizarra desaturada diferente. El modo oscuro es válido como reto adicional, pero el modo claro debería alinearse con los colores exactos del PDF antes de la entrega.

Mantener:

- Jerarquía visual consistente.
- Espaciado uniforme.
- Iconografía Lucide coherente.
- Cards alineadas.
- Formularios organizados.
- Responsive Design real, no solo grids parcialmente adaptables.

## 7. Arquitectura actual

```text
src/
├── components/     Componentes reutilizables y WorldMap
├── context/        Providers y definiciones de contexto
├── hooks/          useProposals y useTheme
├── data/           Mocks de AWS, costos, regiones, seguridad y red
├── pages/          Módulos/rutas
├── routes/         Tabla de rutas y router
├── types/          Contratos del dominio Cloud
├── utils/          Formato y reglas derivadas de datos
└── index.css       Tokens de tema claro/oscuro
```

Patrón:

`pages → components → utils/data → types`

Estado global:

- `ProposalsProvider`: propuestas, propuesta seleccionada y persistencia.
- `ThemeProvider`: modo claro/oscuro.

No duplicar la selección de propuesta con `useState` local en cada página. Usar `useProposals()`.

## 8. Reglas de consistencia de datos

- `costItems` es la única fuente de precios.
- No volver a añadir `monthlyCost` a `CloudService`.
- Todo `Proposal.regionId` debe existir en `regions`.
- Todo `Proposal.serviceIds[]` debe existir en `awsServices` y estar disponible en `Region.services`.
- Todo `CostItem.serviceId` debe existir en el catálogo.
- Las aristas de red deben referenciar nodos existentes.
- La seguridad se filtra por servicios mediante `SecurityCheck.serviceIds` cuando corresponda.
- Usar funciones de `src/utils/cloudData.ts` para cálculos compartidos.
- Mantener versionado y validación de `localStorage`; no hacer `JSON.parse(...) as Proposal[]` sin validar.
- Al modificar mocks, actualizar o ampliar `src/data/dataConsistency.test.ts`.

## 9. Componentes reutilizables

Actualmente existen:

- Sidebar.
- StatCard.
- ServiceCard.
- CostCard.
- SecurityCard.
- RegionCard.
- StatusBadge.
- CostChart.
- ProposalForm y ProposalList.
- WorldMap.
- Loader.

Brecha: `src/components/Header.tsx` sigue siendo un placeholder y no se usa. El PDF lo recomienda dentro de la estructura mínima. Implementarlo o eliminarlo justificadamente antes de la entrega.

## 10. Retos adicionales

Ya implementados total o parcialmente:

- Modo oscuro.
- Gráficos interactivos mediante Recharts.
- Selector/visualización de regiones.
- Animaciones y transiciones.
- Persistencia con localStorage.

Pendientes:

- Buscador de servicios.
- Filtros por categoría.
- Exportación de reporte.
- Notificaciones.
- Vista detallada por servicio.

Estos retos no deben priorizarse sobre requisitos obligatorios incompletos.

## 11. Entregables aún pendientes

El código no completa por sí solo todo el entregable. Antes de finalizar se necesita:

- README con nombre oficial, descripción, tecnologías, instalación, ejecución y funcionalidades detalladas.
- Capturas/evidencias de los siete módulos y vista responsive.
- Breve demostración o guion explicando problema, solución, arquitectura React, conceptos Cloud y decisiones de diseño.
- Revisión responsive de Sidebar y navegación en móvil.
- Confirmar alineación de paleta clara con el PDF.
- Resolver horas estimadas del módulo Costos.
- Resolver el Header placeholder.

## 12. Prioridad de trabajo para próximos agentes

1. Cumplimiento de requisitos obligatorios del PDF.
2. Funcionalidad y consistencia entre mocks y pantallas.
3. Responsive Design.
4. Paleta exacta y calidad UI/UX.
5. README, evidencias y presentación.
6. Retos adicionales.

No dedicar tiempo a backend o infraestructura real de AWS: están fuera del alcance de la práctica.

## 13. Validación obligatoria después de cambios

Ejecutar siempre:

```bash
npm run lint
npm test
npm run build
npm audit
```

Estado conocido al crear este archivo:

- Lint: 0 errores y 0 advertencias.
- Tests: 5 aprobados.
- Build: correcto y dividido por rutas.
- Auditoría: 0 vulnerabilidades.

La documentación técnica y funcional para estudiar el sistema se mantiene en `docs/DOCUMENTACION_PROYECTO.md`. Actualizarla cuando cambien arquitectura, modelos, reglas o módulos.

## 14. Criterios de evaluación

- Conceptos Cloud: 20%.
- Funcionalidad: 20%.
- React: 15%.
- Arquitectura y organización: 10%.
- UI/UX: 15%.
- Responsive: 10%.
- Red y seguridad: 5%.
- Documentación y presentación: 5%.

Toda propuesta de cambio debe indicar qué criterio mejora y evitar sacrificar requisitos obligatorios por funcionalidades extra.

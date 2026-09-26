import {
  Activity,
  Banknote,
  Boxes,
  ClipboardList,
  FileDown,
  MapPin,
  Server,
  ShieldCheck,
  Wallet,
} from 'lucide-react'
import CostChart from '../components/CostChart'
import RegionCard from '../components/RegionCard'
import SecurityCard from '../components/SecurityCard'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import { useProposals } from '../hooks/useProposals'
import { regions } from '../data/regions'
import {
  countServicesInRegion,
  getSecurityChecksForProposal,
  getServiceCost,
  getValidServicesForProposal,
  summarizeSecurity,
} from '../utils/cloudData'
import { formatUSD } from '../utils/format'

export default function Dashboard() {
  const { proposals, selectedProposalId, setSelectedProposalId } = useProposals()
  const selected = proposals.find((proposal) => proposal.id === selectedProposalId) ?? proposals[0]
  const region = regions.find((item) => item.id === selected?.regionId)
  const selectedServices = selected ? getValidServicesForProposal(selected) : []
  const selectedServiceIds = new Set(selectedServices.map((service) => service.id))
  const selectedCostItems = [...selectedServiceIds].flatMap((id) => {
    const item = getServiceCost(id, region?.id)
    return item ? [item] : []
  })
  const monthlyCost = selectedCostItems.reduce((total, item) => total + item.monthlyCost, 0)
  const activeRegionCount = regions.filter((item) => item.status === 'active').length
  const architectureStatus = region?.status === 'active' ? 'Operativa' : 'En revisión'
  const serviceCosts = selectedCostItems.map((item) => ({
    service: item.serviceName,
    cost: item.monthlyCost,
  }))
  const selectedSecurityChecks = getSecurityChecksForProposal(selected)
  const securitySummary = summarizeSecurity(selectedSecurityChecks)
  const issues = selectedSecurityChecks.filter((check) => check.status !== 'ok')

  async function handleExport() {
    if (!selected) return
    const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
      import('jspdf'),
      import('jspdf-autotable'),
    ])
    const doc = new jsPDF({ unit: 'mm', format: 'a4' })
    const pageWidth = doc.internal.pageSize.getWidth()
    let y = 18

    // Título
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(20)
    doc.setTextColor(30, 41, 59)
    doc.text('Dashboard — CloudOpus', 14, y)
    y += 6

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(100, 116, 139)
    doc.text(
      `Generado el ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}`,
      14,
      y,
    )
    y += 10

    // Propuesta
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.setTextColor(30, 41, 59)
    doc.text('Propuesta seleccionada', 14, y)
    y += 6

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(30, 41, 59)
    doc.text(selected.solutionName, 14, y)
    y += 5

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(100, 116, 139)
    doc.text(`${selected.appType} · ${selected.migrationGoal}`, 14, y)
    y += 5
    doc.text(
      selected.description || 'Sin descripción',
      14,
      y,
      { maxWidth: pageWidth - 28 },
    )
    y += 10

    // KPIs
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.setTextColor(30, 41, 59)
    doc.text('Resumen', 14, y)
    y += 6

    const kpis: [string, string][] = [
      ['Servicios utilizados', String(selectedServices.length)],
      ['Región', region ? `${region.name} (${region.location})` : 'Sin región'],
      ['Estado de arquitectura', architectureStatus],
      ['Disponibilidad objetivo', selected.availability],
      ['Usuarios estimados', selected.estimatedUsers.toLocaleString('es-ES')],
      ['Costo mensual', formatUSD(monthlyCost)],
      ['Costo anual', formatUSD(monthlyCost * 12)],
      [
        'Estado de seguridad',
        `${securitySummary.ok} correctos · ${securitySummary.warning} en revisión · ${securitySummary.error} problema`,
      ],
    ]

    autoTable(doc, {
      startY: y,
      head: [['Indicador', 'Valor']],
      body: kpis.map(([k, v]) => [k, v]),
      styles: { fontSize: 10, cellPadding: 3, lineColor: [226, 232, 240], lineWidth: 0.1 },
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: { 0: { cellWidth: 70 }, 1: { cellWidth: pageWidth - 70 - 28 } },
      margin: { left: 14, right: 14 },
    })
    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8

    // Desglose de costos por servicio
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.setTextColor(30, 41, 59)
    doc.text('Costo por servicio', 14, y)
    y += 6

    const costRows = selectedCostItems.map((item) => [
      item.serviceName,
      `${item.quantity} ${item.unit}`,
      `${formatUSD(item.unitCost)} ${item.unitCostLabel}`,
      formatUSD(item.monthlyCost),
      formatUSD(item.monthlyCost * 12),
    ])
    costRows.push([
      'Total',
      '—',
      '—',
      formatUSD(monthlyCost),
      formatUSD(monthlyCost * 12),
    ])

    autoTable(doc, {
      startY: y,
      head: [['Servicio', 'Cantidad', 'Tarifa', 'Mensual', 'Anual']],
      body: costRows,
      styles: { fontSize: 9, cellPadding: 3, lineColor: [226, 232, 240], lineWidth: 0.1 },
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' },
      footStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      margin: { left: 14, right: 14 },
      didParseCell: (data) => {
        if (data.section === 'body' && data.row.index === costRows.length - 1) {
          data.cell.styles.fontStyle = 'bold'
          data.cell.styles.fillColor = [241, 245, 249]
        }
      },
    })
    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8

    // Nueva página si falta espacio
    if (y > doc.internal.pageSize.getHeight() - 60) {
      doc.addPage()
      y = 18
    }

    // Controles de seguridad
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.setTextColor(30, 41, 59)
    doc.text('Seguridad', 14, y)
    y += 6

    const statusLabel = { ok: 'Correcto', warning: 'Revisión', error: 'Problema' } as const
    const securityRows = selectedSecurityChecks.map((check) => [
      check.title,
      check.area,
      statusLabel[check.status],
      check.description,
    ])

    autoTable(doc, {
      startY: y,
      head: [['Control', 'Área', 'Estado', 'Descripción']],
      body: securityRows,
      styles: { fontSize: 9, cellPadding: 3, lineColor: [226, 232, 240], lineWidth: 0.1 },
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: {
        0: { cellWidth: 45, fontStyle: 'bold' },
        1: { cellWidth: 35 },
        2: { cellWidth: 25, halign: 'center' },
        3: { cellWidth: pageWidth - 105 - 28 },
      },
      margin: { left: 14, right: 14 },
      didParseCell: (data) => {
        if (data.section === 'body' && data.column.index === 2) {
          const status = securityRows[data.row.index][2]
          if (status === 'Correcto') data.cell.styles.textColor = [22, 163, 74]
          else if (status === 'Revisión') data.cell.styles.textColor = [245, 158, 11]
          else if (status === 'Problema') data.cell.styles.textColor = [220, 38, 38]
        }
      },
    })
    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8

    // Regiones
    if (y > doc.internal.pageSize.getHeight() - 60) {
      doc.addPage()
      y = 18
    }

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.setTextColor(30, 41, 59)
    doc.text('Regiones AWS', 14, y)
    y += 6

    const regionRows = regions.map((r) => [
      r.name,
      r.location,
      r.status === 'active' ? 'Activa' : 'Standby',
      String(countServicesInRegion(proposals, r.id)),
      `×${r.priceFactor.toFixed(2)}`,
    ])

    autoTable(doc, {
      startY: y,
      head: [['Región', 'Ubicación', 'Estado', 'Servicios', 'Factor']],
      body: regionRows,
      styles: { fontSize: 9, cellPadding: 3, lineColor: [226, 232, 240], lineWidth: 0.1 },
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      margin: { left: 14, right: 14 },
    })

    // Pie de página en cada hoja
    const totalPages = doc.getNumberOfPages()
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(148, 163, 184)
      doc.text(
        `CloudOpus · ${selected.solutionName} · página ${i} de ${totalPages}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 8,
        { align: 'center' },
      )
    }

    const fileName = `dashboard-${selected.solutionName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')}.pdf`
    doc.save(fileName)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">Dashboard</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Resumen general de la solución Cloud.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
          <div className="w-full md:w-96">
            <label className="mb-1 block text-sm font-medium text-black" htmlFor="dashboard-proposal">
              Propuesta Cloud
            </label>
            <select
              id="dashboard-proposal"
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-black outline-none transition focus:border-black"
              value={selected?.id ?? ''}
              onChange={(event) => setSelectedProposalId(event.target.value)}
              disabled={proposals.length === 0}
            >
              {proposals.length === 0 ? (
                <option value="">No hay propuestas registradas</option>
              ) : (
                proposals.map((proposal) => (
                  <option key={proposal.id} value={proposal.id}>
                    {proposal.solutionName}
                  </option>
                ))
              )}
            </select>
            <p className="mt-1 text-xs text-neutral-500">
              {selected
                ? `${selected.estimatedUsers.toLocaleString('es-ES')} usuarios · ${selected.availability}`
                : 'Registra una propuesta en Planificación.'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleExport}
            disabled={!selected}
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50 md:self-center"
            title="Exportar dashboard a PDF"
          >
            <FileDown className="h-4 w-4" />
            Exportar PDF
          </button>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Servicios utilizados"
          value={String(selectedServices.length)}
          subtitle={selectedServices.map((service) => service.name).join(' · ') || 'Sin servicios seleccionados'}
          icon={Boxes}
        />
        <StatCard
          title="Región seleccionada"
          value={region?.name ?? 'Sin región'}
          subtitle={region?.location ?? 'Sin ubicación definida'}
          icon={MapPin}
        />
        <StatCard
          title="Costo mensual"
          value={formatUSD(monthlyCost)}
          icon={Wallet}
          inverted
        />
        <StatCard
          title="Costo anual"
          value={formatUSD(monthlyCost * 12)}
          icon={Banknote}
        />
        <StatCard
          title="Servicios estimados"
          value={String(selectedCostItems.length)}
          subtitle="Servicios con una línea de costo"
          icon={Server}
        />
        <StatCard
          title="Estado de seguridad"
          value={`${securitySummary.ok}/${selectedSecurityChecks.length}`}
          subtitle={`${securitySummary.ok} correctos · ${securitySummary.warning} en revisión · ${securitySummary.error} problema`}
          icon={ShieldCheck}
        />
        <StatCard
          title="Arquitectura"
          value={selected ? architectureStatus : 'Sin configurar'}
          subtitle={selected ? `${selected.availability} · ${region?.status === 'active' ? 'Región activa' : 'Región standby'}` : 'Registra una propuesta Cloud'}
          icon={Activity}
        />
        <StatCard
          title="Propuestas Cloud"
          value={String(proposals.length)}
          subtitle="Soluciones planificadas"
          icon={ClipboardList}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm xl:col-span-2">
          <h2 className="text-lg font-semibold text-black">Costo por servicio</h2>
          <p className="text-xs text-neutral-500">Distribución mensual de la propuesta seleccionada · USD</p>
          <div className="mt-4">
            <CostChart data={serviceCosts} />
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-black">Seguridad</h2>
          <p className="text-xs text-neutral-500">Resumen del estado actual</p>
          <p className="mt-3 text-4xl font-bold text-black">
            {securitySummary.ok}
            <span className="text-lg text-neutral-400">/{selectedSecurityChecks.length}</span>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <StatusBadge status="ok" label={`${securitySummary.ok} correctos`} />
            <StatusBadge status="warning" label={`${securitySummary.warning} en revisión`} />
            <StatusBadge status="error" label={`${securitySummary.error} problema`} />
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {issues.map((check) => (
              <SecurityCard key={check.id} check={check} />
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-black">Regiones AWS</h2>
            <p className="text-xs text-neutral-500">
              Regiones activas y standby con los servicios asociados a las propuestas.
            </p>
          </div>
          <span className="text-xs font-medium text-neutral-400">
            {activeRegionCount} activas · {regions.length - activeRegionCount} standby
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {regions.map((awsRegion) => (
            <RegionCard
              key={awsRegion.id}
              region={awsRegion}
              selected={awsRegion.id === region?.id}
              deployedServiceCount={countServicesInRegion(proposals, awsRegion.id)}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

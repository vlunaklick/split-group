import ExcelJS from 'exceljs'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

export type SpendingTableType = {
  id: string
  name: string
  description: string | null
  date: Date
  amount: number
  category: string
  createdBy: string | null
  hasDebt: boolean
  someoneOwesYou: boolean
  groupId: string
}

export async function exportData ({ groupId, type, props }: { groupId: string, type: 'excel' | 'pdf', props: any }) {
  if (type === 'excel') {
    await exportDataToExcel(groupId)
  } else if (type === 'pdf') {
    await exportDataToPDF(groupId, props)
  }
}

function downloadBlob (buffer: ArrayBuffer, filename: string, mimeType: string) {
  const blob = new Blob([buffer], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export async function exportDataToExcel (groupId: string) {
  const response = await fetch(`/api/groups/${groupId}/spendings?getSpendingsTable=true`).then(res => res.json())
  const spendings: SpendingTableType[] = response.data

  if (!spendings || !Array.isArray(spendings)) {
    throw new Error('No se pudieron cargar los gastos para exportar')
  }

  const dataToExport = spendings.map((spending) => ({
    id: spending.id,
    name: spending.name,
    description: spending.description,
    date: spending.date,
    amount: spending.amount,
    category: spending.category,
    createdBy: spending.createdBy,
    hasDebt: spending.hasDebt,
    someoneOwesYou: spending.someoneOwesYou
  }))

  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Gastos')

  if (dataToExport.length > 0) {
    worksheet.columns = Object.keys(dataToExport[0]).map((key) => ({
      header: key,
      key,
      width: 18
    }))
    worksheet.addRows(dataToExport)
  }

  const buffer = await workbook.xlsx.writeBuffer()
  downloadBlob(
    buffer,
    `${groupId}.xlsx`,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  )
}

export async function exportDataToPDF (groupId: string, props: any) {
  const response = await fetch(`/api/groups/${groupId}/spendings?getSpendingsTable=true`).then(res => res.json())
  const spendings: SpendingTableType[] = response.data

  if (!spendings || !Array.isArray(spendings)) {
    throw new Error('No se pudieron cargar los gastos para exportar')
  }

  const dataToExport = spendings.map((spending) => ({
    name: spending.name,
    description: spending.description,
    date: spending.date,
    amount: spending.amount,
    category: spending.category,
    createdBy: spending.createdBy,
    hasDebt: spending.hasDebt,
    someoneOwesYou: spending.someoneOwesYou
  }))

  const doc = new jsPDF()
  const color = props?.color ?? '#000000'

  autoTable(doc, {
    headStyles: { fillColor: color },
    head: [['Nombre', 'Descripción', 'Fecha', 'Monto', 'Categoría', 'Creado por', 'Debés', 'Te deben']],
    body: dataToExport.map((spending) => [
      spending.name,
      spending.description ?? '',
      new Date(spending.date).toLocaleDateString('es-AR'),
      spending.amount,
      spending.category,
      spending.createdBy,
      spending.hasDebt ? 'Sí' : 'No',
      spending.someoneOwesYou ? 'Sí' : 'No'
    ])
  })

  doc.save(`${groupId}.pdf`)
}

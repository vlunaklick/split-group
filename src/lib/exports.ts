import * as XLSX from 'xlsx'
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

export async function exportDataToExcel (groupId: string) {
  try {
    const response = await fetch(`/api/groups/${groupId}/spendings?getSpendingsTable=true`).then(res => res.json())

    const spendings: SpendingTableType[] = response.data

    if (spendings && Array.isArray(spendings)) {
      const dataToExport = spendings.map((spending: any) => ({
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

      const workbook = XLSX.utils.book_new()
      const worksheet = XLSX.utils?.json_to_sheet(dataToExport)
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Spendings')
      XLSX.writeFile(workbook, `${groupId}.xlsx`)
      console.log(`Exported data to ${groupId}.xlsx`)
    } else {
      console.log('#==================Export Error')
    }
  } catch (error: any) {
    console.log('#==================Export Error', error.message)
  }
}

export async function exportDataToPDF (groupId: string, props: any) {
  try {
    const response = await fetch(`/api/groups/${groupId}/spendings?getSpendingsTable=true`).then(res => res.json())

    const spendings: SpendingTableType[] = response.data

    if (spendings && Array.isArray(spendings)) {
      const dataToExport = spendings.map((spending: any) => ({
        name: spending.name,
        description: spending.description,
        date: spending.date,
        amount: spending.amount,
        category: spending.category,
        createdBy: spending.createdBy,
        hasDebt: spending.hasDebt,
        someoneOwesYou: spending.someoneOwesYou
      }))

      // eslint-disable-next-line new-cap
      const doc = new jsPDF()

      const color = props?.color ?? '#000000'

      autoTable(doc, {
        headStyles: {
          fillColor: color
        },
        head: [['Nombre', 'Descripción', 'Fecha', 'Monto', 'Categoría', 'Creado por', 'Debes', 'Te deben']],
        body: dataToExport.map(spending => [
          spending.name,
          spending.description,
          spending.date,
          spending.amount,
          spending.category,
          spending.createdBy,
          spending.hasDebt ? 'Sí' : 'No',
          spending.someoneOwesYou ? 'Sí' : 'No'
        ])
      })

      doc.save(`${groupId}.pdf`)
    } else {
      console.log('#==================Export Error')
    }
  } catch (error: any) {
    console.log('#==================Export Error', error.message)
  }
}

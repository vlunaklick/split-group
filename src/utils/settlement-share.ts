import { formatMoney } from '@/lib/money'

type SettlementTransfer = {
  fromName: string
  toName: string
  amount: number
}

export function buildSettlementPlanText ({
  groupName,
  transferCount,
  transfers
}: {
  groupName: string
  transferCount: number
  transfers: SettlementTransfer[]
}) {
  const lines = transfers.map(
    (transfer) => `${transfer.fromName} → ${transfer.toName}: ${formatMoney(transfer.amount)}`
  )

  const paymentLabel = transferCount === 1 ? '1 pago' : `${transferCount} pagos`

  return [
    `Liquidación Split Group — ${groupName}`,
    '',
    `${paymentLabel} para cerrar el grupo:`,
    ...lines.map((line) => `• ${line}`),
    '',
    'Generado en Split Group'
  ].join('\n')
}

export function shareSettlementPlanOnWhatsApp (text: string) {
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
}

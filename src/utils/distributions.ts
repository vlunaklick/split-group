import { DistributionMode, DistributionModeType, SpendingInfo } from '@/app/(overview)/groups/[groupId]/spendings/types'

export const handleDistribution = ({ type, spending }: { type: DistributionModeType, spending: SpendingInfo }) => {
  switch (type) {
    case DistributionMode.EQUAL:
      return handleEqualDistribution({ spending })
    default:
      throw new Error('Invalid distribution type')
  }
}

export const handleEqualDistribution = ({ spending }: { spending: SpendingInfo }) => {
  // Calcular el monto total que fue pagado
  const totalPaid = spending.payers.reduce((acc, payer) => acc + payer.amount, 0)

  // Calcular el número total de personas involucradas en el gasto
  const totalInvolved = spending.payers.length + spending.debters.length

  // Calcular el monto que cada persona debería pagar
  const amountPerPerson = totalPaid / totalInvolved

  // Crear un array para guardar las deudas de cada persona
  const debts = []

  // Calcular cuánto debe cada deudor
  for (const debter of spending.debters) {
    debts.push({
      person: debter.userId,
      debt: amountPerPerson
    })
  }

  // Calcular cuánto debe cada pagador (si pagaron menos de lo que deberían) o cuánto pagaron de más
  for (const payer of spending.payers) {
    const remainingDebt = amountPerPerson - payer.amount
    if (remainingDebt > 0) {
      debts.push({
        person: payer.userId,
        debt: remainingDebt
      })
    } else {
      debts.push({
        person: payer.userId,
        debt: 0,
        overpaid: -remainingDebt // Guardar el exceso pagado para los reembolsos
      })
    }
  }

  // Crear un array para registrar los pagos
  const payments = []

  // Distribuir las deudas entre los pagadores que pagaron de más
  for (const payer of spending.payers) {
    let overpaidAmount = payer.amount - amountPerPerson
    if (overpaidAmount > 0) {
      for (const debt of debts) {
        if (debt.debt > 0) {
          const paymentAmount = Math.min(debt.debt, overpaidAmount)
          payments.push({
            from: debt.person,
            to: payer.userId,
            amount: paymentAmount
          })
          debt.debt -= paymentAmount
          overpaidAmount -= paymentAmount // Reducir el monto excesivo en consecuencia
        }
      }
    }
  }

  return payments.filter(payment => payment.amount > 0)
}

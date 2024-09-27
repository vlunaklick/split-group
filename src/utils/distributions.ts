import { DistributionMode, DistributionModeType, SpendingInfo } from '@/app/(overview)/groups/[groupId]/spendings/types'

export const handleDistribution = ({ type, spending }: { type: DistributionModeType, spending: SpendingInfo }) => {
  switch (type) {
    case DistributionMode.EQUAL:
      return handleEqualDistribution({ spending })
    case DistributionMode.CUSTOM:
      return handleCustomDistribution({ spending })
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

export const handleCustomDistribution = ({ spending }: { spending: SpendingInfo }) => {
  const { payers, debters } = spending

  // Map the amounts already paid by users
  const paidByUser: { [key: string]: number } = {}
  payers.forEach(payer => {
    paidByUser[payer.userId] = (paidByUser[payer.userId] || 0) + payer.amount
  })

  // Map the amounts owed by users
  const debtByUser: { [key: string]: number } = {}
  debters.forEach(debter => {
    debtByUser[debter.userId] = (debtByUser[debter.userId] || 0) + debter.amount
  })

  // Result array
  const result: { from: string; to: string; amount: number }[] = []

  // Calculate balances
  const balances: { userId: string; balance: number }[] = []

  for (const userId of Object.keys(debtByUser)) {
    const paid = paidByUser[userId] || 0
    const debt = debtByUser[userId]
    const balance = paid - debt

    // Only add users with non-zero balances
    if (balance !== 0) {
      balances.push({ userId, balance })
    }
  }

  // Separate creditors and debtors
  const creditors = balances.filter(b => b.balance > 0) // Users with a positive balance (overpaid)
  const debtors = balances.filter(b => b.balance < 0) // Users with a negative balance (owed money)

  // Settle debts
  while (creditors.length > 0 && debtors.length > 0) {
    const creditor = creditors[0] // The first creditor
    const debtor = debtors[0] // The first debtor

    const amountToTransfer = Math.min(creditor.balance, -debtor.balance) // Amount to transfer

    // Add the transaction to the result
    result.push({
      from: debtor.userId, // The debtor (who owes money)
      to: creditor.userId, // The creditor (who will receive money)
      amount: amountToTransfer
    })

    // Update balances
    creditor.balance -= amountToTransfer // Reduce the creditor's credit
    debtor.balance += amountToTransfer // Reduce the debtor's debt

    // Remove settled creditors or debtors
    if (creditor.balance === 0) {
      creditors.shift() // Remove creditor if settled
    }
    if (debtor.balance === 0) {
      debtors.shift() // Remove debtor if settled
    }
  }

  return result // Return the result with transactions
}

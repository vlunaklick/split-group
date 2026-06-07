export type SettlementTransfer = {
  fromId: string
  fromName: string
  toId: string
  toName: string
  amount: number
}

type BalanceEntry = {
  userId: string
  name: string
  balance: number
}

const EPSILON = 0.01

export function simplifyBalances (
  balances: Map<string, { name: string, balance: number }>
): SettlementTransfer[] {
  const creditors: BalanceEntry[] = []
  const debtors: BalanceEntry[] = []

  for (const [userId, entry] of Array.from(balances.entries())) {
    if (entry.balance > EPSILON) {
      creditors.push({ userId, name: entry.name, balance: entry.balance })
    } else if (entry.balance < -EPSILON) {
      debtors.push({ userId, name: entry.name, balance: -entry.balance })
    }
  }

  creditors.sort((a, b) => b.balance - a.balance)
  debtors.sort((a, b) => b.balance - a.balance)

  const transfers: SettlementTransfer[] = []
  let i = 0
  let j = 0

  while (i < creditors.length && j < debtors.length) {
    const amount = Math.round(Math.min(creditors[i].balance, debtors[j].balance) * 100) / 100

    if (amount > EPSILON) {
      transfers.push({
        fromId: debtors[j].userId,
        fromName: debtors[j].name,
        toId: creditors[i].userId,
        toName: creditors[i].name,
        amount
      })
    }

    creditors[i].balance -= amount
    debtors[j].balance -= amount

    if (creditors[i].balance < EPSILON) i++
    if (debtors[j].balance < EPSILON) j++
  }

  return transfers
}

'use client'

import { DistributionMode, DistributionModeType } from '@/app/(overview)/groups/[groupId]/spendings/types'
import { NumberField, NumberFieldDecrement, NumberFieldGroup, NumberFieldIncrement, NumberFieldInput } from '@/components/number-field'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatMoney } from '@/lib/money'
import { handleDistribution } from '@/utils/distributions'
import { ArrowRight, ChevronDownIcon, ChevronUpIcon, Copy, Plus, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'

type Participant = { id: string, name: string }
type PersonAmount = { userId: string, amount: number }

function participantLabel (participants: Participant[], id: string) {
  return participants.find((p) => p.id === id)?.name ?? '?'
}

export function SplitCalculator () {
  const [expenseName, setExpenseName] = useState('')
  const [amount, setAmount] = useState(0)
  const [nameInput, setNameInput] = useState('')
  const [participants, setParticipants] = useState<Participant[]>([])
  const [payers, setPayers] = useState<PersonAmount[]>([])
  const [debters, setDebters] = useState<PersonAmount[]>([])
  const [mode, setMode] = useState<DistributionModeType>(DistributionMode.EQUAL)
  const [error, setError] = useState<string | null>(null)
  const nextId = useRef(0)

  const payerIds = useMemo(() => new Set(payers.map((p) => p.userId)), [payers])

  const addParticipant = () => {
    const name = nameInput.trim()
    if (!name || participants.some((p) => p.name.toLowerCase() === name.toLowerCase())) return

    const id = `p-${nextId.current++}`
    setParticipants((prev) => [...prev, { id, name }])
    setNameInput('')
    setError(null)
  }

  const removeParticipant = (id: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id))
    setPayers((prev) => prev.filter((p) => p.userId !== id))
    setDebters((prev) => prev.filter((d) => d.userId !== id))
    setError(null)
  }

  const togglePayer = (userId: string) => {
    setPayers((prev) => {
      const exists = prev.find((p) => p.userId === userId)
      if (exists) return prev.filter((p) => p.userId !== userId)
      return [...prev, { userId, amount: 0 }]
    })
    setError(null)
  }

  const toggleDebter = (userId: string) => {
    setDebters((prev) => {
      const exists = prev.find((d) => d.userId === userId)
      if (exists) return prev.filter((d) => d.userId !== userId)
      return [...prev, { userId, amount: 0 }]
    })
    setError(null)
  }

  const handlePayerAmount = (userId: string, value: number) => {
    setPayers((prev) => prev.map((p) => (p.userId === userId ? { ...p, amount: value } : p)))
    setError(null)
  }

  const handleDebterAmount = (userId: string, value: number) => {
    setDebters((prev) => prev.map((d) => (d.userId === userId ? { ...d, amount: value } : d)))
    setError(null)
  }

  const assignFullPayment = (userId: string) => {
    if (amount <= 0) return
    setPayers([{ userId, amount }])

    if (mode === DistributionMode.EQUAL) {
      const eligible = participants.filter((p) => p.id !== userId)
      if (eligible.length > 0) {
        const share = Math.round(amount / eligible.length)
        setDebters(eligible.map((p) => ({ userId: p.id, amount: share })))
      }
    }

    setError(null)
  }

  const splitPaymentAmongPayers = () => {
    if (payers.length === 0 || amount <= 0) return
    const share = Math.round(amount / payers.length)
    setPayers((prev) => prev.map((p) => ({ ...p, amount: share })))
    setError(null)
  }

  const selectAllEligibleDebters = () => {
    const eligible = participants.filter((p) => !payerIds.has(p.id))
    if (eligible.length === 0) return
    const share = Math.round(amount / eligible.length)
    setDebters(eligible.map((p) => ({ userId: p.id, amount: share })))
    setError(null)
  }

  useEffect(() => {
    if (mode !== DistributionMode.EQUAL || debters.length === 0 || amount <= 0) return
    const share = Math.round(amount / debters.length)
    if (debters.every((d) => d.amount === share)) return
    setDebters((prev) => prev.map((d) => ({ ...d, amount: share })))
  }, [debters.length, mode, amount])

  const transfers = useMemo(() => {
    if (amount <= 0 || payers.length === 0 || debters.length === 0) return []

    const payersTotal = payers.reduce((sum, p) => sum + p.amount, 0)
    if (payersTotal !== amount) return []

    if (mode === DistributionMode.CUSTOM) {
      const debtersTotal = debters.reduce((sum, d) => sum + d.amount, 0)
      if (debtersTotal !== amount) return []
    }

    return handleDistribution({
      type: mode,
      spending: {
        name: expenseName,
        amount,
        description: '',
        categoryId: '',
        currencyId: '',
        date: '',
        payers,
        debters
      }
    })
  }, [amount, payers, debters, mode, expenseName])

  const copyPlan = async () => {
    if (transfers.length === 0) return

    const title = expenseName.trim() || 'Gasto'
    const lines = transfers.map((t) =>
      `${participantLabel(participants, t.from)} → ${participantLabel(participants, t.to)}: ${formatMoney(t.amount)}`
    )
    const text = `${title} — ${transfers.length} ${transfers.length === 1 ? 'pago' : 'pagos'}:\n${lines.join('\n')}`

    try {
      await navigator.clipboard.writeText(text)
    } catch {
      setError('No se pudo copiar al portapapeles')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addParticipant()
    }
  }

  const canCalculate = participants.length >= 2 && amount > 0

  return (
    <section className="container mx-auto flex max-w-xl flex-col gap-6 px-4 py-section">
      <div className="text-center">
        <h1 className="text-display-md">Calculadora de gastos</h1>
        <p className="mt-2 text-muted-foreground">
          Mismo flujo que en la app: quién pagó, cómo se reparte y quién le debe a quién.
        </p>
      </div>

      <section className="surface-panel grid gap-4 p-4 sm:p-5">
        <div className="grid gap-1">
          <h2 className="section-label">El gasto</h2>
          <p className="text-xs text-muted-foreground">Nombre opcional y monto total a repartir.</p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="expense-name">Nombre</Label>
          <Input
            id="expense-name"
            placeholder="Ej. Cena, supermercado, nafta…"
            value={expenseName}
            onChange={(e) => setExpenseName(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label>Monto total</Label>
          <NumberField minValue={0} value={amount} onChange={setAmount}>
            <NumberFieldGroup>
              <NumberFieldDecrement><ChevronDownIcon /></NumberFieldDecrement>
              <NumberFieldInput />
              <NumberFieldIncrement><ChevronUpIcon /></NumberFieldIncrement>
            </NumberFieldGroup>
          </NumberField>
        </div>
      </section>

      <section className="surface-panel grid gap-4 p-4 sm:p-5">
        <div className="grid gap-1">
          <h2 className="section-label">Participantes</h2>
          <p className="text-xs text-muted-foreground">Agregá a cada persona del grupo.</p>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Nombre"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button type="button" variant="secondary" size="icon" onClick={addParticipant} aria-label="Añadir participante">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {participants.length === 0 && (
          <p className="text-sm text-muted-foreground">Necesitás al menos dos personas.</p>
        )}

        <ul className="flex flex-wrap gap-2">
          {participants.map(({ id, name }) => (
            <li
              key={id}
              className="flex items-center gap-1 rounded-full border border-border bg-muted/50 py-1 pl-3 pr-1 text-sm"
            >
              {name}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full"
                onClick={() => removeParticipant(id)}
                aria-label={`Quitar a ${name}`}
              >
                <X className="h-3 w-3" />
              </Button>
            </li>
          ))}
        </ul>
      </section>

      {canCalculate && (
        <section className="surface-panel grid gap-4 p-4 sm:p-5">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="section-label">Quién pagó</h2>
            <p className="font-mono text-sm">{formatMoney(amount)}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {participants.map(({ id, name }) => (
              <Button
                key={id}
                type="button"
                variant={payers.length === 1 && payers[0]?.userId === id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => assignFullPayment(id)}
              >
                {name} pagó todo
              </Button>
            ))}
            {payers.length > 1 && (
              <Button type="button" variant="ghost" size="sm" onClick={splitPaymentAmongPayers}>
                Repartir el pago
              </Button>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between font-normal">
                {payers.length > 0
                  ? `${payers.length} pagador${payers.length > 1 ? 'es' : ''}`
                  : 'Elegir pagadores'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]" onCloseAutoFocus={(e) => e.preventDefault()}>
              <DropdownMenuLabel>Participantes</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {participants.map(({ id, name }) => (
                <DropdownMenuCheckboxItem
                  key={id}
                  checked={payers.some((p) => p.userId === id)}
                  onSelect={(e) => e.preventDefault()}
                  onCheckedChange={() => togglePayer(id)}
                >
                  {name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {payers.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Usá &quot;pagó todo&quot; para el caso más común.
            </p>
          )}

          {payers.map((payer) => (
            <div key={payer.userId} className="flex items-center gap-4">
              <Label className="min-w-0 truncate">
                {participantLabel(participants, payer.userId)}
              </Label>
              <NumberField
                className="ml-auto"
                minValue={0}
                value={payer.amount}
                onChange={(value) => handlePayerAmount(payer.userId, value)}
              >
                <NumberFieldGroup>
                  <NumberFieldIncrement><ChevronUpIcon /></NumberFieldIncrement>
                  <NumberFieldInput />
                  <NumberFieldDecrement><ChevronDownIcon /></NumberFieldDecrement>
                </NumberFieldGroup>
              </NumberField>
            </div>
          ))}
        </section>
      )}

      {canCalculate && payers.length > 0 && (
        <section className="surface-panel grid gap-4 p-4 sm:p-5">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="section-label">Cómo se reparte</h2>
            <p className="font-mono text-sm">{formatMoney(amount)}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Label className="shrink-0 text-muted-foreground">Modo</Label>
            <Select
              value={mode}
              onValueChange={(value) => {
                setMode(value as DistributionModeType)
                setDebters([])
                setError(null)
              }}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equal">Partes iguales</SelectItem>
                <SelectItem value="custom">Montos distintos</SelectItem>
              </SelectContent>
            </Select>
            {mode === DistributionMode.EQUAL && (
              <Button type="button" variant="ghost" size="sm" onClick={selectAllEligibleDebters}>
                Todos menos quien pagó
              </Button>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between font-normal">
                {debters.length > 0
                  ? `${debters.length} participante${debters.length > 1 ? 's' : ''}`
                  : 'Elegir participantes'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]" onCloseAutoFocus={(e) => e.preventDefault()}>
              <DropdownMenuLabel>Participantes</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {participants.map(({ id, name }) => {
                if (mode === DistributionMode.EQUAL && payerIds.has(id)) return null

                return (
                  <DropdownMenuCheckboxItem
                    key={id}
                    checked={debters.some((d) => d.userId === id)}
                    onSelect={(e) => e.preventDefault()}
                    onCheckedChange={() => toggleDebter(id)}
                  >
                    {name}
                  </DropdownMenuCheckboxItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          {debters.length === 0 && (
            <p className="text-sm text-muted-foreground">Elegí quién participa en la división.</p>
          )}

          {mode === DistributionMode.EQUAL && debters.length > 0 && (
            <ul className="divide-y divide-border rounded-lg border border-border">
              {debters.map((debter) => (
                <li key={debter.userId} className="flex items-center justify-between gap-3 px-4 py-3">
                  <span className="truncate text-sm">{participantLabel(participants, debter.userId)}</span>
                  <span className="shrink-0 font-mono text-sm text-muted-foreground">
                    {formatMoney(debter.amount)}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {mode === DistributionMode.CUSTOM && debters.map((debter) => (
            <div key={debter.userId} className="flex items-center gap-4">
              <Label className="min-w-0 truncate">
                {participantLabel(participants, debter.userId)}
              </Label>
              <NumberField
                className="ml-auto"
                minValue={0}
                value={debter.amount}
                onChange={(value) => handleDebterAmount(debter.userId, value)}
              >
                <NumberFieldGroup>
                  <NumberFieldIncrement><ChevronUpIcon /></NumberFieldIncrement>
                  <NumberFieldInput />
                  <NumberFieldDecrement><ChevronDownIcon /></NumberFieldDecrement>
                </NumberFieldGroup>
              </NumberField>
            </div>
          ))}
        </section>
      )}

      {transfers.length > 0 && (
        <section className="grid gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="grid gap-1">
              <h2 className="section-label">Quién debe a quién</h2>
              <p className="text-xs text-muted-foreground">
                {transfers.length} {transfers.length === 1 ? 'pago' : 'pagos'} para cerrar este gasto
              </p>
            </div>
            <Button type="button" variant="outline" size="sm" className="h-8 shrink-0" onClick={copyPlan}>
              <Copy className="mr-1.5 h-3.5 w-3.5" />
              Copiar
            </Button>
          </div>

          <ul className="surface-panel divide-y divide-border">
            {transfers.map((transfer) => (
              <li
                key={`${transfer.from}-${transfer.to}-${transfer.amount}`}
                className="flex items-center gap-3 px-4 py-3 text-sm"
              >
                <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="font-medium">{participantLabel(participants, transfer.from)}</span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="font-medium">{participantLabel(participants, transfer.to)}</span>
                </div>
                <span className="shrink-0 font-mono text-sm">{formatMoney(transfer.amount)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="surface-panel grid gap-4 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          ¿Querés guardar gastos, invitar amigos y llevar el balance del grupo?
        </p>
        <Button variant="download" asChild>
          <Link href="/register">Crear cuenta gratis</Link>
        </Button>
      </div>
    </section>
  )
}

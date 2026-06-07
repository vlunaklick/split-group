'use client'

import { NumberField, NumberFieldDecrement, NumberFieldGroup, NumberFieldIncrement, NumberFieldInput } from '@/components/number-field'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { formatMoney } from '@/lib/money'
import { ChevronDownIcon, ChevronUpIcon, Plus, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export function SplitCalculator () {
  const [amount, setAmount] = useState(0)
  const [nameInput, setNameInput] = useState('')
  const [participants, setParticipants] = useState<string[]>([])

  const addParticipant = () => {
    const name = nameInput.trim()
    if (!name || participants.includes(name)) return
    setParticipants((prev) => [...prev, name])
    setNameInput('')
  }

  const removeParticipant = (name: string) => {
    setParticipants((prev) => prev.filter((p) => p !== name))
  }

  const share = participants.length > 0 && amount > 0
    ? Math.round((amount / participants.length) * 100) / 100
    : 0

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addParticipant()
    }
  }

  return (
    <section className="container mx-auto flex max-w-lg flex-col gap-6 px-4 py-section">
      <div className="text-center">
        <h1 className="text-display-md">Calculadora de gastos</h1>
        <p className="mt-2 text-muted-foreground">
          Divide un monto en partes iguales entre tu grupo — sin crear cuenta.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monto total</CardTitle>
          <CardDescription>¿Cuánto hay que repartir?</CardDescription>
        </CardHeader>
        <CardContent>
          <NumberField minValue={0} value={amount} onChange={setAmount}>
            <NumberFieldGroup>
              <NumberFieldDecrement>
                <ChevronDownIcon />
              </NumberFieldDecrement>
              <NumberFieldInput />
              <NumberFieldIncrement>
                <ChevronUpIcon />
              </NumberFieldIncrement>
            </NumberFieldGroup>
          </NumberField>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Participantes</CardTitle>
          <CardDescription>Añade a cada persona del grupo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
            <p className="text-sm text-muted-foreground">Añade al menos dos personas para calcular.</p>
          )}

          <ul className="flex flex-wrap gap-2">
            {participants.map((name) => (
              <li
                key={name}
                className="flex items-center gap-1 rounded-full border border-border bg-muted/50 pl-3 pr-1 py-1 text-sm"
              >
                {name}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full"
                  onClick={() => removeParticipant(name)}
                  aria-label={`Quitar a ${name}`}
                >
                  <X className="h-3 w-3" />
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {participants.length >= 2 && amount > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>Resultado</CardTitle>
            <CardDescription>
              Cada persona debe aportar {formatMoney(share)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {participants.map((name) => (
              <div key={name} className="flex items-center justify-between text-sm">
                <span>{name}</span>
                <span className="font-medium">{formatMoney(share)}</span>
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-border pt-3 font-medium">
              <span>Total</span>
              <span>{formatMoney(share * participants.length)}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="rounded-lg border border-border bg-card p-6 text-center">
        <p className="text-sm text-muted-foreground mb-4">
          ¿Quieres guardar gastos, invitar amigos y llevar el balance del grupo?
        </p>
        <Button variant="download" asChild>
          <Link href="/register">Crear cuenta gratis</Link>
        </Button>
      </div>
    </section>
  )
}

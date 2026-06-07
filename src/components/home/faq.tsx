'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'

const items = [
  {
    question: '¿Cuánto cuesta?',
    answer:
      'Gratis, sin límites de grupos ni gastos. No pedimos tarjeta de crédito ni tenemos planes de pago.'
  },
  {
    question: '¿Tienen que registrarse todos los miembros?',
    answer:
      'No hace falta que todos se registren al mismo tiempo. Compartís un enlace de invitación y cada persona se suma cuando puede.'
  },
  {
    question: '¿Funciona en el celular?',
    answer:
      'Sí. Podés usarla desde el navegador o instalarla como app en tu teléfono — sin descargar nada de la App Store ni Google Play.'
  },
  {
    question: '¿Puedo usarla sin crear una cuenta?',
    answer:
      'Sí. La calculadora pública te deja repartir un gasto al instante sin registrarte. Para guardar grupos y seguir el historial, creás una cuenta gratis.'
  }
]

export function Faq () {
  return (
    <section
      id="preguntas-frecuentes"
      className="border-t border-border bg-canvas-soft/60"
    >
      <div className="container mx-auto px-4 py-10 md:py-12">
        <div className="mb-8 text-center md:mb-10">
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-primary">
            Preguntas frecuentes
          </p>
          <h2 className="text-display-sm md:text-display-md">
            Lo que suele preguntarse
          </h2>
        </div>

        <Accordion
          type="single"
          collapsible
          className="mx-auto max-w-2xl rounded-lg border border-border bg-card px-5"
        >
          {items.map(({ question, answer }) => (
            <AccordionItem key={question} value={question}>
              <AccordionTrigger className="text-left text-sm font-semibold text-foreground hover:no-underline">
                {question}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

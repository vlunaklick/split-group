import { ChevronDown } from 'lucide-react'

const items = [
  {
    id: 'precio',
    question: '¿Cuánto cuesta?',
    answer:
      'Gratis, sin límites de grupos ni gastos. No pedimos tarjeta de crédito ni tenemos planes de pago.'
  },
  {
    id: 'registro',
    question: '¿Tienen que registrarse todos los miembros?',
    answer:
      'No hace falta que todos se registren al mismo tiempo. Compartís un enlace de invitación y cada persona se suma cuando puede.'
  },
  {
    id: 'movil',
    question: '¿Funciona en el celular?',
    answer:
      'Sí. Podés usarla desde el navegador o instalarla como app en tu teléfono — sin descargar nada de la App Store ni Google Play.'
  },
  {
    id: 'sin-cuenta',
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

        <div className="mx-auto max-w-2xl rounded-lg border border-border bg-card px-5">
          {items.map(({ id, question, answer }) => (
            <details
              key={id}
              className="group border-b border-border last:border-b-0"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-semibold text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
                {question}
                <ChevronDown
                  className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <p className="pb-4 text-sm leading-relaxed text-muted-foreground">
                {answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

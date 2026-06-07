import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'

export const FaqPage = () => {
  return (
    <section className="mx-auto flex w-full max-w-[58rem] flex-col items-center gap-8 py-section">
      <div className="flex flex-col items-center gap-4 text-center">
        <h2 className="text-display-md">
          Preguntas frecuentes
        </h2>
        <p className="max-w-[85%] text-base leading-relaxed text-muted-foreground">
          Aquí encontrarás las preguntas más comunes sobre nuestro producto.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>¿Es gratuito?</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            Sí, es completamente gratuito. Puedes usarlo sin restricciones ni costos ocultos.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>¿Qué formas hay para dividir los gastos?</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            Actualmente, los gastos se pueden dividir de manera igualitaria o especificando los montos de cada persona. También, se le puede agregar datos adicionales a cada gasto como la fecha, la categoría y una descripción lo cuál facilita luego la visualización de los gastos.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>¿Se pueden exportar los gastos?</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            Nos encontramos trabajando en esta funcionalidad. Pronto podrás exportar tus gastos en formato CSV u otro formato que prefieras.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  )
}

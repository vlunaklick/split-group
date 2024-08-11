import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"

export const FaqPage = () => {
  return (
    <section className="mx-auto flex flex-col items-center justify-between gap-4 py-0 w-full">
      <div className="pt-8 sm:pt-8 lg:pt-5 mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-3xl font-bold">
          Preguntas frecuentes
        </h2>
        <p className="text-muted-foreground max-w-[85%] pb-1 sm:pb-1 lg:pb-10 leading-normal sm:text-lg sm:leading-7">
          Aquí encontrarás las preguntas más comunes sobre nuestro producto.
        </p>
      </div>
      
      <div className="container my-10 sm:my-0 lg:my-0 md:my-0 flex max-w-[58rem] flex-col items-center justify-between gap-4 py-0 w-full">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>¿Es gratuito?</AccordionTrigger>
            <AccordionContent>
              Sí, es completamente gratuito. Puedes usarlo sin restricciones ni costos ocultos.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>¿Qué formas hay para dividir los gastos?</AccordionTrigger>
            <AccordionContent>
              Actualmente, los gastos se pueden dividir de manera igualitaria o especificando los montos de cada persona. También, se le puede agregar datos adicionales a cada gasto como la fecha, la categoría y una descripción lo cuál facilita luego la visualización de los gastos.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>¿Se pueden exportar los gastos?</AccordionTrigger>
            <AccordionContent>
              Nos encontramos trabajando en esta funcionalidad. Pronto podrás exportar tus gastos en formato CSV u otro formato que prefieras.
            </AccordionContent>
          </AccordionItem>
        </Accordion>   
      </div>
    </section>
  )
}
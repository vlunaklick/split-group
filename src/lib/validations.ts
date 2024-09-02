import * as z from 'zod'

export const searchParamsSchema = z.object({
  name: z.string().optional(),
  page: z.coerce.number().optional(),
  per_page: z.coerce.number().optional()
})

export const getSpendingsSchema = searchParamsSchema

export type GetSpendingsSchema = z.infer<typeof getSpendingsSchema>

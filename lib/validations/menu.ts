import * as z from "zod"

export const categoryFormSchema = z.object({
  name: z.string().min(1, "Nome da categoria é obrigatório"),
  description: z.string().optional(),
})

export const dishFormSchema = z.object({
  name: z.string().min(1, "Nome do prato é obrigatório"),
  description: z.string().optional(),
  price: z.string().min(1, "Preço é obrigatório"),
  categoryId: z.string().min(1, "Categoria é obrigatória"),
  image: z.any().optional(),
})

export type CategoryFormValues = z.infer<typeof categoryFormSchema>
export type DishFormValues = z.infer<typeof dishFormSchema> 
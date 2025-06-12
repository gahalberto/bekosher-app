import { z } from "zod"

export const establishmentTypeEnum = {
  RESTAURANT: "RESTAURANT",
  BUFFET: "BUFFET",
  SWEET_SHOP: "SWEET_SHOP",
  OTHER: "OTHER"
} as const

export const establishmentTypeLabels = {
  [establishmentTypeEnum.RESTAURANT]: "Restaurante",
  [establishmentTypeEnum.BUFFET]: "Buffet",
  [establishmentTypeEnum.SWEET_SHOP]: "Doceria",
  [establishmentTypeEnum.OTHER]: "Outro"
} as const

export const establishmentFormSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  type: z.enum([
    establishmentTypeEnum.RESTAURANT,
    establishmentTypeEnum.BUFFET,
    establishmentTypeEnum.SWEET_SHOP,
    establishmentTypeEnum.OTHER
  ]),
  cep: z.string().regex(/^\d{5}-\d{3}$/, "CEP inválido"),
  street: z.string().min(1, "Rua é obrigatória"),
  number: z.string().min(1, "Número é obrigatório"),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(1, "Estado é obrigatório"),
  phone: z.string().regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, "Telefone inválido"),
  email: z.string().email("Email inválido"),
  description: z.string().min(10, "Descrição deve ter no mínimo 10 caracteres"),
  image: z.string().optional(),
  hasDelivery: z.boolean().default(true),
  deliveryFee: z.number().min(0, "Taxa de entrega não pode ser negativa").optional(),
  minDeliveryOrder: z.number().min(0, "Pedido mínimo não pode ser negativo").optional(),
  deliveryRadius: z.number().min(0, "Raio de entrega deve ser positivo").max(50, "Raio máximo de 50km").optional(),
})

export type EstablishmentFormData = z.infer<typeof establishmentFormSchema>

export interface AddressData {
  cep: string
  logradouro: string
  bairro: string
  localidade: string
  uf: string
} 
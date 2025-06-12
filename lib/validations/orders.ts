import * as z from "zod"

// Schema para criar um pedido
export const createOrderSchema = z.object({
  establishmentId: z.string().min(1, "ID do estabelecimento é obrigatório"),
  deliveryAddress: z.string().min(1, "Endereço de entrega é obrigatório"),
  notes: z.string().optional(),
  items: z.array(z.object({
    productId: z.string().min(1, "ID do produto é obrigatório"),
    quantity: z.number().min(1, "Quantidade deve ser pelo menos 1")
  })).min(1, "Pelo menos um item é obrigatório")
})

// Schema para atualizar status do pedido
export const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED'])
})

// Schema para buscar pedidos com filtros
export const getOrdersQuerySchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED']).optional(),
  page: z.string().transform(val => parseInt(val) || 1).optional(),
  limit: z.string().transform(val => parseInt(val) || 10).optional()
})

// Types
export type CreateOrderRequest = z.infer<typeof createOrderSchema>
export type UpdateOrderStatusRequest = z.infer<typeof updateOrderStatusSchema>
export type GetOrdersQuery = z.infer<typeof getOrdersQuerySchema>

// Schemas de resposta para documentação
export const orderItemResponseSchema = z.object({
  id: z.string(),
  productId: z.string(),
  productName: z.string(),
  quantity: z.number(),
  price: z.number(),
  subtotal: z.number()
})

export const orderResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  establishmentId: z.string(),
  establishmentName: z.string(),
  status: z.enum(['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED']),
  total: z.number(),
  deliveryAddress: z.string(),
  notes: z.string().nullable(),
  items: z.array(orderItemResponseSchema),
  createdAt: z.string(),
  updatedAt: z.string()
})

export type OrderItemResponse = z.infer<typeof orderItemResponseSchema>
export type OrderResponse = z.infer<typeof orderResponseSchema> 
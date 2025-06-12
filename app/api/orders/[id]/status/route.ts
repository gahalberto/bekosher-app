import { NextRequest, NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth-utils"
import prismadb from "@/lib/prismadb"
import { updateOrderStatusSchema } from "@/lib/validations/orders"
import { z } from "zod"

// PATCH /api/orders/[id]/status - Atualizar status do pedido
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthenticatedUser(req)
    if (!user) {
      return NextResponse.json(
        { message: "Token de autenticação inválido" },
        { status: 401 }
      )
    }

    // Apenas estabelecimentos podem alterar status de pedidos
    if (user.role !== 'ESTABLISHMENT') {
      return NextResponse.json(
        { message: "Apenas estabelecimentos podem alterar status de pedidos" },
        { status: 403 }
      )
    }

    const { id } = params

    if (!id) {
      return NextResponse.json(
        { message: "ID do pedido é obrigatório" },
        { status: 400 }
      )
    }

    const body = await req.json()
    const { status } = updateOrderStatusSchema.parse(body)

    // Verificar se o pedido existe e pertence ao estabelecimento
    const order = await prismadb.order.findFirst({
      where: {
        id,
        establishmentId: user.establishmentId
      },
      include: {
        user: {
          select: { name: true, phone: true }
        },
        establishment: {
          select: { name: true }
        }
      }
    })

    if (!order) {
      return NextResponse.json(
        { message: "Pedido não encontrado" },
        { status: 404 }
      )
    }

    // Validar transições de status
    const validTransitions: Record<string, string[]> = {
      'PENDING': ['CONFIRMED', 'CANCELLED'],
      'CONFIRMED': ['PREPARING', 'CANCELLED'],
      'PREPARING': ['READY', 'CANCELLED'],
      'READY': ['DELIVERED'],
      'DELIVERED': [], // Status final
      'CANCELLED': [] // Status final
    }

    const allowedStatuses = validTransitions[order.status] || []
    
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { 
          message: `Não é possível alterar status de ${order.status} para ${status}`,
          currentStatus: order.status,
          allowedStatuses
        },
        { status: 400 }
      )
    }

    // Atualizar o status
    const updatedOrder = await prismadb.order.update({
      where: { id },
      data: { status },
      include: {
        establishment: {
          select: { name: true }
        },
        user: {
          select: { name: true, phone: true }
        },
        items: {
          include: {
            product: {
              select: { name: true }
            }
          }
        }
      }
    })

    const formattedOrder = {
      id: updatedOrder.id,
      userId: updatedOrder.userId,
      userName: updatedOrder.user.name,
      userPhone: updatedOrder.user.phone,
      establishmentId: updatedOrder.establishmentId,
      establishmentName: updatedOrder.establishment.name,
      status: updatedOrder.status,
      total: updatedOrder.total,
      deliveryAddress: updatedOrder.deliveryAddress,
      notes: updatedOrder.notes,
      items: updatedOrder.items.map(item => ({
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity
      })),
      createdAt: updatedOrder.createdAt.toISOString(),
      updatedAt: updatedOrder.updatedAt.toISOString()
    }

    return NextResponse.json({
      message: "Status do pedido atualizado com sucesso",
      order: formattedOrder
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          message: "Dados inválidos",
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      )
    }

    console.error("[ORDER_STATUS_PATCH]", error)
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    )
  }
} 
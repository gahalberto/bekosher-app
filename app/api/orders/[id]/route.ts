import { NextRequest, NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth-utils"
import prismadb from "@/lib/prismadb"

// GET /api/orders/[id] - Buscar detalhes de um pedido específico
export async function GET(
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

    const { id } = params

    if (!id) {
      return NextResponse.json(
        { message: "ID do pedido é obrigatório" },
        { status: 400 }
      )
    }

    // Buscar o pedido
    const order = await prismadb.order.findFirst({
      where: {
        id,
        // Usuário só pode ver seus próprios pedidos
        // Estabelecimento só pode ver pedidos feitos para ele
        ...(user.role === 'USER' 
          ? { userId: user.userId }
          : user.role === 'ESTABLISHMENT' && user.establishmentId
            ? { establishmentId: user.establishmentId }
            : { userId: user.userId } // fallback
        )
      },
      include: {
        establishment: {
          select: { 
            name: true,
            address: true,
            phone: true,
            hasDelivery: true,
            deliveryFee: true
          }
        },
        user: {
          select: { 
            name: true, 
            phone: true,
            email: true
          }
        },
        items: {
          include: {
            product: {
              select: { 
                name: true,
                description: true,
                imageUrl: true
              }
            }
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json(
        { message: "Pedido não encontrado" },
        { status: 404 }
      )
    }

    const formattedOrder = {
      id: order.id,
      userId: order.userId,
      userName: order.user.name,
      userPhone: order.user.phone,
      userEmail: order.user.email,
      establishmentId: order.establishmentId,
      establishmentName: order.establishment.name,
      establishmentAddress: order.establishment.address,
      establishmentPhone: order.establishment.phone,
      status: order.status,
      total: order.total,
      deliveryAddress: order.deliveryAddress,
      notes: order.notes,
      hasDelivery: order.establishment.hasDelivery,
      deliveryFee: order.establishment.deliveryFee,
      items: order.items.map(item => ({
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        productDescription: item.product.description,
        productImage: item.product.imageUrl,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity
      })),
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString()
    }

    return NextResponse.json({ order: formattedOrder })

  } catch (error) {
    console.error("[ORDER_GET]", error)
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    )
  }
} 
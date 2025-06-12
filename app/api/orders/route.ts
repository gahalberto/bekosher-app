import { NextRequest, NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth-utils"
import prismadb from "@/lib/prismadb"
import { createOrderSchema, getOrdersQuerySchema } from "@/lib/validations/orders"
import { z } from "zod"

// POST /api/orders - Criar novo pedido
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req)
    if (!user) {
      return NextResponse.json(
        { message: "Token de autenticação inválido" },
        { status: 401 }
      )
    }

    // Só usuários comuns podem fazer pedidos
    if (user.role !== 'USER') {
      return NextResponse.json(
        { message: "Apenas usuários podem fazer pedidos" },
        { status: 403 }
      )
    }

    const body = await req.json()
    const validatedData = createOrderSchema.parse(body)

    // Verificar se o estabelecimento existe e está ativo
    const establishment = await prismadb.establishment.findFirst({
      where: {
        id: validatedData.establishmentId,
        status: 'APPROVED'
      }
    })

    if (!establishment) {
      return NextResponse.json(
        { message: "Estabelecimento não encontrado ou inativo" },
        { status: 404 }
      )
    }

    // Buscar todos os produtos e verificar se existem
    const products = await prismadb.product.findMany({
      where: {
        id: { in: validatedData.items.map(item => item.productId) },
        establishmentId: validatedData.establishmentId,
        isActive: true
      }
    })

    if (products.length !== validatedData.items.length) {
      return NextResponse.json(
        { message: "Um ou mais produtos não foram encontrados ou estão inativos" },
        { status: 400 }
      )
    }

    // Calcular o total
    let total = 0
    const orderItems = validatedData.items.map(item => {
      const product = products.find(p => p.id === item.productId)!
      const subtotal = product.price * item.quantity
      total += subtotal
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price
      }
    })

    // Adicionar taxa de entrega se houver
    if (establishment.hasDelivery && establishment.deliveryFee) {
      total += establishment.deliveryFee
    }

    // Verificar pedido mínimo se aplicável
    if (establishment.minDeliveryOrder && total < establishment.minDeliveryOrder) {
      return NextResponse.json(
        { 
          message: `Pedido mínimo de R$ ${establishment.minDeliveryOrder.toFixed(2)} não atingido`,
          minOrder: establishment.minDeliveryOrder,
          currentTotal: total
        },
        { status: 400 }
      )
    }

    // Criar o pedido com transação
    const order = await prismadb.$transaction(async (tx) => {
      // Criar o pedido
      const newOrder = await tx.order.create({
        data: {
          userId: user.userId,
          establishmentId: validatedData.establishmentId,
          total,
          deliveryAddress: validatedData.deliveryAddress,
          notes: validatedData.notes,
          status: 'PENDING'
        }
      })

      // Criar os itens do pedido
      await tx.orderItem.createMany({
        data: orderItems.map(item => ({
          orderId: newOrder.id,
          ...item
        }))
      })

      return newOrder
    })

    // Buscar o pedido completo para retornar
    const completeOrder = await prismadb.order.findUnique({
      where: { id: order.id },
      include: {
        establishment: {
          select: { name: true }
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

    return NextResponse.json({
      message: "Pedido criado com sucesso",
      order: {
        id: completeOrder!.id,
        userId: completeOrder!.userId,
        establishmentId: completeOrder!.establishmentId,
        establishmentName: completeOrder!.establishment.name,
        status: completeOrder!.status,
        total: completeOrder!.total,
        deliveryAddress: completeOrder!.deliveryAddress,
        notes: completeOrder!.notes,
        items: completeOrder!.items.map(item => ({
          id: item.id,
          productId: item.productId,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.price * item.quantity
        })),
        createdAt: completeOrder!.createdAt.toISOString(),
        updatedAt: completeOrder!.updatedAt.toISOString()
      }
    }, { status: 201 })

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

    console.error("[ORDERS_POST]", error)
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// GET /api/orders - Listar pedidos do usuário
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req)
    if (!user) {
      return NextResponse.json(
        { message: "Token de autenticação inválido" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const queryParams = Object.fromEntries(searchParams.entries())
    const { status, page = 1, limit = 10 } = getOrdersQuerySchema.parse(queryParams)

    const skip = (page - 1) * limit

    // Buscar pedidos do usuário ou do estabelecimento
    const whereClause: any = user.role === 'USER' 
      ? { userId: user.userId }
      : user.role === 'ESTABLISHMENT' && user.establishmentId
        ? { establishmentId: user.establishmentId }
        : { userId: user.userId }

    if (status) {
      whereClause.status = status
    }

    const [orders, totalCount] = await Promise.all([
      prismadb.order.findMany({
        where: whereClause,
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
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prismadb.order.count({ where: whereClause })
    ])

    const formattedOrders = orders.map(order => ({
      id: order.id,
      userId: order.userId,
      userName: order.user.name,
      userPhone: order.user.phone,
      establishmentId: order.establishmentId,
      establishmentName: order.establishment.name,
      status: order.status,
      total: order.total,
      deliveryAddress: order.deliveryAddress,
      notes: order.notes,
      items: order.items.map(item => ({
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity
      })),
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString()
    }))

    return NextResponse.json({
      orders: formattedOrders,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          message: "Parâmetros inválidos",
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      )
    }

    console.error("[ORDERS_GET]", error)
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    )
  }
} 
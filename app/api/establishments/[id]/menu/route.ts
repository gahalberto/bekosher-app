import { NextRequest, NextResponse } from "next/server"
import prismadb from "@/lib/prismadb"

// GET /api/establishments/[id]/menu - Buscar cardápio de um estabelecimento
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { message: "ID do estabelecimento é obrigatório" },
        { status: 400 }
      )
    }

    // Verificar se o estabelecimento existe e está aprovado
    const establishment = await prismadb.establishment.findFirst({
      where: {
        id,
        status: 'APPROVED'
      },
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        phone: true,
        logoUrl: true,
        hasDelivery: true,
        deliveryFee: true,
        minDeliveryOrder: true,
        deliveryRadius: true
      }
    })

    if (!establishment) {
      return NextResponse.json(
        { message: "Estabelecimento não encontrado ou inativo" },
        { status: 404 }
      )
    }

    // Buscar categorias e produtos ativos
    const categories = await prismadb.category.findMany({
      where: {
        establishmentId: id
      },
      include: {
        products: {
          where: {
            isActive: true
          },
          orderBy: [
            { order: 'asc' },
            { name: 'asc' }
          ]
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    // Verificar horários de funcionamento (hoje)
    const today = new Date().getDay() // 0 = domingo, 1 = segunda, etc.
    
    const [operatingHours, deliveryHours] = await Promise.all([
      prismadb.operatingHours.findFirst({
        where: {
          establishmentId: id,
          dayOfWeek: today,
          isOpen: true
        }
      }),
      establishment.hasDelivery ? prismadb.deliveryHours.findFirst({
        where: {
          establishmentId: id,
          dayOfWeek: today,
          isOpen: true
        }
      }) : null
    ])

    // Verificar se está aberto agora
    const now = new Date()
    const currentTime = now.toTimeString().substring(0, 5) // HH:mm
    
    const isOpen = operatingHours ? 
      currentTime >= operatingHours.openTime && currentTime <= operatingHours.closeTime 
      : false

    const isDeliveryOpen = establishment.hasDelivery && deliveryHours ?
      currentTime >= deliveryHours.openTime && currentTime <= deliveryHours.closeTime
      : false

    // Formatar resposta
    const formattedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description,
      products: category.products.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl,
        isKosher: product.isKosher
      }))
    }))

    const response = {
      establishment: {
        id: establishment.id,
        name: establishment.name,
        description: establishment.description,
        address: establishment.address,
        phone: establishment.phone,
        logoUrl: establishment.logoUrl,
        hasDelivery: establishment.hasDelivery,
        deliveryFee: establishment.deliveryFee,
        minDeliveryOrder: establishment.minDeliveryOrder,
        deliveryRadius: establishment.deliveryRadius,
        isOpen,
        isDeliveryOpen: establishment.hasDelivery ? isDeliveryOpen : null,
        operatingHours: operatingHours ? {
          openTime: operatingHours.openTime,
          closeTime: operatingHours.closeTime
        } : null,
        deliveryHours: deliveryHours ? {
          openTime: deliveryHours.openTime,
          closeTime: deliveryHours.closeTime
        } : null
      },
      categories: formattedCategories,
      totalProducts: formattedCategories.reduce((total, cat) => total + cat.products.length, 0)
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error("[ESTABLISHMENT_MENU_GET]", error)
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    )
  }
} 
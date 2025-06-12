import { NextRequest, NextResponse } from "next/server"
import prismadb from "@/lib/prismadb"

// GET /api/establishments - Listar estabelecimentos disponíveis
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const hasDelivery = searchParams.get('hasDelivery')
    
    const skip = (page - 1) * limit

    // Construir filtros
    const where: any = {
      status: 'APPROVED'
    }

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive'
      }
    }

    if (hasDelivery === 'true') {
      where.hasDelivery = true
    }

    // Buscar estabelecimentos
    const [establishments, totalCount] = await Promise.all([
      prismadb.establishment.findMany({
        where,
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
          deliveryRadius: true,
          createdAt: true
        },
        orderBy: {
          name: 'asc'
        },
        skip,
        take: limit
      }),
      prismadb.establishment.count({ where })
    ])

    // Verificar horários de funcionamento para cada estabelecimento
    const today = new Date().getDay()
    const currentTime = new Date().toTimeString().substring(0, 5)

    const establishmentsWithStatus = await Promise.all(
      establishments.map(async (establishment) => {
        const operatingHours = await prismadb.operatingHours.findFirst({
          where: {
            establishmentId: establishment.id,
            dayOfWeek: today,
            isOpen: true
          }
        })

        const deliveryHours = establishment.hasDelivery 
          ? await prismadb.deliveryHours.findFirst({
              where: {
                establishmentId: establishment.id,
                dayOfWeek: today,
                isOpen: true
              }
            })
          : null

        const isOpen = operatingHours ? 
          currentTime >= operatingHours.openTime && currentTime <= operatingHours.closeTime 
          : false

        const isDeliveryOpen = establishment.hasDelivery && deliveryHours ?
          currentTime >= deliveryHours.openTime && currentTime <= deliveryHours.closeTime
          : false

        return {
          ...establishment,
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
        }
      })
    )

    return NextResponse.json({
      establishments: establishmentsWithStatus,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    })

  } catch (error) {
    console.error("[ESTABLISHMENTS_GET]", error)
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    )
  }
} 
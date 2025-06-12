import { NextRequest, NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth-utils"
import prismadb from "@/lib/prismadb"

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req)
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { hasDelivery, deliveryFee, minDeliveryOrder, deliveryRadius } = body

    const establishment = await prismadb.establishment.findFirst({
      where: {
        userId: user.userId,
      },
    })

    if (!establishment) {
      return new NextResponse("Establishment not found", { status: 404 })
    }

    const updatedEstablishment = await prismadb.establishment.update({
      where: {
        id: establishment.id,
      },
      data: {
        hasDelivery,
        deliveryFee: hasDelivery ? deliveryFee : 0,
        minDeliveryOrder: hasDelivery ? minDeliveryOrder : 0,
        deliveryRadius: hasDelivery ? deliveryRadius : 0,
      },
    })

    return NextResponse.json(updatedEstablishment)
  } catch (error) {
    console.error("[DELIVERY_SETTINGS_POST]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 
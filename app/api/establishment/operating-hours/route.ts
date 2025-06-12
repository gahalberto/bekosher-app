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
    const { hours } = body

    const establishment = await prismadb.establishment.findFirst({
      where: {
        userId: user.userId,
      },
    })

    if (!establishment) {
      return new NextResponse("Establishment not found", { status: 404 })
    }

    // Deletar horários existentes
    await prismadb.operatingHours.deleteMany({
      where: {
        establishmentId: establishment.id,
      },
    })

    // Criar novos horários
    const operatingHours = await Promise.all(
      hours.map((hour: any) =>
        prismadb.operatingHours.create({
          data: {
            establishmentId: establishment.id,
            dayOfWeek: hour.dayOfWeek,
            openTime: hour.openTime,
            closeTime: hour.closeTime,
            isOpen: hour.isOpen,
          },
        })
      )
    )

    return NextResponse.json(operatingHours)
  } catch (error) {
    console.error("[OPERATING_HOURS_POST]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 
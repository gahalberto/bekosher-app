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

    const { name, description } = body

    if (!name) {
      return new NextResponse("Name is required", { status: 400 })
    }

    const establishment = await prismadb.establishment.findFirst({
      where: {
        userId: user.userId,
      },
    })

    if (!establishment) {
      return new NextResponse("Establishment not found", { status: 404 })
    }

    const category = await prismadb.category.create({
      data: {
        name,
        description,
        establishmentId: establishment.id,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error("[CATEGORIES_POST]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req)
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const establishment = await prismadb.establishment.findFirst({
      where: {
        userId: user.userId,
      },
    })

    if (!establishment) {
      return new NextResponse("Establishment not found", { status: 404 })
    }

    const categories = await prismadb.category.findMany({
      where: {
        establishmentId: establishment.id,
      },
      include: {
        products: true,
      },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error("[CATEGORIES_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 
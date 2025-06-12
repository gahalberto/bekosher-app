import { NextRequest, NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth-utils"
import prismadb from "@/lib/prismadb"

export async function PATCH(
  req: NextRequest,
  { params }: { params: { categoryId: string } }
) {
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

    if (!params.categoryId) {
      return new NextResponse("Category id is required", { status: 400 })
    }

    const establishment = await prismadb.establishment.findFirst({
      where: {
        userId: user.userId,
      },
    })

    if (!establishment) {
      return new NextResponse("Establishment not found", { status: 404 })
    }

    const category = await prismadb.category.updateMany({
      where: {
        id: params.categoryId,
        establishmentId: establishment.id,
      },
      data: {
        name,
        description,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error("[CATEGORY_PATCH]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  try {
    const user = await getAuthenticatedUser(req)
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (!params.categoryId) {
      return new NextResponse("Category id is required", { status: 400 })
    }

    const establishment = await prismadb.establishment.findFirst({
      where: {
        userId: user.userId,
      },
    })

    if (!establishment) {
      return new NextResponse("Establishment not found", { status: 404 })
    }

    const category = await prismadb.category.deleteMany({
      where: {
        id: params.categoryId,
        establishmentId: establishment.id,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error("[CATEGORY_DELETE]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 
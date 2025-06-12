import { NextRequest, NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth-utils"
import prismadb from "@/lib/prismadb"

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req)
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }
    const formData = await req.formData()

    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const price = parseFloat(formData.get("price") as string)
    const categoryId = formData.get("categoryId") as string
    const imageUrl = formData.get("image") as string

    if (!name) {
      return new NextResponse("Name is required", { status: 400 })
    }

    if (!price) {
      return new NextResponse("Price is required", { status: 400 })
    }

    if (!categoryId) {
      return new NextResponse("Category is required", { status: 400 })
    }

    const establishment = await prismadb.establishment.findFirst({
      where: {
        userId: user.userId,
      },
    })

    if (!establishment) {
      return new NextResponse("Establishment not found", { status: 404 })
    }

    const product = await prismadb.product.create({
      data: {
        name,
        description,
        price,
        imageUrl,
        categoryId,
        establishmentId: establishment.id,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error("[PRODUCTS_POST]", error)
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

    const products = await prismadb.product.findMany({
      where: {
        establishmentId: establishment.id,
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error("[PRODUCTS_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 
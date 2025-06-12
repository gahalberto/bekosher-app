import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { auth } from "@clerk/nextjs"

export async function POST(req: Request) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const form = await req.formData()
    const file = form.get("file") as File

    if (!file) {
      return new NextResponse("No file provided", { status: 400 })
    }

    const blob = await put(file.name, file, {
      access: "public",
    })

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error("[UPLOAD_ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 
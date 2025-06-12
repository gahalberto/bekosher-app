import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { verifyJWT } from "@/lib/auth"
import prismadb from "@/lib/prismadb"
import Menu from "@/components/establishment/pages/Menu"

export default async function MenuPage() {
  const cookieStore = cookies()
  const token = cookieStore.get('auth-token')?.value

  if (!token) {
    redirect("/establishment/login")
  }

  const payload = await verifyJWT(token)
  if (!payload || payload.role !== 'ESTABLISHMENT') {
    redirect("/establishment/login")
  }

  const establishment = await prismadb.establishment.findFirst({
    where: {
      userId: payload.userId,
    },
    include: {
      categories: {
        include: {
          products: true,
        },
      },
    },
  })

  if (!establishment) {
    redirect("/establishment/onboarding")
  }

  return <Menu establishment={establishment} />
} 
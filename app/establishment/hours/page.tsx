import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { verifyJWT } from "@/lib/auth"
import prismadb from "@/lib/prismadb"
import HoursManagement from "@/components/establishment/pages/HoursManagement"

export default async function HoursPage() {
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
      operatingHours: {
        orderBy: {
          dayOfWeek: 'asc'
        }
      },
      deliveryHours: {
        orderBy: {
          dayOfWeek: 'asc'
        }
      }
    },
  })

  if (!establishment) {
    redirect("/establishment/onboarding")
  }

  return <HoursManagement establishment={establishment} />
} 
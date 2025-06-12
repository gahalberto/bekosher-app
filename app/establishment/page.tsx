import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { verifyJWT } from "@/lib/auth"
import prismadb from "@/lib/prismadb"
import EstablishmentDashboard from '@/components/establishment/EstablishmentDashboard'

export default async function EstablishmentPage() {
  const cookieStore = cookies()
  const token = cookieStore.get('auth-token')?.value

  if (!token) {
    redirect("/establishment/login")
  }

  const payload = await verifyJWT(token)
  if (!payload || payload.role !== 'ESTABLISHMENT') {
    redirect("/establishment/login")
  }

  // Buscar dados do estabelecimento
  const establishment = await prismadb.establishment.findFirst({
    where: { userId: payload.userId },
    include: {
      user: {
        select: {
          email: true,
          name: true
        }
      },
      categories: {
        include: {
          products: true
        }
      },
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
    }
  })

  if (!establishment) {
    redirect('/establishment/onboarding')
  }

  return (
    <EstablishmentDashboard 
      establishment={establishment}
      currentUser={payload}
    />
  )
} 
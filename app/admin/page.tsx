import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import AdminDashboard from '@/components/admin/AdminDashboard'

export default async function AdminPage() {
  const user = await getCurrentUser()

  if (!user || user.role !== 'ADMIN') {
    redirect('/admin/login')
  }

  // Buscar dados para o dashboard
  const [establishments, totalUsers, pendingEstablishments] = await Promise.all([
    prisma.establishment.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    }),
    prisma.user.count(),
    prisma.establishment.count({
      where: {
        status: 'PENDING'
      }
    })
  ])

  return (
    <AdminDashboard 
      establishments={establishments}
      totalUsers={totalUsers}
      pendingEstablishments={pendingEstablishments}
      currentUser={user}
    />
  )
} 
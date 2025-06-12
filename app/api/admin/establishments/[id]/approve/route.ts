import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Acesso negado' },
        { status: 403 }
      )
    }

    const establishmentId = params.id

    await prisma.establishment.update({
      where: { id: establishmentId },
      data: { status: 'APPROVED' }
    })

    return NextResponse.json({
      message: 'Estabelecimento aprovado com sucesso'
    })

  } catch (error) {
    console.error('Erro ao aprovar estabelecimento:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 
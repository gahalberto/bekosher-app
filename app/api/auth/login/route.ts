import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { verifyPassword, signJWT } from '@/lib/auth'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'ESTABLISHMENT'])
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, role } = loginSchema.parse(body)

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        establishment: true
      }
    })

    if (!user || user.role !== role) {
      return NextResponse.json(
        { message: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    // Verificar senha
    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    // Se for estabelecimento, verificar se está aprovado
    if (role === 'ESTABLISHMENT' && user.establishment) {
      if (user.establishment.status !== 'APPROVED') {
        return NextResponse.json(
          { message: 'Estabelecimento aguardando aprovação' },
          { status: 403 }
        )
      }
    }

    // Gerar JWT
    const token = signJWT({
      userId: user.id,
      email: user.email,
      role: user.role as 'ADMIN' | 'ESTABLISHMENT' | 'USER',
      establishmentId: user.establishment?.id
    })

    // Criar resposta com cookie
    const response = NextResponse.json({
      message: 'Login realizado com sucesso',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        establishmentId: user.establishment?.id
      }
    })

    // Definir cookie com configurações atualizadas
    response.cookies.set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      domain: process.env.NODE_ENV === 'production' ? '.bekosher.com.br' : undefined
    })

    return response

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Dados inválidos', errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Erro no login:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prismadb from '@/lib/prismadb'
import { verifyPassword, signJWT } from '@/lib/auth'

const loginUserSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = loginUserSchema.parse(body)

    // Buscar usuário
    const user = await prismadb.user.findUnique({
      where: { email }
    })

    if (!user || user.role !== 'USER') {
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

    // Gerar JWT
    const token = signJWT({
      userId: user.id,
      email: user.email,
      role: 'USER'
    })

    return NextResponse.json({
      message: 'Login realizado com sucesso',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role
      },
      token
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          message: 'Dados inválidos', 
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      )
    }

    console.error('Erro no login de usuário:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 
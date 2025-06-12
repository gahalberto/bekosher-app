import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prismadb from '@/lib/prismadb'
import { hashPassword, signJWT } from '@/lib/auth'

const registerUserSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  name: z.string().min(1, 'Nome é obrigatório'),
  phone: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, phone } = registerUserSchema.parse(body)

    // Verificar se o email já existe
    const existingUser = await prismadb.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email já cadastrado' },
        { status: 400 }
      )
    }

    // Hash da senha
    const hashedPassword = await hashPassword(password)

    // Criar usuário
    const user = await prismadb.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        role: 'USER'
      }
    })

    // Gerar JWT
    const token = signJWT({
      userId: user.id,
      email: user.email,
      role: 'USER'
    })

    return NextResponse.json({
      message: 'Usuário cadastrado com sucesso',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role
      },
      token
    }, { status: 201 })

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

    console.error('Erro no cadastro de usuário:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 
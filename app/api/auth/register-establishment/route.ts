import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { hashPassword } from '@/lib/auth'

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = registerSchema.parse(body)

    // Verificar se o email já existe
    const existingUser = await prisma.user.findUnique({
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

    // Criar usuário e estabelecimento
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: 'Novo Estabelecimento', // Nome temporário
        role: 'ESTABLISHMENT',
        establishment: {
          create: {
            name: 'Novo Estabelecimento',
            email,
            phone: '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            cnpj: '',
            status: 'PENDING'
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Estabelecimento cadastrado com sucesso. Aguarde aprovação.',
      userId: user.id
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Dados inválidos', errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Erro no cadastro:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getAuthenticatedUser } from '@/lib/auth-utils'
import prismadb from '@/lib/prismadb'

const updateProfileSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  phone: z.string().min(1, "Telefone é obrigatório"),
  street: z.string().min(1, "Rua é obrigatória"),
  number: z.string().min(1, "Número é obrigatório"),
  neighborhood: z.string().optional(),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(1, "Estado é obrigatório"),
  cep: z.string().min(1, "CEP é obrigatório"),
  email: z.string().email("Email inválido"),
  image: z.string().optional(),
  type: z.string().optional(),
  hasDelivery: z.boolean().optional(),
  deliveryFee: z.number().min(0).optional(),
  minDeliveryOrder: z.number().min(0).optional(),
  deliveryRadius: z.number().min(0).max(50).optional(),
})

export async function PATCH(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)

    if (!user || user.role !== 'ESTABLISHMENT') {
      return NextResponse.json(
        { message: 'Acesso negado' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const data = updateProfileSchema.parse(body)

    // Monta o endereço completo
    const address = `${data.street}, ${data.number}${data.neighborhood ? `, ${data.neighborhood}` : ''}`

    // Atualizar o estabelecimento
    await prismadb.establishment.update({
      where: { userId: user.userId },
      data: {
        name: data.name,
        description: data.description,
        phone: data.phone,
        address: address,
        zipCode: data.cep,
        city: data.city,
        state: data.state,
        logoUrl: data.image,
        hasDelivery: data.hasDelivery,
        deliveryFee: data.hasDelivery ? data.deliveryFee : 0,
        minDeliveryOrder: data.hasDelivery ? data.minDeliveryOrder : 0,
        deliveryRadius: data.hasDelivery ? data.deliveryRadius : 0,
      }
    })

    // Atualizar o email no usuário
    await prismadb.user.update({
      where: { id: user.userId },
      data: {
        email: data.email,
      }
    })

    return NextResponse.json({
      message: 'Perfil atualizado com sucesso'
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Dados inválidos', errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Erro ao atualizar perfil:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 
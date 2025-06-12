import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../lib/auth'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Criar usuário admin
  const hashedPassword = await hashPassword('admin123')
  
  const admin = await prisma.user.create({
    data: {
      email: 'admin@bekosher.com',
      password: hashedPassword,
      name: 'Administrador BeKosher',
      role: 'ADMIN',
    }
  })

  console.log('✅ Usuário admin criado:')
  console.log('   Email: admin@bekosher.com')
  console.log('   Senha: admin123')
  console.log('   ID:', admin.id)

  // Criar estabelecimento 1 - Com entrega
  const establishment1Password = await hashPassword('restaurante123')
  const establishment1User = await prisma.user.create({
    data: {
      email: 'restaurante@bekosher.com',
      password: establishment1Password,
      name: 'Restaurante Kosher Teste',
      phone: '(11) 99999-9999',
      role: 'ESTABLISHMENT',
    }
  })

  const establishment1 = await prisma.establishment.create({
    data: {
      name: 'Restaurante Kosher Delícias',
      description: 'Um restaurante kosher de alta qualidade com pratos tradicionais e modernos.',
      phone: '(11) 99999-9999',
      address: 'Rua das Delícias, 123 - Bela Vista, São Paulo - SP',
      zipCode: '01310-100',
      city: 'São Paulo',
      state: 'SP',
      status: 'APPROVED',
      hasDelivery: true,
      deliveryFee: 5.90,
      minDeliveryOrder: 30.00,
      deliveryRadius: 8.0,
      userId: establishment1User.id,
    }
  })

  // Criar estabelecimento 2 - Apenas retirada
  const establishment2Password = await hashPassword('padaria123')
  const establishment2User = await prisma.user.create({
    data: {
      email: 'padaria@bekosher.com',
      password: establishment2Password,
      name: 'Padaria Kosher Teste',
      phone: '(11) 88888-8888',
      role: 'ESTABLISHMENT',
    }
  })

  const establishment2 = await prisma.establishment.create({
    data: {
      name: 'Padaria Kosher Pão & Cia',
      description: 'Pães e doces kosher fresquinhos todos os dias',
      phone: '(11) 88888-8888',
      address: 'Av. Paulista, 456 - Jardins, São Paulo - SP',
      zipCode: '01310-200',
      city: 'São Paulo',
      state: 'SP',
      status: 'APPROVED',
      hasDelivery: false,
      deliveryFee: 0,
      minDeliveryOrder: 0,
      deliveryRadius: 0,
      userId: establishment2User.id,
    }
  })

  // Criar horários de funcionamento para estabelecimento 1
  const operatingHours1 = [
    { dayOfWeek: 0, openTime: '11:00', closeTime: '22:00', isOpen: true }, // Domingo
    { dayOfWeek: 1, openTime: '11:00', closeTime: '23:00', isOpen: true }, // Segunda
    { dayOfWeek: 2, openTime: '11:00', closeTime: '23:00', isOpen: true }, // Terça
    { dayOfWeek: 3, openTime: '11:00', closeTime: '23:00', isOpen: true }, // Quarta
    { dayOfWeek: 4, openTime: '11:00', closeTime: '23:00', isOpen: true }, // Quinta
    { dayOfWeek: 5, openTime: '11:00', closeTime: '24:00', isOpen: true }, // Sexta
    { dayOfWeek: 6, openTime: '11:00', closeTime: '24:00', isOpen: true }, // Sábado
  ]

  for (const hours of operatingHours1) {
    await prisma.operatingHours.create({
      data: {
        ...hours,
        establishmentId: establishment1.id,
      },
    })
  }

  // Criar horários de entrega para estabelecimento 1
  const deliveryHours1 = [
    { dayOfWeek: 0, openTime: '18:00', closeTime: '22:00', isOpen: true }, // Domingo
    { dayOfWeek: 1, openTime: '18:00', closeTime: '22:30', isOpen: true }, // Segunda
    { dayOfWeek: 2, openTime: '18:00', closeTime: '22:30', isOpen: true }, // Terça
    { dayOfWeek: 3, openTime: '18:00', closeTime: '22:30', isOpen: true }, // Quarta
    { dayOfWeek: 4, openTime: '18:00', closeTime: '22:30', isOpen: true }, // Quinta
    { dayOfWeek: 5, openTime: '18:00', closeTime: '23:00', isOpen: true }, // Sexta
    { dayOfWeek: 6, openTime: '18:00', closeTime: '23:00', isOpen: true }, // Sábado
  ]

  for (const hours of deliveryHours1) {
    await prisma.deliveryHours.create({
      data: {
        ...hours,
        establishmentId: establishment1.id,
      },
    })
  }

  // Criar horários de funcionamento para estabelecimento 2
  const operatingHours2 = [
    { dayOfWeek: 0, openTime: '08:00', closeTime: '18:00', isOpen: true }, // Domingo
    { dayOfWeek: 1, openTime: '06:00', closeTime: '20:00', isOpen: true }, // Segunda
    { dayOfWeek: 2, openTime: '06:00', closeTime: '20:00', isOpen: true }, // Terça
    { dayOfWeek: 3, openTime: '06:00', closeTime: '20:00', isOpen: true }, // Quarta
    { dayOfWeek: 4, openTime: '06:00', closeTime: '20:00', isOpen: true }, // Quinta
    { dayOfWeek: 5, openTime: '06:00', closeTime: '20:00', isOpen: true }, // Sexta
    { dayOfWeek: 6, openTime: '08:00', closeTime: '18:00', isOpen: true }, // Sábado
  ]

  for (const hours of operatingHours2) {
    await prisma.operatingHours.create({
      data: {
        ...hours,
        establishmentId: establishment2.id,
      },
    })
  }

  console.log('✅ Estabelecimentos criados:')
  console.log('   1. Restaurante Kosher Delícias (com entrega)')
  console.log('      Email: restaurante@bekosher.com | Senha: restaurante123')
  console.log('   2. Padaria Kosher Pão & Cia (apenas retirada)')
  console.log('      Email: padaria@bekosher.com | Senha: padaria123')

  console.log('🎉 Seed concluído!')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 
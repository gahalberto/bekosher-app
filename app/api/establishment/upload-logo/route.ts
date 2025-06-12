import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== 'ESTABLISHMENT') {
      return NextResponse.json(
        { message: 'Acesso negado' },
        { status: 403 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { message: 'Nenhum arquivo enviado' },
        { status: 400 }
      )
    }

    // Validar o tipo do arquivo
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { message: 'O arquivo deve ser uma imagem' },
        { status: 400 }
      )
    }

    // Gerar um nome único para o arquivo
    const fileExtension = path.extname(file.name)
    const fileName = `${user.userId}${fileExtension}`
    const filePath = path.join(process.cwd(), 'public', 'images', 'establishments', 'logos', fileName)

    // Converter o arquivo para buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Salvar o arquivo
    await writeFile(filePath, buffer)

    // Retornar o caminho relativo da imagem
    const imageUrl = `/images/establishments/logos/${fileName}`
    
    return NextResponse.json({
      message: 'Logo enviada com sucesso',
      imageUrl
    })

  } catch (error) {
    console.error('Erro ao fazer upload da logo:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 
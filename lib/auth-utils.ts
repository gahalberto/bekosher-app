import { NextRequest } from 'next/server'
import { verifyJWT } from '@/lib/auth'

export async function getAuthenticatedUser(request: NextRequest) {
  try {
    // Tentar pegar do header Authorization
    const authHeader = request.headers.get('authorization')
    let token: string | null = null
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7)
    } else {
      // Tentar pegar dos cookies
      const cookieHeader = request.headers.get('cookie')
      if (cookieHeader) {
        const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
          const [key, value] = cookie.trim().split('=')
          acc[key] = value
          return acc
        }, {} as Record<string, string>)
        
        token = cookies['auth-token']
      }
    }

    if (!token) {
      return null
    }

    const payload = await verifyJWT(token)
    return payload
  } catch (error) {
    console.error('Erro ao verificar token:', error)
    return null
  }
} 
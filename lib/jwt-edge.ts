import { SignJWT, jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key'
const secret = new TextEncoder().encode(JWT_SECRET)

export interface CustomJWTPayload {
  userId: string
  email: string
  role: 'ADMIN' | 'ESTABLISHMENT' | 'USER'
  establishmentId?: string
}

export async function signJWTEdge(payload: CustomJWTPayload): Promise<string> {
  return await new SignJWT(payload as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)
}

export async function verifyJWTEdge(token: string): Promise<CustomJWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    
    // Verificar se o payload tem os campos necessários
    if (!payload.userId || !payload.email || !payload.role) {
      console.error('❌ JWT inválido: payload incompleto')
      return null
    }

    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as 'ADMIN' | 'ESTABLISHMENT' | 'USER',
      establishmentId: payload.establishmentId as string | undefined
    }
  } catch (error) {
    console.error('❌ Erro na verificação do JWT:', error instanceof Error ? error.message : 'Token corrompido')
    return null
  }
} 
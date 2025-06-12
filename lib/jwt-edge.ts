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
    return payload as unknown as CustomJWTPayload
  } catch (error) {
    console.log('❌ JWT inválido (Edge):', error instanceof Error ? error.message : 'Token corrompido')
    return null
  }
} 
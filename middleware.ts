import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyJWTEdge } from './lib/jwt-edge'

async function getTokenFromRequest(request: NextRequest): Promise<string | null> {
  // Tentar pegar do header Authorization
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  // Tentar pegar dos cookies
  const token = request.cookies.get('auth-token')?.value
  return token || null
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Permitir todas as rotas de API
  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Rotas públicas (não precisam de autenticação)
  const publicRoutes = ['/admin/login', '/establishment/login', '/login']
  const isPublicRoute = publicRoutes.some(route => pathname === route)

  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Rotas que precisam de autenticação
  const protectedRoutes = ['/admin', '/establishment']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  // Verificar token
  const token = await getTokenFromRequest(request)
  
  if (!token) {
    const loginUrl = pathname.startsWith('/admin') 
      ? '/admin/login' 
      : '/establishment/login'
    return NextResponse.redirect(new URL(loginUrl, request.url))
  }

  try {
    const payload = await verifyJWTEdge(token)
    
    if (!payload) {
      const loginUrl = pathname.startsWith('/admin') 
        ? '/admin/login' 
        : '/establishment/login'
      return NextResponse.redirect(new URL(loginUrl, request.url))
    }

    // Verificar permissões por role
    if (pathname.startsWith('/admin') && payload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    if (pathname.startsWith('/establishment') && payload.role !== 'ESTABLISHMENT') {
      return NextResponse.redirect(new URL('/establishment/login', request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Erro na verificação do token:', error)
    const loginUrl = pathname.startsWith('/admin') 
      ? '/admin/login' 
      : '/establishment/login'
    return NextResponse.redirect(new URL(loginUrl, request.url))
  }
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/establishment/:path*',
    '/api/:path*'
  ]
} 
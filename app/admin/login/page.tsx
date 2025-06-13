'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import BeKosherLogo from "@/components/ui/BeKosherLogo"

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          role: 'ADMIN'
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Aguardar um pouco para garantir que o cookie seja definido
        setTimeout(() => {
          window.location.href = '/admin'
        }, 100)
      } else {
        setError(data.message || 'Erro ao fazer login')
      }
    } catch {
      setError('Erro de conexão')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center mb-8">
          <BeKosherLogo width={200} height={77} />
        </div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-purple-600">BeKosher Admin</CardTitle>
            <CardDescription>
              Acesso administrativo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="seu@email.com"
                />
              </div>
              <div>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
              </div>
              {error && (
                <div className="text-red-600 text-sm text-center">
                  {error}
                </div>
              )}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <div className="text-center">
          <Link href="/" className="text-purple-600 hover:underline">
            ← Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  )
} 
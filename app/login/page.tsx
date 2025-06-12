import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="w-full max-w-md space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-purple-600">BeKosher</CardTitle>
            <CardDescription>
              Escolha como deseja fazer login
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full h-12">
              <Link href="/admin/login">
                Login Administrador
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full h-12">
              <Link href="/establishment/login">
                Login Estabelecimento
              </Link>
            </Button>
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
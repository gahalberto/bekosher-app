import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import BeKosherLogo from "@/components/ui/BeKosherLogo"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <BeKosherLogo width={180} height={60} />
            </div>
            <div className="flex space-x-4">
              <Button variant="outline" asChild>
                <Link href="/establishment/login">Login Estabelecimento</Link>
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700" asChild>
                <Link href="/admin/login">Login Admin</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-8">
            <BeKosherLogo width={500} height={180} className="max-w-full h-auto" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
            A plataforma completa para 
            <span className="text-red-500"> certificação kosher</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-4xl mx-auto">
            Conectando estabelecimentos, supervisores e consumidores em um só lugar.
            Gerencie certificações, cardápios e eventos com facilidade e confiança.
          </p>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏪</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Para Estabelecimentos</h3>
              <p className="text-gray-600">Gerencie seu cardápio, eventos e obtenha certificação kosher</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Para Administradores</h3>
              <p className="text-gray-600">Supervisione certificações e gerencie a plataforma</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Certificação Confiável</h3>
              <p className="text-gray-600">Processo rigoroso de aprovação e monitoramento contínuo</p>
            </div>
          </div>
        </div>
      </section>

      {/* Login Cards Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Acesse sua Conta
            </h3>
            <p className="text-lg text-gray-600">
              Escolha seu tipo de acesso para começar
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-8 border-2 hover:border-purple-200 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <span className="text-3xl">👔</span>
                  Administradores
                </CardTitle>
                <CardDescription className="text-base">
                  Gerencie estabelecimentos e supervise certificações kosher
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/admin/login">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700" size="lg">
                    Acesso Administrativo
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="p-8 border-2 hover:border-red-200 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <span className="text-3xl">🏪</span>
                  Estabelecimentos
                </CardTitle>
                <CardDescription className="text-base">
                  Cadastre seu estabelecimento e obtenha certificação kosher
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/establishment/login">
                  <Button className="w-full" variant="outline" size="lg">
                    Fazer Login
                  </Button>
                </Link>
                <Link href="/establishment/register">
                  <Button className="w-full bg-red-500 hover:bg-red-600" size="lg">
                    Cadastrar Estabelecimento
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Details Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Funcionalidades da Plataforma
            </h3>
            <p className="text-lg text-gray-600">
              Tudo que você precisa para gerenciar seu negócio kosher
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-xl">📋</span>
                  Gestão de Cardápio
                </CardTitle>
                <CardDescription>
                  Organize seus pratos e produtos com facilidade
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Interface intuitiva para adicionar, editar e organizar seu cardápio kosher com categorias e preços.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-xl">🎉</span>
                  Eventos Especiais
                </CardTitle>
                <CardDescription>
                  Divulgue seus eventos kosher
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Promova jantares de Shabat, festivais e eventos especiais da comunidade kosher.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-xl">⚡</span>
                  Processo Simplificado
                </CardTitle>
                <CardDescription>
                  Aprovação administrativa eficiente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Cadastre-se facilmente e aguarde a aprovação da nossa equipe especializada.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <BeKosherLogo width={200} height={70} className="brightness-0 invert" />
            </div>
            <p className="text-gray-400 mb-4">
              Conectando estabelecimentos kosher com a comunidade
            </p>
            <p className="text-sm text-gray-500">
              © 2024 BeKosher. Garantindo qualidade e confiança na alimentação kosher.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
} 
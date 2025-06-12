'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { JWTPayload } from "@/lib/auth"
import { 
  ChartBarIcon, 
  BuildingStorefrontIcon, 
  UsersIcon, 
  DocumentChartBarIcon,
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'
import BeKosherLogo from "@/components/ui/BeKosherLogo"

interface AdminDashboardProps {
  establishments: any[]
  totalUsers: number
  pendingEstablishments: number
  currentUser: JWTPayload
}

export default function AdminDashboard({ 
  establishments, 
  totalUsers, 
  pendingEstablishments,
  currentUser 
}: AdminDashboardProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [activeAdminTab, setActiveAdminTab] = useState('dashboard')
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleApproveEstablishment = async (establishmentId: string) => {
    setLoading(establishmentId)
    try {
      const response = await fetch(`/api/admin/establishments/${establishmentId}/approve`, {
        method: 'PATCH',
      })

      if (response.ok) {
        window.location.reload()
      } else {
        alert('Erro ao aprovar estabelecimento')
      }
    } catch {
      alert('Erro ao aprovar estabelecimento')
    } finally {
      setLoading(null)
    }
  }

  const handleRejectEstablishment = async (establishmentId: string) => {
    setLoading(establishmentId)
    try {
      const response = await fetch(`/api/admin/establishments/${establishmentId}/reject`, {
        method: 'PATCH',
      })

      if (response.ok) {
        window.location.reload()
      } else {
        alert('Erro ao rejeitar estabelecimento')
      }
    } catch {
      alert('Erro ao rejeitar estabelecimento')
    } finally {
      setLoading(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      PENDING: { label: 'Pendente', variant: 'outline' as const },
      APPROVED: { label: 'Aprovado', variant: 'default' as const },
      REJECTED: { label: 'Rejeitado', variant: 'destructive' as const },
      SUSPENDED: { label: 'Suspenso', variant: 'secondary' as const },
    }
    
    const statusConfig = statusMap[status as keyof typeof statusMap] || statusMap.PENDING
    return <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      window.location.href = '/admin/login'
    } catch {
      window.location.href = '/admin/login'
    }
  }

  const adminTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: ChartBarIcon },
    { id: 'establishments', label: 'Estabelecimentos', icon: BuildingStorefrontIcon },
    { id: 'users', label: 'Usuários', icon: UsersIcon },
    { id: 'reports', label: 'Relatórios', icon: DocumentChartBarIcon },
  ]

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar Vertical - Menu Esquerdo */}
      <div className={`bg-white shadow-lg border-r h-full flex flex-col transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-60'}`}>
        <div className={`p-4 border-b bg-gray-900 ${isCollapsed ? 'items-center' : ''}`}>
          <div className={`flex ${isCollapsed ? 'justify-center' : ''} mb-4`}>
            {isCollapsed ? (
              <img src="/images/minimalist-logo.svg" alt="BeKosher" className="w-10 h-10" />
            ) : (
              <BeKosherLogo width={120} height={46} />
            )}
          </div>
          {!isCollapsed && (
            <p className="text-gray-300 text-xs mt-1">Administrador</p>
          )}
        </div>
        <nav className="flex-1 p-3">
          <div className="space-y-2">
            {adminTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveAdminTab(tab.id)}
                title={isCollapsed ? tab.label : undefined}
                className={`w-full text-left px-3 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                  activeAdminTab === tab.id
                    ? 'bg-gray-100 text-gray-900 border-l-4 border-gray-900 shadow-sm transform scale-105'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm hover:transform hover:scale-102'
                }`}
              >
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''} space-x-3`}>
                  <tab.icon className={`${isCollapsed ? 'h-6 w-6' : 'h-5 w-5'}`} />
                  {!isCollapsed && <span className="text-sm">{tab.label}</span>}
                </div>
              </button>
            ))}
          </div>
        </nav>
        <div className="p-3 border-t">
          <div className="flex flex-col gap-2">
            <Button 
              onClick={() => setIsCollapsed(!isCollapsed)} 
              variant="outline" 
              className="w-full"
              title={isCollapsed ? "Expandir menu" : "Recolher menu"}
            >
              {isCollapsed ? (
                <ChevronRightIcon className="h-6 w-6" />
              ) : (
                <>
                  <ChevronLeftIcon className="h-5 w-5 mr-2" />
                  Recolher menu
                </>
              )}
            </Button>
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              className="w-full"
              title={isCollapsed ? "Sair" : undefined}
            >
              {isCollapsed ? (
                <ArrowRightOnRectangleIcon className="h-6 w-6" />
              ) : (
                <>
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                  Sair
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-auto bg-gray-50">
        {/* Tab Content */}
        {activeAdminTab === 'dashboard' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total de Usuários</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">{totalUsers}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estabelecimentos Pendentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">{pendingEstablishments}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Total de Estabelecimentos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{establishments.length}</div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeAdminTab === 'establishments' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Estabelecimentos</h2>
            
            {/* Establishments Table */}
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Estabelecimentos</CardTitle>
                <CardDescription>
                  Gerencie os estabelecimentos cadastrados na plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Nome</th>
                        <th className="text-left py-3 px-4">Email</th>
                        <th className="text-left py-3 px-4">CNPJ</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Data de Cadastro</th>
                        <th className="text-left py-3 px-4">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {establishments.map((establishment) => (
                        <tr key={establishment.id} className="border-b">
                          <td className="py-3 px-4 font-medium">{establishment.name}</td>
                          <td className="py-3 px-4">{establishment.email}</td>
                          <td className="py-3 px-4">{establishment.cnpj || 'Não informado'}</td>
                          <td className="py-3 px-4">{getStatusBadge(establishment.status)}</td>
                          <td className="py-3 px-4">
                            {new Date(establishment.createdAt).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="py-3 px-4">
                            {establishment.status === 'PENDING' && (
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleApproveEstablishment(establishment.id)}
                                  disabled={loading === establishment.id}
                                >
                                  {loading === establishment.id ? 'Processando...' : 'Aprovar'}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleRejectEstablishment(establishment.id)}
                                  disabled={loading === establishment.id}
                                >
                                  {loading === establishment.id ? 'Processando...' : 'Rejeitar'}
                                </Button>
                              </div>
                            )}
                            {establishment.status === 'APPROVED' && (
                              <Badge variant="default">Aprovado</Badge>
                            )}
                            {establishment.status === 'REJECTED' && (
                              <Badge variant="destructive">Rejeitado</Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeAdminTab === 'users' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Usuários</h2>
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Usuários</CardTitle>
                <CardDescription>
                  Visualize e gerencie todos os usuários da plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">Funcionalidade em desenvolvimento</p>
                  <p className="text-sm text-gray-400">Total de usuários: {totalUsers}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeAdminTab === 'reports' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Relatórios</h2>
            <Card>
              <CardHeader>
                <CardTitle>Relatórios e Analytics</CardTitle>
                <CardDescription>
                  Visualize dados e estatísticas da plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">Funcionalidade em desenvolvimento</p>
                  <p className="text-sm text-gray-400">Relatórios detalhados em breve</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
} 
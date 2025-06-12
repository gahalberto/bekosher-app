'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { JWTPayload } from "@/lib/auth"
import BeKosherLogo from '@/components/ui/BeKosherLogo'
import { 
  HomeIcon, 
  UserIcon, 
  DocumentTextIcon, 
  CalendarIcon, 
  ShoppingBagIcon,
  ClockIcon,
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'
import Overview from './pages/Overview'
import Profile from './pages/Profile'
import Menu from './pages/Menu'
import Events from './pages/Events'
import Orders from './pages/Orders'
import HoursManagement from './pages/HoursManagement'

interface EstablishmentDashboardProps {
  establishment: any
  currentUser: JWTPayload
}

export default function EstablishmentDashboard({ 
  establishment, 
  currentUser 
}: EstablishmentDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      window.location.href = '/establishment/login'
    } catch {
      window.location.href = '/establishment/login'
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      PENDING: { label: 'Aguardando Aprovação', variant: 'outline' as const },
      APPROVED: { label: 'Aprovado', variant: 'default' as const },
      REJECTED: { label: 'Rejeitado', variant: 'destructive' as const },
      SUSPENDED: { label: 'Suspenso', variant: 'secondary' as const },
    }
    
    const statusConfig = statusMap[status as keyof typeof statusMap] || statusMap.PENDING
    return <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
  }

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: HomeIcon },
    { id: 'profile', label: 'Perfil', icon: UserIcon },
    { id: 'menu', label: 'Cardápio', icon: DocumentTextIcon },
    { id: 'hours', label: 'Horários', icon: ClockIcon },
    { id: 'events', label: 'Eventos', icon: CalendarIcon },
    { id: 'orders', label: 'Pedidos', icon: ShoppingBagIcon },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview establishment={establishment} />
      case 'profile':
        return <Profile establishment={establishment} />
      case 'menu':
        return <Menu establishment={establishment} />
      case 'hours':
        return <HoursManagement establishment={establishment} />
      case 'events':
        return <Events establishment={establishment} />
      case 'orders':
        return <Orders establishment={establishment} />
      default:
        return <Overview establishment={establishment} />
    }
  }

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
            <>
              <p className="text-gray-300 text-xs mt-1">{establishment.name}</p>
              <div className="mt-2">
                {getStatusBadge(establishment.status)}
              </div>
            </>
          )}
        </div>
        <nav className="flex-1 p-3">
          <div className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                title={isCollapsed ? tab.label : undefined}
                className={`w-full text-left px-3 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                  activeTab === tab.id
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
        {renderContent()}
      </div>
    </div>
  )
} 
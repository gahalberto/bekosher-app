import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface OverviewProps {
  establishment: any
}

export default function Overview({ establishment }: OverviewProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Visão Geral</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total de Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {establishment.categories?.reduce((total: number, cat: any) => total + cat.products.length, 0) || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Eventos Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {establishment.events?.filter((event: any) => event.isActive).length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pedidos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {establishment.orders?.length || 0}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
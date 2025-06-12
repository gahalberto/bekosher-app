import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface OrdersProps {
  establishment: any
}

export default function Orders({ establishment }: OrdersProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Pedidos</h2>
      <Card>
        <CardHeader>
          <CardTitle>Pedidos Recentes</CardTitle>
          <CardDescription>
            Acompanhe os pedidos do seu estabelecimento
          </CardDescription>
        </CardHeader>
        <CardContent>
          {establishment.orders && establishment.orders.length > 0 ? (
            <div className="space-y-4">
              {establishment.orders.map((order: any) => (
                <div key={order.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">Pedido #{order.id.slice(-8)}</p>
                      <p className="text-sm text-gray-600">{order.user?.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">R$ {order.total.toFixed(2)}</p>
                      <Badge variant="outline">{order.status}</Badge>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString('pt-BR')} às{' '}
                    {new Date(order.createdAt).toLocaleTimeString('pt-BR')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhum pedido encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 
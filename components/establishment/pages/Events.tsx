import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface EventsProps {
  establishment: any
}

export default function Events({ establishment }: EventsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Eventos</h2>
      <Card>
        <CardHeader>
          <CardTitle>Eventos</CardTitle>
          <CardDescription>
            Gerencie os eventos do seu estabelecimento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Funcionalidade em desenvolvimento</p>
            <Button disabled>Criar Evento</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
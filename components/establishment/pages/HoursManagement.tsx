"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Clock, Truck, Store } from "lucide-react"

interface OperatingHours {
  id: string
  dayOfWeek: number
  openTime: string
  closeTime: string
  isOpen: boolean
}

interface DeliveryHours {
  id: string
  dayOfWeek: number
  openTime: string
  closeTime: string
  isOpen: boolean
}

interface Establishment {
  id: string
  name: string
  hasDelivery: boolean
  deliveryFee: number | null
  minDeliveryOrder: number | null
  deliveryRadius: number | null
  operatingHours: OperatingHours[]
  deliveryHours: DeliveryHours[]
}

interface HoursManagementProps {
  establishment: Establishment
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Segunda-feira' },
  { value: 2, label: 'Terça-feira' },
  { value: 3, label: 'Quarta-feira' },
  { value: 4, label: 'Quinta-feira' },
  { value: 5, label: 'Sexta-feira' },
  { value: 6, label: 'Sábado' },
]

export default function HoursManagement({ establishment }: HoursManagementProps) {
  const { toast } = useToast()
  const [hasDelivery, setHasDelivery] = useState(establishment.hasDelivery)
  const [deliveryFee, setDeliveryFee] = useState(establishment.deliveryFee?.toString() || "0")
  const [minDeliveryOrder, setMinDeliveryOrder] = useState(establishment.minDeliveryOrder?.toString() || "0")
  const [deliveryRadius, setDeliveryRadius] = useState(establishment.deliveryRadius?.toString() || "5")
  
  // Estados para horários de funcionamento
  const [operatingHours, setOperatingHours] = useState<OperatingHours[]>(
    DAYS_OF_WEEK.map(day => {
      const existingHour = establishment.operatingHours.find(h => h.dayOfWeek === day.value)
      return existingHour || {
        id: '',
        dayOfWeek: day.value,
        openTime: '09:00',
        closeTime: '18:00',
        isOpen: true
      }
    })
  )

  // Estados para horários de entrega
  const [deliveryHours, setDeliveryHours] = useState<DeliveryHours[]>(
    DAYS_OF_WEEK.map(day => {
      const existingHour = establishment.deliveryHours.find(h => h.dayOfWeek === day.value)
      return existingHour || {
        id: '',
        dayOfWeek: day.value,
        openTime: '18:00',
        closeTime: '22:00',
        isOpen: true
      }
    })
  )

  const handleOperatingHourChange = (dayIndex: number, field: keyof OperatingHours, value: string | boolean) => {
    setOperatingHours(prev => prev.map((hour, index) => 
      index === dayIndex ? { ...hour, [field]: value } : hour
    ))
  }

  const handleDeliveryHourChange = (dayIndex: number, field: keyof DeliveryHours, value: string | boolean) => {
    setDeliveryHours(prev => prev.map((hour, index) => 
      index === dayIndex ? { ...hour, [field]: value } : hour
    ))
  }

  const handleSaveDeliverySettings = async () => {
    try {
      const response = await fetch(`/api/establishment/delivery-settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hasDelivery,
          deliveryFee: parseFloat(deliveryFee),
          minDeliveryOrder: parseFloat(minDeliveryOrder),
          deliveryRadius: parseFloat(deliveryRadius),
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar configurações de entrega')
      }

      toast({
        title: "Sucesso",
        description: "Configurações de entrega atualizadas!",
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar configurações de entrega",
        variant: "destructive",
      })
    }
  }

  const handleSaveOperatingHours = async () => {
    try {
      const response = await fetch(`/api/establishment/operating-hours`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hours: operatingHours }),
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar horários de funcionamento')
      }

      toast({
        title: "Sucesso",
        description: "Horários de funcionamento atualizados!",
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar horários de funcionamento",
        variant: "destructive",
      })
    }
  }

  const handleSaveDeliveryHours = async () => {
    try {
      const response = await fetch(`/api/establishment/delivery-hours`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hours: deliveryHours }),
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar horários de entrega')
      }

      toast({
        title: "Sucesso",
        description: "Horários de entrega atualizados!",
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar horários de entrega",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Clock className="h-6 w-6" />
        <h2 className="text-2xl font-bold text-gray-900">Horários e Entrega</h2>
      </div>

      {/* Configurações de Entrega */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Truck className="h-5 w-5" />
            <span>Configurações de Entrega</span>
          </CardTitle>
          <CardDescription>
            Configure se seu estabelecimento faz entregas e as condições
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="hasDelivery"
              checked={hasDelivery}
              onChange={(e) => setHasDelivery(e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="hasDelivery">Fazer entregas</Label>
          </div>

          {hasDelivery && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="deliveryFee">Taxa de Entrega (R$)</Label>
                <Input
                  id="deliveryFee"
                  type="number"
                  step="0.01"
                  min="0"
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="minDeliveryOrder">Pedido Mínimo (R$)</Label>
                <Input
                  id="minDeliveryOrder"
                  type="number"
                  step="0.01"
                  min="0"
                  value={minDeliveryOrder}
                  onChange={(e) => setMinDeliveryOrder(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="deliveryRadius">Raio de Entrega (km)</Label>
                <Input
                  id="deliveryRadius"
                  type="number"
                  step="0.5"
                  min="0"
                  value={deliveryRadius}
                  onChange={(e) => setDeliveryRadius(e.target.value)}
                  placeholder="5.0"
                />
              </div>
            </div>
          )}

          <Button onClick={handleSaveDeliverySettings}>
            Salvar Configurações
          </Button>
        </CardContent>
      </Card>

      {/* Horários de Funcionamento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Store className="h-5 w-5" />
            <span>Horários de Funcionamento</span>
          </CardTitle>
          <CardDescription>
            Configure os horários que seu estabelecimento estará aberto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {DAYS_OF_WEEK.map((day, index) => (
              <div key={day.value} className="flex items-center space-x-4">
                <div className="w-32">
                  <Label>{day.label}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={operatingHours[index].isOpen}
                    onChange={(e) => handleOperatingHourChange(index, 'isOpen', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">Aberto</span>
                </div>
                {operatingHours[index].isOpen && (
                  <>
                    <div>
                      <Input
                        type="time"
                        value={operatingHours[index].openTime}
                        onChange={(e) => handleOperatingHourChange(index, 'openTime', e.target.value)}
                        className="w-32"
                      />
                    </div>
                    <span className="text-sm">às</span>
                    <div>
                      <Input
                        type="time"
                        value={operatingHours[index].closeTime}
                        onChange={(e) => handleOperatingHourChange(index, 'closeTime', e.target.value)}
                        className="w-32"
                      />
                    </div>
                  </>
                )}
              </div>
            ))}
            <Button onClick={handleSaveOperatingHours}>
              Salvar Horários de Funcionamento
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Horários de Entrega */}
      {hasDelivery && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Truck className="h-5 w-5" />
              <span>Horários de Entrega</span>
            </CardTitle>
            <CardDescription>
              Configure os horários específicos para entregas (podem ser diferentes do funcionamento)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {DAYS_OF_WEEK.map((day, index) => (
                <div key={day.value} className="flex items-center space-x-4">
                  <div className="w-32">
                    <Label>{day.label}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={deliveryHours[index].isOpen}
                      onChange={(e) => handleDeliveryHourChange(index, 'isOpen', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">Entrega</span>
                  </div>
                  {deliveryHours[index].isOpen && (
                    <>
                      <div>
                        <Input
                          type="time"
                          value={deliveryHours[index].openTime}
                          onChange={(e) => handleDeliveryHourChange(index, 'openTime', e.target.value)}
                          className="w-32"
                        />
                      </div>
                      <span className="text-sm">às</span>
                      <div>
                        <Input
                          type="time"
                          value={deliveryHours[index].closeTime}
                          onChange={(e) => handleDeliveryHourChange(index, 'closeTime', e.target.value)}
                          className="w-32"
                        />
                      </div>
                    </>
                  )}
                </div>
              ))}
              <Button onClick={handleSaveDeliveryHours}>
                Salvar Horários de Entrega
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 
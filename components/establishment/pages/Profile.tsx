import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { establishmentFormSchema, establishmentTypeEnum, establishmentTypeLabels, type EstablishmentFormData } from "@/lib/types/establishment"
import { useToast } from "@/components/ui/use-toast"

interface ProfileProps {
  establishment: any
}

export default function Profile({ establishment }: ProfileProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingCep, setIsLoadingCep] = useState(false)
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const [previewImage, setPreviewImage] = useState<string>(establishment.logoUrl || "")
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EstablishmentFormData>({
    resolver: zodResolver(establishmentFormSchema),
    defaultValues: {
      name: "",
      type: establishmentTypeEnum.RESTAURANT,
      cep: "",
      street: "",
      number: "",
      neighborhood: "",
      city: "",
      state: "",
      phone: "",
      email: "",
      description: "",
      image: "",
      hasDelivery: true,
      deliveryFee: 0,
      minDeliveryOrder: 0,
      deliveryRadius: 5,
    },
  })

  useEffect(() => {
    // Atualiza os campos quando o establishment mudar
    if (establishment) {
      setValue("name", establishment.name || "")
      setValue("type", establishment.type || establishmentTypeEnum.RESTAURANT)
      setValue("cep", establishment.zipCode || "")
      setValue("phone", establishment.phone || "")
      setValue("email", establishment.user?.email || "")
      setValue("description", establishment.description || "")
      setValue("image", establishment.logoUrl || "")
      setValue("city", establishment.city || "")
      setValue("state", establishment.state || "")
      setValue("hasDelivery", establishment.hasDelivery ?? true)
      setValue("deliveryFee", establishment.deliveryFee ?? 0)
      setValue("minDeliveryOrder", establishment.minDeliveryOrder ?? 0)
      setValue("deliveryRadius", establishment.deliveryRadius ?? 5)

      // Processa o endereço
      const addressParts = establishment.address?.split(',').map((part: string) => part.trim()) || []
      setValue("street", addressParts[0] || "")
      setValue("number", addressParts[1] || "")
      setValue("neighborhood", addressParts[2] || "")
    }
  }, [establishment, setValue])

  const cep = watch("cep")

  // Função para formatar o CEP
  const formatCep = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 5) {
      return numbers
    }
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`
  }

  // Função para formatar o telefone
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 2) {
      return numbers
    }
    if (numbers.length <= 6) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    }
    if (numbers.length <= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`
    }
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
  }

  // Função para formatar o CNPJ
  const formatCnpj = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      "$1.$2.$3/$4-$5"
    )
  }

  // Função para buscar o CEP
  const fetchAddress = async (cep: string) => {
    if (cep.length === 8) {
      setIsLoadingCep(true)
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
        const data = await response.json()

        if (!data.erro) {
          setValue("street", data.logradouro)
          setValue("neighborhood", data.bairro)
          setValue("city", data.localidade)
          setValue("state", data.uf)
        } else {
          toast({
            title: "Erro",
            description: "CEP não encontrado",
            variant: "destructive"
          })
        }
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao buscar CEP",
          variant: "destructive"
        })
      } finally {
        setIsLoadingCep(false)
      }
    }
  }

  // Efeito para monitorar mudanças no CEP
  useEffect(() => {
    const cepNumbers = cep?.replace(/\D/g, "")
    if (cepNumbers?.length === 8) {
      fetchAddress(cepNumbers)
    }
  }, [cep, setValue])

  const onSubmit = async (data: EstablishmentFormData) => {
    setIsLoading(true)
    console.log('Iniciando submissão do formulário:', data)
    try {
      const response = await fetch("/api/establishment/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()
      console.log('Resposta da API:', responseData)

      if (response.ok) {
        toast({
          title: "Sucesso!",
          description: responseData.message || "Perfil atualizado com sucesso!",
          variant: "success",
          duration: 3000,
        })
        // Atualiza os dados do estabelecimento no formulário
        if (establishment) {
          establishment.name = data.name
          establishment.type = data.type
          establishment.phone = data.phone
          establishment.description = data.description
          establishment.logoUrl = data.image
          establishment.hasDelivery = data.hasDelivery
          establishment.deliveryFee = data.deliveryFee
          establishment.minDeliveryOrder = data.minDeliveryOrder
          establishment.deliveryRadius = data.deliveryRadius
          establishment.address = `${data.street}, ${data.number}${data.neighborhood ? `, ${data.neighborhood}` : ''}`
        }
      } else {
        console.error('Erro na resposta:', responseData)
        toast({
          title: "Erro",
          description: responseData.message || "Erro ao atualizar perfil",
          variant: "destructive",
          duration: 3000,
        })
      }
    } catch (error) {
      console.error('Erro ao fazer requisição:', error)
      toast({
        title: "Erro",
        description: "Erro ao atualizar perfil",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Função para fazer upload da logo
  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar o tipo do arquivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erro",
        description: "O arquivo deve ser uma imagem",
        variant: "destructive",
      })
      return
    }

    // Validar o tamanho do arquivo (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erro",
        description: "A imagem deve ter no máximo 5MB",
        variant: "destructive",
      })
      return
    }

    try {
      setIsUploadingLogo(true)

      // Criar preview da imagem
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Criar FormData
      const formData = new FormData()
      formData.append('file', file)

      // Enviar para o servidor
      const response = await fetch('/api/establishment/upload-logo', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Sucesso!",
          description: "Logo enviada com sucesso",
          variant: "success",
        })
        setValue('image', data.imageUrl)
      } else {
        toast({
          title: "Erro",
          description: data.message || "Erro ao enviar logo",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      toast({
        title: "Erro",
        description: "Erro ao enviar logo",
        variant: "destructive",
      })
    } finally {
      setIsUploadingLogo(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Perfil do Estabelecimento</h2>
      <Card>
        <CardHeader>
          <CardTitle>Informações do Estabelecimento</CardTitle>
          <CardDescription>
            Complete suas informações para ser aprovado na plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Estabelecimento</Label>
                <Input
                  id="name"
                  {...register("name")}
                  error={errors.name?.message}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <Select
                  defaultValue={establishment.type || establishmentTypeEnum.RESTAURANT}
                  onValueChange={(value) => setValue("type", value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(establishmentTypeLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cep">CEP</Label>
                <div className="relative">
                  <Input
                    id="cep"
                    {...register("cep", {
                      onChange: (e) => {
                        const formatted = formatCep(e.target.value)
                        setValue("cep", formatted)
                      }
                    })}
                    placeholder="00000-000"
                    maxLength={9}
                    error={errors.cep?.message}
                  />
                  {isLoadingCep && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="street">Rua</Label>
                <Input
                  id="street"
                  {...register("street")}
                  error={errors.street?.message}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="number">Número</Label>
                <Input
                  id="number"
                  {...register("number")}
                  error={errors.number?.message}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="neighborhood">Bairro</Label>
                <Input
                  id="neighborhood"
                  {...register("neighborhood")}
                  error={errors.neighborhood?.message}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  {...register("city")}
                  error={errors.city?.message}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">Estado</Label>
                <Input
                  id="state"
                  {...register("state")}
                  error={errors.state?.message}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  {...register("phone", {
                    onChange: (e) => {
                      const formatted = formatPhone(e.target.value)
                      setValue("phone", formatted)
                    }
                  })}
                  placeholder="(00) 00000-0000"
                  maxLength={15}
                  error={errors.phone?.message}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  error={errors.email?.message}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input
                  id="cnpj"
                  value={formatCnpj(establishment.cnpj || "")}
                  readOnly
                  disabled
                  className="bg-gray-100"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  error={errors.description?.message}
                />
              </div>
            </div>

            {/* Seção de Configurações de Entrega */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações de Entrega</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="hasDelivery"
                      {...register("hasDelivery")}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="hasDelivery">Fazer entregas</Label>
                  </div>
                </div>

                {watch("hasDelivery") && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="deliveryFee">Taxa de Entrega (R$)</Label>
                      <Input
                        id="deliveryFee"
                        type="number"
                        step="0.01"
                        min="0"
                        {...register("deliveryFee", { valueAsNumber: true })}
                        error={errors.deliveryFee?.message}
                        placeholder="5.90"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="minDeliveryOrder">Pedido Mínimo (R$)</Label>
                      <Input
                        id="minDeliveryOrder"
                        type="number"
                        step="0.01"
                        min="0"
                        {...register("minDeliveryOrder", { valueAsNumber: true })}
                        error={errors.minDeliveryOrder?.message}
                        placeholder="30.00"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deliveryRadius">Raio de Entrega (km)</Label>
                      <Input
                        id="deliveryRadius"
                        type="number"
                        step="0.5"
                        min="0"
                        max="50"
                        {...register("deliveryRadius", { valueAsNumber: true })}
                        error={errors.deliveryRadius?.message}
                        placeholder="5.0"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="image">Logo do Estabelecimento</Label>
                <div className="flex flex-col items-center gap-4">
                  {previewImage && (
                    <div className="relative w-32 h-32">
                      <img
                        src={previewImage}
                        alt="Logo preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      disabled={isUploadingLogo}
                      className="max-w-xs"
                    />
                    {isUploadingLogo && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar alterações
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 
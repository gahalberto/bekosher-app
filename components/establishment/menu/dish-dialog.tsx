import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DishFormValues, dishFormSchema } from "@/lib/validations/menu"
import { useToast } from "@/components/ui/use-toast"
import { useState, useEffect } from "react"
import { ImageUpload } from "@/components/ui/image-upload"

interface Category {
  id: string
  name: string
}

interface DishDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: Category[]
  dish?: {
    id: string
    name: string
    description: string | null
    price: number
    categoryId: string
    imageUrl: string | null
  }
  onSuccess?: () => void
}

export function DishDialog({
  open,
  onOpenChange,
  categories,
  dish,
  onSuccess,
}: DishDialogProps) {
  const { toast } = useToast()
  const [imageUrl, setImageUrl] = useState<string | null>(dish?.imageUrl || null)

  const form = useForm<DishFormValues>({
    resolver: zodResolver(dishFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      categoryId: "",
    },
  })

  // Atualizar formulário quando o dish muda
  useEffect(() => {
    if (dish) {
      form.reset({
        name: dish.name || "",
        description: dish.description || "",
        price: dish.price ? dish.price.toString() : "",
        categoryId: dish.categoryId || "",
      })
      setImageUrl(dish.imageUrl)
    } else {
      form.reset({
        name: "",
        description: "",
        price: "",
        categoryId: "",
      })
      setImageUrl(null)
    }
  }, [dish, form])

  // Resetar quando o dialog abrir/fechar
  useEffect(() => {
    if (!open) {
      form.reset()
      setImageUrl(null)
    }
  }, [open, form])

  async function onSubmit(data: DishFormValues) {
    try {
      const formData = new FormData()
      formData.append("name", data.name)
      formData.append("description", data.description || "")
      formData.append("price", data.price)
      formData.append("categoryId", data.categoryId)
      if (data.image) {
        formData.append("image", data.image)
      }

      const url = dish
        ? `/api/establishment/dish/${dish.id}`
        : "/api/establishment/dish"
      const method = dish ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Erro ao salvar prato")
      }

      toast({
        title: "Sucesso",
        description: dish ? "Prato atualizado!" : "Prato criado!",
        variant: "success",
      })
      onOpenChange(false)
      form.reset()
      // Chama o callback para atualizar a lista
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar prato",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dish ? "Editar Prato" : "Novo Prato"}</DialogTitle>
          <DialogDescription>
            {dish
              ? "Edite os detalhes do prato"
              : "Adicione um novo prato ao seu cardápio"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Feijoada" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o prato..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imagem (opcional)</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={imageUrl}
                      onChange={(url) => {
                        setImageUrl(url)
                        field.onChange(url)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">
                {dish ? "Salvar alterações" : "Criar prato"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 
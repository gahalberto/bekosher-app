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
import { CategoryFormValues, categoryFormSchema } from "@/lib/validations/menu"
import { useToast } from "@/components/ui/use-toast"

interface CategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: {
    id: string
    name: string
    description?: string
  }
  onSuccess?: () => void
}

export function CategoryDialog({
  open,
  onOpenChange,
  category,
  onSuccess,
}: CategoryDialogProps) {
  const { toast } = useToast()
  
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
    },
  })

  async function onSubmit(data: CategoryFormValues) {
    try {
      const url = category
        ? `/api/establishment/category/${category.id}`
        : "/api/establishment/category"
      const method = category ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Erro ao salvar categoria")
      }

      toast({
        title: "Sucesso",
        description: category ? "Categoria atualizada!" : "Categoria criada!",
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
        description: "Erro ao salvar categoria",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {category ? "Editar Categoria" : "Nova Categoria"}
          </DialogTitle>
          <DialogDescription>
            {category
              ? "Edite os detalhes da categoria do cardápio"
              : "Adicione uma nova categoria ao seu cardápio"}
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
                    <Input placeholder="Ex: Entradas" {...field} />
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
                      placeholder="Descreva a categoria..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">
                {category ? "Salvar alterações" : "Criar categoria"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 
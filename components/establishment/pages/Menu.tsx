"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CategoryDialog } from "../menu/category-dialog"
import { DishDialog } from "../menu/dish-dialog"
import { useToast } from "@/components/ui/use-toast"
import { PlusCircle, Edit, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Category {
  id: string
  name: string
  description: string | null
  products: Product[]
}

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  categoryId: string
  imageUrl: string | null
}

interface MenuProps {
  establishment: {
    id: string
    description: string | null
    categories: Category[]
  }
}

export default function Menu({ establishment }: MenuProps) {
  const { toast } = useToast()
  const [categories, setCategories] = useState<Category[]>(establishment.categories || [])
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [isDishDialogOpen, setIsDishDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [selectedDish, setSelectedDish] = useState<Product | null>(null)
  const [itemToDelete, setItemToDelete] = useState<{ type: 'category' | 'dish', id: string } | null>(null)

  // Função para atualizar a lista de categorias após operações CRUD
  const refreshCategories = async () => {
    try {
      const response = await fetch('/api/establishment/category')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Erro ao buscar categorias:', error)
    }
  }

  // Função para adicionar nova categoria ao estado local
  const handleCategorySuccess = (newCategory?: any) => {
    refreshCategories() // Recarrega toda a lista para garantir dados atualizados
  }

  // Função para adicionar novo prato ao estado local
  const handleDishSuccess = (newDish?: any) => {
    refreshCategories() // Recarrega toda a lista para garantir dados atualizados
  }

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return

    try {
      const url = itemToDelete.type === 'category'
        ? `/api/establishment/category/${itemToDelete.id}`
        : `/api/establishment/dish/${itemToDelete.id}`

      const response = await fetch(url, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`Erro ao excluir ${itemToDelete.type === 'category' ? 'categoria' : 'prato'}`)
      }

      // Atualiza a lista após exclusão
      refreshCategories()

      toast({
        title: "Sucesso",
        description: `${itemToDelete.type === 'category' ? 'Categoria' : 'Prato'} excluído com sucesso!`,
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: `Erro ao excluir ${itemToDelete.type === 'category' ? 'categoria' : 'prato'}`,
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setItemToDelete(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Cardápio</h2>
        <div className="space-x-2">
          <Button
            onClick={() => {
              setSelectedCategory(null)
              setIsCategoryDialogOpen(true)
            }}
            variant="outline"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Nova Categoria
          </Button>
          <Button
            onClick={() => {
              setSelectedDish(null)
              setIsDishDialogOpen(true)
            }}
            disabled={categories.length === 0}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Novo Prato
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Produtos do Cardápio</CardTitle>
          <CardDescription>
            Gerencie os produtos do seu estabelecimento
          </CardDescription>
        </CardHeader>
        <CardContent>
          {categories && categories.length > 0 ? (
            <div className="space-y-6">
              {categories.map((category) => (
                <div key={category.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold">{category.name}</h3>
                    <div className="space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedCategory(category)
                          setIsCategoryDialogOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setItemToDelete({ type: 'category', id: category.id })
                          setIsDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category.products.map((product) => (
                      <div key={product.id} className="border rounded p-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h4 className="font-medium">{product.name}</h4>
                              <span className="font-bold text-green-600">
                                R$ {product.price.toFixed(2)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {product.description}
                            </p>
                            {product.imageUrl && (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="mt-2 rounded-md w-full h-32 object-cover"
                              />
                            )}
                          </div>
                          <div className="flex flex-col space-y-1 ml-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedDish(product)
                                setIsDishDialogOpen(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setItemToDelete({ type: 'dish', id: product.id })
                                setIsDeleteDialogOpen(true)
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Nenhuma categoria cadastrada</p>
              <Button
                onClick={() => {
                  setSelectedCategory(null)
                  setIsCategoryDialogOpen(true)
                }}
              >
                Adicionar Categoria
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <CategoryDialog
        open={isCategoryDialogOpen}
        onOpenChange={setIsCategoryDialogOpen}
        category={selectedCategory || undefined}
        onSuccess={handleCategorySuccess}
      />

      <DishDialog
        open={isDishDialogOpen}
        onOpenChange={setIsDishDialogOpen}
        categories={categories}
        dish={selectedDish || undefined}
        onSuccess={handleDishSuccess}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este{" "}
              {itemToDelete?.type === "category" ? "categoria" : "prato"}? Esta
              ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 
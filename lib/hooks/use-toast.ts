import { useToast as useToastOriginal } from "@/components/ui/use-toast"

export const useToast = useToastOriginal

export const toast = {
  success: (message: string) => {
    useToastOriginal().toast({
      title: "Sucesso",
      description: message,
    })
  },
  error: (message: string) => {
    useToastOriginal().toast({
      title: "Erro",
      description: message,
      variant: "destructive",
    })
  },
} 
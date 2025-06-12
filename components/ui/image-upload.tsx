import { ChangeEvent, useState } from "react"
import { Button } from "@/components/ui/button"
import { ImageIcon, X } from "lucide-react"

interface ImageUploadProps {
  value?: string
  onChange: (value: string) => void
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | undefined>(value)

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Erro ao fazer upload da imagem")
      }

      const data = await response.json()
      setPreview(data.url)
      onChange(data.url)
    } catch (error) {
      console.error("Erro ao fazer upload:", error)
    }
  }

  const handleRemove = () => {
    setPreview(undefined)
    onChange("")
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-40 h-40 border rounded-lg overflow-hidden">
        {preview ? (
          <>
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <ImageIcon className="h-10 w-10 text-gray-400" />
          </div>
        )}
      </div>
      <div>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          id="image-upload"
          onChange={handleFileChange}
        />
        <label htmlFor="image-upload">
          <Button type="button" variant="outline" asChild>
            <span>Escolher imagem</span>
          </Button>
        </label>
      </div>
    </div>
  )
} 
"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, ImageIcon } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ImageUploadProps {
  onImageUploaded: (url: string) => void
  acceptedTypes?: string
  className?: string
  currentImage?: string
}

export function ImageUpload({ onImageUploaded, acceptedTypes, className, currentImage }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Dosya türü kontrolü
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Hata",
        description: "Lütfen geçerli bir görsel dosyası seçin.",
        variant: "destructive",
      })
      return
    }

    // Dosya boyutu kontrolü (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Hata",
        description: "Dosya boyutu 5MB'dan küçük olmalıdır.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // Dosyayı base64'e çevir
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPreviewUrl(result)
        onImageUploaded(result)

        toast({
          title: "Başarılı",
          description: "Görsel başarıyla yüklendi.",
        })
      }
      reader.readAsDataURL(file)
    } catch (error: any) {
      console.error("Upload error:", error)
      toast({
        title: "Hata",
        description: "Görsel yüklenirken bir hata oluştu.",
        variant: "destructive",
      })
      setPreviewUrl(null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setPreviewUrl(null)
    onImageUploaded("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`space-y-4 ${className || ""}`}>
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleButtonClick}
          disabled={isUploading}
          className="flex items-center gap-2"
        >
          {isUploading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {isUploading ? "Yükleniyor..." : "Görsel Seç"}
        </Button>

        {previewUrl && (
          <Button type="button" variant="outline" size="icon" onClick={handleRemoveImage} disabled={isUploading}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes || "image/*"}
        onChange={handleFileSelect}
        className="hidden"
      />

      {previewUrl ? (
        <div className="relative w-full max-w-xs">
          <div className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 p-2">
            <img
              src={previewUrl || "/placeholder.svg"}
              alt="Yüklenen görsel"
              className="w-full h-full object-contain rounded"
            />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full max-w-xs aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50">
          <div className="text-center">
            <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Görsel seçilmedi</p>
          </div>
        </div>
      )}
    </div>
  )
}

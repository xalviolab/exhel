"use client"

import type React from "react"

import { useState, useRef } from "react"
import { uploadImage } from "@/lib/storage"
import { ImageIcon, LinkIcon } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ImageUploadProps {
  onImageUploaded: (url: string) => void
  className?: string
}

export function ImageUpload({ onImageUploaded, className }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileChange = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]

    // Dosya türünü kontrol et
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Hata",
        description: "Lütfen geçerli bir görsel dosyası seçin.",
        variant: "destructive",
      })
      return
    }

    // Dosya boyutunu kontrol et (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Hata",
        description: "Dosya boyutu 2MB'dan küçük olmalıdır.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      const url = await uploadImage(file)

      if (url) {
        onImageUploaded(url)
        toast({
          title: "Başarılı",
          description: "Görsel başarıyla yüklendi.",
        })
      } else {
        throw new Error("Görsel yüklenemedi.")
      }
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message || "Görsel yüklenirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      // Input değerini sıfırla
      if (inputRef.current) {
        inputRef.current.value = ""
      }
    }
  }

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!imageUrl) {
      toast({
        title: "Hata",
        description: "Lütfen bir görsel URL'i girin.",
        variant: "destructive",
      })
      return
    }

    // URL formatını kontrol et
    try {
      new URL(imageUrl)
    } catch (error) {
      toast({
        title: "Hata",
        description: "Lütfen geçerli bir URL girin.",
        variant: "destructive",
      })
      return
    }

    onImageUploaded(imageUrl)
    toast({
      title: "Başarılı",
      description: "Görsel başarıyla eklendi.",
    })
    setImageUrl("")
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files)
    }
  }

  const handleButtonClick = () => {
    inputRef.current?.click()
  }

  return (
    <div className={cn("space-y-4", className)}>
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Dosya Yükle</TabsTrigger>
          <TabsTrigger value="url">URL Ekle</TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <div
            className={cn(
              "border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer transition-colors",
              dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
              isUploading && "opacity-50 pointer-events-none",
            )}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={handleButtonClick}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files)}
              disabled={isUploading}
            />

            {isUploading ? (
              <div className="flex flex-col items-center justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                <p className="text-sm text-muted-foreground">Yükleniyor...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-4">
                <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm font-medium mb-1">Görsel yüklemek için tıklayın veya sürükleyin</p>
                <p className="text-xs text-muted-foreground">PNG, JPG, GIF, WEBP (maks. 2MB)</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="url">
          <form onSubmit={handleUrlSubmit} className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input
                type="url"
                placeholder="https://ornek.com/gorsel.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">Ekle</Button>
            </div>
            <div className="flex items-center justify-center py-4">
              <LinkIcon className="h-5 w-5 text-muted-foreground mr-2" />
              <p className="text-xs text-muted-foreground">Görsel URL'i girin</p>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  )
}

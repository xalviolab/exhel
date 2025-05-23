"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { ImageUpload } from "@/components/image-upload"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface BadgeFormProps {
  badgeId?: string
  type?: string
  defaultValues?: {
    name: string
    description: string
    image_url: string
    requirement_type: string
    requirement_value: number
  }
  children?: React.ReactNode
}

export function BadgeForm({ badgeId, type, defaultValues, children }: BadgeFormProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const [name, setName] = useState(defaultValues?.name || "")
  const [description, setDescription] = useState(defaultValues?.description || "")
  const [imageUrl, setImageUrl] = useState(defaultValues?.image_url || "")
  const [requirementType, setRequirementType] = useState(defaultValues?.requirement_type || type || "streak")
  const [requirementValue, setRequirementValue] = useState(defaultValues?.requirement_value || 1)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()

      const badgeData = {
        name,
        description,
        image_url: imageUrl,
        requirement_type: requirementType,
        requirement_value: requirementValue,
      }

      if (badgeId) {
        // Güncelleme
        const { error } = await supabase.from("badges").update(badgeData).eq("id", badgeId)

        if (error) throw error

        toast({
          title: "Rozet güncellendi",
          description: "Rozet başarıyla güncellendi.",
        })
      } else {
        // Yeni oluşturma
        const { error } = await supabase.from("badges").insert(badgeData)

        if (error) throw error

        toast({
          title: "Rozet oluşturuldu",
          description: "Yeni rozet başarıyla oluşturuldu.",
        })
      }

      setOpen(false)
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message || "Rozet kaydedilirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const requirementTypeOptions = [
    { value: "streak", label: "Seri (Gün)" },
    { value: "lessons_completed", label: "Tamamlanan Ders" },
    { value: "xp_earned", label: "Kazanılan XP" },
    { value: "level", label: "Seviye" },
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className="mt-2">
            {badgeId ? "Düzenle" : "Yeni Rozet"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{badgeId ? "Rozeti Düzenle" : "Yeni Rozet Oluştur"}</DialogTitle>
            <DialogDescription>
              {badgeId
                ? "Rozet bilgilerini güncelleyin."
                : "Yeni bir rozet oluşturmak için aşağıdaki bilgileri doldurun."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Rozet Adı</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image_url">Rozet Görseli</Label>
              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upload">Görsel Yükle</TabsTrigger>
                  <TabsTrigger value="url">URL Ekle</TabsTrigger>
                </TabsList>
                <TabsContent value="upload" className="pt-2">
                  <ImageUpload onImageUploaded={(url) => setImageUrl(url)} />
                </TabsContent>
                <TabsContent value="url" className="pt-2">
                  <Input
                    id="image_url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.svg"
                  />
                </TabsContent>
              </Tabs>
              {imageUrl && (
                <div className="mt-2 flex items-center justify-center">
                  <div className="relative h-24 w-24 overflow-hidden">
                    <img
                      src={imageUrl || "/placeholder.svg"}
                      alt="Rozet görseli"
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="requirement_type">Gereksinim Türü</Label>
                <Select value={requirementType} onValueChange={setRequirementType} disabled={!!type}>
                  <SelectTrigger id="requirement_type">
                    <SelectValue placeholder="Gereksinim türü seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {requirementTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="requirement_value">Gereksinim Değeri</Label>
                <Input
                  id="requirement_value"
                  type="number"
                  value={requirementValue}
                  onChange={(e) => setRequirementValue(Number.parseInt(e.target.value))}
                  min={1}
                  required
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

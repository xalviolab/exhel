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
import { Plus, Edit } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import { ImageUpload } from "@/components/image-upload"

interface BadgeFormProps {
  badgeId?: string
  defaultValues?: {
    name: string
    description: string
    image_url: string
    requirement_type: string
    requirement_value: number
  }
  type?: string
  children?: React.ReactNode
}

export function BadgeForm({ badgeId, defaultValues, type, children }: BadgeFormProps) {
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
        const newBadgeId = uuidv4()
        const { error } = await supabase.from("badges").insert({
          id: newBadgeId,
          ...badgeData,
        })

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

  const requirementTypes = [
    { value: "streak", label: "Günlük Seri" },
    { value: "lessons_completed", label: "Tamamlanan Ders" },
    { value: "xp_earned", label: "Kazanılan XP" },
    { value: "level", label: "Ulaşılan Seviye" },
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant={badgeId ? "outline" : "default"} size={badgeId ? "sm" : "default"}>
            {badgeId ? <Edit className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
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
              <ImageUpload onImageUploaded={(url) => setImageUrl(url)} />
              {imageUrl && (
                <div className="mt-2 flex items-center justify-center">
                  <div className="badge-container h-20 w-20">
                    {imageUrl.endsWith(".svg") ? (
                      <object data={imageUrl} type="image/svg+xml" className="badge-svg" aria-label="Rozet görseli">
                        <img src={imageUrl || "/placeholder.svg"} alt="Rozet görseli" className="badge-image" />
                      </object>
                    ) : (
                      <img src={imageUrl || "/placeholder.svg"} alt="Rozet görseli" className="badge-image" />
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="requirement_type">Gereksinim Türü</Label>
                <Select value={requirementType} onValueChange={setRequirementType}>
                  <SelectTrigger id="requirement_type">
                    <SelectValue placeholder="Gereksinim türü seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {requirementTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
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

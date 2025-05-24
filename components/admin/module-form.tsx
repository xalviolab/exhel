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
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Plus, Edit } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import { ImageUpload } from "@/components/image-upload"

interface ModuleFormProps {
  moduleId?: string
  defaultValues?: {
    title: string
    description: string
    image_url: string
    required_level: number
    is_premium: boolean
    class_level: string
    order_index: number
  }
  children?: React.ReactNode
}

export function ModuleForm({ moduleId, defaultValues, children }: ModuleFormProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const [title, setTitle] = useState(defaultValues?.title || "")
  const [description, setDescription] = useState(defaultValues?.description || "")
  const [imageUrl, setImageUrl] = useState(defaultValues?.image_url || "")
  const [requiredLevel, setRequiredLevel] = useState(defaultValues?.required_level || 1)
  const [isPremium, setIsPremium] = useState(defaultValues?.is_premium || false)
  const [classLevel, setClassLevel] = useState(defaultValues?.class_level || "9")
  const [orderIndex, setOrderIndex] = useState(defaultValues?.order_index || 1)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast({
        title: "Hata",
        description: "Modül başlığı gereklidir.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()

      const moduleData = {
        title: title.trim(),
        description: description.trim(),
        image_url: imageUrl,
        required_level: requiredLevel,
        is_premium: isPremium,
        class_level: classLevel,
        order_index: orderIndex,
      }

      if (moduleId) {
        // Güncelleme
        const { error } = await supabase.from("modules").update(moduleData).eq("id", moduleId)

        if (error) throw error

        toast({
          title: "Modül güncellendi",
          description: "Modül başarıyla güncellendi.",
        })
      } else {
        // Yeni oluşturma
        const newModuleId = uuidv4()
        const { error } = await supabase.from("modules").insert({
          id: newModuleId,
          ...moduleData,
        })

        if (error) throw error

        toast({
          title: "Modül oluşturuldu",
          description: "Yeni modül başarıyla oluşturuldu.",
        })
      }

      setOpen(false)

      // Formu temizle
      if (!moduleId) {
        setTitle("")
        setDescription("")
        setImageUrl("")
        setRequiredLevel(1)
        setIsPremium(false)
        setClassLevel("9")
        setOrderIndex(1)
      }

      router.refresh()
    } catch (error: any) {
      console.error("Module save error:", error)
      toast({
        title: "Hata",
        description: error.message || "Modül kaydedilirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const classLevels = [
    { value: "9", label: "9. Sınıf" },
    { value: "10", label: "10. Sınıf" },
    { value: "11", label: "11. Sınıf" },
    { value: "12", label: "12. Sınıf" },
    { value: "medical", label: "Tıp Fakültesi" },
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant={moduleId ? "outline" : "default"} size={moduleId ? "sm" : "default"}>
            {moduleId ? <Edit className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
            {moduleId ? "Düzenle" : "Yeni Modül"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{moduleId ? "Modülü Düzenle" : "Yeni Modül Oluştur"}</DialogTitle>
            <DialogDescription>
              {moduleId
                ? "Modül bilgilerini güncelleyin."
                : "Yeni bir modül oluşturmak için aşağıdaki bilgileri doldurun."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Modül Başlığı *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Modül başlığını girin"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Modül açıklamasını girin"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image_url">Modül Görseli</Label>
              <ImageUpload onImageUploaded={(url) => setImageUrl(url)} currentImage={imageUrl} showFrame={true} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="class_level">Sınıf Seviyesi</Label>
                <Select value={classLevel} onValueChange={setClassLevel}>
                  <SelectTrigger id="class_level">
                    <SelectValue placeholder="Sınıf seviyesi seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {classLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="required_level">Gerekli Seviye</Label>
                <Input
                  id="required_level"
                  type="number"
                  value={requiredLevel}
                  onChange={(e) => setRequiredLevel(Number.parseInt(e.target.value) || 1)}
                  min={1}
                  max={100}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="order_index">Sıralama</Label>
                <Input
                  id="order_index"
                  type="number"
                  value={orderIndex}
                  onChange={(e) => setOrderIndex(Number.parseInt(e.target.value) || 1)}
                  min={1}
                  required
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Switch id="is_premium" checked={isPremium} onCheckedChange={setIsPremium} />
                <Label htmlFor="is_premium">Premium Modül</Label>
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

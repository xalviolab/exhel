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
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ModuleFormProps {
  moduleId?: string
  defaultValues?: {
    title: string
    description: string
    image_url: string
    order_index: number
    required_level: number
    is_premium: boolean
    class_level?: string
  }
}

export function ModuleForm({ moduleId, defaultValues }: ModuleFormProps = {}) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const [title, setTitle] = useState(defaultValues?.title || "")
  const [description, setDescription] = useState(defaultValues?.description || "")
  const [imageUrl, setImageUrl] = useState(defaultValues?.image_url || "")
  const [orderIndex, setOrderIndex] = useState(defaultValues?.order_index || 0)
  const [requiredLevel, setRequiredLevel] = useState(defaultValues?.required_level || 1)
  const [isPremium, setIsPremium] = useState(defaultValues?.is_premium || false)
  const [classLevel, setClassLevel] = useState(defaultValues?.class_level || "all")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()

      const moduleData = {
        title,
        description,
        image_url: imageUrl,
        order_index: orderIndex,
        required_level: requiredLevel,
        is_premium: isPremium,
        class_level: classLevel,
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
        // Yeni oluşturma - UUID oluştur
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
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message || "Modül kaydedilirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          {moduleId ? "Modülü Düzenle" : "Yeni Modül"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
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
              <Label htmlFor="title">Başlık</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
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
              <Label htmlFor="image_url">Görsel URL</Label>
              <Input
                id="image_url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="order_index">Sıra</Label>
                <Input
                  id="order_index"
                  type="number"
                  value={orderIndex}
                  onChange={(e) => setOrderIndex(Number.parseInt(e.target.value))}
                  min={0}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="required_level">Gerekli Seviye</Label>
                <Input
                  id="required_level"
                  type="number"
                  value={requiredLevel}
                  onChange={(e) => setRequiredLevel(Number.parseInt(e.target.value))}
                  min={1}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="class_level">Sınıf Seviyesi</Label>
              <Select value={classLevel} onValueChange={setClassLevel}>
                <SelectTrigger id="class_level">
                  <SelectValue placeholder="Sınıf seviyesi seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Sınıflar</SelectItem>
                  <SelectItem value="9">9. Sınıf</SelectItem>
                  <SelectItem value="10">10. Sınıf</SelectItem>
                  <SelectItem value="11">11. Sınıf</SelectItem>
                  <SelectItem value="12">12. Sınıf</SelectItem>
                  <SelectItem value="medical">Tıp Fakültesi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Switch id="is_premium" checked={isPremium} onCheckedChange={setIsPremium} />
              <Label htmlFor="is_premium">Premium Modül</Label>
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

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"
import { Plus, Pencil, Trash2, Link, FileText, Video } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface LessonResourceFormProps {
  lessonId: string
  resourceId?: string
  defaultValues?: {
    title: string
    type: string
    url: string
    description: string
  }
  onSuccess?: () => void
}

export function LessonResourceForm({ lessonId, resourceId, defaultValues, onSuccess }: LessonResourceFormProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [resources, setResources] = useState<any[]>([])
  const [isLoadingResources, setIsLoadingResources] = useState(false)
  const { toast } = useToast()

  const [title, setTitle] = useState(defaultValues?.title || "")
  const [type, setType] = useState(defaultValues?.type || "link")
  const [url, setUrl] = useState(defaultValues?.url || "")
  const [description, setDescription] = useState(defaultValues?.description || "")
  const [editingResourceId, setEditingResourceId] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      fetchResources()
    }
  }, [open])

  const fetchResources = async () => {
    try {
      setIsLoadingResources(true)
      const supabase = createClient()
      const { data, error } = await supabase.from("lesson_resources").select("*").eq("lesson_id", lessonId)

      if (error) throw error
      setResources(data || [])
    } catch (error: any) {
      toast({
        title: "Hata",
        description: "Kaynaklar yüklenirken bir hata oluştu: " + error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoadingResources(false)
    }
  }

  const resetForm = () => {
    setTitle("")
    setType("link")
    setUrl("")
    setDescription("")
    setEditingResourceId(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!lessonId) {
      toast({
        title: "Hata",
        description: "Ders ID bulunamadı.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()

      const resourceData = {
        lesson_id: lessonId,
        title,
        type,
        url,
        description,
      }

      if (editingResourceId) {
        // Güncelleme
        const { error } = await supabase.from("lesson_resources").update(resourceData).eq("id", editingResourceId)

        if (error) throw error

        toast({
          title: "Kaynak güncellendi",
          description: "Kaynak başarıyla güncellendi.",
        })
      } else {
        // Yeni oluşturma
        const { error } = await supabase.from("lesson_resources").insert({
          id: uuidv4(),
          ...resourceData,
        })

        if (error) throw error

        toast({
          title: "Kaynak oluşturuldu",
          description: "Yeni kaynak başarıyla oluşturuldu.",
        })
      }

      resetForm()
      fetchResources()

      // Başarı callback'i çağır
      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message || "Kaynak kaydedilirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (resource: any) => {
    setTitle(resource.title)
    setType(resource.type)
    setUrl(resource.url)
    setDescription(resource.description || "")
    setEditingResourceId(resource.id)
  }

  const handleDelete = async (resourceId: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase.from("lesson_resources").delete().eq("id", resourceId)

      if (error) throw error

      toast({
        title: "Kaynak silindi",
        description: "Kaynak başarıyla silindi.",
      })

      fetchResources()
    } catch (error: any) {
      toast({
        title: "Hata",
        description: "Kaynak silinirken bir hata oluştu: " + error.message,
        variant: "destructive",
      })
    }
  }

  const getResourceIcon = (resourceType: string) => {
    switch (resourceType) {
      case "link":
        return <Link className="h-4 w-4" />
      case "file":
        return <FileText className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      default:
        return <Link className="h-4 w-4" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Kaynak Ekle
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ders Kaynakları</DialogTitle>
          <DialogDescription>Derse ek kaynaklar ekleyin (makaleler, videolar, dosyalar vb.).</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="md:col-span-1 border-r pr-4">
            <h3 className="font-medium mb-2">Kaynaklar</h3>
            {isLoadingResources ? (
              <div className="flex items-center justify-center h-20">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : resources.length > 0 ? (
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                {resources.map((resource) => (
                  <div
                    key={resource.id}
                    className="flex items-center justify-between p-2 border rounded-md hover:bg-accent/50"
                  >
                    <div className="truncate flex-1 flex items-center gap-2">
                      {getResourceIcon(resource.type)}
                      <span className="font-medium">{resource.title}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(resource)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Kaynağı Sil</AlertDialogTitle>
                            <AlertDialogDescription>
                              Bu kaynağı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>İptal</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(resource.id)}>Sil</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-4 text-muted-foreground">Henüz kaynak eklenmemiş.</div>
            )}
          </div>

          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Kaynak Başlığı</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="type">Kaynak Tipi</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Kaynak tipi seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="link">Bağlantı</SelectItem>
                    <SelectItem value="file">Dosya</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="url">URL</Label>
                <Input id="url" value={url} onChange={(e) => setUrl(e.target.value)} required />
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

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={resetForm}>
                  {editingResourceId ? "Yeni Kaynak" : "Temizle"}
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Kaydediliyor..." : editingResourceId ? "Güncelle" : "Ekle"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

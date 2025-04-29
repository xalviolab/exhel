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
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import { RichTextEditor } from "@/components/rich-text-editor"
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

interface LessonSectionFormProps {
  lessonId: string
  sectionId?: string
  defaultValues?: {
    title: string
    content: string
    order_index: number
  }
  onSuccess?: () => void
}

export function LessonSectionForm({ lessonId, sectionId, defaultValues, onSuccess }: LessonSectionFormProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [sections, setSections] = useState<any[]>([])
  const [isLoadingSections, setIsLoadingSections] = useState(false)
  const { toast } = useToast()

  const [title, setTitle] = useState(defaultValues?.title || "")
  const [content, setContent] = useState(defaultValues?.content || "")
  const [orderIndex, setOrderIndex] = useState(defaultValues?.order_index || 0)
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      fetchSections()
    }
  }, [open])

  const fetchSections = async () => {
    try {
      setIsLoadingSections(true)
      const supabase = createClient()
      const { data, error } = await supabase
        .from("lesson_sections")
        .select("*")
        .eq("lesson_id", lessonId)
        .order("order_index")

      if (error) throw error
      setSections(data || [])
    } catch (error: any) {
      toast({
        title: "Hata",
        description: "Bölümler yüklenirken bir hata oluştu: " + error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoadingSections(false)
    }
  }

  const resetForm = () => {
    setTitle("")
    setContent("")
    setOrderIndex(sections.length)
    setEditingSectionId(null)
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

      const sectionData = {
        lesson_id: lessonId,
        title,
        content,
        order_index: orderIndex,
      }

      if (editingSectionId) {
        // Güncelleme
        const { error } = await supabase.from("lesson_sections").update(sectionData).eq("id", editingSectionId)

        if (error) throw error

        toast({
          title: "Bölüm güncellendi",
          description: "Bölüm başarıyla güncellendi.",
        })
      } else {
        // Yeni oluşturma
        const { error } = await supabase.from("lesson_sections").insert({
          id: uuidv4(),
          ...sectionData,
        })

        if (error) throw error

        toast({
          title: "Bölüm oluşturuldu",
          description: "Yeni bölüm başarıyla oluşturuldu.",
        })
      }

      resetForm()
      fetchSections()

      // Başarı callback'i çağır
      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message || "Bölüm kaydedilirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (section: any) => {
    setTitle(section.title)
    setContent(section.content || "")
    setOrderIndex(section.order_index)
    setEditingSectionId(section.id)
  }

  const handleDelete = async (sectionId: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase.from("lesson_sections").delete().eq("id", sectionId)

      if (error) throw error

      toast({
        title: "Bölüm silindi",
        description: "Bölüm başarıyla silindi.",
      })

      fetchSections()
    } catch (error: any) {
      toast({
        title: "Hata",
        description: "Bölüm silinirken bir hata oluştu: " + error.message,
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Bölüm Ekle
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ders Bölümleri</DialogTitle>
          <DialogDescription>Derse bölümler ekleyerek içeriği organize edin.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="md:col-span-1 border-r pr-4">
            <h3 className="font-medium mb-2">Bölümler</h3>
            {isLoadingSections ? (
              <div className="flex items-center justify-center h-20">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : sections.length > 0 ? (
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                {sections.map((section) => (
                  <div
                    key={section.id}
                    className="flex items-center justify-between p-2 border rounded-md hover:bg-accent/50"
                  >
                    <div className="truncate flex-1">
                      <span className="font-medium">{section.title}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(section)}>
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
                            <AlertDialogTitle>Bölümü Sil</AlertDialogTitle>
                            <AlertDialogDescription>
                              Bu bölümü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>İptal</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(section.id)}>Sil</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-4 text-muted-foreground">Henüz bölüm eklenmemiş.</div>
            )}
          </div>

          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Bölüm Başlığı</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>

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
                <Label htmlFor="content">Bölüm İçeriği</Label>
                <RichTextEditor
                  content={content}
                  onChange={setContent}
                  placeholder="Bölüm içeriğini buraya yazın..."
                  className="min-h-[300px]"
                />
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={resetForm}>
                  {editingSectionId ? "Yeni Bölüm" : "Temizle"}
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Kaydediliyor..." : editingSectionId ? "Güncelle" : "Ekle"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

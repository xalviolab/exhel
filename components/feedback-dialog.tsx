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
import { useToast } from "@/components/ui/use-toast"
import { MessageSquare, Smile, Meh, Frown } from "lucide-react"
import { ImageUpload } from "@/components/image-upload"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function FeedbackDialog() {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [satisfaction, setSatisfaction] = useState<"happy" | "neutral" | "sad" | null>(null)
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !description || !satisfaction) {
      toast({
        title: "Eksik bilgi",
        description: "Lütfen başlık, açıklama ve memnuniyet seviyesi alanlarını doldurun.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const supabase = createClient()

      // Kullanıcı bilgilerini al
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("Kullanıcı oturumu bulunamadı")
      }

      // Geri bildirimi kaydet
      const { error } = await supabase.from("feedback").insert({
        user_id: user.id,
        title,
        description,
        satisfaction_level: satisfaction,
        screenshot_url: screenshot,
        status: "new",
      })

      if (error) {
        throw error
      }

      // Başarılı mesajı göster
      toast({
        title: "Teşekkürler!",
        description: "Geri bildiriminiz başarıyla gönderildi.",
      })

      // Formu sıfırla
      setTitle("")
      setDescription("")
      setSatisfaction(null)
      setScreenshot(null)

      // Dialog'u kapat
      setOpen(false)

      // Sayfayı yenile
      router.refresh()
    } catch (error: any) {
      console.error("Geri bildirim gönderme hatası:", error)
      toast({
        title: "Hata",
        description: error.message || "Geri bildirim gönderilirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUploaded = (url: string) => {
    setScreenshot(url)
    toast({
      title: "Ekran görüntüsü yüklendi",
      description: "Ekran görüntüsü başarıyla yüklendi.",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <MessageSquare className="h-4 w-4" />
          <span className="hidden sm:inline">Görüş Bildir</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Görüş Bildir</DialogTitle>
          <DialogDescription>
            Sistemle ilgili görüşlerinizi, önerilerinizi veya karşılaştığınız sorunları bizimle paylaşın.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Başlık</Label>
              <Input
                id="title"
                placeholder="Görüşünüzün kısa başlığı"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                placeholder="İsteğiniz, öneriniz veya şikayetinizi detaylı olarak yazın"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
                required
                className="min-h-[100px]"
              />
            </div>
            <div className="grid gap-2">
              <Label>Memnuniyet Seviyesi</Label>
              <div className="flex justify-center gap-4 py-2">
                <Button
                  type="button"
                  variant={satisfaction === "happy" ? "default" : "outline"}
                  size="icon"
                  className="h-12 w-12 rounded-full"
                  onClick={() => setSatisfaction("happy")}
                  disabled={isSubmitting}
                >
                  <Smile className={`h-6 w-6 ${satisfaction === "happy" ? "text-white" : ""}`} />
                  <span className="sr-only">Memnunum</span>
                </Button>
                <Button
                  type="button"
                  variant={satisfaction === "neutral" ? "default" : "outline"}
                  size="icon"
                  className="h-12 w-12 rounded-full"
                  onClick={() => setSatisfaction("neutral")}
                  disabled={isSubmitting}
                >
                  <Meh className={`h-6 w-6 ${satisfaction === "neutral" ? "text-white" : ""}`} />
                  <span className="sr-only">Kararsızım</span>
                </Button>
                <Button
                  type="button"
                  variant={satisfaction === "sad" ? "default" : "outline"}
                  size="icon"
                  className="h-12 w-12 rounded-full"
                  onClick={() => setSatisfaction("sad")}
                  disabled={isSubmitting}
                >
                  <Frown className={`h-6 w-6 ${satisfaction === "sad" ? "text-white" : ""}`} />
                  <span className="sr-only">Memnun değilim</span>
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Ekran Görüntüsü (İsteğe Bağlı)</Label>
              {screenshot ? (
                <div className="relative">
                  <img
                    src={screenshot || "/placeholder.svg"}
                    alt="Ekran görüntüsü"
                    className="max-h-[200px] w-full object-contain rounded-md border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setScreenshot(null)}
                    disabled={isSubmitting}
                  >
                    Kaldır
                  </Button>
                </div>
              ) : (
                <ImageUpload onImageUploaded={handleImageUploaded} />
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Gönderiliyor..." : "Gönder"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>

      {/* Teşekkür Mesajı */}
      <Dialog open={!open && !!title}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Teşekkürler!</DialogTitle>
            <DialogDescription>
              Görüşünüz bizim için çok değerli. Bu sistemi birlikte şekillendireceğiz. 💪
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <Button onClick={() => setTitle("")}>Tamam</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}

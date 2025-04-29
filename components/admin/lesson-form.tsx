"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { Plus, Award } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RichTextEditor } from "@/components/rich-text-editor"
import { LessonSectionForm } from "@/components/admin/lesson-section-form"
import { LessonResourceForm } from "@/components/admin/lesson-resource-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"

interface LessonFormProps {
  moduleId: string
  lessonId?: string
  defaultValues?: {
    title: string
    description: string
    image_url: string
    order_index: number
    xp_reward: number
    is_premium: boolean
    content?: string
    class_level?: string
    badge_id?: string
  }
  onSuccess?: () => void
}

export function LessonForm({ moduleId, lessonId, defaultValues, onSuccess }: LessonFormProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const [title, setTitle] = useState(defaultValues?.title || "")
  const [description, setDescription] = useState(defaultValues?.description || "")
  const [imageUrl, setImageUrl] = useState(defaultValues?.image_url || "")
  const [orderIndex, setOrderIndex] = useState(defaultValues?.order_index || 0)
  const [xpReward, setXpReward] = useState(defaultValues?.xp_reward || 10)
  const [isPremium, setIsPremium] = useState(defaultValues?.is_premium || false)
  const [content, setContent] = useState(defaultValues?.content || "")
  const [classLevel, setClassLevel] = useState(defaultValues?.class_level || "all")
  const [activeTab, setActiveTab] = useState("basic")
  const [badges, setBadges] = useState<any[]>([])
  const [selectedBadgeId, setSelectedBadgeId] = useState(defaultValues?.badge_id || "")

  // Rozetleri yükle
  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase.from("badges").select("*")

        if (error) throw error
        setBadges(data || [])
      } catch (error: any) {
        console.error("Rozetler yüklenirken hata:", error)
      }
    }

    if (open) {
      fetchBadges()
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!moduleId) {
      toast({
        title: "Hata",
        description: "Modül ID bulunamadı.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()

      const lessonData = {
        module_id: moduleId,
        title,
        description,
        image_url: imageUrl,
        order_index: orderIndex,
        xp_reward: xpReward,
        is_premium: isPremium,
        content,
        class_level: classLevel,
        badge_id: selectedBadgeId || null,
      }

      if (lessonId) {
        // Güncelleme
        const { error } = await supabase.from("lessons").update(lessonData).eq("id", lessonId)

        if (error) throw error

        toast({
          title: "Ders güncellendi",
          description: "Ders başarıyla güncellendi.",
        })
      } else {
        // Yeni oluşturma - UUID oluştur
        const newLessonId = uuidv4()
        const { error } = await supabase.from("lessons").insert({
          id: newLessonId,
          ...lessonData,
        })

        if (error) throw error

        toast({
          title: "Ders oluşturuldu",
          description: "Yeni ders başarıyla oluşturuldu.",
        })
      }

      setOpen(false)

      // Form alanlarını temizle
      if (!lessonId) {
        setTitle("")
        setDescription("")
        setImageUrl("")
        setOrderIndex(0)
        setXpReward(10)
        setIsPremium(false)
        setContent("")
      }

      // Başarı callback'i çağır
      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message || "Ders kaydedilirken bir hata oluştu.",
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
          {lessonId ? "Dersi Düzenle" : "Yeni Ders"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{lessonId ? "Dersi Düzenle" : "Yeni Ders Oluştur"}</DialogTitle>
            <DialogDescription>
              {lessonId
                ? "Ders bilgilerini güncelleyin."
                : "Yeni bir ders oluşturmak için aşağıdaki bilgileri doldurun."}
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="basic">Temel Bilgiler</TabsTrigger>
              <TabsTrigger value="content">İçerik</TabsTrigger>
              <TabsTrigger value="sections">Bölümler ve Kaynaklar</TabsTrigger>
              <TabsTrigger value="badges">Rozet Ödülü</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
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
                <Label htmlFor="image_url">Kapak Görseli URL</Label>
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
                  <Label htmlFor="xp_reward">XP Ödülü</Label>
                  <Input
                    id="xp_reward"
                    type="number"
                    value={xpReward}
                    onChange={(e) => setXpReward(Number.parseInt(e.target.value))}
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
                <Label htmlFor="is_premium">Premium Ders</Label>
              </div>
            </TabsContent>

            <TabsContent value="content">
              <div className="space-y-4">
                <Label htmlFor="content">Ders İçeriği</Label>
                <p className="text-sm text-muted-foreground">
                  Zengin metin düzenleyici ile ders içeriğini oluşturun. Görsel eklemek için sürükle-bırak yapabilir
                  veya düzenleyici araç çubuğundaki görsel simgesini kullanabilirsiniz.
                </p>
                <RichTextEditor
                  content={content}
                  onChange={setContent}
                  placeholder="Ders içeriğini buraya yazın..."
                  className="min-h-[400px]"
                />
              </div>
            </TabsContent>

            <TabsContent value="sections">
              {lessonId ? (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Ders Bölümleri</Label>
                      <LessonSectionForm lessonId={lessonId} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Dersi bölümlere ayırarak içeriği daha organize edebilirsiniz. Önce dersi kaydedin, sonra bölüm
                      ekleyebilirsiniz.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Ders Kaynakları</Label>
                      <LessonResourceForm lessonId={lessonId} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Derse ek kaynaklar ekleyebilirsiniz (makaleler, videolar, dosyalar vb.). Önce dersi kaydedin,
                      sonra kaynak ekleyebilirsiniz.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">
                    Bölüm ve kaynak eklemek için önce dersi oluşturun. Dersi kaydettikten sonra bu sekmeye geri
                    dönebilirsiniz.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="badges">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  <Label className="text-lg font-medium">Ders Tamamlama Rozeti</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Bu dersi tamamlayan kullanıcılara otomatik olarak verilecek rozeti seçin. Rozet seçmek zorunlu değildir.
                </p>

                <RadioGroup value={selectedBadgeId} onValueChange={setSelectedBadgeId} className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card className={`border-2 ${selectedBadgeId === "" ? "border-primary" : "border-muted"} cursor-pointer`} onClick={() => setSelectedBadgeId("")}>
                      <CardContent className="p-4 flex items-center gap-3">
                        <RadioGroupItem value="" id="no-badge" className="mt-0" />
                        <Label htmlFor="no-badge" className="cursor-pointer font-medium">Rozet Yok</Label>
                      </CardContent>
                    </Card>

                    {badges.map((badge) => (
                      <Card
                        key={badge.id}
                        className={`border-2 ${selectedBadgeId === badge.id ? "border-primary" : "border-muted"} cursor-pointer hover:bg-accent/50 transition-colors`}
                        onClick={() => setSelectedBadgeId(badge.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value={badge.id} id={`badge-${badge.id}`} className="mt-0" />
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                {badge.image_url ? (
                                  <img src={badge.image_url} alt={badge.name} className="h-8 w-8" />
                                ) : (
                                  <Award className="h-6 w-6 text-primary" />
                                )}
                                <Label htmlFor={`badge-${badge.id}`} className="cursor-pointer font-medium">{badge.name}</Label>
                              </div>
                              {badge.description && (
                                <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

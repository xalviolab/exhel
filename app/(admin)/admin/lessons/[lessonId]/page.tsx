"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, Pencil, Trash2, FileText, LinkIcon, Video } from "lucide-react"
import Link from "next/link"
import { QuestionForm } from "@/components/admin/question-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RichTextEditor } from "@/components/rich-text-editor"
import { LessonSectionForm } from "@/components/admin/lesson-section-form"
import { LessonResourceForm } from "@/components/admin/lesson-resource-form"
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

interface LessonEditPageProps {
  params: {
    lessonId: string
  }
}

export default function LessonEditPage({ params }: LessonEditPageProps) {
  const { lessonId } = params
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [questions, setQuestions] = useState<any[]>([])
  const [sections, setSections] = useState<any[]>([])
  const [resources, setResources] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("basic")

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [orderIndex, setOrderIndex] = useState(0)
  const [xpReward, setXpReward] = useState(10)
  const [isPremium, setIsPremium] = useState(false)
  const [moduleId, setModuleId] = useState("")
  const [content, setContent] = useState("")

  useEffect(() => {
    const fetchLesson = async () => {
      if (!lessonId) return

      try {
        setIsLoading(true)
        const supabase = createClient()

        // Ders bilgilerini al
        const { data, error } = await supabase.from("lessons").select("*").eq("id", lessonId).single()

        if (error) {
          throw error
        }

        if (data) {
          setTitle(data.title || "")
          setDescription(data.description || "")
          setImageUrl(data.image_url || "")
          setOrderIndex(data.order_index || 0)
          setXpReward(data.xp_reward || 10)
          setIsPremium(data.is_premium || false)
          setModuleId(data.module_id || "")
          setContent(data.content || "")
        }

        // Soruları al
        const { data: questionsData, error: questionsError } = await supabase
          .from("questions")
          .select(`
            *,
            answers (*)
          `)
          .eq("lesson_id", lessonId)
          .order("order_index")

        if (questionsError) {
          throw questionsError
        }

        setQuestions(questionsData || [])

        // Bölümleri al
        const { data: sectionsData, error: sectionsError } = await supabase
          .from("lesson_sections")
          .select("*")
          .eq("lesson_id", lessonId)
          .order("order_index")

        if (sectionsError) {
          throw sectionsError
        }

        setSections(sectionsData || [])

        // Kaynakları al
        const { data: resourcesData, error: resourcesError } = await supabase
          .from("lesson_resources")
          .select("*")
          .eq("lesson_id", lessonId)

        if (resourcesError) {
          throw resourcesError
        }

        setResources(resourcesData || [])
      } catch (error: any) {
        toast({
          title: "Hata",
          description: "Ders bilgileri yüklenirken bir hata oluştu: " + error.message,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchLesson()
  }, [lessonId, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const supabase = createClient()

      const { error } = await supabase
        .from("lessons")
        .update({
          title,
          description,
          image_url: imageUrl,
          order_index: orderIndex,
          xp_reward: xpReward,
          is_premium: isPremium,
          content,
        })
        .eq("id", lessonId)

      if (error) {
        throw error
      }

      toast({
        title: "Başarılı",
        description: "Ders başarıyla güncellendi.",
      })
    } catch (error: any) {
      toast({
        title: "Hata",
        description: "Ders güncellenirken bir hata oluştu: " + error.message,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const refreshQuestions = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("questions")
        .select(`
          *,
          answers (*)
        `)
        .eq("lesson_id", lessonId)
        .order("order_index")

      if (error) {
        throw error
      }

      setQuestions(data || [])
    } catch (error: any) {
      toast({
        title: "Hata",
        description: "Sorular yenilenirken bir hata oluştu: " + error.message,
        variant: "destructive",
      })
    }
  }

  const refreshSections = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("lesson_sections")
        .select("*")
        .eq("lesson_id", lessonId)
        .order("order_index")

      if (error) {
        throw error
      }

      setSections(data || [])
    } catch (error: any) {
      toast({
        title: "Hata",
        description: "Bölümler yenilenirken bir hata oluştu: " + error.message,
        variant: "destructive",
      })
    }
  }

  const refreshResources = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("lesson_resources").select("*").eq("lesson_id", lessonId)

      if (error) {
        throw error
      }

      setResources(data || [])
    } catch (error: any) {
      toast({
        title: "Hata",
        description: "Kaynaklar yenilenirken bir hata oluştu: " + error.message,
        variant: "destructive",
      })
    }
  }

  const handleDeleteSection = async (sectionId: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase.from("lesson_sections").delete().eq("id", sectionId)

      if (error) {
        throw error
      }

      toast({
        title: "Başarılı",
        description: "Bölüm başarıyla silindi.",
      })

      refreshSections()
    } catch (error: any) {
      toast({
        title: "Hata",
        description: "Bölüm silinirken bir hata oluştu: " + error.message,
        variant: "destructive",
      })
    }
  }

  const handleDeleteResource = async (resourceId: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase.from("lesson_resources").delete().eq("id", resourceId)

      if (error) {
        throw error
      }

      toast({
        title: "Başarılı",
        description: "Kaynak başarıyla silindi.",
      })

      refreshResources()
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
        return <LinkIcon className="h-4 w-4" />
      case "file":
        return <FileText className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      default:
        return <LinkIcon className="h-4 w-4" />
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="icon">
              <Link href={`/admin/modules/${moduleId}/lessons`}>
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Dersi Düzenle</h1>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Yükleniyor...</p>
            </div>
          </div>
        ) : (
          <>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="basic">Temel Bilgiler</TabsTrigger>
                <TabsTrigger value="content">İçerik</TabsTrigger>
                <TabsTrigger value="sections">Bölümler ve Kaynaklar</TabsTrigger>
                <TabsTrigger value="questions">Sorular</TabsTrigger>
              </TabsList>

              <TabsContent value="basic">
                <Card>
                  <CardHeader>
                    <CardTitle>Ders Bilgileri</CardTitle>
                    <CardDescription>Ders bilgilerini düzenleyin</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid gap-4">
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <div className="flex items-center gap-2">
                          <Switch id="is_premium" checked={isPremium} onCheckedChange={setIsPremium} />
                          <Label htmlFor="is_premium">Premium Ders</Label>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button type="submit" disabled={isSaving}>
                          {isSaving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="content">
                <Card>
                  <CardHeader>
                    <CardTitle>Ders İçeriği</CardTitle>
                    <CardDescription>Zengin metin düzenleyici ile ders içeriğini düzenleyin</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="content">İçerik</Label>
                          <p className="text-sm text-muted-foreground">
                            Görsel eklemek için sürükle-bırak yapabilir veya düzenleyici araç çubuğundaki görsel
                            simgesini kullanabilirsiniz.
                          </p>
                          <RichTextEditor
                            content={content}
                            onChange={setContent}
                            placeholder="Ders içeriğini buraya yazın..."
                            className="min-h-[500px]"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button type="submit" disabled={isSaving}>
                          {isSaving ? "Kaydediliyor..." : "İçeriği Kaydet"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sections">
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Ders Bölümleri</CardTitle>
                        <CardDescription>Derse bölümler ekleyerek içeriği organize edin</CardDescription>
                      </div>
                      <LessonSectionForm lessonId={lessonId} onSuccess={refreshSections} />
                    </CardHeader>
                    <CardContent>
                      {sections && sections.length > 0 ? (
                        <div className="space-y-4">
                          {sections.map((section) => (
                            <div
                              key={section.id}
                              className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-medium">{section.title}</h3>
                                <div className="flex items-center gap-2">
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="ghost" size="sm">
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
                                        <AlertDialogAction onClick={() => handleDeleteSection(section.id)}>
                                          Sil
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Sıra: {section.order_index} | İçerik uzunluğu:{" "}
                                {section.content ? section.content.length : 0} karakter
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-12 text-center">
                          <h3 className="text-xl font-medium">Henüz bölüm bulunmuyor</h3>
                          <p className="text-muted-foreground mt-2 mb-6">Bu derse bölüm ekleyin.</p>
                          <LessonSectionForm lessonId={lessonId} onSuccess={refreshSections} />
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Ders Kaynakları</CardTitle>
                        <CardDescription>Derse ek kaynaklar ekleyin</CardDescription>
                      </div>
                      <LessonResourceForm lessonId={lessonId} onSuccess={refreshResources} />
                    </CardHeader>
                    <CardContent>
                      {resources && resources.length > 0 ? (
                        <div className="space-y-4">
                          {resources.map((resource) => (
                            <div
                              key={resource.id}
                              className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                  {getResourceIcon(resource.type)}
                                  <h3 className="font-medium">{resource.title}</h3>
                                </div>
                                <div className="flex items-center gap-2">
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="ghost" size="sm">
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
                                        <AlertDialogAction onClick={() => handleDeleteResource(resource.id)}>
                                          Sil
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </div>
                              <div className="text-sm text-muted-foreground mb-2">
                                Tür:{" "}
                                {resource.type === "link" ? "Bağlantı" : resource.type === "file" ? "Dosya" : "Video"}
                              </div>
                              <a
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline truncate block"
                              >
                                {resource.url}
                              </a>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-12 text-center">
                          <h3 className="text-xl font-medium">Henüz kaynak bulunmuyor</h3>
                          <p className="text-muted-foreground mt-2 mb-6">Bu derse kaynak ekleyin.</p>
                          <LessonResourceForm lessonId={lessonId} onSuccess={refreshResources} />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="questions">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Sorular</CardTitle>
                      <CardDescription>Bu derse ait soruları yönetin</CardDescription>
                    </div>
                    <QuestionForm lessonId={lessonId} onSuccess={refreshQuestions} />
                  </CardHeader>
                  <CardContent>
                    {questions.length > 0 ? (
                      <div className="space-y-4">
                        {questions.map((question, index) => (
                          <div key={question.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-medium">
                                {index + 1}. {question.question_text}
                              </h3>
                              <div className="flex items-center gap-2">
                                <Button asChild variant="ghost" size="sm">
                                  <Link href={`/admin/questions/${question.id}`}>
                                    <Pencil className="h-4 w-4 mr-1" />
                                    Düzenle
                                  </Link>
                                </Button>
                              </div>
                            </div>
                            <div className="ml-6 mt-2 space-y-1">
                              {question.answers.map((answer: any) => (
                                <div key={answer.id} className="flex items-center gap-2">
                                  <div
                                    className={`w-4 h-4 rounded-full ${
                                      answer.is_correct ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                                    }`}
                                  ></div>
                                  <span className={answer.is_correct ? "font-medium" : ""}>{answer.answer_text}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-12 text-center">
                        <h3 className="text-xl font-medium">Henüz soru bulunmuyor</h3>
                        <p className="text-muted-foreground mt-2 mb-6">Bu derse soru ekleyin.</p>
                        <QuestionForm lessonId={lessonId} onSuccess={refreshQuestions} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </AdminLayout>
  )
}

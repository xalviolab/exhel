"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, Pencil, Trash2, BookOpen } from "lucide-react"
import Link from "next/link"
import { LessonForm } from "@/components/admin/lesson-form"
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

interface LessonsPageProps {
  params: {
    moduleId: string
  }
}

export default function LessonsPage({ params }: LessonsPageProps) {
  const { moduleId } = params
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [module, setModule] = useState<any>(null)
  const [lessons, setLessons] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      if (!moduleId) {
        router.push("/admin/modules")
        return
      }

      try {
        const supabase = createClient()

        // Modül bilgilerini al
        const { data: moduleData, error: moduleError } = await supabase
          .from("modules")
          .select("*")
          .eq("id", moduleId)
          .single()

        if (moduleError) {
          throw new Error(`Modül bilgileri yüklenirken hata: ${moduleError.message}`)
        }

        setModule(moduleData)

        // Dersleri al
        const { data: lessonsData, error: lessonsError } = await supabase
          .from("lessons")
          .select("*")
          .eq("module_id", moduleId)
          .order("order_index")

        if (lessonsError) {
          throw new Error(`Dersler yüklenirken hata: ${lessonsError.message}`)
        }

        setLessons(lessonsData || [])
      } catch (error: any) {
        console.error("Error fetching data:", error)
        toast({
          title: "Hata",
          description: error.message || "Veriler yüklenirken bir hata oluştu.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [moduleId, router, toast])

  const handleDeleteLesson = async (lessonId: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase.from("lessons").delete().eq("id", lessonId)

      if (error) {
        throw error
      }

      // Dersleri güncelle
      setLessons(lessons.filter((lesson) => lesson.id !== lessonId))

      toast({
        title: "Başarılı",
        description: "Ders başarıyla silindi.",
      })
    } catch (error: any) {
      toast({
        title: "Hata",
        description: "Ders silinirken bir hata oluştu: " + error.message,
        variant: "destructive",
      })
    }
  }

  const refreshLessons = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("lessons").select("*").eq("module_id", moduleId).order("order_index")

      if (error) {
        throw error
      }

      setLessons(data || [])
    } catch (error: any) {
      toast({
        title: "Hata",
        description: "Dersler yenilenirken bir hata oluştu: " + error.message,
        variant: "destructive",
      })
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="icon">
              <Link href="/admin/modules">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">
              {isLoading ? "Dersler Yükleniyor..." : `${module?.title} - Dersler`}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <LessonForm moduleId={moduleId} onSuccess={refreshLessons} />
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
          <Card>
            <CardHeader>
              <CardTitle>Dersler</CardTitle>
              <CardDescription>Bu modüle ait dersleri yönetin</CardDescription>
            </CardHeader>
            <CardContent>
              {lessons.length > 0 ? (
                <div className="space-y-4">
                  {lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{lesson.title}</h3>
                          <p className="text-sm text-muted-foreground">{lesson.description || "Açıklama bulunmuyor"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button asChild variant="ghost" size="icon">
                          <Link href={`/admin/lessons/${lesson.id}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Dersi Sil</AlertDialogTitle>
                              <AlertDialogDescription>
                                Bu dersi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>İptal</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteLesson(lesson.id)}>Sil</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium">Henüz ders bulunmuyor</h3>
                  <p className="text-muted-foreground mt-2 mb-6">Bu modüle ders ekleyin.</p>
                  <LessonForm moduleId={moduleId} onSuccess={refreshLessons} />
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}

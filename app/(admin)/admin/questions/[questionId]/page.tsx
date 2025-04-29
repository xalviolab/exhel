"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { QuestionForm } from "@/components/admin/question-form"

interface QuestionEditPageProps {
  params: {
    questionId: string
  }
}

export default function QuestionEditPage({ params }: QuestionEditPageProps) {
  const { questionId } = params
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [question, setQuestion] = useState<any>(null)
  const [lessonId, setLessonId] = useState("")

  useEffect(() => {
    const fetchQuestion = async () => {
      if (!questionId) return

      try {
        const supabase = createClient()

        // Soru bilgilerini al
        const { data, error } = await supabase
          .from("questions")
          .select(`
            *,
            answers (*)
          `)
          .eq("id", questionId)
          .single()

        if (error) {
          throw error
        }

        if (data) {
          setQuestion(data)
          setLessonId(data.lesson_id)
        }
      } catch (error: any) {
        toast({
          title: "Hata",
          description: "Soru bilgileri yüklenirken bir hata oluştu: " + error.message,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuestion()
  }, [questionId, toast])

  const handleSuccess = () => {
    router.push(`/admin/lessons/${lessonId}`)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="icon">
              <Link href={`/admin/lessons/${lessonId}`}>
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Soruyu Düzenle</h1>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Yükleniyor...</p>
            </div>
          </div>
        ) : question ? (
          <Card>
            <CardHeader>
              <CardTitle>Soru Bilgileri</CardTitle>
              <CardDescription>Soru bilgilerini düzenleyin</CardDescription>
            </CardHeader>
            <CardContent>
              <QuestionForm
                lessonId={lessonId}
                questionId={questionId}
                defaultValues={{
                  question_text: question.question_text,
                  question_type: question.question_type,
                  image_url: question.image_url || "",
                  order_index: question.order_index,
                  xp_value: question.xp_value,
                  answers: question.answers,
                }}
                onSuccess={handleSuccess}
              />
            </CardContent>
          </Card>
        ) : (
          <div className="text-center">
            <p>Soru bulunamadı.</p>
            <Button asChild className="mt-4">
              <Link href="/admin/questions">Sorular Sayfasına Dön</Link>
            </Button>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

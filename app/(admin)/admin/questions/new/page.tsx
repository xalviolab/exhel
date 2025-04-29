"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Trash2, Plus } from "lucide-react"

export default function NewQuestionPage() {
  const [modules, setModules] = useState<any[]>([])
  const [lessons, setLessons] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingModules, setIsLoadingModules] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  // Form state
  const [moduleId, setModuleId] = useState("")
  const [lessonId, setLessonId] = useState("")
  const [questionText, setQuestionText] = useState("")
  const [questionType, setQuestionType] = useState("multiple_choice")
  const [imageUrl, setImageUrl] = useState("")
  const [orderIndex, setOrderIndex] = useState(0)
  const [xpValue, setXpValue] = useState(5)
  const [answers, setAnswers] = useState([
    { answer_text: "", is_correct: true, explanation: "" },
    { answer_text: "", is_correct: false, explanation: "" },
  ])

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase.from("modules").select("id, title").order("order_index")

        if (error) throw error

        setModules(data || [])
        if (data && data.length > 0) {
          setModuleId(data[0].id)
          fetchLessons(data[0].id)
        }
      } catch (error) {
        console.error("Error fetching modules:", error)
        toast({
          title: "Hata",
          description: "Modüller yüklenirken bir hata oluştu.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingModules(false)
      }
    }

    fetchModules()
  }, [toast])

  const fetchLessons = async (moduleId: string) => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("lessons")
        .select("id, title")
        .eq("module_id", moduleId)
        .order("order_index")

      if (error) throw error

      setLessons(data || [])
      if (data && data.length > 0) {
        setLessonId(data[0].id)
      } else {
        setLessonId("")
      }
    } catch (error) {
      console.error("Error fetching lessons:", error)
      toast({
        title: "Hata",
        description: "Dersler yüklenirken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  const handleModuleChange = (value: string) => {
    setModuleId(value)
    fetchLessons(value)
  }

  const handleAnswerChange = (index: number, field: string, value: any) => {
    const newAnswers = [...answers]
    newAnswers[index] = { ...newAnswers[index], [field]: value }
    setAnswers(newAnswers)
  }

  const handleCorrectAnswerChange = (index: number, value: boolean) => {
    if (value) {
      // Eğer bu cevap doğru olarak işaretlendiyse, diğer tüm cevapları yanlış yap
      const newAnswers = answers.map((answer, i) => ({
        ...answer,
        is_correct: i === index,
      }))
      setAnswers(newAnswers)
    } else {
      // En az bir doğru cevap olmalı
      toast({
        title: "Uyarı",
        description: "En az bir doğru cevap olmalıdır.",
      })
    }
  }

  const addAnswer = () => {
    setAnswers([...answers, { answer_text: "", is_correct: false, explanation: "" }])
  }

  const removeAnswer = (index: number) => {
    if (answers.length <= 2) {
      toast({
        title: "Uyarı",
        description: "En az iki cevap seçeneği olmalıdır.",
      })
      return
    }

    // Eğer silinen cevap doğruysa, ilk cevabı doğru yap
    const isRemovingCorrect = answers[index].is_correct
    const newAnswers = answers.filter((_, i) => i !== index)

    if (isRemovingCorrect && newAnswers.every((a) => !a.is_correct)) {
      newAnswers[0].is_correct = true
    }

    setAnswers(newAnswers)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!lessonId) {
      toast({
        title: "Uyarı",
        description: "Lütfen bir ders seçin.",
      })
      return
    }

    if (answers.some((a) => !a.answer_text.trim())) {
      toast({
        title: "Uyarı",
        description: "Tüm cevap seçenekleri doldurulmalıdır.",
      })
      return
    }

    if (!answers.some((a) => a.is_correct)) {
      toast({
        title: "Uyarı",
        description: "En az bir doğru cevap olmalıdır.",
      })
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()

      // Önce soruyu ekle
      const { data: questionData, error: questionError } = await supabase
        .from("questions")
        .insert({
          lesson_id: lessonId,
          question_text: questionText,
          question_type: questionType,
          image_url: imageUrl || null,
          order_index: orderIndex,
          xp_value: xpValue,
        })
        .select()
        .single()

      if (questionError) throw questionError

      // Sonra cevapları ekle
      const answersWithQuestionId = answers.map((answer) => ({
        ...answer,
        question_id: questionData.id,
      }))

      const { error: answersError } = await supabase.from("answers").insert(answersWithQuestionId)

      if (answersError) throw answersError

      toast({
        title: "Başarılı",
        description: "Soru başarıyla eklendi.",
      })

      router.push("/admin/questions")
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message || "Soru eklenirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Yeni Soru</h1>
          <p className="text-muted-foreground">Yeni bir soru oluşturun</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ders Seçimi</CardTitle>
                <CardDescription>Sorunun ekleneceği modül ve dersi seçin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="module">Modül</Label>
                    <Select value={moduleId} onValueChange={handleModuleChange} disabled={isLoadingModules}>
                      <SelectTrigger id="module">
                        <SelectValue placeholder="Modül seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {modules.map((module) => (
                          <SelectItem key={module.id} value={module.id}>
                            {module.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lesson">Ders</Label>
                    <Select value={lessonId} onValueChange={setLessonId} disabled={!moduleId}>
                      <SelectTrigger id="lesson">
                        <SelectValue placeholder="Ders seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {lessons.map((lesson) => (
                          <SelectItem key={lesson.id} value={lesson.id}>
                            {lesson.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Soru Bilgileri</CardTitle>
                <CardDescription>Soru detaylarını girin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="question_text">Soru Metni</Label>
                  <Textarea
                    id="question_text"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder="Soru metni"
                    required
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="question_type">Soru Tipi</Label>
                    <Select value={questionType} onValueChange={setQuestionType}>
                      <SelectTrigger id="question_type">
                        <SelectValue placeholder="Soru tipi seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="multiple_choice">Çoktan Seçmeli</SelectItem>
                        <SelectItem value="true_false">Doğru/Yanlış</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="order_index">Sıra</Label>
                    <Input
                      id="order_index"
                      type="number"
                      value={orderIndex}
                      onChange={(e) => setOrderIndex(Number.parseInt(e.target.value))}
                      min={0}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="xp_value">XP Değeri</Label>
                    <Input
                      id="xp_value"
                      type="number"
                      value={xpValue}
                      onChange={(e) => setXpValue(Number.parseInt(e.target.value))}
                      min={1}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image_url">Görsel URL (Opsiyonel)</Label>
                  <Input
                    id="image_url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cevap Seçenekleri</CardTitle>
                <CardDescription>Soru için cevap seçeneklerini girin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {answers.map((answer, index) => (
                  <div key={index} className="space-y-4 p-4 border rounded-md">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Cevap {index + 1}</h4>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeAnswer(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`answer_text_${index}`}>Cevap Metni</Label>
                      <Input
                        id={`answer_text_${index}`}
                        value={answer.answer_text}
                        onChange={(e) => handleAnswerChange(index, "answer_text", e.target.value)}
                        placeholder="Cevap metni"
                        required
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`is_correct_${index}`}
                        checked={answer.is_correct}
                        onCheckedChange={(checked) => handleCorrectAnswerChange(index, checked)}
                      />
                      <Label htmlFor={`is_correct_${index}`}>Doğru Cevap</Label>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`explanation_${index}`}>Açıklama (Opsiyonel)</Label>
                      <Textarea
                        id={`explanation_${index}`}
                        value={answer.explanation}
                        onChange={(e) => handleAnswerChange(index, "explanation", e.target.value)}
                        placeholder="Cevap için açıklama"
                        rows={2}
                      />
                    </div>
                  </div>
                ))}

                <Button type="button" variant="outline" onClick={addAnswer} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Cevap Ekle
                </Button>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Kaydediliyor..." : "Soruyu Kaydet"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}

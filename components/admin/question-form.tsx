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
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"
import { Plus, Trash2, Check } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

interface QuestionFormProps {
  lessonId: string
  questionId?: string
  defaultValues?: {
    question_text: string
    question_type: string
    image_url: string
    order_index: number
    xp_value: number
    answers: Array<{
      answer_text: string
      is_correct: boolean
      explanation: string
    }>
  }
  onSuccess?: () => void
}

export function QuestionForm({ lessonId, questionId, defaultValues, onSuccess }: QuestionFormProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const [questionText, setQuestionText] = useState(defaultValues?.question_text || "")
  const [questionType, setQuestionType] = useState(defaultValues?.question_type || "multiple_choice")
  const [imageUrl, setImageUrl] = useState(defaultValues?.image_url || "")
  const [orderIndex, setOrderIndex] = useState(defaultValues?.order_index || 0)
  const [xpValue, setXpValue] = useState(defaultValues?.xp_value || 10)
  const [answers, setAnswers] = useState<
    Array<{
      id?: string
      answer_text: string
      is_correct: boolean
      explanation: string
    }>
  >(
    defaultValues?.answers || [
      { answer_text: "", is_correct: true, explanation: "" },
      { answer_text: "", is_correct: false, explanation: "" },
    ],
  )

  const addAnswer = () => {
    setAnswers([...answers, { answer_text: "", is_correct: false, explanation: "" }])
  }

  const removeAnswer = (index: number) => {
    const newAnswers = [...answers]
    newAnswers.splice(index, 1)
    setAnswers(newAnswers)
  }

  const updateAnswer = (index: number, field: string, value: string | boolean) => {
    const newAnswers = [...answers]
    newAnswers[index] = { ...newAnswers[index], [field]: value }
    setAnswers(newAnswers)
  }

  const setCorrectAnswer = (index: number) => {
    const newAnswers = answers.map((answer, i) => ({
      ...answer,
      is_correct: i === index,
    }))
    setAnswers(newAnswers)
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

    if (answers.length < 2) {
      toast({
        title: "Hata",
        description: "En az 2 cevap eklemelisiniz.",
        variant: "destructive",
      })
      return
    }

    if (!answers.some((answer) => answer.is_correct)) {
      toast({
        title: "Hata",
        description: "En az bir doğru cevap işaretlemelisiniz.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()

      // Yeni soru ID'si oluştur
      const newQuestionId = questionId || uuidv4()

      if (questionId) {
        // Soruyu güncelle
        const { error } = await supabase
          .from("questions")
          .update({
            question_text: questionText,
            question_type: questionType,
            image_url: imageUrl,
            order_index: orderIndex,
            xp_value: xpValue,
          })
          .eq("id", questionId)

        if (error) throw error

        // Mevcut cevapları sil
        const { error: deleteError } = await supabase.from("answers").delete().eq("question_id", questionId)

        if (deleteError) throw deleteError
      } else {
        // Yeni soru oluştur
        const { error } = await supabase.from("questions").insert({
          id: newQuestionId,
          lesson_id: lessonId,
          question_text: questionText,
          question_type: questionType,
          image_url: imageUrl,
          order_index: orderIndex,
          xp_value: xpValue,
        })

        if (error) throw error
      }

      // Cevapları ekle
      const answersToInsert = answers.map((answer) => ({
        id: uuidv4(),
        question_id: newQuestionId,
        answer_text: answer.answer_text,
        is_correct: answer.is_correct,
        explanation: answer.explanation,
      }))

      const { error: answersError } = await supabase.from("answers").insert(answersToInsert)

      if (answersError) throw answersError

      toast({
        title: questionId ? "Soru güncellendi" : "Soru oluşturuldu",
        description: questionId ? "Soru başarıyla güncellendi." : "Yeni soru başarıyla oluşturuldu.",
      })

      setOpen(false)

      // Form alanlarını temizle
      if (!questionId) {
        setQuestionText("")
        setQuestionType("multiple_choice")
        setImageUrl("")
        setOrderIndex(0)
        setXpValue(10)
        setAnswers([
          { answer_text: "", is_correct: true, explanation: "" },
          { answer_text: "", is_correct: false, explanation: "" },
        ])
      }

      // Başarı callback'i çağır
      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message || "Soru kaydedilirken bir hata oluştu.",
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
          {questionId ? "Soruyu Düzenle" : "Yeni Soru"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{questionId ? "Soruyu Düzenle" : "Yeni Soru Oluştur"}</DialogTitle>
            <DialogDescription>
              {questionId
                ? "Soru bilgilerini güncelleyin."
                : "Yeni bir soru oluşturmak için aşağıdaki bilgileri doldurun."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="question_text">Soru Metni</Label>
              <Textarea
                id="question_text"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                rows={3}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="question_type">Soru Tipi</Label>
              <Select value={questionType} onValueChange={setQuestionType}>
                <SelectTrigger>
                  <SelectValue placeholder="Soru tipi seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple_choice">Çoktan Seçmeli</SelectItem>
                  <SelectItem value="true_false">Doğru/Yanlış</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image_url">Görsel URL (Opsiyonel)</Label>
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
                <Label htmlFor="xp_value">XP Değeri</Label>
                <Input
                  id="xp_value"
                  type="number"
                  value={xpValue}
                  onChange={(e) => setXpValue(Number.parseInt(e.target.value))}
                  min={1}
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Cevaplar</Label>
                <Button type="button" variant="outline" size="sm" onClick={addAnswer}>
                  <Plus className="h-4 w-4 mr-1" /> Cevap Ekle
                </Button>
              </div>

              {answers.map((answer, index) => (
                <div key={index} className="space-y-2 p-3 border rounded-md">
                  <div className="flex items-center justify-between">
                    <Label>Cevap {index + 1}</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant={answer.is_correct ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCorrectAnswer(index)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        {answer.is_correct ? "Doğru" : "Doğru Yap"}
                      </Button>
                      {answers.length > 2 && (
                        <Button type="button" variant="outline" size="sm" onClick={() => removeAnswer(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <Input
                    value={answer.answer_text}
                    onChange={(e) => updateAnswer(index, "answer_text", e.target.value)}
                    placeholder="Cevap metni"
                    required
                  />
                  <Textarea
                    value={answer.explanation}
                    onChange={(e) => updateAnswer(index, "explanation", e.target.value)}
                    placeholder="Açıklama (opsiyonel)"
                    rows={2}
                  />
                </div>
              ))}
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

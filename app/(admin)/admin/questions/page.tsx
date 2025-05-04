import { requireAdmin } from "@/lib/auth"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HelpCircle, Plus } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function AdminQuestionsPage() {
  await requireAdmin()

  const supabase = await import("@/lib/supabase/server").then((mod) => mod.createServerClient())

  // Modülleri getir
  const { data: modules } = await supabase.from("modules").select("id, title").order("order_index")

  // İlk modülün derslerini getir (varsayılan olarak)
  const firstModuleId = modules && modules.length > 0 ? modules[0].id : null

  // Dersleri getir
  const { data: lessons } = firstModuleId
    ? await supabase.from("lessons").select("id, title").eq("module_id", firstModuleId).order("order_index")
    : { data: [] }

  // İlk dersin sorularını getir (varsayılan olarak)
  const firstLessonId = lessons && lessons.length > 0 ? lessons[0].id : null

  // Soruları getir
  const { data: questions } = firstLessonId
    ? await supabase
      .from("questions")
      .select(`
          *,
          answers (*)
        `)
      .eq("lesson_id", firstLessonId)
      .order("order_index")
    : { data: [] }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Soru Yönetimi</h1>
            <p className="text-muted-foreground">Soruları görüntüleyin ve yönetin</p>
          </div>
          <Button asChild>
            <Link href="/admin/questions/new">
              <Plus className="h-4 w-4 mr-2" />
              Yeni Soru
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Modül ve Ders Seçimi</CardTitle>
              <CardDescription>Soruları görüntülemek için modül ve ders seçin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="module" className="text-sm font-medium">
                  Modül
                </label>
                <Select defaultValue={firstModuleId || ""}>
                  <SelectTrigger id="module">
                    <SelectValue placeholder="Modül seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {modules?.map((module) => (
                      <SelectItem key={module.id} value={module.id}>
                        {module.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="lesson" className="text-sm font-medium">
                  Ders
                </label>
                <Select defaultValue={firstLessonId || ""}>
                  <SelectTrigger id="lesson">
                    <SelectValue placeholder="Ders seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {lessons?.map((lesson) => (
                      <SelectItem key={lesson.id} value={lesson.id}>
                        {lesson.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full">Soruları Göster</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Soru Arama</CardTitle>
              <CardDescription>Soru metni veya ID ile arama yapın</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="search" className="text-sm font-medium">
                  Arama
                </label>
                <Input id="search" placeholder="Soru metni veya ID" />
              </div>
              <Button className="w-full">Ara</Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sorular</CardTitle>
            <CardDescription>
              {firstLessonId && lessons?.find((l) => l.id === firstLessonId)?.title} dersine ait sorular
            </CardDescription>
          </CardHeader>
          <CardContent>
            {questions && questions.length > 0 ? (
              <div className="space-y-4">
                {questions.map((question) => (
                  <Card key={question.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <h3 className="font-medium">{question.question_text}</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-muted px-2 py-1 rounded-md">
                              {question.question_type === "multiple_choice"
                                ? "Çoktan Seçmeli"
                                : question.question_type === "true_false"
                                  ? "Doğru/Yanlış"
                                  : question.question_type}
                            </span>
                            <span className="text-xs bg-muted px-2 py-1 rounded-md">{question.xp_value} XP</span>
                          </div>
                        </div>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/questions/${question.id}`}>Düzenle</Link>
                        </Button>
                      </div>

                      {question.answers && question.answers.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <p className="text-sm font-medium">Cevaplar:</p>
                          <div className="grid gap-2">
                            {question.answers.map((answer) => (
                              <div
                                key={answer.id}
                                className={`p-2 border rounded-md ${answer.is_correct
                                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                                    : "border-gray-200"
                                  }`}
                              >
                                <div className="flex justify-between items-center">
                                  <span>{answer.answer_text}</span>
                                  {answer.is_correct && (
                                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                                      Doğru Cevap
                                    </span>
                                  )}
                                </div>
                                {answer.explanation && (
                                  <p className="text-xs text-muted-foreground mt-1">{answer.explanation}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <HelpCircle className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium">Henüz soru bulunmuyor</h3>
                <p className="text-muted-foreground mt-2 mb-6">Bu derse soru ekleyin.</p>
                <Button asChild>
                  <Link href="/admin/questions/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Yeni Soru
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

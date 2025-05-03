"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Heart, AlertCircle, CheckCircle, XCircle, ArrowRight, Trophy } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface QuizPageProps {
  params: {
    lessonId: string
  }
}

export default function QuizPage({ params }: QuizPageProps) {
  const router = useRouter()
  const [questions, setQuestions] = useState<any[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>([])
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [hearts, setHearts] = useState(5)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [totalXp, setTotalXp] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [earnedBadge, setEarnedBadge] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient()

        // Kullanıcı bilgilerini al
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          router.push("/login")
          return
        }

        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single()

        if (userError) {
          throw userError
        }

        setUser(userData)
        setHearts(userData.hearts)

        // Dersin bilgilerini al
        const { data: lessonData } = await supabase
          .from("lessons")
          .select("*, modules(*)")
          .eq("id", params.lessonId)
          .single()

        if (!lessonData) {
          throw new Error("Ders bulunamadı")
        }

        // Erişim kontrolü - isLessonLocked fonksiyonunu doğrudan çağıramıyoruz (client side)
        // Bu yüzden RPC kullanıyoruz
        const { data: isLocked, error: lockCheckError } = await supabase.rpc(
          'check_lesson_access',
          { p_user_id: session.user.id, p_lesson_id: params.lessonId }
        )

        if (lockCheckError) {
          console.error("Ders erişim kontrolü yapılamadı:", lockCheckError)
          // Hata durumunda güvenli tarafta kal
          router.push(`/modules/${lessonData.module_id}`)
          return
        }

        // Kullanıcının ilerleme durumunu kontrol et
        const { data: userProgress } = await supabase
          .from("user_progress")
          .select("*")
          .eq("user_id", session.user.id)

        // Ders daha önce tamamlanmış mı kontrol et
        const lessonCompleted = userProgress?.some(p => p.lesson_id === params.lessonId && p.completed)

        // Ders kilitliyse ve tamamlanmamışsa modül sayfasına yönlendir
        if (isLocked && !lessonCompleted) {
          router.push(`/modules/${lessonData.module_id}`)
          return
        }

        // Soruları al
        const { data: questionsData, error: questionsError } = await supabase
          .from("questions")
          .select(`
            *,
            answers (*)
          `)
          .eq("lesson_id", params.lessonId)
          .order("order_index")

        if (questionsError) {
          throw questionsError
        }

        setQuestions(questionsData || [])
      } catch (error: any) {
        setError(error.message || "Bir hata oluştu.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.lessonId, router])

  const currentQuestion = questions[currentQuestionIndex]

  const handleAnswerSelect = (answerId: string) => {
    if (isAnswerSubmitted) return
    setSelectedAnswer(answerId)
  }

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || !currentQuestion || !user) return

    const selectedAnswerObj = currentQuestion.answers.find((a: any) => a.id === selectedAnswer)
    const isAnswerCorrect = selectedAnswerObj?.is_correct || false

    setIsAnswerSubmitted(true)
    setIsCorrect(isAnswerCorrect)
    setShowFeedback(true)

    if (isAnswerCorrect) {
      setScore(score + currentQuestion.xp_value)
      setTotalXp(totalXp + currentQuestion.xp_value)
    } else {
      // Yanlış cevap verdiğinde kalp azalt (0'dan aşağı düşmemeli)
      const newHearts = Math.max(0, hearts - 1)
      setHearts(newHearts)

      // Kalpleri güncelle
      const supabase = createClient()
      await supabase.from("users").update({ hearts: newHearts }).eq("id", user.id)

      // Kalp 0 olduğunda yenilenme süresi bilgisi göster
      if (newHearts === 0) {
        toast({
          title: "Kalpleriniz tükendi",
          description: "24 saat içinde yenilenecektir.",
          variant: "destructive"
        })
      }

      // Kalp kalmadıysa dersi tekrar etmesi gerekiyor
      if (newHearts <= 0) {
        setTimeout(() => {
          router.push(`/modules/${currentQuestion.lesson_id}`)
        }, 2000)
        return
      }
    }
  }

  const handleNextQuestion = () => {
    // Seçilen cevabı kaydet
    setSelectedAnswers(prev => {
      const newAnswers = [...prev]
      newAnswers[currentQuestionIndex] = selectedAnswer
      return newAnswers
    })

    setSelectedAnswer(null)
    setIsAnswerSubmitted(false)
    setShowFeedback(false)

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      completeQuiz()
    }
  }

  const completeQuiz = async () => {
    if (!user) return

    setQuizCompleted(true)

    try {
      const supabase = createClient()

      // Dersi tamamla
      await supabase.from("user_progress").upsert({
        user_id: user.id,
        lesson_id: params.lessonId,
        completed: true,
        score: score,
        completed_at: new Date().toISOString(),
      })

      // XP ekle
      await supabase
        .from("users")
        .update({
          xp: user.xp + totalXp,
        })
        .eq("id", user.id)

      // Kullanıcı istatistiklerini güncelle
      // Doğru cevap sayısını hesapla
      const correctAnswersCount = questions.reduce((count, question, index) => {
        const questionResult = question.answers.find(a => a.id === selectedAnswers[index])?.is_correct || false
        return questionResult ? count + 1 : count
      }, 0)

      // Quiz istatistiklerini güncelle
      await supabase.rpc('update_quiz_stats', {
        p_user_id: user.id,
        p_lesson_id: params.lessonId,
        p_score: score,
        p_total_possible_score: questions.reduce((total, q) => total + q.xp_value, 0),
        p_correct_answers: correctAnswersCount,
        p_total_questions: questions.length
      })

      // Ders tamamlandığında rozet kontrolü
      const { data: lessonData } = await supabase
        .from('lessons')
        .select('badge_id')
        .eq('id', params.lessonId)
        .single()

      if (lessonData?.badge_id) {
        // Kullanıcının bu rozeti daha önce kazanıp kazanmadığını kontrol et
        const { data: existingBadge } = await supabase
          .from('user_badges')
          .select('id')
          .eq('user_id', user.id)
          .eq('badge_id', lessonData.badge_id)
          .single()

        if (!existingBadge) {
          // Kullanıcıya rozeti ver
          await supabase.from('user_badges').insert({
            user_id: user.id,
            badge_id: lessonData.badge_id,
            earned_at: new Date().toISOString()
          })

          // Rozet bilgilerini al ve state'e kaydet
          const { data: badgeData } = await supabase
            .from('badges')
            .select('*')
            .eq('id', lessonData.badge_id)
            .single()

          if (badgeData) {
            setEarnedBadge(badgeData)
          }
        }
      }
    } catch (error) {
      console.error("Quiz tamamlanırken hata oluştu:", error)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Yükleniyor...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => router.back()}>Geri Dön</Button>
      </DashboardLayout>
    )
  }

  if (questions.length === 0) {
    return (
      <DashboardLayout>
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Bu ders için soru bulunamadı</h2>
          <p className="text-muted-foreground mb-6">Bu ders için henüz soru eklenmemiş.</p>
          <Button onClick={() => router.back()}>Geri Dön</Button>
        </div>
      </DashboardLayout>
    )
  }

  if (quizCompleted) {
    return (
      <DashboardLayout>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="max-w-2xl mx-auto overflow-hidden border-2">
            <div className="bg-primary/10 p-6 flex justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
              >
                <div className="bg-primary/20 rounded-full p-6">
                  <Trophy className="h-16 w-16 text-primary" />
                </div>
              </motion.div>
            </div>
            <CardHeader>
              <CardTitle className="text-center text-2xl">Quiz Tamamlandı!</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <h3 className="text-xl font-bold mb-2">Tebrikler!</h3>
                <p className="text-muted-foreground mb-6">Bu dersi başarıyla tamamladınız.</p>
                <div className="flex justify-center items-center gap-8 mb-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-1">{totalXp}</div>
                    <p className="text-sm text-muted-foreground">Kazanılan XP</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-1">
                      {Math.round((score / questions.reduce((acc, q) => acc + q.xp_value, 0)) * 100)}%
                    </div>
                    <p className="text-sm text-muted-foreground">Doğruluk</p>
                  </div>
                </div>

                {earnedBadge && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, type: "spring", stiffness: 200, damping: 15 }}
                    className="mt-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6 max-w-md mx-auto"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-800/50">
                        {earnedBadge.image_url ? (
                          <img src={earnedBadge.image_url} alt={earnedBadge.name} className="h-12 w-12" />
                        ) : (
                          <Trophy className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                        )}
                      </div>
                      <div className="text-left">
                        <h3 className="text-lg font-bold text-amber-800 dark:text-amber-300">Yeni Rozet Kazandınız!</h3>
                        <p className="text-amber-700 dark:text-amber-400 font-medium">{earnedBadge.name}</p>
                        {earnedBadge.description && (
                          <p className="text-sm text-amber-600 dark:text-amber-500 mt-1">{earnedBadge.description}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </CardContent>
            <CardFooter className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => router.push(`/modules/${currentQuestion?.modules?.id}`)}>
                Modüle Dön
              </Button>
              <Button onClick={() => router.push("/dashboard")}>Ana Sayfaya Dön</Button>
            </CardFooter>
          </Card>
        </motion.div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-full">
              <Heart className="h-5 w-5" />
              <span className="font-medium">{hearts}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Soru {currentQuestionIndex + 1}/{questions.length}
            </span>
          </div>
        </div>

        <Progress value={(currentQuestionIndex / questions.length) * 100} className="h-2 mb-8" />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="overflow-hidden border-2">
              <CardHeader className="bg-primary/5">
                <CardTitle>{currentQuestion?.question_text}</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {currentQuestion?.answers.map((answer: any) => (
                    <div
                      key={answer.id}
                      className={cn(
                        "p-4 border rounded-md cursor-pointer transition-all",
                        selectedAnswer === answer.id
                          ? isAnswerSubmitted
                            ? answer.is_correct
                              ? "bg-green-100 border-green-500 dark:bg-green-900/30 dark:border-green-500"
                              : "bg-red-100 border-red-500 dark:bg-red-900/30 dark:border-red-500"
                            : "bg-primary/10 border-primary"
                          : isAnswerSubmitted && answer.is_correct
                            ? "bg-green-100 border-green-500 dark:bg-green-900/30 dark:border-green-500"
                            : "hover:bg-accent",
                        !isAnswerSubmitted && "hover:-translate-y-0.5 hover:shadow-md",
                      )}
                      onClick={() => handleAnswerSelect(answer.id)}
                    >
                      <div className="flex items-center justify-between">
                        <span>{answer.answer_text}</span>
                        {isAnswerSubmitted &&
                          (answer.is_correct ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : selectedAnswer === answer.id ? (
                            <XCircle className="h-5 w-5 text-red-500" />
                          ) : null)}
                      </div>

                      {showFeedback && isAnswerSubmitted && answer.is_correct && answer.explanation && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          transition={{ duration: 0.3 }}
                        >
                          <p className="mt-2 text-sm text-muted-foreground bg-muted p-2 rounded">
                            {answer.explanation}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end p-6">
                {isAnswerSubmitted ? (
                  <Button onClick={handleNextQuestion} className="group">
                    {currentQuestionIndex < questions.length - 1 ? "Sonraki Soru" : "Tamamla"}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmitAnswer} disabled={!selectedAnswer}>
                    Cevabı Kontrol Et
                  </Button>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </DashboardLayout>
  )
}

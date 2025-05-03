// Sayfayı dinamik olarak işaretle
export const dynamic = 'force-dynamic'

import { getUserDetails, requireAuth } from "@/lib/auth"
import { getModuleDetails, getUserProgress } from "@/lib/db"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BookOpen, Check, Lock, Award } from "lucide-react"
import { notFound } from "next/navigation"

interface ModulePageProps {
  params: {
    moduleId: string
  }
}

export default async function ModulePage({ params }: ModulePageProps) {
  const session = await requireAuth()
  const user = await getUserDetails()

  if (!user) {
    return <div>Kullanıcı bilgileri yüklenemedi.</div>
  }

  const module = await getModuleDetails(params.moduleId)

  if (!module) {
    notFound()
  }

  const userProgress = await getUserProgress(user.id)

  // Derslerin tamamlanma durumunu kontrol et
  const lessonsWithProgress = module.lessons.map((lesson: any) => {
    const progress = userProgress.find((p: any) => p.lesson_id === lesson.id)
    return {
      ...lesson,
      completed: progress?.completed || false,
      attempted: progress ? true : false, // Ders denenmiş mi kontrol et
      score: progress?.score || 0,
    };
  })

  // Derslerin kilit durumunu kontrol et
  // İlk ders her zaman açık, diğerleri bir önceki ders tamamlanmışsa açık
  // Ayrıca kalp sayısı 0 ise ve ders tamamlanmamışsa kilitli olarak işaretle
  const lessonsWithLockStatus = lessonsWithProgress.map((lesson: any, index: number) => {
    // Ders daha önce tamamlanmış mı kontrol et
    const isCompleted = lesson.completed

    // Tamamlanmış dersler her zaman erişilebilir
    if (isCompleted) {
      return { ...lesson, locked: false }
    }

    // Kalp sayısı 0 ise ve ders tamamlanmamışsa kilitli
    if (user.hearts <= 0) {
      return { ...lesson, locked: true }
    }

    // İlk ders her zaman açık (kalp varsa)
    if (index === 0) {
      return { ...lesson, locked: false }
    }

    // Diğer dersler için önceki ders tamamlanmışsa açık
    const previousLesson = lessonsWithProgress[index - 1]
    return { ...lesson, locked: !previousLesson.completed }
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{module.title}</h1>
            <p className="text-muted-foreground">{module.description || "Bu modül hakkında açıklama bulunmuyor."}</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/modules">Tüm Modüller</Link>
          </Button>
        </div>

        <div className="grid gap-6">
          {lessonsWithLockStatus.map((lesson: any, index: number) => {
            // Standart görünüm kullan
            const standardGradient = "from-primary to-primary/80";

            return (
              <Card
                key={lesson.id}
                className={`overflow-hidden transition-all duration-300 hover:shadow-md ${lesson.locked ? 'opacity-75' : ''}`}
              >
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-2 h-2 md:h-auto bg-gradient-to-r from-primary to-primary/80"></div>
                    <div className="p-6 flex-1">
                      <div className="flex items-center gap-4">
                        <div className={`flex h-14 w-14 items-center justify-center rounded-full ${lesson.completed ? 'bg-green-100 dark:bg-green-900/30' : lesson.locked ? 'bg-muted' : 'bg-gradient-to-br from-primary to-primary/80'}`}>
                          {lesson.completed ? (
                            <Check className="h-7 w-7 text-green-500" />
                          ) : lesson.locked ? (
                            <Lock className="h-7 w-7 text-muted-foreground" />
                          ) : (
                            <BookOpen className="h-7 w-7 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-medium">{lesson.title}</h3>
                            {lesson.badge_id && (
                              <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-md text-xs font-medium flex items-center gap-1">
                                <Award className="h-3 w-3" />
                                Rozetli
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {lesson.description || "Bu ders hakkında açıklama bulunmuyor."}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">{lesson.xp_reward} XP</div>
                          <Button
                            asChild
                            variant={lesson.completed ? "outline" : "default"}
                            disabled={lesson.locked}
                            className={!lesson.locked && !lesson.completed ? 'bg-primary' : ''}
                            size="sm"
                          >
                            <Link href={`/lessons/${lesson.id}`}>
                              {lesson.completed ? "Tekrar Et" : lesson.locked ? "Kilitli" : lesson.attempted && !lesson.completed ? "Tekrar Dene" : "Başla"}
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}


          {module.lessons.length === 0 && (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium">Bu modülde henüz ders bulunmuyor</h3>
              <p className="text-muted-foreground mt-2">Yakında yeni dersler eklenecek.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

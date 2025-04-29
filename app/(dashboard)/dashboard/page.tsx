import { getUserDetails, requireAuth } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Award, BookOpen, Heart, Flame, Trophy, TrendingUp, ArrowRight, CheckCircle, Activity } from "lucide-react"
import { cn } from "@/lib/utils"

// Varsayılan modüller
const defaultModules = [
  {
    id: 1,
    title: "Kardiyoloji Temelleri",
    description: "Kardiyoloji biliminin temel prensipleri ve kalp anatomisi",
    image_url: "/placeholder.svg?height=200&width=300",
    is_premium: false,
  },
  {
    id: 2,
    title: "EKG Okuma",
    description: "EKG okuma ve yorumlama teknikleri",
    image_url: "/placeholder.svg?height=200&width=300",
    is_premium: false,
  },
  {
    id: 3,
    title: "Kalp Hastalıkları",
    description: "Yaygın kalp hastalıkları ve tedavi yöntemleri",
    image_url: "/placeholder.svg?height=200&width=300",
    is_premium: false,
  },
  {
    id: 4,
    title: "İleri Kardiyoloji",
    description: "Kardiyolojide ileri konular ve vaka çalışmaları",
    image_url: "/placeholder.svg?height=200&width=300",
    is_premium: true,
  },
]

// Varsayılan rozetler
const defaultBadges = [
  {
    id: 1,
    badges: {
      id: 1,
      name: "Kardiyoloji Çaylağı",
      description: "İlk dersini tamamladın!",
      image_url: "/placeholder.svg?height=100&width=100",
    },
  },
  {
    id: 2,
    badges: {
      id: 2,
      name: "EKG Uzmanı",
      description: "10 EKG testini başarıyla geçtin!",
      image_url: "/placeholder.svg?height=100&width=100",
    },
  },
  {
    id: 3,
    badges: {
      id: 3,
      name: "Kalp Dostu",
      description: "30 gün boyunca her gün çalıştın!",
      image_url: "/placeholder.svg?height=100&width=100",
    },
  },
]

// Varsayılan ilerleme
const defaultProgress = [
  {
    id: 1,
    lesson_id: 1,
    lesson_title: "Kalp Anatomisi",
    module_id: 1,
    completed: false,
  },
  {
    id: 2,
    lesson_id: 2,
    lesson_title: "Kalp Döngüsü",
    module_id: 1,
    completed: false,
  },
  {
    id: 3,
    lesson_id: 3,
    lesson_title: "EKG Temelleri",
    module_id: 2,
    completed: false,
  },
]

// Varsayılan günlük hedef
const defaultDailyGoal = {
  lessons_completed: 1,
  lessons_goal: 3,
  xp_earned: 50,
  completed: false,
}

export default async function DashboardPage() {
  let user = null
  let modules = defaultModules
  let dailyGoal = defaultDailyGoal
  let userBadges = defaultBadges
  let userProgress = defaultProgress

  try {
    await requireAuth()
    user = await getUserDetails()

    // Eğer kullanıcı bilgileri alınamazsa varsayılan değerler kullan
    if (!user) {
      user = {
        id: "default",
        full_name: "Kullanıcı",
        email: "kullanici@example.com",
        level: 1,
        xp: 100,
        hearts: 5,
        max_hearts: 5,
        streak_count: 1,
        role: "user",
        created_at: new Date().toISOString(),
      }
    }

    // Veritabanı sorgularını try-catch bloklarına al
    try {
      const { getDailyGoal, getAccessibleModules, getUserBadges, getUserProgress } = await import("@/lib/db")

      // Her sorguyu ayrı try-catch bloklarına al
      try {
        const fetchedModules = await getAccessibleModules(user.id)
        if (fetchedModules && fetchedModules.length > 0) {
          modules = fetchedModules
        }
      } catch (error) {
        console.error("Modüller alınırken hata:", error)
      }

      try {
        const fetchedDailyGoal = await getDailyGoal(user.id)
        if (fetchedDailyGoal) {
          dailyGoal = fetchedDailyGoal
        }
      } catch (error) {
        console.error("Günlük hedef alınırken hata:", error)
      }

      try {
        const fetchedBadges = await getUserBadges(user.id)
        if (fetchedBadges && fetchedBadges.length > 0) {
          userBadges = fetchedBadges
        }
      } catch (error) {
        console.error("Rozetler alınırken hata:", error)
      }

      try {
        const fetchedProgress = await getUserProgress(user.id)
        if (fetchedProgress && fetchedProgress.length > 0) {
          userProgress = fetchedProgress
        }
      } catch (error) {
        console.error("İlerleme durumu alınırken hata:", error)
      }
    } catch (error) {
      console.error("Veritabanı modülü yüklenirken hata:", error)
    }
  } catch (authError) {
    console.error("Kimlik doğrulama hatası:", authError)
    // Kimlik doğrulama hatası durumunda varsayılan kullanıcı bilgileri kullan
    user = {
      id: "guest",
      full_name: "Misafir Kullanıcı",
      email: "misafir@example.com",
      level: 1,
      xp: 0,
      hearts: 5,
      max_hearts: 5,
      streak_count: 0,
      role: "user",
      created_at: new Date().toISOString(),
    }
  }

  // Son kazanılan rozetler
  const recentBadges = userBadges.slice(0, 3)

  // Devam eden dersler
  const inProgressLessons = userProgress.filter((progress) => !progress.completed).slice(0, 3)

  // XP hesaplama
  const currentLevelXp = 100 * (user.level - 1) * (user.level - 1)
  const nextLevelXp = 100 * user.level * user.level
  const xpForCurrentLevel = user.xp - currentLevelXp
  const xpRequiredForNextLevel = nextLevelXp - currentLevelXp
  const xpProgress = Math.round((xpForCurrentLevel / xpRequiredForNextLevel) * 100)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Merhaba, {user.full_name || "Kullanıcı"}</h1>
            <p className="text-muted-foreground">Kardiyoloji eğitimine devam etmeye hazır mısın?</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-full">
              <Heart className="h-5 w-5" />
              <span className="font-medium">
                {user.hearts}/{user.max_hearts}
              </span>
            </div>
            <div className="flex items-center gap-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-3 py-1.5 rounded-full">
              <Flame className="h-5 w-5" />
              <span className="font-medium">{user.streak_count} gün</span>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="overflow-hidden border-2 transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-primary/5">
              <CardTitle className="text-sm font-medium">Seviye</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-3xl font-bold">{user.level}</div>
              <div className="mt-3">
                <Progress value={xpProgress} className="h-2" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {xpForCurrentLevel} / {xpRequiredForNextLevel} XP
              </p>
            </CardContent>
          </Card>
          <Card className="overflow-hidden border-2 transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-primary/5">
              <CardTitle className="text-sm font-medium">Toplam XP</CardTitle>
              <Trophy className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-3xl font-bold">{user.xp}</div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center">
                Bugün:
                <span className="ml-1 text-green-600 dark:text-green-400 font-medium flex items-center">
                  +{dailyGoal?.xp_earned || 0} XP
                  <TrendingUp className="h-3 w-3 ml-0.5" />
                </span>
              </p>
            </CardContent>
          </Card>
          <Card className="overflow-hidden border-2 transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-primary/5">
              <CardTitle className="text-sm font-medium">Günlük Hedef</CardTitle>
              <Flame className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-3xl font-bold">
                {dailyGoal?.lessons_completed || 0} / {dailyGoal?.lessons_goal || 3}
              </div>
              <div className="mt-3">
                <Progress
                  value={dailyGoal ? (dailyGoal.lessons_completed / dailyGoal.lessons_goal) * 100 : 0}
                  className="h-2"
                />
              </div>
              <p className="text-xs mt-2">
                {dailyGoal?.completed ? (
                  <span className="text-green-600 dark:text-green-400 font-medium flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" /> Tamamlandı!
                  </span>
                ) : (
                  <span className="text-muted-foreground">Devam ediyor</span>
                )}
              </p>
            </CardContent>
          </Card>
          <Card className="overflow-hidden border-2 transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-primary/5">
              <CardTitle className="text-sm font-medium">Rozetler</CardTitle>
              <Award className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-3xl font-bold">{userBadges.length}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Son kazanılan: {recentBadges.length > 0 ? recentBadges[0].badges.name : "Henüz rozet kazanılmadı"}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4 overflow-hidden border-2 transition-all hover:shadow-md">
            <CardHeader className="bg-primary/5">
              <CardTitle>Modüller</CardTitle>
              <CardDescription>Öğrenmeye devam etmek için bir modül seçin</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 p-6">
              {modules.slice(0, 4).map((module) => (
                <Card
                  key={module.id}
                  className="overflow-hidden border transition-all hover:shadow-md hover:-translate-y-1"
                >
                  <div className="aspect-video w-full bg-muted relative">
                    {module.image_url ? (
                      <img
                        src={module.image_url || "/placeholder.svg"}
                        alt={module.title}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <BookOpen className="h-10 w-10 text-muted-foreground" />
                      </div>
                    )}
                    {module.is_premium && (
                      <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2.5 py-0.5 rounded-full">
                        Premium
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{module.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {module.description || "Bu modül hakkında açıklama bulunmuyor."}
                    </p>
                    <Button asChild className="w-full mt-4" size="sm">
                      <Link href={`/modules/${module.id}`}>
                        Başla
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
              {modules.length > 4 && (
                <Button asChild variant="outline" className="mt-2">
                  <Link href="/modules">Tüm Modülleri Gör</Link>
                </Button>
              )}
              {modules.length === 0 && (
                <div className="col-span-2 flex flex-col items-center justify-center p-6 text-center">
                  <BookOpen className="h-10 w-10 text-muted-foreground mb-2" />
                  <h3 className="font-medium">Henüz modül bulunmuyor</h3>
                  <p className="text-sm text-muted-foreground mt-1">Yakında yeni modüller eklenecek.</p>
                </div>
              )}
            </CardContent>
          </Card>
          <Card className="lg:col-span-3 overflow-hidden border-2 transition-all hover:shadow-md">
            <CardHeader className="bg-primary/5">
              <CardTitle>Son Kazanılan Rozetler</CardTitle>
              <CardDescription>Başarılarınızı takip edin</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 grid-cols-1 p-6">
              {recentBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    {badge.badges.image_url ? (
                      <img
                        src={badge.badges.image_url || "/placeholder.svg"}
                        alt={badge.badges.name}
                        className="h-10 w-10 rounded-full"
                      />
                    ) : (
                      <Award className="h-6 w-6 text-primary" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium">{badge.badges.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {badge.badges.description || "Rozet açıklaması bulunmuyor."}
                    </p>
                  </div>
                </div>
              ))}
              {recentBadges.length === 0 && (
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <Award className="h-10 w-10 text-muted-foreground mb-2" />
                  <h3 className="font-medium">Henüz rozet kazanılmadı</h3>
                  <p className="text-sm text-muted-foreground mt-1">Dersleri tamamlayarak rozetler kazanın.</p>
                </div>
              )}
              {userBadges.length > 3 && (
                <Button asChild variant="outline" className="mt-2">
                  <Link href="/badges">Tüm Rozetleri Gör</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="overflow-hidden border-2 transition-all hover:shadow-md">
          <CardHeader className="bg-primary/5">
            <CardTitle>Günlük Aktivite</CardTitle>
            <CardDescription>Son 7 gündeki aktiviteniz</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {[...Array(7)].map((_, i) => {
                const date = new Date()
                date.setDate(date.getDate() - (6 - i))
                const day = date.toLocaleDateString("tr-TR", { weekday: "short" })
                const isToday = i === 6
                const isActive = Math.random() > 0.3 // Rastgele aktivite durumu

                return (
                  <div key={i} className="flex flex-col items-center">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center mb-1",
                        isActive ? "bg-primary/20" : "bg-muted",
                        isToday && "ring-2 ring-primary",
                      )}
                    >
                      {isActive ? (
                        <Activity className={cn("h-6 w-6", isToday ? "text-primary" : "text-primary/70")} />
                      ) : (
                        <div className="w-6 h-6" />
                      )}
                    </div>
                    <span className={cn("text-xs font-medium", isToday ? "text-primary" : "text-muted-foreground")}>
                      {day}
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

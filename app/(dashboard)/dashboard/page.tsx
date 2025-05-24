import { getUserDetails, requireAuth } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Award, BookOpen, Heart, Flame, Trophy, TrendingUp, ArrowRight, CheckCircle, GraduationCap } from "lucide-react"

// Varsayılan modüller
const defaultModules = [
  {
    id: 1,
    title: "Tıp Temelleri",
    description: "Tıp biliminin temel prensipleri ve insan anatomisi",
    image_url: "/placeholder.svg?height=200&width=300",
    is_premium: false,
  },
  {
    id: 2,
    title: "Fizyoloji",
    description: "İnsan vücudunun çalışma prensipleri ve sistemleri",
    image_url: "/placeholder.svg?height=200&width=300",
    is_premium: false,
  },
  {
    id: 3,
    title: "Patoloji",
    description: "Hastalık süreçleri ve tanı yöntemleri",
    image_url: "/placeholder.svg?height=200&width=300",
    is_premium: false,
  },
  {
    id: 4,
    title: "İleri Klinik Uygulamalar",
    description: "Klinik vaka çalışmaları ve ileri konular",
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
      name: "Tıp Çaylağı",
      description: "İlk dersini tamamladın!",
      image_url: "/placeholder.svg?height=100&width=100",
    },
  },
  {
    id: 2,
    badges: {
      id: 2,
      name: "Bilgi Avcısı",
      description: "10 testi başarıyla geçtin!",
      image_url: "/placeholder.svg?height=100&width=100",
    },
  },
  {
    id: 3,
    badges: {
      id: 3,
      name: "Kararlı Öğrenci",
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
    lesson_title: "İnsan Anatomisi",
    module_id: 1,
    completed: false,
  },
  {
    id: 2,
    lesson_id: 2,
    lesson_title: "Hücre Biyolojisi",
    module_id: 1,
    completed: false,
  },
  {
    id: 3,
    lesson_id: 3,
    lesson_title: "Fizyoloji Temelleri",
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
      <div className="space-y-8 animate-fade-in">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy via-navy-light to-blue-light p-8 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">Merhaba, {user.full_name || "Kullanıcı"}</h1>
              <p className="text-blue-light/90 text-lg">Edulogy ile tıp eğitimine devam etmeye hazır mısın?</p>
              <div className="flex items-center gap-2 text-sm">
                <GraduationCap className="h-4 w-4" />
                <span>Healision Eğitim Platformu</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="glass-card flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full">
                <Heart className="h-5 w-5 text-red-300" />
                <span className="font-medium">
                  {Math.max(0, user.hearts)}/{user.max_hearts}
                </span>
                {Math.max(0, user.hearts) === 0 && (
                  <span className="text-xs ml-1 text-red-200">(24s içinde yenilenir)</span>
                )}
              </div>
              <div className="glass-card flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full">
                <Flame className="h-5 w-5 text-orange-300" />
                <span className="font-medium">{user.streak_count} gün</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="glass-card border-navy/20 transition-all hover:shadow-xl hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-navy">Seviye</CardTitle>
              <TrendingUp className="h-4 w-4 text-navy" />
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-navy">{user.level}</div>
              <div className="mt-3">
                <Progress value={xpProgress} className="h-3 bg-blue-light/30" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {xpForCurrentLevel} / {xpRequiredForNextLevel} XP
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-navy/20 transition-all hover:shadow-xl hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-navy">Toplam XP</CardTitle>
              <Trophy className="h-4 w-4 text-navy" />
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-navy">{user.xp}</div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center">
                Bugün:
                <span className="ml-1 text-navy font-medium flex items-center">
                  +{dailyGoal?.xp_earned || 0} XP
                  <TrendingUp className="h-3 w-3 ml-0.5" />
                </span>
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-navy/20 transition-all hover:shadow-xl hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-navy">Günlük Hedef</CardTitle>
              <Flame className="h-4 w-4 text-navy" />
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-navy">
                {dailyGoal?.lessons_completed || 0} / {dailyGoal?.lessons_goal || 3}
              </div>
              <div className="mt-3">
                <Progress
                  value={dailyGoal ? (dailyGoal.lessons_completed / dailyGoal.lessons_goal) * 100 : 0}
                  className="h-3 bg-blue-light/30"
                />
              </div>
              <p className="text-xs mt-2">
                {dailyGoal?.completed ? (
                  <span className="text-navy font-medium flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" /> Tamamlandı!
                  </span>
                ) : (
                  <span className="text-muted-foreground">Devam ediyor</span>
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-navy/20 transition-all hover:shadow-xl hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-navy">Rozetler</CardTitle>
              <Award className="h-4 w-4 text-navy" />
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-navy">{userBadges.length}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Son kazanılan: {recentBadges.length > 0 ? recentBadges[0].badges.name : "Henüz rozet kazanılmadı"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Modules Section */}
          <Card className="glass-card lg:col-span-2 border-navy/20">
            <CardHeader className="bg-gradient-to-r from-navy/5 to-blue-light/5 rounded-t-xl">
              <CardTitle className="text-navy">Eğitim Modülleri</CardTitle>
              <CardDescription>Öğrenmeye devam etmek için bir modül seçin</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2 p-6">
              {modules.slice(0, 4).map((module) => (
                <Card
                  key={module.id}
                  className="group overflow-hidden border border-navy/10 transition-all hover:shadow-xl hover:-translate-y-2 hover:border-navy/30"
                >
                  <div className="aspect-video w-full bg-gradient-to-br from-blue-light/20 to-navy/10 relative">
                    {module.image_url ? (
                      <img
                        src={module.image_url || "/placeholder.svg"}
                        alt={module.title}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <BookOpen className="h-12 w-12 text-navy/60" />
                      </div>
                    )}
                    {module.is_premium && (
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                        Premium
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-navy group-hover:text-navy-light transition-colors">
                      {module.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {module.description || "Bu modül hakkında açıklama bulunmuyor."}
                    </p>
                    <Button asChild className="corporate-button w-full mt-4" size="sm">
                      <Link href={`/modules/${module.id}`}>
                        Başla
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
              {modules.length > 4 && (
                <div className="sm:col-span-2">
                  <Button asChild variant="outline" className="w-full border-navy/20 text-navy hover:bg-navy/5">
                    <Link href="/modules">Tüm Modülleri Gör</Link>
                  </Button>
                </div>
              )}
              {modules.length === 0 && (
                <div className="sm:col-span-2 flex flex-col items-center justify-center p-8 text-center">
                  <BookOpen className="h-16 w-16 text-navy/40 mb-4" />
                  <h3 className="font-medium text-navy">Henüz modül bulunmuyor</h3>
                  <p className="text-sm text-muted-foreground mt-1">Yakında yeni modüller eklenecek.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Badges Section */}
          <Card className="glass-card border-navy/20">
            <CardHeader className="bg-gradient-to-r from-navy/5 to-blue-light/5 rounded-t-xl">
              <CardTitle className="text-navy">Son Kazanılan Rozetler</CardTitle>
              <CardDescription>Başarılarınızı takip edin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              {recentBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-light/10 to-navy/5 hover:from-blue-light/20 hover:to-navy/10 transition-all border border-navy/10"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-navy/10 to-blue-light/20">
                    {badge.badges.image_url ? (
                      <img
                        src={badge.badges.image_url || "/placeholder.svg"}
                        alt={badge.badges.name}
                        className="h-10 w-10 rounded-full badge-svg"
                      />
                    ) : (
                      <Award className="h-6 w-6 text-navy" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-navy">{badge.badges.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {badge.badges.description || "Rozet açıklaması bulunmuyor."}
                    </p>
                  </div>
                </div>
              ))}
              {recentBadges.length === 0 && (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <Award className="h-16 w-16 text-navy/40 mb-4" />
                  <h3 className="font-medium text-navy">Henüz rozet kazanılmadı</h3>
                  <p className="text-sm text-muted-foreground mt-1">Dersleri tamamlayarak rozetler kazanın.</p>
                </div>
              )}
              {userBadges.length > 3 && (
                <Button asChild variant="outline" className="w-full border-navy/20 text-navy hover:bg-navy/5">
                  <Link href="/badges">Tüm Rozetleri Gör</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

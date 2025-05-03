import { getUserDetails, requireAuth } from "@/lib/auth"
import { getUserStats, getUserBadges } from "@/lib/db"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Award, Flame, Heart, TrendingUp, User } from "lucide-react"
import { cache } from "react"

// Sayfayı dinamik olarak işaretle
export const dynamic = 'force-dynamic'

// Önbelleğe alma fonksiyonları
const getCachedUserStats = cache(getUserStats)
const getCachedUserBadges = cache(getUserBadges)

export default async function ProfilePage() {
  try {
    const session = await requireAuth()
    const user = await getUserDetails()

    if (!user) {
      return <div>Kullanıcı bilgileri yüklenemedi.</div>
    }

    // Önbelleğe alınmış fonksiyonları kullan
    const userStats = await getCachedUserStats(user.id)
    const userBadges = await getCachedUserBadges(user.id)

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
              <h1 className="text-3xl font-bold tracking-tight">Profil</h1>
              <p className="text-muted-foreground">Kişisel bilgileriniz ve istatistikleriniz</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Kişisel Bilgiler</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user.avatar_url || ""} alt={user.full_name || "Kullanıcı"} />
                  <AvatarFallback>
                    <User className="h-12 w-12 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{user.full_name || "İsimsiz Kullanıcı"}</h2>
                <p className="text-sm text-muted-foreground mb-4">{user.email}</p>
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">
                    <strong>{user.streak_count}</strong> günlük seri
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="text-sm">
                    <strong>{user.hearts}</strong>/{user.max_hearts} kalp
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>İlerleme</CardTitle>
                <CardDescription>Öğrenme yolculuğunuzdaki ilerlemeniz</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <span className="font-medium">Seviye {user.level}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {xpForCurrentLevel} / {xpRequiredForNextLevel} XP
                      </span>
                    </div>
                    <Progress value={xpProgress} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-2">
                      Bir sonraki seviyeye ulaşmak için {xpRequiredForNextLevel - xpForCurrentLevel} XP daha kazanın
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Toplam XP</p>
                      <p className="text-2xl font-bold">{user.xp}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Tamamlanan Dersler</p>
                      <p className="text-2xl font-bold">{userStats?.total_lessons_completed || 0}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Cevaplanan Sorular</p>
                      <p className="text-2xl font-bold">{userStats?.total_questions_answered || 0}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Doğruluk Oranı</p>
                      <p className="text-2xl font-bold">
                        {userStats?.total_questions_answered
                          ? Math.round((userStats.correct_answers / userStats.total_questions_answered) * 100)
                          : 0}
                        %
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Rozetler</CardTitle>
                <CardDescription>Kazandığınız başarı rozetleri</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {userBadges && userBadges.length > 0 ? (
                    userBadges.map((badge: any) => (
                      <div key={badge.id} className="flex flex-col items-center text-center">
                        <div className="flex h-16 w-16 items-center justify-center bg-muted mb-2">
                          {badge.badges && badge.badges.image_url ? (
                            <img
                              src={badge.badges.image_url || "/placeholder.svg"}
                              alt={badge.badges.name}
                              className="max-h-16 max-w-16 object-contain"
                            />
                          ) : (
                            <Award className="h-8 w-8 text-primary" />
                          )}
                        </div>
                        <h4 className="font-medium text-sm">{badge.badges?.name || "Rozet"}</h4>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {badge.badges?.description || "Rozet açıklaması bulunmuyor."}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full flex flex-col items-center justify-center p-6 text-center">
                      <Award className="h-12 w-12 text-muted-foreground mb-2" />
                      <h3 className="font-medium">Henüz rozet kazanılmadı</h3>
                      <p className="text-sm text-muted-foreground mt-1">Dersleri tamamlayarak rozetler kazanın.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    )
  } catch (error) {
    console.error("Profil sayfası yüklenirken hata oluştu:", error)
    return (
      <DashboardLayout>
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-2">Bir hata oluştu</h2>
          <p className="text-muted-foreground">
            Profil bilgileriniz şu anda yüklenemiyor. Lütfen daha sonra tekrar deneyin.
          </p>
        </div>
      </DashboardLayout>
    )
  }
}

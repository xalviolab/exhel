import { getUserDetails, requireAuth } from "@/lib/auth"
import { getUserBadges } from "@/lib/db"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Award } from "lucide-react"

export default async function BadgesPage() {
  const session = await requireAuth()
  const user = await getUserDetails()

  if (!user) {
    return <div>Kullanıcı bilgileri yüklenemedi.</div>
  }

  const userBadges = await getUserBadges(user.id)

  // Rozet türlerine göre gruplandırma
  const badgesByType: Record<string, any[]> = {}

  userBadges.forEach((badge: any) => {
    const type = badge.badges.requirement_type
    if (!badgesByType[type]) {
      badgesByType[type] = []
    }
    badgesByType[type].push(badge)
  })

  // Rozet türleri için başlıklar
  const badgeTypeNames: Record<string, string> = {
    streak: "Seri Rozetleri",
    lessons_completed: "Ders Tamamlama Rozetleri",
    xp_earned: "XP Rozetleri",
    level: "Seviye Rozetleri",
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Rozetler</h1>
            <p className="text-muted-foreground">Kazandığınız başarı rozetleri</p>
          </div>
        </div>

        {Object.keys(badgesByType).length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <Award className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium">Henüz rozet kazanılmadı</h3>
              <p className="text-muted-foreground mt-2">
                Dersleri tamamlayarak ve hedeflere ulaşarak rozetler kazanın.
              </p>
            </CardContent>
          </Card>
        ) : (
          Object.keys(badgesByType).map((type) => (
            <Card key={type}>
              <CardHeader>
                <CardTitle>{badgeTypeNames[type] || type}</CardTitle>
                <CardDescription>
                  {type === "streak" && "Günlük serinizi koruyarak kazandığınız rozetler"}
                  {type === "lessons_completed" && "Dersleri tamamlayarak kazandığınız rozetler"}
                  {type === "xp_earned" && "XP kazanarak elde ettiğiniz rozetler"}
                  {type === "level" && "Seviye atlayarak kazandığınız rozetler"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {badgesByType[type].map((badge: any) => (
                    <div key={badge.id} className="flex flex-col items-center text-center">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-3">
                        {badge.badges.image_url ? (
                          <img
                            src={badge.badges.image_url || "/placeholder.svg"}
                            alt={badge.badges.name}
                            className="h-16 w-16 rounded-full"
                          />
                        ) : (
                          <Award className="h-10 w-10 text-primary" />
                        )}
                      </div>
                      <h4 className="font-medium">{badge.badges.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {badge.badges.description || "Rozet açıklaması bulunmuyor."}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Kazanıldı: {new Date(badge.earned_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </DashboardLayout>
  )
}

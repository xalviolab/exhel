"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Award, Plus } from "lucide-react"
import { BadgeForm } from "@/components/admin/badge-form"
import { createClient } from "@/lib/supabase/client"

// Sayfanın dinamik olarak oluşturulmasını zorluyoruz
export const dynamic = 'force-dynamic'

export default function AdminBadgesPage() {
  const [badges, setBadges] = useState<any[]>([])
  const [error, setError] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("badges")
          .select("*")
          .order("requirement_type", { ascending: true })

        if (error) throw error
        setBadges(data || [])
      } catch (err) {
        console.error("Error fetching badges:", err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchBadges()
  }, [])

  if (error) {
    console.error("Error fetching badges:", error)
    return (
      <AdminLayout>
        <div className="text-center">
          <p className="text-red-500">Rozetler yüklenirken bir hata oluştu.</p>
        </div>
      </AdminLayout>
    )
  }

  // Rozet türlerine göre gruplandırma
  const badgesByType: Record<string, any[]> = {}

  badges.forEach((badge: any) => {
    const type = badge.requirement_type
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
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Rozet Yönetimi</h1>
            <p className="text-muted-foreground">Rozetleri görüntüleyin ve yönetin</p>
          </div>
          <BadgeForm />
        </div>

        {Object.keys(badgesByType).length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <Award className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium">Henüz rozet bulunmuyor</h3>
              <p className="text-muted-foreground mt-2 mb-6">İlk rozetinizi oluşturun.</p>
              <BadgeForm />
            </CardContent>
          </Card>
        ) : (
          Object.keys(badgesByType).map((type) => (
            <Card key={type}>
              <CardHeader>
                <CardTitle>{badgeTypeNames[type] || type}</CardTitle>
                <CardDescription>
                  {type === "streak" && "Günlük seri hedeflerine göre kazanılan rozetler"}
                  {type === "lessons_completed" && "Tamamlanan ders sayısına göre kazanılan rozetler"}
                  {type === "xp_earned" && "Kazanılan XP miktarına göre elde edilen rozetler"}
                  {type === "level" && "Ulaşılan seviyeye göre kazanılan rozetler"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {badgesByType[type].map((badge: any) => (
                    <div key={badge.id} className="flex flex-col items-center text-center">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-3">
                        {badge.image_url ? (
                          <img
                            src={badge.image_url || "/placeholder.svg"}
                            alt={badge.name}
                            className="h-16 w-16 rounded-full"
                          />
                        ) : (
                          <Award className="h-10 w-10 text-primary" />
                        )}
                      </div>
                      <h4 className="font-medium">{badge.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {badge.description || "Rozet açıklaması bulunmuyor."}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Gereksinim: {badge.requirement_value}{" "}
                        {type === "streak"
                          ? "gün"
                          : type === "lessons_completed"
                            ? "ders"
                            : type === "xp_earned"
                              ? "XP"
                              : "seviye"}
                      </p>
                      <BadgeForm badgeId={badge.id} defaultValues={badge} />
                    </div>
                  ))}
                  <div className="flex flex-col items-center justify-center">
                    <Button variant="outline" className="h-20 w-20 rounded-full" asChild>
                      <BadgeForm type={type}>
                        <Plus className="h-6 w-6" />
                      </BadgeForm>
                    </Button>
                    <p className="text-sm font-medium mt-3">Yeni Rozet</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </AdminLayout>
  )
}

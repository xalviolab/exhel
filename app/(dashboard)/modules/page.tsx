// Sayfayı dinamik olarak işaretle
export const dynamic = 'force-dynamic'

import { getUserDetails, requireAuth } from "@/lib/auth"
import { getAccessibleModules } from "@/lib/db"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BookOpen, Lock, ArrowRight, Filter } from "lucide-react"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default async function ModulesPage({
  searchParams,
}: {
  searchParams: { class_level?: string }
}) {
  const session = await requireAuth()
  const user = await getUserDetails()

  if (!user) {
    return <div>Kullanıcı bilgileri yüklenemedi.</div>
  }

  const classLevel = searchParams.class_level || "all"
  const modules = await getAccessibleModules(user.id)

  // Sınıf seviyesine göre filtreleme
  const filteredModules = classLevel === "all"
    ? modules
    : modules.filter(module => module.class_level === classLevel || module.class_level === "all")

  // Tüm modülleri getir (admin için)
  const isAdmin = user.role === "admin"

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Modüller</h1>
            <p className="text-muted-foreground">Kardiyoloji eğitim modüllerini keşfedin</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-lg">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select defaultValue={classLevel}>
                <SelectTrigger className="w-[180px] h-8 text-sm">
                  <SelectValue placeholder="Sınıf seviyesi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Sınıflar</SelectItem>
                  <SelectItem value="9">9. Sınıf</SelectItem>
                  <SelectItem value="10">10. Sınıf</SelectItem>
                  <SelectItem value="11">11. Sınıf</SelectItem>
                  <SelectItem value="12">12. Sınıf</SelectItem>
                  <SelectItem value="medical">Tıp Fakültesi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {isAdmin && (
              <Button asChild>
                <Link href="/admin/modules">Modülleri Yönet</Link>
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredModules.map((module) => {
            // Modül için rastgele bir renk seç
            const colors = [
              "from-blue-500 to-cyan-400",
              "from-purple-500 to-pink-400",
              "from-green-500 to-emerald-400",
              "from-orange-500 to-amber-400",
              "from-red-500 to-rose-400",
              "from-indigo-500 to-violet-400",
            ];
            const colorIndex = module.id.charCodeAt(0) % colors.length;
            const gradientColor = colors[colorIndex];

            return (
              <Card
                key={module.id}
                className={cn(
                  "overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md border-0",
                  module.required_level > user.level ? "opacity-75" : "",
                )}
              >
                <div className={`aspect-video w-full bg-gradient-to-br ${gradientColor} relative`}>
                  {module.image_url ? (
                    <img
                      src={module.image_url || "/placeholder.svg"}
                      alt={module.title}
                      className="object-cover w-full h-full mix-blend-overlay"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <BookOpen className="h-16 w-16 text-white/90" />
                    </div>
                  )}
                  <div className="absolute top-0 left-0 w-full p-3 flex justify-between items-center">
                    <div className="bg-background/80 backdrop-blur-sm text-foreground font-medium text-xs px-3 py-1.5 rounded-full shadow-sm">
                      Seviye {module.required_level}
                    </div>
                    {module.is_premium && (
                      <div className="bg-yellow-500 text-white font-medium text-xs px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1">
                        <span className="text-yellow-200 text-base">★</span> Premium
                      </div>
                    )}
                  </div>
                  {module.required_level > user.level && (
                    <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
                      <div className="flex flex-col items-center text-foreground bg-background/90 p-5 rounded-lg shadow-lg">
                        <Lock className="h-12 w-12 mb-3 text-primary" />
                        <p className="text-base font-medium">Seviye {module.required_level} gerekli</p>
                      </div>
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold">{module.title}</h3>
                  <p className="text-muted-foreground mt-2 mb-4 line-clamp-2">
                    {module.description || "Bu modül hakkında açıklama bulunmuyor."}
                  </p>
                  <Button
                    asChild
                    className={cn(
                      "w-full mt-2 shadow-sm transition-all",
                      !module.required_level || module.required_level <= user.level
                        ? `bg-gradient-to-r ${gradientColor} hover:shadow-md hover:translate-y-[-2px]`
                        : ""
                    )}
                    disabled={module.required_level > user.level}
                  >
                    <Link href={`/modules/${module.id}`}>
                      {module.required_level > user.level ? (
                        `Seviye ${module.required_level} gerekli`
                      ) : (
                        <>
                          Başla
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}

          {filteredModules.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center p-12 text-center">
              <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium">Henüz modül bulunmuyor</h3>
              <p className="text-muted-foreground mt-2">Yakında yeni modüller eklenecek.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

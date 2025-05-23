import { requireAdmin } from "@/lib/auth"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllUsers } from "@/lib/db"
import { Users, BookOpen, Award, HelpCircle } from "lucide-react"
import { redirect } from "next/navigation"

export default async function AdminDashboardPage() {
  const session = await requireAdmin()

  if (!session) {
    redirect("/login")
  }

  const users = await getAllUsers()

  // Kullanıcı istatistikleri
  const totalUsers = users.length
  const activeUsers = users.filter((user) => user.streak_count > 0).length
  const adminUsers = users.filter((user) => user.role === "admin").length
  const premiumUsers = users.filter((user) => user.role === "premium").length

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">CardioEdu platformu yönetim paneli</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Kullanıcı</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Aktif: {activeUsers} ({Math.round((activeUsers / totalUsers) * 100)}%)
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admin Kullanıcılar</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminUsers}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Toplam kullanıcıların {Math.round((adminUsers / totalUsers) * 100)}%'i
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Premium Kullanıcılar</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{premiumUsers}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Toplam kullanıcıların {Math.round((premiumUsers / totalUsers) * 100)}%'i
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platform İstatistikleri</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground mt-2">Modül ve ders istatistikleri</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Son Kayıt Olan Kullanıcılar</CardTitle>
              <CardDescription>Son 10 kayıt olan kullanıcı</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {users.slice(0, 10).map((user) => (
                  <div key={user.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">{user.full_name || "İsimsiz Kullanıcı"}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Hızlı Erişim</CardTitle>
              <CardDescription>Yönetim işlemleri için hızlı erişim</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <BookOpen className="h-8 w-8 text-primary mb-2" />
                    <h3 className="font-medium">Modül Yönetimi</h3>
                    <p className="text-xs text-muted-foreground mt-1">Modül ve dersleri yönetin</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <Users className="h-8 w-8 text-primary mb-2" />
                    <h3 className="font-medium">Kullanıcı Yönetimi</h3>
                    <p className="text-xs text-muted-foreground mt-1">Kullanıcıları yönetin</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <Award className="h-8 w-8 text-primary mb-2" />
                    <h3 className="font-medium">Rozet Yönetimi</h3>
                    <p className="text-xs text-muted-foreground mt-1">Rozetleri yönetin</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <HelpCircle className="h-8 w-8 text-primary mb-2" />
                    <h3 className="font-medium">Soru Yönetimi</h3>
                    <p className="text-xs text-muted-foreground mt-1">Soruları yönetin</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}

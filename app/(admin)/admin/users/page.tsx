export const dynamic = 'force-dynamic';

import { requireAdmin } from "@/lib/auth"
import { getAllUsers } from "@/lib/db"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserRoleForm } from "@/components/admin/user-role-form"
import { redirect } from "next/navigation"

export default async function AdminUsersPage() {
  const session = await requireAdmin()

  if (!session) {
    redirect("/login")
  }

  const users = await getAllUsers()

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Kullanıcı Yönetimi</h1>
            <p className="text-muted-foreground">Kullanıcıları görüntüleyin ve yönetin</p>
          </div>
          <div className="flex items-center gap-2">
            <Input placeholder="Kullanıcı ara..." className="max-w-xs" />
            <Button>Ara</Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Kullanıcılar</CardTitle>
            <CardDescription>Toplam {users.length} kullanıcı</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="grid grid-cols-6 border-b bg-muted/50 p-2 text-sm font-medium">
                <div className="col-span-2">Kullanıcı</div>
                <div>Seviye</div>
                <div>Rol</div>
                <div>Kayıt Tarihi</div>
                <div className="text-right">İşlemler</div>
              </div>
              <div className="divide-y">
                {users.map((user) => (
                  <div key={user.id} className="grid grid-cols-6 items-center p-2">
                    <div className="col-span-2">
                      <div className="font-medium">{user.full_name || "İsimsiz Kullanıcı"}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                    <div>{user.level}</div>
                    <div>
                      <Badge
                        variant={user.role === "admin" ? "default" : user.role === "premium" ? "outline" : "secondary"}
                      >
                        {user.role}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </div>
                    <div className="text-right">
                      <UserRoleForm userId={user.id} currentRole={user.role} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

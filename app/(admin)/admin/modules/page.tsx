import { requireAdmin } from "@/lib/auth"
import { getModules } from "@/lib/db"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, Pencil, BookOpen } from "lucide-react"
import { ModuleForm } from "@/components/admin/module-form"

export default async function AdminModulesPage() {
  await requireAdmin()

  const modules = await getModules()

  return ( 
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Modül Yönetimi</h1>
            <p className="text-muted-foreground">Modülleri görüntüleyin ve yönetin</p>
          </div>
          <ModuleForm />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <Card key={module.id} className="overflow-hidden">
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
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                    Premium
                  </div>
                )}
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold">{module.title}</h3>
                  <Badge variant="outline">Seviye {module.required_level}</Badge>
                </div>
                <p className="text-muted-foreground mb-4">
                  {module.description || "Bu modül hakkında açıklama bulunmuyor."}
                </p>
                <div className="flex items-center justify-between">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/modules/${module.id}`}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Düzenle
                    </Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href={`/admin/modules/${module.id}/lessons`}>
                      <Plus className="h-4 w-4 mr-2" />
                      Ders Ekle
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {modules.length === 0 && (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium">Henüz modül bulunmuyor</h3>
                <p className="text-muted-foreground mt-2 mb-6">İlk modülünüzü oluşturun.</p>
                <ModuleForm />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

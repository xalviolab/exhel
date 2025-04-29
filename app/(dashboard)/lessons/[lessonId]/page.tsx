import { getUserDetails, requireAuth } from "@/lib/auth"
import { getLessonDetails } from "@/lib/db"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, ArrowLeft, Heart, FileText, LinkIcon, Video } from "lucide-react"
import { notFound } from "next/navigation"

interface LessonPageProps {
  params: {
    lessonId: string
  }
}

export default async function LessonPage({ params }: LessonPageProps) {
  const session = await requireAuth()
  const user = await getUserDetails()

  if (!user) {
    return <div>Kullanıcı bilgileri yüklenemedi.</div>
  }

  const lesson = await getLessonDetails(params.lessonId)

  if (!lesson) {
    notFound()
  }

  // Ders bölümlerini getir
  const supabase = await import("@/lib/supabase/server").then((mod) => mod.createServerClient())
  const { data: sections } = await supabase
    .from("lesson_sections")
    .select("*")
    .eq("lesson_id", params.lessonId)
    .order("order_index")

  // Ders kaynaklarını getir
  const { data: resources } = await supabase.from("lesson_resources").select("*").eq("lesson_id", params.lessonId)

  const getResourceIcon = (resourceType: string) => {
    switch (resourceType) {
      case "link":
        return <LinkIcon className="h-4 w-4" />
      case "file":
        return <FileText className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      default:
        return <LinkIcon className="h-4 w-4" />
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Link href={`/modules/${lesson.module_id}`} className="hover:text-primary transition-colors">
                {lesson.modules.title}
              </Link>
              <span>/</span>
              <span>{lesson.title}</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{lesson.title}</h1>
            <p className="text-muted-foreground">{lesson.description || "Bu ders hakkında açıklama bulunmuyor."}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link href={`/modules/${lesson.module_id}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Modüle Dön
              </Link>
            </Button>
            <div className="flex items-center gap-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-full">
              <Heart className="h-5 w-5" />
              <span className="font-medium">
                {user.hearts}/{user.max_hearts}
              </span>
            </div>
          </div>
        </div>

        <Card className="overflow-hidden border-2 transition-all hover:shadow-md">
          <CardContent className="p-6">
            <div className="prose dark:prose-invert max-w-none">
              {lesson.content ? (
                <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
              ) : (
                <p className="text-muted-foreground italic">Bu ders için henüz içerik eklenmemiş.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {sections && sections.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Ders Bölümleri</h2>
            {sections.map((section) => (
              <Card key={section.id} className="overflow-hidden border-2 transition-all hover:shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">{section.title}</h3>
                  <div className="prose dark:prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: section.content }} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {resources && resources.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Ek Kaynaklar</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {resources.map((resource) => (
                <Card key={resource.id} className="overflow-hidden border-2 transition-all hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {getResourceIcon(resource.type)}
                      <h3 className="font-bold">{resource.title}</h3>
                    </div>
                    {resource.description && (
                      <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>
                    )}
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <a href={resource.url} target="_blank" rel="noopener noreferrer">
                        Kaynağa Git
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button asChild size="lg" className="group">
            <Link href={`/lessons/${params.lessonId}/quiz`}>
              Quiz'e Başla
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}

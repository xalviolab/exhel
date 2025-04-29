import { requireAdmin } from "@/lib/auth"
import { createServerClient } from "@/lib/supabase/server"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Smile, Meh, Frown, Clock, CheckCircle, XCircle } from "lucide-react"

export default async function AdminFeedbackPage() {
  await requireAdmin()
  const supabase = createServerClient()

  const { data: feedbacks, error } = await supabase
    .from("feedback")
    .select(`
      *,
      users:user_id (
        email,
        full_name
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Geri bildirimler alınırken hata:", error)
    return <div>Geri bildirimler yüklenirken bir hata oluştu.</div>
  }

  const getSatisfactionIcon = (level: string) => {
    switch (level) {
      case "positive":
        return <Smile className="h-5 w-5 text-green-500" />
      case "neutral":
        return <Meh className="h-5 w-5 text-amber-500" />
      case "negative":
        return <Frown className="h-5 w-5 text-red-500" />
      default:
        return <Meh className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <Badge
            variant="outline"
            className="flex items-center gap-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
          >
            <Clock className="h-3 w-3" />
            <span>Açık</span>
          </Badge>
        )
      case "resolved":
        return (
          <Badge
            variant="outline"
            className="flex items-center gap-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          >
            <CheckCircle className="h-3 w-3" />
            <span>Çözüldü</span>
          </Badge>
        )
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="flex items-center gap-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          >
            <XCircle className="h-3 w-3" />
            <span>Reddedildi</span>
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Beklemede</span>
          </Badge>
        )
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Geri Bildirimler</h1>
          <p className="text-muted-foreground">Kullanıcılardan gelen geri bildirimleri yönetin.</p>
        </div>

        <div className="grid gap-6">
          {feedbacks.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                <Meh className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Henüz geri bildirim yok</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Kullanıcılar geri bildirim gönderdiğinde burada görüntülenecek.
                </p>
              </CardContent>
            </Card>
          ) : (
            feedbacks.map((feedback) => (
              <Card key={feedback.id} className="overflow-hidden">
                <CardHeader className="bg-muted/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {feedback.title}
                        {getSatisfactionIcon(feedback.satisfaction_level)}
                      </CardTitle>
                      <CardDescription>
                        {feedback.users?.full_name || "İsimsiz Kullanıcı"} ({feedback.users?.email || "E-posta yok"})
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(feedback.status || "open")}
                      <span className="text-xs text-muted-foreground">{formatDate(feedback.created_at)}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="whitespace-pre-wrap">{feedback.description}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

import { Heart } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="flex items-center gap-2 mb-6">
        <Heart className="h-10 w-10 text-blue-600" />
        <span className="text-2xl font-bold">Edulogy</span>
      </div>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p className="text-muted-foreground mt-4">Yükleniyor...</p>
    </div>
  )
}

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="flex items-center gap-2 mb-6">
        <Heart className="h-10 w-10 text-blue-600" />
        <span className="text-2xl font-bold">Edulogy</span>
      </div>
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <h2 className="text-xl font-medium mb-6">Sayfa Bulunamadı</h2>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        Aradığınız sayfa bulunamadı. Silinmiş, taşınmış veya hiç var olmamış olabilir.
      </p>
      <div className="flex gap-4">
        <Button asChild variant="outline">
          <Link href="/dashboard">Dashboard</Link>
        </Button>
        <Button asChild>
          <Link href="/">Ana Sayfa</Link>
        </Button>
      </div>
    </div>
  )
}

"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="flex items-center gap-2 mb-6">
        <Heart className="h-10 w-10 text-red-500" />
        <span className="text-2xl font-bold">CardioEdu</span>
      </div>
      <h1 className="text-4xl font-bold mb-2">Bir Hata Oluştu</h1>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        Üzgünüz, bir şeyler yanlış gitti. Lütfen daha sonra tekrar deneyin.
      </p>
      <div className="flex gap-4">
        <Button onClick={reset} variant="outline">
          Tekrar Dene
        </Button>
        <Button asChild>
          <Link href="/">Ana Sayfa</Link>
        </Button>
      </div>
    </div>
  )
}

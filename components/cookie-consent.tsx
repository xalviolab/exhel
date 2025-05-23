"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { CookieIcon, X } from "lucide-react"
import Link from "next/link"

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAccepted = localStorage.getItem("cookie-consent-accepted")
    if (!hasAccepted) {
      // Show the cookie consent after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("cookie-consent-accepted", "true")
    setIsVisible(false)
  }

  const handleDecline = () => {
    // Still mark as seen, but with a different value
    localStorage.setItem("cookie-consent-accepted", "false")
    setIsVisible(false)
  }

  const handleClose = () => {
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <Card className="mx-auto max-w-4xl shadow-lg border-primary/20">
        <CardContent className="pt-6 pb-2">
          <div className="flex items-start">
            <CookieIcon className="h-6 w-6 text-primary mr-4 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-medium mb-2">Çerez Kullanımı</h3>
                <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Bu web sitesi, deneyiminizi geliştirmek için çerezleri kullanmaktadır. Sitemizi kullanmaya devam ederek,
                çerez kullanımımızı kabul etmiş olursunuz.
              </p>
              <p className="text-sm text-muted-foreground">
                Daha fazla bilgi için{" "}
                <Link href="/privacy-policy" className="text-primary hover:underline">
                  Gizlilik Politikamızı
                </Link>{" "}
                inceleyebilirsiniz.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={handleDecline}>
            Reddet
          </Button>
          <Button size="sm" onClick={handleAccept}>
            Kabul Et
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

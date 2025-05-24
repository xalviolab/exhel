"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Cookie, X } from "lucide-react"

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      setShowBanner(true)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "accepted")
    setShowBanner(false)
  }

  const rejectCookies = () => {
    localStorage.setItem("cookie-consent", "rejected")
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-up">
      <Card className="glass-card border-navy/20 shadow-2xl">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy/10">
              <Cookie className="h-5 w-5 text-navy" />
            </div>
            <div className="flex-1 space-y-3">
              <h3 className="font-semibold text-navy">Çerez Kullanımı</h3>
              <p className="text-sm text-muted-foreground">
                Edulogy platformunda size daha iyi hizmet verebilmek için çerezler kullanıyoruz. Çerez kullanımımız
                hakkında detaylı bilgi için{" "}
                <a href="/privacy-policy" className="text-navy hover:underline">
                  Gizlilik Politikamızı
                </a>{" "}
                inceleyebilirsiniz.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={acceptCookies} className="corporate-button">
                  Kabul Et
                </Button>
                <Button onClick={rejectCookies} variant="outline" className="border-navy/20 text-navy hover:bg-navy/5">
                  Reddet
                </Button>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBanner(false)}
              className="text-muted-foreground hover:text-navy"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

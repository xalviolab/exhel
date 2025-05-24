"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CreditCard, Shield, Check } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

export default function PaymentPage() {
  const [loading, setLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState("premium")
  const { toast } = useToast()

  const plans = [
    {
      id: "basic",
      name: "Temel Plan",
      price: 99,
      duration: "aylık",
      features: ["Temel derslere erişim", "Quiz çözme", "İlerleme takibi", "E-posta desteği"],
    },
    {
      id: "premium",
      name: "Premium Plan",
      price: 199,
      duration: "aylık",
      features: [
        "Tüm derslere erişim",
        "Gelişmiş quizler",
        "Kişisel mentor desteği",
        "Sertifika programları",
        "Öncelikli destek",
        "Mobil uygulama erişimi",
      ],
      popular: true,
    },
    {
      id: "annual",
      name: "Yıllık Plan",
      price: 1999,
      duration: "yıllık",
      originalPrice: 2388,
      features: [
        "Tüm Premium özellikler",
        "2 ay ücretsiz",
        "Özel webinarlar",
        "Kariyer danışmanlığı",
        "Sınırsız sertifika",
      ],
    },
  ]

  const handlePayment = async () => {
    setLoading(true)

    // Sanal ödeme işlemi simülasyonu
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Ödeme Başarılı!",
        description: "Planınız aktifleştirildi. Hoş geldiniz!",
      })

      // Başarılı ödeme sonrası dashboard'a yönlendir
      window.location.href = "/dashboard"
    } catch (error) {
      toast({
        title: "Ödeme Hatası",
        description: "Ödeme işlemi sırasında bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const selectedPlanData = plans.find((plan) => plan.id === selectedPlan)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-light/20 to-ivory">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" className="text-navy hover:bg-navy/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard'a Dön
            </Button>
          </Link>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-navy mb-4">Premium'a Geçin</h1>
            <p className="text-lg text-muted-foreground">Tıp eğitiminizi bir üst seviyeye taşıyın</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Plan Seçimi */}
            <div className="lg:col-span-2">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-navy">Plan Seçin</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {plans.map((plan) => (
                      <div
                        key={plan.id}
                        className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          selectedPlan === plan.id ? "border-navy bg-navy/5" : "border-border hover:border-navy/50"
                        }`}
                        onClick={() => setSelectedPlan(plan.id)}
                      >
                        {plan.popular && <Badge className="absolute -top-2 left-4 bg-navy">En Popüler</Badge>}
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-navy">{plan.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-2xl font-bold text-navy">₺{plan.price}</span>
                              <span className="text-muted-foreground">/{plan.duration}</span>
                              {plan.originalPrice && (
                                <span className="text-sm text-muted-foreground line-through">
                                  ₺{plan.originalPrice}
                                </span>
                              )}
                            </div>
                          </div>
                          <div
                            className={`w-4 h-4 rounded-full border-2 ${
                              selectedPlan === plan.id ? "border-navy bg-navy" : "border-muted-foreground"
                            }`}
                          >
                            {selectedPlan === plan.id && (
                              <div className="w-full h-full rounded-full bg-white scale-50" />
                            )}
                          </div>
                        </div>
                        <ul className="mt-3 space-y-1">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <Check className="h-4 w-4 text-green-600" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Ödeme Bilgileri */}
              <Card className="glass-card mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-navy">
                    <CreditCard className="h-5 w-5" />
                    Ödeme Bilgileri
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Ad</Label>
                      <Input id="firstName" placeholder="Adınız" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Soyad</Label>
                      <Input id="lastName" placeholder="Soyadınız" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Kart Numarası</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" maxLength={19} />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expMonth">Ay</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Ay" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => (
                            <SelectItem key={i + 1} value={String(i + 1).padStart(2, "0")}>
                              {String(i + 1).padStart(2, "0")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expYear">Yıl</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Yıl" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, i) => (
                            <SelectItem key={i} value={String(new Date().getFullYear() + i)}>
                              {new Date().getFullYear() + i}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" maxLength={3} />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    Ödeme bilgileriniz SSL ile şifrelenir ve güvenle işlenir.
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sipariş Özeti */}
            <div>
              <Card className="glass-card sticky top-8">
                <CardHeader>
                  <CardTitle className="text-navy">Sipariş Özeti</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedPlanData && (
                    <>
                      <div className="flex justify-between">
                        <span>{selectedPlanData.name}</span>
                        <span className="font-semibold">₺{selectedPlanData.price}</span>
                      </div>

                      {selectedPlanData.originalPrice && (
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>İndirim</span>
                          <span>-₺{selectedPlanData.originalPrice - selectedPlanData.price}</span>
                        </div>
                      )}

                      <Separator />

                      <div className="flex justify-between font-semibold text-lg">
                        <span>Toplam</span>
                        <span className="text-navy">₺{selectedPlanData.price}</span>
                      </div>

                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>• 7 gün ücretsiz deneme</p>
                        <p>• İstediğiniz zaman iptal edebilirsiniz</p>
                        <p>• Anında erişim</p>
                      </div>

                      <Button onClick={handlePayment} disabled={loading} className="w-full h-12 corporate-button">
                        {loading ? "İşleniyor..." : `₺${selectedPlanData.price} Öde`}
                      </Button>

                      <p className="text-xs text-center text-muted-foreground">
                        Ödeme yaparak{" "}
                        <Link href="/terms-of-service" className="text-navy hover:underline">
                          Kullanım Şartları
                        </Link>{" "}
                        ve{" "}
                        <Link href="/privacy-policy" className="text-navy hover:underline">
                          Gizlilik Politikası
                        </Link>
                        'nı kabul etmiş olursunuz.
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, CreditCard, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState("monthly")
  const { toast } = useToast()
  const router = useRouter()

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simüle edilmiş ödeme işlemi
    try {
      // Gerçek bir API çağrısı yerine zaman aşımı kullanıyoruz
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Başarılı ödeme simülasyonu
      setIsProcessing(false)
      setIsSuccess(true)

      toast({
        title: "Ödeme başarılı!",
        description: "Premium hesabınız aktifleştirildi.",
      })

      // Başarılı ödemeden sonra 3 saniye bekleyip dashboard'a yönlendir
      setTimeout(() => {
        router.push("/dashboard")
      }, 3000)
    } catch (error) {
      setIsProcessing(false)
      toast({
        title: "Ödeme hatası",
        description: "Ödeme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive",
      })
    }
  }

  const formatCardNumber = (value: string) => {
    // Sadece rakamları al
    const numbers = value.replace(/\D/g, "")
    // 4'lü gruplar halinde formatlama
    const formatted = numbers.replace(/(\d{4})(?=\d)/g, "$1 ")
    // Maksimum 19 karakter (16 rakam + 3 boşluk)
    return formatted.slice(0, 19)
  }

  const formatExpiryDate = (value: string) => {
    // Sadece rakamları al
    const numbers = value.replace(/\D/g, "")
    // MM/YY formatında
    if (numbers.length > 2) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}`
    }
    return numbers
  }

  const plans = {
    monthly: {
      price: "49,99 ₺",
      period: "aylık",
      features: ["Tüm premium içeriklere erişim", "Sınırsız quiz hakkı", "Özel rozetler", "Reklamsız deneyim"],
    },
    yearly: {
      price: "499,99 ₺",
      period: "yıllık",
      features: [
        "Tüm premium içeriklere erişim",
        "Sınırsız quiz hakkı",
        "Özel rozetler",
        "Reklamsız deneyim",
        "2 ay ücretsiz",
        "Özel destek hattı",
      ],
    },
  }

  if (isSuccess) {
    return (
      <DashboardLayout>
        <div className="max-w-md mx-auto py-12">
          <Card className="border-green-200 dark:border-green-900">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-500" />
                </div>
                <h2 className="text-2xl font-bold">Ödeme Başarılı!</h2>
                <p className="text-muted-foreground">
                  Premium hesabınız başarıyla aktifleştirildi. Tüm premium özelliklere erişebilirsiniz.
                </p>
                <Button className="mt-4" onClick={() => router.push("/dashboard")}>
                  Dashboard'a Dön
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Premium'a Yükselt</h1>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Ödeme Bilgileri</CardTitle>
                <CardDescription>Güvenli ödeme işlemi için bilgilerinizi girin</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="credit-card" className="w-full" onValueChange={setPaymentMethod}>
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="credit-card">Kredi Kartı</TabsTrigger>
                    <TabsTrigger value="bank-transfer">Banka Havalesi</TabsTrigger>
                  </TabsList>

                  <TabsContent value="credit-card">
                    <form onSubmit={handlePayment} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="card-number">Kart Numarası</Label>
                        <div className="relative">
                          <Input
                            id="card-number"
                            placeholder="1234 5678 9012 3456"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                            required
                            maxLength={19}
                          />
                          <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="card-name">Kart Üzerindeki İsim</Label>
                        <Input
                          id="card-name"
                          placeholder="Ad Soyad"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry-date">Son Kullanma Tarihi</Label>
                          <Input
                            id="expiry-date"
                            placeholder="MM/YY"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                            required
                            maxLength={5}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                            required
                            maxLength={3}
                            type="password"
                          />
                        </div>
                      </div>

                      <Alert className="mt-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-900">
                        <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <AlertTitle>Güvenli Ödeme</AlertTitle>
                        <AlertDescription>
                          Tüm ödeme bilgileriniz SSL ile şifrelenir ve güvenli bir şekilde işlenir.
                        </AlertDescription>
                      </Alert>

                      <Button type="submit" className="w-full mt-6" disabled={isProcessing}>
                        {isProcessing ? "İşleniyor..." : `${plans[selectedPlan as keyof typeof plans].price} Öde`}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="bank-transfer">
                    <div className="space-y-4">
                      <Alert className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-900">
                        <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        <AlertTitle>Banka Havalesi ile Ödeme</AlertTitle>
                        <AlertDescription>
                          Banka havalesi ile ödeme yapmak için aşağıdaki hesap bilgilerini kullanabilirsiniz. Ödemeniz
                          manuel olarak kontrol edilecek ve onaylandıktan sonra hesabınız aktifleştirilecektir.
                        </AlertDescription>
                      </Alert>

                      <div className="rounded-md border p-4">
                        <h3 className="font-medium mb-2">Banka Hesap Bilgileri</h3>
                        <div className="space-y-2 text-sm">
                          <p>
                            <span className="font-medium">Banka:</span> Örnek Banka
                          </p>
                          <p>
                            <span className="font-medium">Hesap Sahibi:</span> Edulogy Eğitim Ltd. Şti.
                          </p>
                          <p>
                            <span className="font-medium">IBAN:</span> TR12 3456 7890 1234 5678 9012 34
                          </p>
                          <p>
                            <span className="font-medium">Açıklama:</span> Premium Üyelik - [E-posta adresiniz]
                          </p>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        Ödemenizi yaptıktan sonra, ödeme dekontunuzu{" "}
                        <a href="mailto:payments@edulogy.com" className="text-primary hover:underline">
                          payments@edulogy.com
                        </a>{" "}
                        adresine gönderebilirsiniz.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Seçilen Plan</CardTitle>
                <CardDescription>Premium üyelik detayları</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  defaultValue="monthly"
                  value={selectedPlan}
                  onValueChange={setSelectedPlan}
                  className="space-y-3"
                >
                  <div
                    className={`flex items-center space-x-2 rounded-md border p-3 ${selectedPlan === "monthly" ? "border-primary bg-primary/5" : ""}`}
                  >
                    <RadioGroupItem value="monthly" id="monthly" />
                    <Label htmlFor="monthly" className="flex-1 cursor-pointer">
                      <span className="font-medium">Aylık Plan</span>
                      <span className="block text-sm text-muted-foreground">49,99 ₺/ay</span>
                    </Label>
                  </div>
                  <div
                    className={`flex items-center space-x-2 rounded-md border p-3 ${selectedPlan === "yearly" ? "border-primary bg-primary/5" : ""}`}
                  >
                    <RadioGroupItem value="yearly" id="yearly" />
                    <Label htmlFor="yearly" className="flex-1 cursor-pointer">
                      <span className="font-medium">Yıllık Plan</span>
                      <span className="block text-sm text-muted-foreground">499,99 ₺/yıl</span>
                      <span className="inline-block mt-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-2 py-0.5 rounded">
                        %17 Tasarruf
                      </span>
                    </Label>
                  </div>
                </RadioGroup>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <h3 className="font-medium">Plan Özellikleri:</h3>
                  <ul className="space-y-1.5">
                    {plans[selectedPlan as keyof typeof plans].features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-500 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start border-t px-6 py-4">
                <div className="flex justify-between w-full mb-2">
                  <span className="text-muted-foreground">Toplam</span>
                  <span className="font-medium">{plans[selectedPlan as keyof typeof plans].price}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Ödemeniz {selectedPlan === "monthly" ? "aylık" : "yıllık"} olarak yenilenecektir. İstediğiniz zaman
                  iptal edebilirsiniz.
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { GraduationCap } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function RegisterPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!acceptedTerms) {
      setError("Gizlilik Politikası ve Kullanım Şartları'nı kabul etmelisiniz.")
      return
    }

    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor.")
      return
    }

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) {
        throw error
      }

      router.push("/dashboard")
      router.refresh()
    } catch (error: any) {
      setError(error.message || "Kayıt olurken bir hata oluştu.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-light/20 to-ivory px-4 py-12">
      <Card className="w-full max-w-md glass-card animate-fade-in">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="corporate-gradient p-3 rounded-2xl">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-navy">Edulogy</CardTitle>
          <CardDescription className="text-base">Healision bünyesinde sunulan tıp eğitimi platformu</CardDescription>
          <CardDescription>Yeni bir hesap oluşturun</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Ad Soyad</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Ad Soyad"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="h-12"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" checked={acceptedTerms} onCheckedChange={setAcceptedTerms} />
              <Label htmlFor="terms" className="text-sm">
                <Link href="/privacy-policy" className="text-navy hover:underline">
                  Gizlilik Politikası
                </Link>{" "}
                ve{" "}
                <Link href="/terms-of-service" className="text-navy hover:underline">
                  Kullanım Şartları
                </Link>
                'nı kabul ediyorum.
              </Label>
            </div>
            <Button type="submit" className="w-full h-12 corporate-button" disabled={loading}>
              {loading ? "Kayıt Yapılıyor..." : "Kayıt Ol"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-center text-sm">
            Zaten hesabınız var mı?{" "}
            <Link href="/login" className="text-navy hover:underline font-semibold">
              Giriş Yap
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

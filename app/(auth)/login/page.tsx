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

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!acceptedTerms) {
      setError("Gizlilik Politikası ve Kullanım Şartları'nı kabul etmelisiniz.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      router.push("/dashboard")
      router.refresh()
    } catch (error: any) {
      setError(error.message || "Giriş yapılırken bir hata oluştu.")
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
          <CardDescription>Hesabınıza giriş yapın</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Şifre</Label>
                <Link href="/forgot-password" className="text-sm text-navy hover:underline">
                  Şifremi Unuttum
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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
              {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-center text-sm">
            Hesabınız yok mu?{" "}
            <Link href="/register" className="text-navy hover:underline font-semibold">
              Kayıt Ol
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

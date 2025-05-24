"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const [rememberMe, setRememberMe] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        router.push("/dashboard")
      }
    }

    checkSession()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      if (data.session) {
        // Başarılı giriş - dashboard'a yönlendir
        router.push("/dashboard")
        router.refresh()
      }
    } catch (error: any) {
      setError(error.message || "Giriş yapılırken bir hata oluştu.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full flex justify-center items-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Giriş Yap</CardTitle>
          <CardDescription>Devam etmek için e-posta ve şifrenizi girin.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive">
              {/* <AlertTitle>Error</AlertTitle> */}
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="grid w-full gap-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                placeholder="E-posta adresinizi girin"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid w-full gap-2">
              <Label htmlFor="password">Şifre</Label>
              <Input
                id="password"
                placeholder="Şifrenizi girin"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(!!checked)} />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="terms">Beni hatırla</Label>
              </div>
            </div>
            <Button disabled={loading} type="submit">
              {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Link href="/(auth)/register">
            <Button variant="outline" className="w-full">
              Hesabınız yok mu? Kayıt Ol
            </Button>
          </Link>
          <Link href="/(auth)/forgot-password">
            <Button variant="secondary" className="w-full">
              Şifremi Unuttum
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

export default LoginPage

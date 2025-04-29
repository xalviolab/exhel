"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Heart } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // Check if we have a session
    const checkSession = async () => {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push("/login")
      }
    }

    checkSession()
  }, [router])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor.")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.")
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        throw error
      }

      setSuccess(true)

      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push("/dashboard")
      }, 3000)
    } catch (error: any) {
      setError(error.message || "Şifre sıfırlanırken bir hata oluştu.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <Heart className="h-10 w-10 text-red-500" />
          </div>

          <CardTitle className="text-2xl font-bold">CardioEdu</CardTitle>
          <CardDescription>Yeni şifrenizi belirleyin</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4">
              <AlertDescription>
                Şifreniz başarıyla değiştirildi. Birkaç saniye içinde yönlendirileceksiniz.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Yeni Şifre</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
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
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Şifre Değiştiriliyor..." : "Şifreyi Değiştir"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-center text-sm">
            <Link href="/login" className="text-red-500 hover:underline">
              Giriş sayfasına dön
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

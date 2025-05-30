"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"
import { User } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [fullName, setFullName] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoadingUser(true)

        // Önce auth kullanıcısını al
        const { data: authData, error: authError } = await supabase.auth.getUser()

        if (authError || !authData.user) {
          console.error("Auth error:", authError)
          window.location.href = "/login"
          return
        }

        // Kullanıcı tablosundan profil bilgilerini al
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", authData.user.id)
          .single()

        if (userError) {
          // Kullanıcı tablosunda kayıt yoksa oluştur
          if (userError.code === "PGRST116") {
            const { data: newUser, error: createError } = await supabase
              .from("users")
              .insert({
                id: authData.user.id,
                email: authData.user.email,
                full_name: authData.user.user_metadata?.full_name || "",
                avatar_url: authData.user.user_metadata?.avatar_url || "",
                role: "user",
                level: 1,
                xp: 0,
                streak: 0,
                created_at: new Date().toISOString(),
              })
              .select()
              .single()

            if (createError) {
              console.error("Error creating user:", createError)
              throw createError
            }

            setUser(newUser)
            setFullName(newUser.full_name || "")
            setAvatarUrl(newUser.avatar_url || "")
          } else {
            console.error("Error fetching user:", userError)
            throw userError
          }
        } else {
          setUser(userData)
          setFullName(userData.full_name || "")
          setAvatarUrl(userData.avatar_url || "")
        }
      } catch (error) {
        console.error("Error in fetchUser:", error)
        toast({
          title: "Hata",
          description: "Kullanıcı bilgileri yüklenirken bir hata oluştu.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingUser(false)
      }
    }

    fetchUser()
  }, [])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    setIsLoading(true)

    try {
      const { error } = await supabase
        .from("users")
        .update({
          full_name: fullName,
          avatar_url: avatarUrl,
        })
        .eq("id", user.id)

      if (error) throw error

      toast({
        title: "Profil güncellendi",
        description: "Profil bilgileriniz başarıyla güncellendi.",
      })
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message || "Profil güncellenirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError(null)

    if (newPassword !== confirmPassword) {
      setPasswordError("Yeni şifre ve şifre tekrarı eşleşmiyor.")
      return
    }

    if (newPassword.length < 6) {
      setPasswordError("Şifre en az 6 karakter olmalıdır.")
      return
    }

    setIsChangingPassword(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) {
        if (error.status === 429) {
          throw new Error("Çok fazla istek gönderildi. Lütfen bir süre bekleyip tekrar deneyin.")
        }
        throw error
      }

      toast({
        title: "Şifre güncellendi",
        description: "Şifreniz başarıyla güncellendi.",
      })

      setNewPassword("")
      setConfirmPassword("")
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message || "Şifre güncellenirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsChangingPassword(false)
    }
  }

  if (isLoadingUser) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Yükleniyor...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <p className="text-muted-foreground">Kullanıcı bilgileri yüklenemedi. Lütfen tekrar giriş yapın.</p>
            <Button className="mt-4" onClick={() => (window.location.href = "/login")}>
              Giriş Yap
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ayarlar</h1>
          <p className="text-muted-foreground">Hesap ayarlarınızı yönetin</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Profil</CardTitle>
              <CardDescription>Profil bilgilerinizi güncelleyin</CardDescription>
            </CardHeader>
            <form onSubmit={handleUpdateProfile}>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={avatarUrl || ""} alt={fullName || "Kullanıcı"} />
                    <AvatarFallback>
                      <User className="h-12 w-12 text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1 flex-1">
                    <Label htmlFor="avatar_url">Profil Resmi URL</Label>
                    <Input
                      id="avatar_url"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="https://example.com/avatar.jpg"
                    />
                    <p className="text-sm text-muted-foreground">Profil resminiz için bir URL girin</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="full_name">Ad Soyad</Label>
                  <Input
                    id="full_name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ad Soyad"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-posta</Label>
                  <Input id="email" value={user.email} disabled />
                  <p className="text-sm text-muted-foreground">E-posta adresiniz değiştirilemez</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                </Button>
              </CardFooter>
            </form>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Şifre Değiştir</CardTitle>
              <CardDescription>Hesap şifrenizi güncelleyin</CardDescription>
            </CardHeader>
            <form onSubmit={handleChangePassword}>
              <CardContent className="space-y-4">
                {passwordError && (
                  <Alert variant="destructive">
                    <AlertDescription>{passwordError}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="new_password">Yeni Şifre</Label>
                  <Input
                    id="new_password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Yeni şifreniz"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm_password">Şifre Tekrar</Label>
                  <Input
                    id="confirm_password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Yeni şifrenizi tekrar girin"
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isChangingPassword}>
                  {isChangingPassword ? "Şifre Değiştiriliyor..." : "Şifre Değiştir"}
                </Button>
              </CardFooter>
            </form>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hesap Bilgileri</CardTitle>
              <CardDescription>Hesabınızla ilgili bilgiler</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Hesap Türü</p>
                  <p className="text-sm text-muted-foreground">
                    {user.role === "admin" ? "Admin" : user.role === "premium" ? "Premium" : "Standart"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Kayıt Tarihi</p>
                  <p className="text-sm text-muted-foreground">{new Date(user.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Seviye</p>
                  <p className="text-sm text-muted-foreground">{user.level}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Toplam XP</p>
                  <p className="text-sm text-muted-foreground">{user.xp}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

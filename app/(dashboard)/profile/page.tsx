"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"
import { Mail, Calendar, Award, Zap, Edit, Save, X } from "lucide-react"
import { ImageUpload } from "@/components/image-upload"

interface UserProfile {
  id: string
  email: string
  full_name: string
  avatar_url: string
  bio: string
  created_at: string
  level: number
  xp: number
  streak: number
  total_lessons_completed: number
  badges_earned: number
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editForm, setEditForm] = useState({
    full_name: "",
    bio: "",
    avatar_url: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const supabase = createClient()

      // Önce auth user'ı al
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        throw new Error("Kullanıcı bulunamadı")
      }

      // User profile'ı al
      const { data: profileData, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single()

      if (profileError) {
        // Eğer profil yoksa oluştur
        if (profileError.code === "PGRST116") {
          const newProfile = {
            id: user.id,
            email: user.email || "",
            full_name: user.user_metadata?.full_name || "",
            avatar_url: user.user_metadata?.avatar_url || "",
            bio: "",
            level: 1,
            xp: 0,
            streak: 0,
            total_lessons_completed: 0,
            badges_earned: 0,
          }

          const { error: insertError } = await supabase.from("users").insert(newProfile)

          if (insertError) throw insertError

          setProfile(newProfile)
          setEditForm({
            full_name: newProfile.full_name,
            bio: newProfile.bio,
            avatar_url: newProfile.avatar_url,
          })
        } else {
          throw profileError
        }
      } else {
        setProfile(profileData)
        setEditForm({
          full_name: profileData.full_name || "",
          bio: profileData.bio || "",
          avatar_url: profileData.avatar_url || "",
        })
      }
    } catch (error: any) {
      console.error("Profile fetch error:", error)
      toast({
        title: "Hata",
        description: "Profil bilgileri yüklenirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }

    if (!profile) return

    setSaving(true)
    try {
      const supabase = createClient()

      const { error } = await supabase
        .from("users")
        .update({
          full_name: editForm.full_name,
          bio: editForm.bio,
          avatar_url: editForm.avatar_url,
        })
        .eq("id", profile.id)

      if (error) throw error

      setProfile({
        ...profile,
        full_name: editForm.full_name,
        bio: editForm.bio,
        avatar_url: editForm.avatar_url,
      })

      setEditing(false)
      toast({
        title: "Başarılı",
        description: "Profil bilgileriniz güncellendi.",
      })
    } catch (error: any) {
      console.error("Profile update error:", error)
      toast({
        title: "Hata",
        description: "Profil güncellenirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (profile) {
      setEditForm({
        full_name: profile.full_name || "",
        bio: profile.bio || "",
        avatar_url: profile.avatar_url || "",
      })
    }
    setEditing(false)
  }

  if (loading) {
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

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="text-center">
          <p className="text-red-500">Profil bilgileri yüklenemedi.</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Profil</h1>
            <p className="text-muted-foreground">Profil bilgilerinizi görüntüleyin ve düzenleyin</p>
          </div>
          {!editing ? (
            <Button onClick={() => setEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Düzenle
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Kaydediliyor..." : "Kaydet"}
              </Button>
              <Button variant="outline" onClick={handleCancel} disabled={saving}>
                <X className="h-4 w-4 mr-2" />
                İptal
              </Button>
            </div>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Profil Kartı */}
          <Card className="md:col-span-1">
            <CardHeader className="text-center">
              <div className="flex flex-col items-center space-y-4">
                {editing ? (
                  <form onSubmit={handleSave} className="space-y-4 w-full">
                    <Avatar className="h-24 w-24 mx-auto">
                      <AvatarImage src={editForm.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback>
                        {editForm.full_name ? editForm.full_name.charAt(0).toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <ImageUpload
                      onImageUploaded={(url) => setEditForm({ ...editForm, avatar_url: url })}
                      currentImage={editForm.avatar_url}
                      showFrame={true}
                    />
                    <div className="w-full space-y-2">
                      <Label htmlFor="full_name">Ad Soyad</Label>
                      <Input
                        id="full_name"
                        value={editForm.full_name}
                        onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                        placeholder="Adınızı ve soyadınızı girin"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Hakkımda</Label>
                      <Textarea
                        id="bio"
                        value={editForm.bio}
                        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                        placeholder="Kendiniz hakkında kısa bir açıklama yazın"
                        rows={3}
                      />
                    </div>
                  </form>
                ) : (
                  <div>
                    <Avatar className="h-24 w-24 mx-auto mb-4">
                      <AvatarImage src={profile.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback>
                        {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-xl">{profile.full_name || "İsimsiz Kullanıcı"}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Mail className="h-4 w-4" />
                      {profile.email}
                    </CardDescription>
                  </div>
                )}
              </div>
            </CardHeader>
            {!editing && (
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Hakkımda</h4>
                    <p className="text-sm text-muted-foreground">{profile.bio || "Henüz bir açıklama eklenmemiş."}</p>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Katılım: {new Date(profile.created_at).toLocaleDateString("tr-TR")}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* İstatistikler */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  İstatistikler
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{profile.level}</div>
                    <div className="text-sm text-muted-foreground">Seviye</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{profile.xp}</div>
                    <div className="text-sm text-muted-foreground">XP</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{profile.streak}</div>
                    <div className="text-sm text-muted-foreground">Seri</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{profile.total_lessons_completed}</div>
                    <div className="text-sm text-muted-foreground">Tamamlanan Ders</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Başarılar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Kazanılan Rozetler</span>
                    <Badge variant="secondary">{profile.badges_earned}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tamamlanan Dersler</span>
                    <Badge variant="secondary">{profile.total_lessons_completed}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Günlük Seri</span>
                    <Badge variant={profile.streak > 0 ? "default" : "secondary"}>{profile.streak} gün</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

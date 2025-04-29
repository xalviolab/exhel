"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
 
interface ModuleEditPageProps {
  params: {
    moduleId: string
  }
}

export default function ModuleEditPage({ params }: ModuleEditPageProps) {
  const { moduleId } = params
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [orderIndex, setOrderIndex] = useState(0)
  const [requiredLevel, setRequiredLevel] = useState(1)
  const [isPremium, setIsPremium] = useState(false)

  useEffect(() => {
    const fetchModule = async () => {
      if (!moduleId) return

      try {
        const supabase = createClient()
        const { data, error } = await supabase.from("modules").select("*").eq("id", moduleId).single()

        if (error) {
          throw error
        }

        if (data) {
          setTitle(data.title || "")
          setDescription(data.description || "")
          setImageUrl(data.image_url || "")
          setOrderIndex(data.order_index || 0)
          setRequiredLevel(data.required_level || 1)
          setIsPremium(data.is_premium || false)
        }
      } catch (error: any) {
        toast({
          title: "Hata",
          description: "Modül bilgileri yüklenirken bir hata oluştu: " + error.message,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchModule()
  }, [moduleId, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const supabase = createClient()

      const { error } = await supabase
        .from("modules")
        .update({
          title,
          description,
          image_url: imageUrl,
          order_index: orderIndex,
          required_level: requiredLevel,
          is_premium: isPremium,
        })
        .eq("id", moduleId)

      if (error) {
        throw error
      }

      toast({
        title: "Başarılı",
        description: "Modül başarıyla güncellendi.",
      })

      router.push("/admin/modules")
    } catch (error: any) {
      toast({
        title: "Hata",
        description: "Modül güncellenirken bir hata oluştu: " + error.message,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="icon">
              <Link href="/admin/modules">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Modülü Düzenle</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link href={`/admin/modules/${moduleId}/lessons`}>Dersleri Yönet</Link>
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Yükleniyor...</p>
            </div>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Modül Bilgileri</CardTitle>
              <CardDescription>Modül bilgilerini düzenleyin</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Başlık</Label>
                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Açıklama</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="image_url">Görsel URL</Label>
                    <Input
                      id="image_url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="order_index">Sıra</Label>
                      <Input
                        id="order_index"
                        type="number"
                        value={orderIndex}
                        onChange={(e) => setOrderIndex(Number.parseInt(e.target.value))}
                        min={0}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="required_level">Gerekli Seviye</Label>
                      <Input
                        id="required_level"
                        type="number"
                        value={requiredLevel}
                        onChange={(e) => setRequiredLevel(Number.parseInt(e.target.value))}
                        min={1}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="is_premium" checked={isPremium} onCheckedChange={setIsPremium} />
                    <Label htmlFor="is_premium">Premium Modül</Label>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}

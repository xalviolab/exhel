"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"
import { ImageUpload } from "@/components/image-upload"
import { AlertTriangle, MessageSquare } from "lucide-react"

interface FeedbackFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function FeedbackForm({ open, onOpenChange }: FeedbackFormProps) {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [satisfactionLevel, setSatisfactionLevel] = useState("")
    const [feedbackType, setFeedbackType] = useState("")
    const [screenshotUrl, setScreenshotUrl] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!title || !description || !satisfactionLevel || !feedbackType) {
            toast({
                title: "Eksik bilgi",
                description: "Lütfen tüm zorunlu alanları doldurun.",
                variant: "destructive",
            })
            return
        }

        setIsSubmitting(true)

        try {
            const supabase = createClient()

            // Önce kullanıcı bilgisini al
            const { data: { session } } = await supabase.auth.getSession()

            if (!session) {
                throw new Error("Oturum bulunamadı. Lütfen tekrar giriş yapın.")
            }

            const { error } = await supabase.from("feedback").insert({
                user_id: session.user.id,
                title,
                description,
                satisfaction_level: satisfactionLevel,
                feedback_type: feedbackType,
                screenshot_url: screenshotUrl || null,
                status: 'new'
            })

            if (error) throw error

            toast({
                title: "Geri bildirim gönderildi",
                description: "Değerli geri bildiriminiz için teşekkür ederiz.",
            })

            // Formu sıfırla ve kapat
            setTitle("")
            setDescription("")
            setSatisfactionLevel("")
            setFeedbackType("")
            setScreenshotUrl("")
            onOpenChange(false)
        } catch (error: any) {
            console.error("Geri bildirim gönderme hatası:", error);
            toast({
                title: "Hata",
                description: "Geri bildirim gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleImageUploaded = (url: string) => {
        setScreenshotUrl(url)
        toast({
            title: "Görsel yüklendi",
            description: "Ekran görüntüsü başarıyla yüklendi.",
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Geri Bildirim Gönder</DialogTitle>
                    <DialogDescription>
                        Platform hakkında geri bildirim gönderin veya ders içeriklerindeki hataları bildirin.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Başlık <span className="text-destructive">*</span></Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Geri bildiriminizin başlığı"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="feedbackType">Geri Bildirim Türü <span className="text-destructive">*</span></Label>
                        <Select value={feedbackType} onValueChange={setFeedbackType} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Geri bildirim türünü seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="bug">Hata Bildirimi</SelectItem>
                                <SelectItem value="content_error">İçerik Hatası</SelectItem>
                                <SelectItem value="suggestion">Öneri</SelectItem>
                                <SelectItem value="question">Soru</SelectItem>
                                <SelectItem value="other">Diğer</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="satisfactionLevel">Memnuniyet Seviyesi <span className="text-destructive">*</span></Label>
                        <Select value={satisfactionLevel} onValueChange={setSatisfactionLevel} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Memnuniyet seviyenizi seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="very_satisfied">Çok Memnunum</SelectItem>
                                <SelectItem value="satisfied">Memnunum</SelectItem>
                                <SelectItem value="neutral">Kararsızım</SelectItem>
                                <SelectItem value="dissatisfied">Memnun Değilim</SelectItem>
                                <SelectItem value="very_dissatisfied">Hiç Memnun Değilim</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Açıklama <span className="text-destructive">*</span></Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Lütfen geri bildiriminizi detaylı bir şekilde açıklayın"
                            rows={5}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="screenshot">Ekran Görüntüsü (İsteğe Bağlı)</Label>
                        <ImageUpload onImageUploaded={handleImageUploaded} />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            İptal
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Gönderiliyor..." : "Gönder"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
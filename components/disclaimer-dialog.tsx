"use client"

import { useState, useEffect } from "react"
import { AlertCircle, AlertTriangle } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function DisclaimerDialog() {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        // Kullanıcının uyarıyı onaylayıp onaylamadığını kontrol et
        const hasAccepted = localStorage.getItem("disclaimer-accepted")
        if (!hasAccepted) {
            setOpen(true)
        }
    }, [])

    // Dashboard'da her zaman göster
    useEffect(() => {
        // Dashboard sayfasında olup olmadığını kontrol et
        if (window.location.pathname.includes('/dashboard')) {
            const hasAccepted = localStorage.getItem("disclaimer-accepted")
            if (!hasAccepted) {
                setOpen(true)
            }
        }
    }, [])

    const handleAccept = () => {
        // Kullanıcının onayını localStorage'a kaydet
        localStorage.setItem("disclaimer-accepted", "true")
        setOpen(false)
    }

    return (
        <AlertDialog open={open} onOpenChange={(newOpen) => {
            // Eğer kullanıcı onaylamamışsa, modalın kapanmasını engelle
            const hasAccepted = localStorage.getItem("disclaimer-accepted")
            if (!hasAccepted && !newOpen) {
                return
            }
            setOpen(newOpen)
        }}>
            <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                        <AlertCircle className="h-5 w-5" />
                        Önemli Uyarı
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-base">
                        Bu platform yalnızca eğitim amaçlıdır ve tanı/teşhis için kullanılamaz.
                        İçerikler henüz tam olarak onaylanmamıştır. Herhangi bir hata gördüğünüzde lütfen bildirin.
                        <div className="mt-2 flex items-center gap-1">
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                            <span className="font-semibold text-amber-500">Beta Sürümü</span>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={handleAccept} className="w-full">
                        Onaylıyorum
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

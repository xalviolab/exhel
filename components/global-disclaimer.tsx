"use client"

import { AlertCircle, AlertTriangle } from "lucide-react"

export function GlobalDisclaimer() {
    return (
        <div className="w-full bg-destructive/15 dark:bg-destructive/20 text-destructive dark:text-destructive-foreground py-2 px-4 text-center text-sm sticky top-0 z-50">
            <div className="container flex items-center justify-center gap-2 max-w-7xl mx-auto">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <p className="font-medium flex items-center flex-wrap justify-center gap-x-1">
                    <strong>Önemli Uyarı:</strong> Bu platform yalnızca eğitim amaçlıdır ve tanı/teşhis için kullanılamaz.
                    İçerikler henüz tam olarak onaylanmamıştır. Herhangi bir hata gördüğünüzde lütfen bildirin.
                    <span className="inline-flex items-center gap-1 bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-2 py-0.5 rounded-full text-xs font-semibold ml-1">
                        <AlertTriangle className="h-3 w-3" />
                        Beta Sürümü
                    </span>
                </p>
            </div>
        </div>
    )
}

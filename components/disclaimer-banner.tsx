"use client"

import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function DisclaimerBanner() {
    return (
        <Alert
            variant="destructive"
            className="rounded-none border-x-0 border-t-0 border-b-2 px-4 py-3 mb-4 text-center sticky top-16 z-20 bg-destructive/10 dark:bg-destructive/20"
        >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm font-medium">
                <strong>Önemli Uyarı:</strong> Bu platform yalnızca eğitim amaçlıdır ve tanı/teşhis için kullanılamaz.
                İçerikler henüz tam olarak onaylanmamıştır. Herhangi bir hata gördüğünüzde lütfen bildirin.
            </AlertDescription>
        </Alert>
    )
}
import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { GlobalDisclaimer } from "@/components/global-disclaimer"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "CardioEdu - Kardiyoloji Eğitim Platformu",
  description: "Tıp öğrencileri ve sağlık profesyonelleri için interaktif kardiyoloji eğitim platformu",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <GlobalDisclaimer />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { Heart, Home, BookOpen, Award, User, Settings, LogOut, Menu, X, AlertTriangle, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { DisclaimerDialog } from "@/components/disclaimer-dialog"
import { FeedbackForm } from "@/components/feedback-form"
import { createClient } from "@/lib/supabase/client"
import { useRouter, usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [feedbackOpen, setFeedbackOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()

      // Doğrudan yönlendirme yerine sayfayı yenileme
      window.location.href = "/"
    } catch (error) {
      console.error("Çıkış yapılırken hata oluştu:", error)
    }
  }

  const navItems = [
    { href: "/dashboard", label: "Ana Sayfa", icon: Home },
    { href: "/modules", label: "Modüller", icon: BookOpen },
    { href: "/badges", label: "Rozetler", icon: Award },
    { href: "/profile", label: "Profil", icon: User },
    { href: "/settings", label: "Ayarlar", icon: Settings },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <DisclaimerDialog />
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex h-16 items-center border-b px-4">
                <div className="flex items-center gap-2">
                  <Heart className="h-6 w-6 text-red-500" />
                  <span className="text-lg font-bold">CardioEdu</span>
                </div>
                <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="flex flex-col gap-1 p-4">
                {navItems.map((item, index) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={index}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isActive ? "bg-primary/10 text-primary" : "hover:bg-accent hover:text-accent-foreground",
                      )}
                    >
                      <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "")} />
                      {item.label}
                    </Link>
                  )
                })}
                <Button variant="ghost" className="justify-start px-3 mt-4" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Çıkış Yap
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/dashboard" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-red-500" />
            <span className="text-lg font-bold hidden md:inline-block">CardioEdu</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="destructive"
            size="sm"
            className="hidden md:flex items-center gap-1"
            onClick={() => setFeedbackOpen(true)}
          >
            <MessageSquare className="h-4 w-4" />
            <span>Geri Bildirim</span>
          </Button>
          <Button
            variant="destructive"
            size="icon"
            className="md:hidden"
            onClick={() => setFeedbackOpen(true)}
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={handleLogout} className="hidden md:flex">
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Çıkış Yap</span>
          </Button>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-background md:block">
          <div className="flex h-full flex-col gap-2 p-4">
            <nav className="flex flex-col gap-1">
              {mounted &&
                navItems.map((item, index) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={index}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isActive ? "bg-primary/10 text-primary" : "hover:bg-accent hover:text-accent-foreground",
                      )}
                    >
                      <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "")} />
                      {item.label}
                    </Link>
                  )
                })}
            </nav>
            <div className="mt-auto">
              <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Çıkış Yap
              </Button>
            </div>
          </div>
        </aside>
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>

      {/* Mobil alt navigasyon */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background z-30">
        <div className="flex items-center justify-around">
          {mounted &&
            navItems.slice(0, 4).map((item, index) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "")} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
        </div>
      </div>

      {/* Mobil alt navigasyon için padding */}
      <div className="h-16 md:hidden"></div>

      {/* Geri Bildirim Formu */}
      <FeedbackForm open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </div>
  )
}

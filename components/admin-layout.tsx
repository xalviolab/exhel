"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import {
  Heart,
  Home,
  BookOpen,
  Users,
  LogOut,
  Menu,
  LayoutDashboard,
  Award,
  HelpCircle,
  X,
  Filter,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { DisclaimerDialog } from "@/components/disclaimer-dialog"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { createClient } from "@/lib/supabase/client"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

interface AdminLayoutProps {
  children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [selectedClass, setSelectedClass] = useState(searchParams.get("class") || "all")

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      window.location.href = "/"
    } catch (error) {
      console.error("Çıkış yapılırken hata oluştu:", error)
    }
  }

  const handleClassChange = (value: string) => {
    setSelectedClass(value)
    const params = new URLSearchParams(searchParams.toString())
    if (value === "all") {
      params.delete("class")
    } else {
      params.set("class", value)
    }
    const newUrl = `${pathname}?${params.toString()}`
    router.push(newUrl)
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/modules", label: "Modüller", icon: BookOpen },
    { href: "/admin/users", label: "Kullanıcılar", icon: Users },
    { href: "/admin/badges", label: "Rozetler", icon: Award },
    { href: "/admin/questions", label: "Sorular", icon: HelpCircle },
    { href: "/dashboard", label: "Kullanıcı Paneli", icon: Home },
  ]

  const classOptions = [
    { value: "all", label: "Tüm Sınıflar" },
    { value: "9", label: "9. Sınıf" },
    { value: "10", label: "10. Sınıf" },
    { value: "11", label: "11. Sınıf" },
    { value: "12", label: "12. Sınıf" },
    { value: "medical", label: "Tıp Fakültesi" },
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
                  <span className="text-lg font-bold">Edulogy Admin</span>
                </div>
                <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="flex flex-col gap-1 p-4">
                {navItems.map((item, index) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
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
          <Link href="/admin" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-red-500" />
            <span className="text-lg font-bold hidden md:inline-block">Edulogy Admin</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
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
                  const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
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
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {/* Filtreleme Bölümü */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col space-y-2">
                <Button
                  variant="ghost"
                  className="flex items-center justify-between w-full"
                  onClick={() => setFilterOpen(!filterOpen)}
                >
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    <span>Filtreleme Seçenekleri</span>
                  </div>
                  {filterOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>

                {filterOpen && (
                  <div className="pt-2 pb-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Sınıf Seçimi</label>
                        <Select value={selectedClass} onValueChange={handleClassChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sınıf seçiniz" />
                          </SelectTrigger>
                          <SelectContent>
                            {classOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {children}
        </main>
      </div>

      {/* Mobil alt navigasyon */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background z-30">
        <div className="flex items-center justify-around">
          {mounted &&
            navItems.slice(0, 5).map((item, index) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
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
                  <span className="text-[10px]">{item.label}</span>
                </Link>
              )
            })}
        </div>
      </div>

      {/* Mobil alt navigasyon için padding */}
      <div className="h-16 md:hidden"></div>
    </div>
  )
}

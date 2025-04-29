"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"

interface UserRoleFormProps {
  userId: string
  currentRole: string
}

export function UserRoleForm({ userId, currentRole }: UserRoleFormProps) {
  const [role, setRole] = useState(currentRole)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleRoleChange = async (newRole: string) => {
    if (newRole === role) return

    setIsLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("users").update({ role: newRole }).eq("id", userId)

      if (error) throw error

      setRole(newRole)
      toast({
        title: "Rol güncellendi",
        description: `Kullanıcı rolü ${newRole} olarak güncellendi.`,
      })
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message || "Rol güncellenirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isLoading}>
          {isLoading ? "Güncelleniyor..." : "Rol Değiştir"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleRoleChange("user")}>Kullanıcı</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleRoleChange("premium")}>Premium</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleRoleChange("admin")}>Admin</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

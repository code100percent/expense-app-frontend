"use client"

import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { API_BASE } from "@/lib/config"

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      })

      router.push("/auth/login")
      router.refresh() // clears cached layouts
    } catch (err) {
      console.error("Logout failed", err)
    }
  }

  return (
    <Button
      onClick={handleLogout}
      variant="destructive"
      className="w-full flex items-center gap-2 justify-start mt-10"
    >
      <LogOut size={18} />
      Logout
    </Button>
  )
}

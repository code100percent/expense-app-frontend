"use client"
import SidebarItem from "./SidebarItem"
import { LogOut } from "lucide-react"
import fetchAPI from "@/lib/fetchAPI"
import { API_BASE } from "@/lib/config"
import { useRouter } from "next/navigation"


export default function Logout() {
    const router = useRouter()
    const handleLogout = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        fetchAPI(`${API_BASE}/api/auth/logout`, {
            method: "POST",
            credentials: "include",
        })
        .then(() => {
            router.push("/auth/login")
        })

    }
    return (
        <button onClick={handleLogout} className="w-full mt-10">
            <SidebarItem
            icon={<LogOut size={18} />}
            label="Logout"
            />
        </button>
    )
}
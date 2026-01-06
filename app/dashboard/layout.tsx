"use client"

import { useEffect, useState } from "react"
import Sidebar from "@/components/dashboard/Sidebar"
import { Menu, Bell, User } from "lucide-react"
import Notification from "@/components/dashboard/Notification"
import { useWebSocket } from "@/hooks/useWebsocket"
import { useRouter } from "next/navigation"


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [notification, setNotification] = useState<string| null>(null)
  const [newNotificatons,setNewNotification] = useState(false)

  
  useWebSocket((data) => {
    // console.log("WS:", data)
    setNotification(data[localStorage.getItem("Role")||""])
    if(data[localStorage.getItem("Role")||""]){
      setNewNotification(true)
    }
    // clear after 5s so future notifications can show
    setTimeout(() => setNotification(null), 5000)
  })

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)")
    const handler = () => setIsDesktop(mql.matches)
    handler()
    mql.addEventListener("change", handler)
    return () => mql.removeEventListener("change", handler)
  }, [])

  return (
    <div className="min-h-screen bg-[#f4f5f7]">

      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Mobile overlay */}
      {!isDesktop && mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main */}
      <main className="md:ml-[260px] transition-all duration-300">
        {/* Top Bar */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
          
          {/* LEFT */}
          <div className="flex items-center gap-3">
            {!isDesktop && (
              <button
                onClick={() => setMobileOpen(true)}
                className="p-2 rounded-md hover:bg-slate-100"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <h1 className="text-xl font-semibold text-slate-800">
              Dashboard
            </h1>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2">
            {/* Notification */}
            <button className="relative p-2 rounded-md hover:bg-slate-100" onClick={()=>{router.push("/dashboard/notifications"); setNewNotification(false)}}>
              <Bell className="w-5 h-5" />
              {newNotificatons && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>

           
            

            {/* Avatar */}
            <button className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-100" onClick={()=>{router.push("/dashboard/user")}}>
              <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-slate-700" />
              </div>
            </button>
          </div>
        </header>

        {/* Page content */}
        <div className="px-6 py-6">
          {notification && (
              <Notification
                message={notification}
                type="info"
                duration={5000}
              />
            )}
          {children}
        </div>
      </main>
    </div>
  )
}

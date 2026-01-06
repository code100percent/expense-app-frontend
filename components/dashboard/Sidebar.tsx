"use client"
import {
  LayoutDashboard,
  BarChart3,
  FileText,
  Download,
  X,
  LogOut,
} from "lucide-react"
import SidebarItem from "./SidebarItem"
import EmployeeSidebarGroup from "./EmployeeSidebarGroup"
import ManagerSidebarGroup from "./ManagerSidebarGroup"
import FinanceSidebarGroup from "./FinanceSidebarGroup"
import AdminSidebarGroup from "./AdminSidebarGroup"
import fetchAPI from "@/lib/fetchAPI"
import { API_BASE } from "@/lib/config"
import { useEffect, useState } from "react"
import Logout from "./Logout"

export default function Sidebar({
  mobileOpen,
  setMobileOpen,
}: {
  mobileOpen: boolean
  setMobileOpen: (v: boolean) => void
}) {

  const [role,setRole] = useState("")

  useEffect(()=>{
    const userFetch = async () => {
      try {
        const res = await fetchAPI(`${API_BASE}/api/users/me`)
        const data = await res.json()
        setRole(data.role)
      } catch (err) {
        console.error("Failed to fetch user role", err)
      }
    }
    userFetch()
  },[])

  
  return (
    <aside
      className={`
        fixed top-0 left-0 h-screen w-[260px]
        bg-slate-800 text-white z-50
        transform transition-transform duration-300
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-slate-700">
        <span className="font-semibold">{role} Panel</span>

        {/* Close button (mobile only) */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Menu (SCROLL FIXED) */}
      <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
        <SidebarItem
          icon={<LayoutDashboard size={18} />}
          label="Dashboard"
          active
        />

        {role === "EMPLOYEE" && <EmployeeSidebarGroup/>}
        {role === "MANAGER" && <ManagerSidebarGroup/>}
        {role === "FINANCE" && <FinanceSidebarGroup/>}
        {role === "ADMIN" && <AdminSidebarGroup/>}
        
        {}

        <Logout/>
      </nav>
    </aside>
  )
}

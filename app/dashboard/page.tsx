"use client"

import { useEffect, useState } from "react"
import fetchAPI from "@/lib/fetchAPI"
import { API_BASE } from "@/lib/config"
import EmployeeDashboard from "./EmployeeDashboard"
import ManagerDashboard from "./ManagerDashboard"
import FinanceDashboard from "./FinanceDashboard"
import AdminDashboard from "./AdminDashboard"

export default function DashboardPage() {
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await fetchAPI(`${API_BASE}/api/users/me`, { credentials: "include" })
        const data = await res.json()
        setRole(data.role)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchRole()
  }, [])

  if (loading) return <div className="text-center py-8">Loading...</div>

  return (
    <div>
      {role === "EMPLOYEE" && <EmployeeDashboard />}
      {role === "MANAGER" && <ManagerDashboard />}
      {role === "FINANCE" && <FinanceDashboard />}
      {role === "ADMIN" && <AdminDashboard />}
      {!role && <div className="text-center py-8">Unable to determine role</div>}
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { API_BASE } from "@/lib/config"
import { Expense } from "@/lib/schemaInterfaces"
import fetchAPI from "@/lib/fetchAPI"
import EmployeeHistory from "./EmployeeHistory"
import ManagerHistory from "./ManagerHistory"
import FinanceHistory from "./FinanceHistory"
import AdminHistory from "./AdminHistory"


export default function HistoryPage() {
  const [historyRequests, setHistoryRequests] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)

  const [role,setRole] = useState("")

    const userFetch = async () => {
      try {
        const res = await fetchAPI(`${API_BASE}/api/users/me`)
        const data = await res.json()
        setRole(data.role)
      } catch (err) {
        console.error("Failed to fetch user role", err)
      }
    }

  const fetchExpenses = async () => {
    try {
      const res = await fetchAPI(`${API_BASE}/api/expenses`, {
        credentials: "include",
      })

      if (!res.ok) {
        throw new Error("Failed to fetch expenses")
      }

      const data = await res.json()
      setHistoryRequests(data.historyRequests || [])

    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    userFetch()
    fetchExpenses()
  }, [])


  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Expense History</h2>
      {role === "EMPLOYEE" && <EmployeeHistory data={historyRequests} />}
      {role === "MANAGER" && <ManagerHistory data={historyRequests} />}
      {role === "FINANCE" && <FinanceHistory data={historyRequests} />}
      {role === "ADMIN" && <AdminHistory data={historyRequests} />}
    </div>
  )
}

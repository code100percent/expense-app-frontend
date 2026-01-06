import SidebarItem from "./SidebarItem"
import {
  BarChart3,
  FileText,
  History,
  UserPlus,
} from "lucide-react"
import { useState, useEffect } from "react"
import fetchAPI from "@/lib/fetchAPI"
import { API_BASE } from "@/lib/config"

export default function EmployeeSidebarGroup(){

  const [requestsBadge, setRequestsBadge] = useState("")

  useEffect(() => {
    const dataFetch = async () => {
      try {
        const res = await fetchAPI(`${API_BASE}/api/expenses`)
        const data = await res.json()
        
        // The API returns { historyRequests, pendingRequests }
        const pendingRequests = data.pendingRequests || []
        const count = pendingRequests.length
        setRequestsBadge(count > 0 ? count.toString() : "")
      } catch (err) {
        console.error("Failed to fetch data", err)
        setRequestsBadge("")
      }
    }
    dataFetch()
  }, [])

    return (
        <>
        <SidebarItem
          icon={<BarChart3 size={18} />}
          label="Analytics"
        />

        <SidebarItem
          icon={<History size={18} />}
          label="History"
          href="/dashboard/history"
        />
        
        <SidebarItem
        icon={<FileText size={18} />}
        label="Expense Requests"
        href="/dashboard/pending-approvals"
        badge={requestsBadge}
        />

        <SidebarItem
        icon={<UserPlus size={18} />}
        label="Add New User"
        href="/dashboard/register-admin-access"
        />
        </>
    )
}
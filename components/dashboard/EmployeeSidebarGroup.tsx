"use client"
import { useEffect, useState } from "react"
import SidebarItem from "./SidebarItem"
import {
  FileText,
  History,
  Plus,
} from "lucide-react"
import fetchAPI from "@/lib/fetchAPI"
import { API_BASE } from "@/lib/config"
import { Expense } from "@/lib/schemaInterfaces"

export default function EmployeeSidebarGroup(){
    const [requestsBadge , setRequestsBadge] = useState("")
    useEffect(()=>{
        const dataFetch = async () => {
      try {
        const res = await fetchAPI(`${API_BASE}/api/expenses`)
        const data = await res.json()
        // console.log(data)
        
        // The API returns { historyRequests, pendingRequests }
        // For employees, pendingRequests contains expenses that need attention
        const pendingRequests = data.pendingRequests || []
        const count = pendingRequests.length
        setRequestsBadge(count > 0 ? count.toString() : "")
            
        } catch (err) {
            console.error("Failed to fetch data", err)
            setRequestsBadge("")
        }
        }
        dataFetch()
    },[])

    return (
      <>
          <SidebarItem
            href="/dashboard/history"
            icon={<History size={18} />}
            label="History"
          />
        <SidebarItem
          icon={<FileText size={18} />}
          href="/dashboard/pending-approvals"
          label="Pending Requests"
          badge={requestsBadge}
        />

        <SidebarItem
          href="/dashboard/new-expense"
          icon={<Plus size={18} />}
          label="New Expense"
        />
        </>
    )
}
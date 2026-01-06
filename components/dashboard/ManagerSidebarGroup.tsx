import fetchAPI from "@/lib/fetchAPI"
import SidebarItem from "./SidebarItem"
import {

  FileText,
  History,

} from "lucide-react"
import {useState,useEffect} from "react"
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
          href="/dashboard/pending-approvals"
          icon={<FileText size={18} />}
          label="Expense Requests"
          badge={requestsBadge}
        />

</>
    )
}
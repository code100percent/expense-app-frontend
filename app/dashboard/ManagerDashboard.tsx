"use client"

import { useEffect, useState } from "react"
import StatCard from "@/components/dashboard/StatCard"
import { VisitorsChart } from "@/components/dashboard/VisitorsChart"
import fetchAPI from "@/lib/fetchAPI"
import { API_BASE } from "@/lib/config"

export default function ManagerDashboard() {
  const [loading, setLoading] = useState(true)
  const [pending, setPending] = useState<any[]>([])
  const [history, setHistory] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchAPI(`${API_BASE}/api/expenses`, { credentials: "include" })
        const data = await res.json()
        setPending(data.pendingRequests || [])
        setHistory(data.historyRequests || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const managerActionCount = history.filter((h) => String(h.status).includes("MANAGER")).length
  const totalPendingAmount = pending.reduce((s,e)=>s+(Number(e.receiptAmount)||0),0)

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Pending Approvals" value={String(pending.length)} />
        <StatCard title="Past Actions" value={String(managerActionCount)} />
        {/* <StatCard title="Pending Amount" value={`₹${totalPendingAmount}`} /> */}
        <StatCard title="Total Requests" value={String(pending.length + history.length)} />
      </div>

      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <VisitorsChart />
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 shadow-sm h-[320px] overflow-auto">
            <h3 className="text-lg font-semibold mb-3">Top Pending Requests</h3>
            {pending.slice(0,6).map((p) => (
              <div key={p._id} className="py-2 border-b last:border-b-0">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{p.title}</div>
                    <div className="text-sm text-muted-foreground">₹{p.receiptAmount || 0}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}
    </div>
  )
}
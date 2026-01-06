"use client"

import { useEffect, useState } from "react"
import StatCard from "@/components/dashboard/StatCard"
import { VisitorsChart } from "@/components/dashboard/VisitorsChart"
import { ProjectsChart } from "@/components/dashboard/ProjectsChart"
import fetchAPI from "@/lib/fetchAPI"
import { API_BASE } from "@/lib/config"

export default function EmployeeDashboard() {
  const [loading, setLoading] = useState(true)
  const [pending, setPending] = useState<any[]>([])
  const [history, setHistory] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchAPI(`${API_BASE}/api/expenses`, {
          credentials: "include",
        })
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

  const totalRequested = [...pending, ...history].reduce(
    (s, e) => s + (Number(e.receiptAmount) || 0),
    0
  )

  const reimbursedAmount = history
    .filter((e) => e.status === "PAID")
    .reduce((s, e) => s + (Number(e.receiptAmount) || 0), 0)

  const rejectedCount = [...pending, ...history].filter((e) =>
    String(e.status).includes("REJECTED")
  ).length

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Pending Requests" value={String(pending.length)} />
        <StatCard title="Total Requests" value={String(pending.length + history.length)} />
        <StatCard title="Total Requested" value={`₹${totalRequested}`} />
        <StatCard title="Reimbursed" value={`₹${reimbursedAmount}`} />
      </div>

      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <VisitorsChart />
        <ProjectsChart />
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-sm h-[320px]">
            <h3 className="text-lg font-semibold mb-3">Quick Insights</h3>
            <p className="text-sm">Rejected requests: <strong>{rejectedCount}</strong></p>
            <p className="text-sm mt-2">Reimbursed entries: <strong>{history.filter(h=>h.status==='PAID').length}</strong></p>
            <p className="text-sm mt-2">Recent pending: <strong>{pending.slice(0,3).map(p=>p.title).join(', ') || '—'}</strong></p>
          </div>
        </div>
      </div> */}
    </div>
  )
}
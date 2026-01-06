"use client"

import { useEffect, useState } from "react"
import StatCard from "@/components/dashboard/StatCard"
import { ProjectsChart } from "@/components/dashboard/ProjectsChart"
import fetchAPI from "@/lib/fetchAPI"
import { API_BASE } from "@/lib/config"

export default function FinanceDashboard() {
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

  const totalToReimburse = pending.reduce((s,e)=>s+(Number(e.receiptAmount)||0),0)
  const paidCount = history.filter(h=>h.status === 'PAID').length

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Ready for Reimbursement" value={String(pending.length)} />
        <StatCard title="Total to Reimburse" value={`₹${totalToReimburse}`} />
        <StatCard title="Paid Count" value={String(paidCount)} />
        <StatCard title="Total Processed" value={String(history.length)} />
      </div>

      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 shadow-sm h-[320px] overflow-auto">
            <h3 className="text-lg font-semibold mb-3">Top Ready for Reimbursement</h3>
            {pending.slice(0,8).map(p=> (
              <div key={p._id} className="py-2 border-b last:border-b-0">
                <div className="flex justify-between">
                  <div>
                    <div className="font-medium">{p.title}</div>
                    <div className="text-sm text-muted-foreground">₹{p.receiptAmount||0}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <ProjectsChart />
      </div> */}
    </div>
  )
}
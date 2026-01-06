"use client"

import { useEffect, useState } from "react"
import StatCard from "@/components/dashboard/StatCard"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import fetchAPI from "@/lib/fetchAPI"
import { API_BASE } from "@/lib/config"
import { useRouter } from "next/navigation"

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [pending, setPending] = useState<any[]>([])
  const [history, setHistory] = useState<any[]>([])
  const router = useRouter()

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

  const totalPendingAmount = pending.reduce((s,e)=>s+(Number(e.receiptAmount)||0),0)
  const paidAmount = history.filter(h=>h.status==='PAID').reduce((s,e)=>s+(Number(e.receiptAmount)||0),0)

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Ready for Reimbursement" value={String(pending.length)} />
        <StatCard title="Total Pending Amount" value={`₹${totalPendingAmount}`} />
        <StatCard title="Paid Amount" value={`₹${paidAmount}`} />
        <StatCard title="Total Processed" value={String(history.length)} />
      </div>

      {/* <Card>
        <CardHeader>
          <CardTitle>Pending Reimbursements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-3">Title</th>
                  <th className="py-2 px-3">Amount</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Created</th>
                  <th className="py-2 px-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((p) => (
                  <tr key={p._id} className="border-b last:border-b-0">
                    <td className="py-2 px-3">{p.title}</td>
                    <td className="py-2 px-3">₹{p.receiptAmount || 0}</td>
                    <td className="py-2 px-3">{p.status.replace(/_/g, ' ')}</td>
                    <td className="py-2 px-3">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="py-2 px-3">
                      <button onClick={()=>router.push(`/dashboard/expenseRequest/${p._id}`)} className="text-sm text-blue-600">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card> */}
    </div>
  )
}
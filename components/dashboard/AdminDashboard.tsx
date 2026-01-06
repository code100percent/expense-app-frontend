"use client"

import { API_BASE } from "@/lib/config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"

type AdminSummary = {
  total_money_spend: number
  total_money_requested: number
}

const AdminDashboardPlugin = () => {
  const [summary, setSummary] = useState<AdminSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSummary() {
      try {
        const res = await fetch(`${API_BASE}/api/admin/summary`, {
          credentials: "include",
        })

        if (!res.ok) throw new Error("Failed to fetch admin summary")

        const data = await res.json()
        setSummary(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchSummary()
  }, [])

  if (loading) {
    return <p>Loading admin summary...</p>
  }

  if (!summary) {
    return <p>Failed to load summary</p>
  }

  return (
    <>
      <h2 className="text-xl font-semibold">Admin Summary</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Money Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              ₹{summary.total_money_spend}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Money Requested</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-500">
              ₹{summary.total_money_requested}
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default AdminDashboardPlugin

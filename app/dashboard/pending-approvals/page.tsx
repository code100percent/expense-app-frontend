"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { API_BASE } from "@/lib/config"
import { Expense } from "@/lib/schemaInterfaces"
import fetchAPI from "@/lib/fetchAPI"

export default function PendingApprovalsPage() {
  const router = useRouter()
  const [pendingRequests, setPendingRequests] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)

  const sortedPendingRequests = useMemo(() => {
    // Guard against undefined or null data
    if (!pendingRequests || !Array.isArray(pendingRequests)) {
      return []
    }

    // Sort by date descending (latest first)
    const sorted = [...pendingRequests].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return dateB - dateA
    })

    return sorted
  }, [pendingRequests])

  const fetchExpenses = async () => {
    try {
      const res = await fetchAPI(`${API_BASE}/api/expenses`, {
        credentials: "include",
      })

      if (!res.ok) {
        throw new Error("Failed to fetch expenses")
      }

      const data = await res.json()
      setPendingRequests(data.pendingRequests || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExpenses()
  }, [])

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!pendingRequests || pendingRequests.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Pending Requests For Approvals</h2>
        <div className="text-center py-8">
          <p className="text-muted-foreground">No pending requests found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Pending Requests For Approvals</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedPendingRequests.map((exp) => (
          <Card key={exp._id}>
            <CardHeader>
              <CardTitle>{exp.title}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-1">
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    exp.status === "PAID"
                      ? "bg-green-100 text-green-800"
                      : exp.status.includes("REJECTED")
                      ? "bg-red-100 text-red-800"
                      : exp.status.includes("APPROVED") ||
                        exp.status === "READY_FOR_REIMBURSEMENT"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {exp.status.replace(/_/g, " ")}
                </span>
              </p>

              {exp.receiptAmount && (
                <p>
                  <strong>Amount:</strong> ₹{exp.receiptAmount}
                </p>
              )}

              <p>
                <strong>Date:</strong>{" "}
                {new Date(exp.createdAt).toLocaleDateString()}
              </p>

              {exp.description && (
                <p className="line-clamp-2">
                  <strong>Description:</strong> {exp.description}
                </p>
              )}

              {exp.rejectResponse && (
                <p className="text-sm text-red-600">
                  <strong>Rejection Reason:</strong> {exp.rejectResponse}
                </p>
              )}

              <Button
                variant="outline"
                size="sm"
                className="mt-2 w-full"
                onClick={() =>
                  router.push(`/dashboard/expenseRequest/${exp._id}`)
                }
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Expense } from "@/lib/schemaInterfaces"

interface AdminHistoryProps {
  data?: Expense[]
}

export default function AdminHistory({ data }: AdminHistoryProps) {
  const router = useRouter()
  const [dateFilter, setDateFilter] = useState<string>("")

  const filteredAndSortedExpenses = useMemo(() => {
    // Guard against undefined or null data
    if (!data || !Array.isArray(data)) {
      return []
    }

    let filtered = [...data]

    // Filter by date if selected
    if (dateFilter) {
      const filterDate = new Date(dateFilter)
      filterDate.setHours(0, 0, 0, 0)
      
      filtered = filtered.filter((expense) => {
        const expenseDate = new Date(expense.createdAt)
        expenseDate.setHours(0, 0, 0, 0)
        return expenseDate.getTime() === filterDate.getTime()
      })
    }

    // Sort by date descending (latest first)
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return dateB - dateA
    })

    return filtered
  }, [data, dateFilter])

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No expense history found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Expense Request Paid or Rejected</h3>
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-[200px]"
            placeholder="Filter by date"
          />
          {dateFilter && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDateFilter("")}
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {filteredAndSortedExpenses.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No expenses found for the selected date.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedExpenses.map((exp) => (
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
                        : exp.status.includes("APPROVED") || exp.status === "READY_FOR_REIMBURSEMENT"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
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
                  onClick={() => router.push(`/dashboard/expenseRequest/${exp._id}`)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}


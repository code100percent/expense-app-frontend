"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Expense } from "@/lib/schemaInterfaces"

interface EmployeeHistoryProps {
  data?: Expense[]
}

const FILTER_OPTIONS = [
  "ALL",
  "PAID",
  "MANAGER_REJECTED",
  "FINANCE_REJECTED",
  "ADMIN_REJECTED",
]

export default function EmployeeHistory({ data }: EmployeeHistoryProps) {
  const router = useRouter()
  const [statusFilter, setStatusFilter] = useState<string>("ALL")

  const filteredExpenses = useMemo(() => {
    // Guard against undefined or null data
    if (!data || !Array.isArray(data)) {
      return []
    }

    if (statusFilter === "ALL") {
      return data
    }
    return data.filter((expense) => expense.status === statusFilter)
  }, [data, statusFilter])

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
        <h3 className="text-lg font-semibold">Your Expense History</h3>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {FILTER_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option === "ALL"
                  ? "All Statuses"
                  : option.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase())}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredExpenses.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No expenses found with the selected status.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredExpenses.map((exp) => (
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
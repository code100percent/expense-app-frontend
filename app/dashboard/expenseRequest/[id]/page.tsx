"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { API_BASE } from "@/lib/config"
import { Expense } from "@/lib/schemaInterfaces"
import fetchAPI from "@/lib/fetchAPI"
import AuthorityActions from "./AuthorityActions"

export default function ExpenseDetailsPage() {
  const { id } = useParams()
  const router = useRouter()

  const [expense, setExpense] = useState<Expense | null>(null)
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState<string | null>(null)

  /* -------- Fetch user role -------- */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetchAPI(`${API_BASE}/api/users/me`)
        const data = await res.json()
        setRole(data.role)
      } catch (err) {
        console.error(err)
      }
    }
    fetchUser()
  }, [])

  /* -------- Fetch expense -------- */
  useEffect(() => {
    if (!id) return

    const fetchExpense = async () => {
      try {
        const res = await fetchAPI(`${API_BASE}/api/expenses/${id}`)
        if (!res.ok) throw new Error("Expense not found")
        const data = await res.json()
        setExpense(data.expense)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchExpense()
  }, [id])

  if (loading) {
    return (
      <div className="max-w-3xl text-center py-8 text-muted-foreground">
        Loading expense details...
      </div>
    )
  }

  if (!expense) {
    return (
      <div className="max-w-3xl space-y-4">
        <Button variant="ghost" onClick={() => router.back()}>
          ← Back
        </Button>
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Expense not found
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-3xl space-y-4">
      <Button variant="ghost" onClick={() => router.back()}>
        ← Back
      </Button>

      {/* Expense details */}
      <Card>
        <CardHeader>
          <CardTitle>{expense.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p><strong>Status:</strong> {expense.status.replace(/_/g, " ")}</p>
          <p><strong>Amount:</strong> ₹{expense.receiptAmount}</p>
          <p>
            <strong>Receipt Date:</strong>{" "}
            {expense.receiptDate
              ? new Date(expense.receiptDate).toLocaleDateString()
              : "N/A"}
          </p>
          <p><strong>Description:</strong> {expense.description}</p>
        </CardContent>
      </Card>

      {/* Receipt */}
      {expense.fileUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Receipt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-[400px] w-full">
              <Image
                src={expense.fileUrl}
                alt="Receipt"
                fill
                className="object-contain rounded-md"
              />
            </div>
          </CardContent>
        </Card>
      )}
      {expense.paidReceiptUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Receipt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-[400px] w-full">
              <Image
                src={expense.paidReceiptUrl}
                alt="Receipt"
                fill
                className="object-contain rounded-md"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
  {(role !== "EMPLOYEE" && (expense.status==="SUBMITTED" || expense.status==="MANAGER_APPROVED" || expense.status==="READY_FOR_REIMBURSEMENT")) && (
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <AuthorityActions
              expenseId={id as string}
              role={role||""}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

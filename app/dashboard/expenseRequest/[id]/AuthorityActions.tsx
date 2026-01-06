"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import fetchAPI from "@/lib/fetchAPI"
import { API_BASE } from "@/lib/config"

interface Props {
  expenseId: string
  role: string
}

export default function AuthorityActions({ expenseId, role }: Props) {
  const router = useRouter()

  const [actionLoading, setActionLoading] = useState(false)
  const [showRejectBox, setShowRejectBox] = useState(false)
  const [rejectComment, setRejectComment] = useState("")

  /* -------- Approve -------- */
  const approveExpense = async () => {
    try {
      setActionLoading(true)
      const res = await fetchAPI(
        `${API_BASE}/api/expenses/${expenseId}/approve`,
        { method: "POST" }
      )
      if (!res.ok) throw new Error()
      router.refresh()
      router.push("/dashboard/pending-approvals")
    } catch {
      alert("Failed to approve expense")
    } finally {
      setActionLoading(false)
    }
  }

  /* -------- Reject -------- */
  const rejectExpense = async () => {
    if (!rejectComment.trim()) return

    try {
      setActionLoading(true)
      const res = await fetchAPI(
        `${API_BASE}/api/expenses/${expenseId}/reject`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ comment: rejectComment }),
        }
      )
      if (!res.ok) throw new Error()
      router.refresh()
      router.push("/dashboard/pending-approvals")
    } catch {
      alert("Failed to reject expense")
    } finally {
      setActionLoading(false)
      setShowRejectBox(false)
      setRejectComment("")
    }
  }

  /* -------- Admin Pay -------- */
  const adminContinue = () => {
    router.push(`/dashboard/expenseRequest/${expenseId}/pay`)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        {role === "ADMIN" ? (
          <Button onClick={adminContinue} disabled={actionLoading} className="flex-1">
            Continue to Pay
          </Button>
        ) : (
          <Button onClick={approveExpense} disabled={actionLoading} className="flex-1">
            Approve
          </Button>
        )}

        <Button
          variant="destructive"
          disabled={actionLoading}
          onClick={() => setShowRejectBox(true)}
          className="flex-1"
        >
          Reject
        </Button>
      </div>

      {showRejectBox && (
        <div className="space-y-3 p-4 border rounded-md">
          <Textarea
            placeholder="Rejection reason..."
            value={rejectComment}
            onChange={(e) => setRejectComment(e.target.value)}
          />
          <div className="flex gap-2">
            <Button
              variant="destructive"
              onClick={rejectExpense}
              disabled={!rejectComment.trim() || actionLoading}
              className="flex-1"
            >
              Submit Reject
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowRejectBox(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

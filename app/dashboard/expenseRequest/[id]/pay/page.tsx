"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { API_BASE } from "@/lib/config"



export default function UploadPaymentReceipt(){ 
    //getting id 
    const { id } = useParams()

    const router = useRouter()
    const [file, setFile] = useState<File | null>(null)

    const [submitting, setSubmitting] = useState(false)

    const handleReceiptSubmit = async (
        e: React.FormEvent<HTMLFormElement>
        ) => {
        e.preventDefault()
        if (!file) {
          alert("Payment receipt image is required")
          return
        }
        setSubmitting(true)
        try {
            const formData = new FormData()
            formData.append("paid-receipt", file)

            const res = await fetch(`${API_BASE}/api/expenses/${id}/mark-paid`, {
                method: "POST",
                body: formData,
                credentials: "include",
            })

            if (res.ok) {
                alert(`Expense id : ${id} marked as paid successfully`)
                router.push("/dashboard/pending-approvals")
            } else {
                alert("Failed to submit payment receipt")
            }
        } catch (error) {
            console.error("Error submitting payment receipt:", error)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleReceiptSubmit} className="space-y-4">
                <Input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
                />

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Payment Receipt"}
            </Button>
          </form>
          )
        }
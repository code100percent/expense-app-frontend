// "use client"

// import { useState } from "react"
// import { useRouter } from "next/navigation"

// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { API_BASE } from "@/lib/config"

// export default function NewExpensePage() {
//   const router = useRouter()

//   // ===== FILE =====
//   const [file, setFile] = useState<File | null>(null)

//   // ===== OCR FLOW =====
//   const [extracting, setExtracting] = useState(false)
//   const [dataExtracted, setDataExtracted] = useState(false)

//   // ===== FORM FIELDS (CONTROLLED FROM FIRST RENDER) =====
//   const [title, setTitle] = useState("")
//   const [description, setDescription] = useState("")
//   const [receiptDate, setReceiptDate] = useState("")
//   const [receiptAmount, setReceiptAmount] = useState("")

//   const [submitting, setSubmitting] = useState(false)

//   /* =======================
//      OCR EXTRACTION
//      ======================= */
//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()

//     if (!dataExtracted) {
//       // ---- OCR STEP ----
//       if (!file) {
//         alert("Receipt image is required")
//         return
//       }

//       setExtracting(true)

//       try {
//         const formData = new FormData()
//         formData.append("image", file)

//         const res = await fetch(`${API_BASE}/api/ocr/extract`, {
//           method: "POST",
//           body: formData,
//           credentials: "include",
//         })

//         if (!res.ok) throw new Error("OCR extraction failed")

//         const data = await res.json()
//         const { ocrData } = data

//         setReceiptAmount(
//           ocrData?.amount != null ? String(ocrData.amount) : ""
//         )
//         setReceiptDate(
//           ocrData?.date ? ocrData.date.split("T")[0] : ""
//         )

//         setDataExtracted(true)
//         alert("Receipt data extracted successfully")
//       } catch (error) {
//         console.error(error)
//         alert("Failed to extract receipt data")
//       } finally {
//         setExtracting(false)
//       }

//       return
//     }

//     // ---- FINAL SUBMIT ----
//     if (!title || !receiptAmount || !receiptDate || !file) {
//       alert("All required fields must be filled")
//       return
//     }

//     setSubmitting(true)

//     try {
//       const formData = new FormData()

//       formData.append("employeeId", String(localStorage.getItem("UserId")))
//       formData.append("title", title)
//       formData.append("description", description)
//       formData.append("receiptDate", receiptDate)
//       formData.append("receiptAmount", receiptAmount)
//       formData.append("receipt", file)

//       const res = await fetch(`${API_BASE}/api/expenses`, {
//         method: "POST",
//         body: formData,
//         credentials: "include",
//       })

//       if (!res.ok) throw new Error("Expense submission failed")

//       alert("Expense submitted successfully")
//       router.push("/dashboard")
//     } catch (error) {
//       console.error(error)
//       alert("Something went wrong")
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   return (
//     <Card className="max-w-xl">
//       <CardHeader>
//         <CardTitle>New Expense</CardTitle>
//       </CardHeader>

//       <CardContent>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* FILE INPUT */}
//           <Input
//             type="file"
//             accept="image/*"
//             onChange={(e) => setFile(e.target.files?.[0] || null)}
//             disabled={dataExtracted}
//             required
//           />

//           {/* TITLE */}
//           <Input
//             placeholder="Expense title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             disabled={!dataExtracted}
//           />

//           {/* DESCRIPTION */}
//           <Textarea
//             placeholder="Description (optional)"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             disabled={!dataExtracted}
//           />

//           {/* AMOUNT */}
//           <Input
//             type="number"
//             placeholder="Amount"
//             value={receiptAmount}
//             onChange={(e) => setReceiptAmount(e.target.value)}
//             disabled={!dataExtracted}
//           />

//           {/* DATE */}
//           <Input
//             type="date"
//             value={receiptDate}
//             onChange={(e) => setReceiptDate(e.target.value)}
//             disabled={!dataExtracted}
//           />

//           <Button
//             type="submit"
//             className="w-full"
//             disabled={extracting || submitting}
//           >
//             {!dataExtracted
//               ? extracting
//                 ? "Extracting..."
//                 : "Extract Receipt Data"
//               : submitting
//                 ? "Submitting..."
//                 : "Submit Expense"}
//           </Button>
//         </form>
//       </CardContent>
//     </Card>
//   )
// }


"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { API_BASE } from "@/lib/config"

export default function NewExpensePage() {
  const router = useRouter()


  const [file, setFile] = useState<File | null>(null)

  const [extracting, setExtracting] = useState(false)
  const [dataExtracted, setDataExtracted] = useState(false)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  // IMPORTANT: HTML inputs use string, not Date
  const [receiptDate, setReceiptDate] = useState("")
  const [receiptAmount, setReceiptAmount] = useState("")

  const [submitting, setSubmitting] = useState(false)

  /* =======================
     OCR EXTRACTION SUBMIT
     ======================= */
  const handleReceiptSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    if (!file) {
      alert("Receipt image is required")
      return
    }

    setExtracting(true)

    try {
      const formData = new FormData()
      formData.append("image", file)

      const res = await fetch(`${API_BASE}/api/ocr/extract`, {
        method: "POST",
        body: formData,
        credentials: "include",
      })

      if (!res.ok) {
        throw new Error("OCR extraction failed")
      }

      const data = await res.json()
      console.log("OCR data:", data)

      // expected backend response:
      // { amount: number, date: "YYYY-MM-DD" }
      const { ocrData } = data

      setReceiptAmount(
        ocrData?.amount != null ? String(ocrData.amount) : ""
      )
      setReceiptDate(
      ocrData?.date ? ocrData.date.split("T")[0] : ""
              )
      setDataExtracted(true)

      alert("Receipt data extracted successfully")

    } catch (err) {
      console.error(err)
      alert("Failed to extract data")
    } finally {
      setExtracting(false)
    }
  }

  /* =======================
     FINAL EXPENSE SUBMIT
     ======================= */
  const handleFinalSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    if (!title || !file) {
      alert("Title and receipt image are required")
      return
    }

    if (!receiptAmount || !receiptDate) {
      alert("Receipt amount and date are required")
      return
    }

    setSubmitting(true)

    try {
      const formData = new FormData()

      formData.append("employeeId", String(localStorage.getItem("UserId")))
      formData.append("title", title)
      formData.append("description", description)
      formData.append("receiptDate", receiptDate)
      formData.append("receiptAmount", Number(receiptAmount).toString())
      formData.append("receipt", file)

      const res = await fetch("http://localhost:5000/api/expenses", {
        method: "POST",
        body: formData,
        credentials: "include",
      })

      if (!res.ok) {
        throw new Error("Expense submission failed")
      }

      const data = await res.json()
      console.log("Expense created:", data)

      alert("Expense submitted successfully")

      // reset form
      setTitle("")
      setDescription("")
      setReceiptAmount("")
      setReceiptDate("")
      setDataExtracted(false)
      //redirect to dashboard
      router.push("/dashboard")

    } catch (err) {
      console.error(err)
      alert("Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>New Expense</CardTitle>
      </CardHeader>

      <CardContent>
        {!dataExtracted ? (
          /* ===== OCR STEP ===== */
          <form onSubmit={handleReceiptSubmit} className="space-y-4">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />

            <Button type="submit" className="w-full" disabled={extracting}>
              {extracting ? "Extracting..." : "Extract Receipt Data"}
            </Button>
          </form>
        ) : (
          /* ===== FINAL SUBMIT STEP ===== */
          <form onSubmit={handleFinalSubmit} className="space-y-4">
            <Input
              placeholder="Expense title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <Textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <Input
              type="number"
              placeholder="Amount"
              value={receiptAmount}
              onChange={(e) => setReceiptAmount(e.target.value)}
              required
            />

            <Input
              type="date"
              value={receiptDate}
              onChange={(e) => setReceiptDate(e.target.value)}
              required
            />

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Expense"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
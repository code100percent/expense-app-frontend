"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function Page() {
  const router = useRouter()
  
  const handleLoginBtn = () => {
    router.push("/auth/login")
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-4xl font-bold">
        Welcome to the Expense Reimbursement System
      </h1>

      <p className="max-w-2xl text-lg text-muted-foreground">
        This is the main landing page of the Expense Reimbursement System.
        Please use the navigation links to access different sections of the mapplication.
      </p>

      {/* Buttons */}
      <div className="flex gap-4 mt-4">

        <Button size="lg" onClick={handleLoginBtn}>
          Login
        </Button>

      </div>
    </div>
  )
}

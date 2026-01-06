export type Role = "EMPLOYEE" | "MANAGER" | "FINANCE" | "ADMIN"

export type Expense = {
  _id: string
  employeeId: string
  title: string
  description?: string
  status: string
  fileUrl: string
  receiptAmount?: number
  receiptDate?: Date
  paidReceiptUrl?: string
  paidAt?: Date
  rejectResponse?: string
  createdAt: Date
  updatedAt: Date
}

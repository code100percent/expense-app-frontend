"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"

const data = [
  { name: "Jan", old: 40, new: 30, avg: 35 },
  { name: "Feb", old: 55, new: 45, avg: 50 },
  { name: "Mar", old: 70, new: 60, avg: 65 },
  { name: "Apr", old: 60, new: 50, avg: 58 },
  { name: "May", old: 80, new: 70, avg: 75 },
]

export function VisitorsChart() {
  return (
    <Card className="lg:col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Visitors</CardTitle>
      </CardHeader>
      <CardContent className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="old" fill="#ffb088" />
            <Bar dataKey="new" fill="#ff7a7a" />
            <Line type="monotone" dataKey="avg" stroke="#6c63ff" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

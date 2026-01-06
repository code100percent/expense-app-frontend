"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"

const data = [
  { name: "UI", value: 10 },
  { name: "UX", value: 15 },
  { name: "Web", value: 12 },
  { name: "App", value: 16 },
]

export function ProjectsChart() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Projects</CardTitle>
      </CardHeader>
      <CardContent className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#42e695" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

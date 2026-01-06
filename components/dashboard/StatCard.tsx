import { Card, CardContent } from "@/components/ui/card"

export default function StatCard({
  title,
  value,
}: {
  title: string
  value: string
}) {
  return (
    <Card className="border border-slate-200">
      <CardContent className="p-6">
        <p className="text-sm text-slate-500">{title}</p>
        <h2 className="text-3xl font-semibold text-slate-800 mt-2">
          {value}
        </h2>
      </CardContent>
    </Card>
  )
}

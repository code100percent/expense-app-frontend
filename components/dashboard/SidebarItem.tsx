import Link from "next/link"
import type { ReactNode } from "react"

export default function SidebarItem({
  icon,
  label,
  active,
  badge,
  href,
}: {
  icon: ReactNode
  label: string
  active?: boolean
  badge?: string
  href?: string
}) {
  return (
    <Link href={href || "/dashboard"}>
    <div
      className={`flex items-center justify-between px-4 py-2.5 rounded-md cursor-pointer
      transition-colors
      ${active ? "bg-slate-700" : "hover:bg-slate-700/60"}`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span>{label}</span>
      </div>

      {badge && (
        <span className="text-[10px] bg-slate-500 px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </div>
    </Link>
  )
}

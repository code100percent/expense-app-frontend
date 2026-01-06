"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { API_BASE } from "@/lib/config"
import fetchAPI from "@/lib/fetchAPI"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function UserDetailPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<{
    id?:string
    name?: string
    email?: string
    role?: string
    createdAt?: string
  } | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetchAPI(`${API_BASE}/api/users/me`, {
          credentials: "include",
        })

        if (!res.ok) throw new Error("Failed to fetch user")

        const data = await res.json()
        console.log(data)
        setUser({
          id : data._id,
          name: data.name,
          email: data.email,
          role: data.role,
          // createdAt: data.createdAt,
        })
      } catch (err: any) {
        console.error(err)
        setError(err.message || "Failed to load user")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Loading user details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">{error}</div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">User Profile</h2>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-300 flex items-center justify-center text-lg font-semibold text-slate-700">
                {user?.name ? user.name.split(" ").map((s)=>s[0]).slice(0,2).join("") : "U"}
              </div>
              <div>
                <div className="text-lg font-semibold">{user?.name || "-"}</div>
                <div className="text-sm text-muted-foreground">{user?.email || "-"}</div>
              </div>
            </span>

            <div>
              <Button variant="outline" size="sm" onClick={()=>router.push('/dashboard')}>Edit Profile</Button>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <div className="w-36 text-sm text-muted-foreground">User ID</div>
              <div className="font-medium">{user?.id || '-'}</div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <div className="w-36 text-sm text-muted-foreground">Role</div>
              <div className="font-medium">{user?.role || '-'}</div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <div className="w-36 text-sm text-muted-foreground">Joined</div>
              <div className="font-medium">{user?.createdAt ? new Date(user.createdAt).toLocaleString() : '-'}</div>
            </div>

          </div>
        </CardContent>
      </Card>
    </div>
  )
}

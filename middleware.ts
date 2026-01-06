import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value

  const protectedRoutes = [
    "/dashboard",
    "/auth/register-admin-access"
  ]
  const isProtected = protectedRoutes.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  )
  if (isProtected && !token) {
    return NextResponse.redirect(
      new URL("/auth/login", request.url)
    )
  }
    if (token) {
        const restrictedRoutesAfterLogin = [
          "/auth/login",
          "/"
        ]

        if (restrictedRoutesAfterLogin.some((path) =>
          request.nextUrl.pathname === path
        )) {
          
            return NextResponse.redirect(new URL("/dashboard", request.url))
          
          }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/login",
    "/auth/register-admin-access",
    "/"
  ],
}
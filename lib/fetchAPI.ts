import { API_BASE } from "./config"

const fetchAPI = async (
  input: RequestInfo,
  init?: RequestInit
) => {
  let res = await fetch(input, {
    ...init,
    credentials: "include",
  })

  if (res.status === 401) {
    const refreshRes = await fetch(`${API_BASE}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })

    if (!refreshRes.ok) {
      throw new Error("Session expired")
    }

    res = await fetch(input, {
      ...init,
      credentials: "include",
    })
  }

  return res
}

export default fetchAPI
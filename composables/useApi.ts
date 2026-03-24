import type { AuthResponse } from '~/types/domain'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type JsonBody = Record<string, unknown> | unknown[] | string | number | boolean | null

interface ApiFetchOptions {
  method?: HttpMethod
  body?: JsonBody
  query?: Record<string, string | number | boolean | undefined>
  headers?: Record<string, string>
  auth?: boolean
  retryOn401?: boolean
}

export function useApi() {
  const config = useRuntimeConfig()
  const auth = useAuthStore()

  async function rawFetch<T>(path: string, opts: ApiFetchOptions = {}): Promise<T> {
    const url = `${config.public.apiBase}${path}`

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(opts.headers ?? {})
    }

    if (opts.auth !== false && auth.accessToken) {
      headers.Authorization = `Bearer ${auth.accessToken}`
    }

    const method = opts.method ?? 'GET'
    const body = method === 'GET' || method === 'DELETE' ? undefined : opts.body

    try {
      return await $fetch<T>(url, {
        method,
        headers,
        body: body as unknown as BodyInit | Record<string, unknown> | null | undefined,
        query: opts.query
      })
    } catch (e: unknown) {
      const err = e as { status?: number; data?: unknown }
      // If access token expired, try refresh once.
      if (opts.retryOn401 !== false && err?.status === 401 && auth.refreshToken) {
        const refreshed = await tryRefresh()
        if (refreshed) return rawFetch<T>(path, { ...opts, retryOn401: false })
      }
      throw e
    }
  }

  async function tryRefresh(): Promise<boolean> {
    try {
      const res = await $fetch<AuthResponse>(`${config.public.apiBase}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { refreshToken: auth.refreshToken }
      })

      auth.setTokens({
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
        expiresInSeconds: res.expiresInSeconds
      })
      auth.setMe(res.me)
      return true
    } catch {
      auth.logout()
      return false
    }
  }

  return {
    fetch: rawFetch
  }
}

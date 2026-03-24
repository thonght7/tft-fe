<script setup lang="ts">
import { z } from 'zod'
import type { AuthResponse } from '~/types/domain'

const auth = useAuthStore()
const { fetch } = useApi()

const route = useRoute()

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

const form = reactive({
  email: '',
  password: ''
})

const loading = ref(false)
const errorMsg = ref<string | null>(null)

async function submit() {
  errorMsg.value = null
  const parsed = schema.safeParse(form)
  if (!parsed.success) {
    errorMsg.value = parsed.error.issues[0]?.message ?? 'Invalid form'
    return
  }

  loading.value = true
  try {
    const res = await fetch<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: parsed.data,
      auth: false
    })

    auth.setTokens({
      accessToken: res.accessToken,
      refreshToken: res.refreshToken,
      expiresInSeconds: res.expiresInSeconds
    })
    auth.setMe(res.me)

    const next = typeof route.query.next === 'string' ? route.query.next : '/'
    await navigateTo(next)
  } catch (e: unknown) {
    const err = e as { data?: { message?: string } }
    errorMsg.value = err?.data?.message ?? 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="card" style="max-width: 520px; margin: 0 auto">
    <h2 style="margin-top: 0">Login</h2>

    <div class="grid">
      <div>
        <div class="label">Email</div>
        <input v-model="form.email" class="input" type="email" placeholder="you@email.com" />
      </div>
      <div>
        <div class="label">Password</div>
        <input v-model="form.password" class="input" type="password" placeholder="••••••••" />
      </div>

      <div v-if="errorMsg" class="card" style="border-color: rgba(255,77,77,.4); background: rgba(255,77,77,.1)">
        {{ errorMsg }}
      </div>

      <button class="btn primary" :disabled="loading" @click="submit">
        {{ loading ? 'Signing in…' : 'Sign in' }}
      </button>

      <div class="help">
        Chưa có tài khoản?
        <NuxtLink to="/register" style="text-decoration: underline">Đăng ký</NuxtLink>
      </div>
    </div>
  </div>
</template>

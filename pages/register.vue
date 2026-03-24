<script setup lang="ts">
import { z } from 'zod'
import type { AuthResponse } from '~/types/domain'

const auth = useAuthStore()
const { fetch } = useApi()

const schema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    password2: z.string().min(8)
  })
  .refine((v) => v.password === v.password2, { message: 'Passwords do not match', path: ['password2'] })

const form = reactive({
  email: '',
  password: '',
  password2: ''
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
    const res = await fetch<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: {
        email: parsed.data.email,
        password: parsed.data.password
      },
      auth: false
    })

    auth.setTokens({
      accessToken: res.accessToken,
      refreshToken: res.refreshToken,
      expiresInSeconds: res.expiresInSeconds
    })
    auth.setMe(res.me)

    await navigateTo('/')
  } catch (e: unknown) {
    const err = e as { data?: { message?: string } }
    errorMsg.value = err?.data?.message ?? 'Register failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="card" style="max-width: 520px; margin: 0 auto">
    <h2 style="margin-top: 0">Register</h2>

    <div class="grid">
      <div>
        <div class="label">Email</div>
        <input v-model="form.email" class="input" type="email" />
      </div>
      <div>
        <div class="label">Password</div>
        <input v-model="form.password" class="input" type="password" />
      </div>
      <div>
        <div class="label">Re-type password</div>
        <input v-model="form.password2" class="input" type="password" />
      </div>

      <div v-if="errorMsg" class="card" style="border-color: rgba(255,77,77,.4); background: rgba(255,77,77,.1)">
        {{ errorMsg }}
      </div>

      <button class="btn primary" :disabled="loading" @click="submit">
        {{ loading ? 'Creating…' : 'Create account' }}
      </button>

      <div class="help">
        Đã có tài khoản?
        <NuxtLink to="/login" style="text-decoration: underline">Đăng nhập</NuxtLink>
      </div>
    </div>
  </div>
</template>

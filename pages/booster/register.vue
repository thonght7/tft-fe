<script setup lang="ts">
import { z } from 'zod'
import { RANKS } from '~/utils/ranks'
import type { BoosterProfileResponse, Rank } from '~/types/domain'

const { fetch } = useApi()
const auth = useAuthStore()

const schema = z.object({
  currentRank: z.string().min(2),
  winrate: z.number().min(0).max(100)
})

const form = reactive({
  currentRank: 'GOLD' as Rank,  winrate: 55
})

const loading = ref(false)
const errorMsg = ref<string | null>(null)
const result = ref<BoosterProfileResponse | null>(null)

async function submit() {
  errorMsg.value = null
  result.value = null

  const parsed = schema.safeParse({
    currentRank: form.currentRank,
    winrate: Number(form.winrate)
  })

  if (!parsed.success) {
    errorMsg.value = parsed.error.issues[0]?.message ?? 'Invalid form'
    return
  }

  loading.value = true
  try {
    result.value = await fetch<BoosterProfileResponse>('/api/boosters/register', {
      method: 'POST',
      body: {
        currentRank: parsed.data.currentRank,
        winrate: parsed.data.winrate
      }
    })

    // Role gets updated server-side; refresh `/api/auth/me` is optional.
    // For now, update local role optimistically if possible.
    if (auth.me) auth.setMe({ ...auth.me, role: 'BOOSTER' })
  } catch (e: unknown) {
    const err = e as { data?: { message?: string } }
    errorMsg.value = err?.data?.message ?? 'Register booster failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="grid" style="grid-template-columns: 1fr 1fr">
    <div class="card">
      <h2 style="margin-top: 0">Become a Booster</h2>
      <p class="help">Backend: <code>POST /api/boosters/register</code></p>

      <div class="grid" style="margin-top: 12px">
        <div>
          <div class="label">Current rank</div>
          <select v-model="form.currentRank" class="input">
            <option v-for="r in RANKS" :key="r.key" :value="r.key">{{ r.label }}</option>
          </select>
        </div>

        <div>
          <div class="label">Winrate (%)</div>
          <input v-model.number="form.winrate" class="input" type="number" min="0" max="100" step="0.01" />
          <div class="help" style="margin-top: 6px">0 → 100 (BigDecimal ở backend)</div>
        </div>

        <div v-if="errorMsg" class="card" style="border-color: rgba(255,77,77,.4); background: rgba(255,77,77,.1)">
          {{ errorMsg }}
        </div>

        <button class="btn primary" :disabled="loading" @click="submit">
          {{ loading ? 'Submitting…' : 'Register as Booster' }}
        </button>
      </div>
    </div>

    <div class="card">
      <h3 style="margin-top: 0">Result</h3>
      <div v-if="!result" class="help">Chưa có dữ liệu.</div>
      <div v-else class="grid" style="gap: 8px">
        <div class="badge">{{ result.status }}</div>
        <div><b>Email:</b> {{ result.email }}</div>
        <div><b>Rank:</b> {{ result.currentRank }}</div>
        <div><b>Winrate:</b> {{ Number(result.winrate).toFixed(2) }}%</div>
      </div>
    </div>
  </div>
</template>

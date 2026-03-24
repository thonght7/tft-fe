<script setup lang="ts">
import type { BoosterProfileResponse } from '~/types/domain'

const { fetch } = useApi()

const loading = ref(true)
const boosters = ref<BoosterProfileResponse[]>([])
const errorMsg = ref<string | null>(null)

onMounted(async () => {
  try {
    boosters.value = await fetch<BoosterProfileResponse[]>('/api/boosters')
  } catch (e: unknown) {
    const err = e as { data?: { message?: string } }
    errorMsg.value = err?.data?.message ?? 'Failed to load boosters'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="grid">
    <div class="card">
      <h2 style="margin-top: 0">Boosters</h2>
      <p class="help">Danh sách booster public (backend: <code>/api/boosters</code>).</p>
    </div>

    <div v-if="loading" class="card">Loading…</div>
    <div v-else-if="errorMsg" class="card" style="border-color: rgba(255,77,77,.4)">{{ errorMsg }}</div>

    <div v-else class="grid" style="grid-template-columns: repeat(3, 1fr)">
      <div v-for="b in boosters" :key="b.id" class="card">
        <div class="badge">{{ b.status }}</div>
        <h3 style="margin: 10px 0 6px">{{ b.email }}</h3>
        <p class="help" style="margin: 0">Rank: {{ b.currentRank }}</p>
        <p class="help" style="margin: 6px 0 0">Winrate: {{ Number(b.winrate).toFixed(2) }}%</p>
      </div>
    </div>
  </div>
</template>

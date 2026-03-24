<script setup lang="ts">
import type { OrderResponse } from '~/types/domain'

const { fetch } = useApi()

const loading = ref(true)
const orders = ref<OrderResponse[]>([])
const errorMsg = ref<string | null>(null)

onMounted(async () => {
  try {
    orders.value = await fetch<OrderResponse[]>('/api/orders/me')
  } catch (e: unknown) {
    const err = e as { data?: { message?: string } }
    errorMsg.value = err?.data?.message ?? 'Failed to load orders'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="grid">
    <div class="card">
      <h2 style="margin-top: 0">My Orders</h2>
    </div>

    <div v-if="loading" class="card">Loading…</div>
    <div v-else-if="errorMsg" class="card" style="border-color: rgba(255,77,77,.4)">{{ errorMsg }}</div>

    <div v-else class="card" style="padding: 0">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>From → To</th>
            <th>Status</th>
            <th>Price</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr v-for="o in orders" :key="o.id">
            <td style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace">
              {{ o.id.slice(0, 8) }}…
            </td>
            <td>{{ o.currentRank }} → {{ o.targetRank }}</td>
            <td><span class="badge">{{ o.status }}</span></td>
            <td>{{ Number(o.price).toLocaleString() }} VND</td>
            <td><NuxtLink class="btn" :to="`/orders/${o.id}`">Open</NuxtLink></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RANKS } from '~/utils/ranks'
import type { CalculatePriceResponse, OrderResponse, Rank } from '~/types/domain'

const { fetch } = useApi()

const GAME = 'tft_ranked'

const currentRank = ref<Rank>('Bạc I')
const targetRank = ref<Rank>('Vàng IV')
const price = ref<number | null>(null)

const loadingPrice = ref(false)
const creating = ref(false)
const errorMsg = ref<string | null>(null)

watch([currentRank, targetRank], async () => {
  price.value = null
  errorMsg.value = null

  loadingPrice.value = true
  try {
    const res = await fetch<CalculatePriceResponse>('/api/pricing/calculate-price', {
      method: 'POST',
      body: {
        game: GAME,
        currentRank: currentRank.value,
        targetRank: targetRank.value
      },
      auth: false
    })
    price.value = Number(res.price)
  } catch (e: unknown) {
    const err = e as { data?: { message?: string } }
    errorMsg.value = err?.data?.message ?? 'Failed to calculate price'
  } finally {
    loadingPrice.value = false
  }
}, { immediate: true })

async function createOrder() {
  errorMsg.value = null
  if (price.value == null) {
    errorMsg.value = 'Price not available'
    return
  }

  creating.value = true
  try {
    const order = await fetch<OrderResponse>('/api/orders', {
      method: 'POST',
      body: {
        currentRank: currentRank.value,
        targetRank: targetRank.value,
        price: price.value
      }
    })
    await navigateTo(`/orders/${order.id}`)
  } catch (e: unknown) {
    const err = e as { data?: { message?: string } }
    errorMsg.value = err?.data?.message ?? 'Failed to create order'
  } finally {
    creating.value = false
  }
}
</script>

<template>
  <div class="grid" style="grid-template-columns: 0.9fr 1.1fr">
    <div class="card">
      <h2 style="margin-top: 0">Create boost order</h2>
      <p class="help">Pricing backend: <code>/api/pricing/calculate-price</code> (game={{ GAME }}).</p>

      <div class="row" style="margin-top: 12px">
        <div>
          <div class="label">Current rank</div>
          <select v-model="currentRank" class="input">
            <option v-for="r in RANKS" :key="r.key" :value="r.key">{{ r.label }}</option>
          </select>
        </div>
        <div>
          <div class="label">Target rank</div>
          <select v-model="targetRank" class="input">
            <option v-for="r in RANKS" :key="r.key" :value="r.key">{{ r.label }}</option>
          </select>
        </div>
      </div>

      <div style="margin-top: 12px" class="card">
        <div class="help">Estimated price</div>
        <div style="font-size: 26px; font-weight: 800; margin-top: 6px">
          <span v-if="loadingPrice">Calculating…</span>
          <span v-else-if="price != null">{{ price.toLocaleString() }} VND</span>
          <span v-else>—</span>
        </div>
      </div>

      <div v-if="errorMsg" class="card" style="margin-top: 12px; border-color: rgba(255,77,77,.4)">
        {{ errorMsg }}
      </div>

      <button class="btn primary" style="margin-top: 12px" :disabled="creating || loadingPrice || price == null" @click="createOrder">
        {{ creating ? 'Creating…' : 'Create order' }}
      </button>

      <div class="help" style="margin-top: 10px">
        Order create backend: <code>POST /api/orders</code> (requires price).
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <div class="badge">Add-ons (coming)</div>
        <h3 style="margin: 10px 0 6px">Queue priority</h3>
        <p class="help">Mô phỏng gói add-on như các site boost: ưu tiên, stream, duo…</p>
      </div>

      <div class="card">
        <div class="badge">Guarantees</div>
        <ul style="margin: 10px 0 0; padding-left: 18px; color: var(--muted)">
          <li>Không chia sẻ account ra bên ngoài</li>
          <li>Chủ động cập nhật tiến độ</li>
          <li>Hoàn tiền nếu không thực hiện</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OrderResponse, PaymentResponse, ProgressUpdateResponse } from '~/types/domain'
import { formatDateTime } from '~/utils/dates'

const route = useRoute()
const { fetch } = useApi()
const auth = useAuthStore()

const id = computed(() => String(route.params.id))

const order = ref<OrderResponse | null>(null)
const payment = ref<PaymentResponse | null>(null)
const progress = ref<ProgressUpdateResponse[]>([])

const loading = ref(true)
const errorMsg = ref<string | null>(null)

const canUpdateProgress = computed(() => auth.role === 'BOOSTER')

const newProgress = reactive({
  message: '',
  percent: 0
})

async function load() {
  loading.value = true
  errorMsg.value = null
  try {
    const list = await fetch<OrderResponse[]>('/api/orders/me')
    order.value = list.find((o) => o.id === id.value) ?? null
    if (!order.value) {
      errorMsg.value = 'Order not found'
      return
    }

    payment.value = await fetch<PaymentResponse>(`/api/payments/orders/${order.value.id}`, {
      method: 'POST'
    })

    progress.value = await fetch<ProgressUpdateResponse[]>(`/api/tracking/orders/${order.value.id}/progress`)
  } catch (e: unknown) {
    const err = e as { data?: { message?: string } }
    errorMsg.value = err?.data?.message ?? 'Failed to load order'
  } finally {
    loading.value = false
  }
}

onMounted(load)

const paying = ref(false)

async function payMock(succeed: boolean) {
  if (!order.value) return
  paying.value = true
  errorMsg.value = null
  try {
    payment.value = await fetch<PaymentResponse>(`/api/payments/orders/${order.value.id}/mock`, {
      method: 'POST',
      body: {
        provider: 'MOCK',
        succeed
      }
    })
    await load()
  } catch (e: unknown) {
    const err = e as { data?: { message?: string } }
    errorMsg.value = err?.data?.message ?? 'Payment failed'
  } finally {
    paying.value = false
  }
}

const adding = ref(false)

async function addProgress() {
  if (!order.value) return
  errorMsg.value = null

  if (!newProgress.message.trim()) {
    errorMsg.value = 'Message is required'
    return
  }
  if (newProgress.percent < 0 || newProgress.percent > 100) {
    errorMsg.value = 'Percent must be 0..100'
    return
  }

  adding.value = true
  try {
    await fetch<ProgressUpdateResponse>(`/api/tracking/orders/${order.value.id}/progress`, {
      method: 'POST',
      body: {
        message: newProgress.message,
        percent: Math.round(Number(newProgress.percent))
      }
    })
    newProgress.message = ''
    await load()
  } catch (e: unknown) {
    const err = e as { data?: { message?: string } }
    errorMsg.value = err?.data?.message ?? 'Add progress failed'
  } finally {
    adding.value = false
  }
}
</script>

<template>
  <div class="grid" style="grid-template-columns: 1.1fr 0.9fr">
    <div class="grid">
      <div class="card">
        <h2 style="margin-top: 0">Order details</h2>
        <div v-if="loading">Loading…</div>
        <div v-else-if="errorMsg" class="card" style="border-color: rgba(255,77,77,.4)">{{ errorMsg }}</div>

        <div v-else-if="order" class="grid" style="gap: 10px">
          <div class="row">
            <div class="card">
              <div class="help">From</div>
              <div style="font-size: 20px; font-weight: 800">{{ order.currentRank }}</div>
            </div>
            <div class="card">
              <div class="help">To</div>
              <div style="font-size: 20px; font-weight: 800">{{ order.targetRank }}</div>
            </div>
          </div>

          <div class="row">
            <div class="card">
              <div class="help">Status</div>
              <div style="font-size: 18px; font-weight: 700">
                <span class="badge">{{ order.status }}</span>
              </div>
            </div>
            <div class="card">
              <div class="help">Price</div>
              <div style="font-size: 18px; font-weight: 700">{{ Number(order.price).toLocaleString() }} VND</div>
            </div>
          </div>

          <div v-if="payment" class="card">
            <div class="help">Payment</div>
            <div style="margin-top: 8px" class="row">
              <div>
                <div class="help">Status</div>
                <div class="badge">{{ payment.status }}</div>
              </div>
              <div>
                <div class="help">Provider</div>
                <div class="badge">{{ payment.provider }}</div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="help">Progress</div>

            <div v-if="progress.length === 0" class="help" style="margin-top: 6px">Chưa có cập nhật.</div>

            <div v-else class="grid" style="gap: 10px; margin-top: 10px">
              <div v-for="p in progress" :key="p.id" class="card" style="padding: 12px">
                <div class="row" style="align-items: center">
                  <div class="badge">{{ p.percent }}%</div>
                  <div class="help">{{ formatDateTime(p.createdAt) }}</div>
                </div>
                <div style="margin-top: 8px">{{ p.message }}</div>
                <div class="help" style="margin-top: 6px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace">
                  boosterUserId: {{ p.boosterUserId.slice(0, 8) }}…
                </div>
              </div>
            </div>

            <div v-if="canUpdateProgress" class="card" style="margin-top: 12px">
              <div class="badge">Booster update</div>

              <div class="grid" style="margin-top: 10px">
                <div>
                  <div class="label">Message</div>
                  <input v-model="newProgress.message" class="input" type="text" maxlength="500" />
                </div>

                <div>
                  <div class="label">Percent (0..100)</div>
                  <input v-model.number="newProgress.percent" class="input" type="number" min="0" max="100" step="1" />
                </div>

                <button class="btn primary" :disabled="adding" @click="addProgress">
                  {{ adding ? 'Saving…' : 'Add progress update' }}
                </button>

                <div class="help">Chỉ booster được assign mới có quyền update (backend check).</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <h3 style="margin-top: 0">Checkout (mock)</h3>
        <p class="help">Backend: <code>POST /api/payments/orders/{orderId}/mock</code></p>
        <div class="row">
          <button class="btn primary" :disabled="paying || loading || !order" @click="payMock(true)">
            {{ paying ? 'Paying…' : 'Mock success' }}
          </button>
          <button class="btn danger" :disabled="paying || loading || !order" @click="payMock(false)">
            Mock fail
          </button>
        </div>
      </div>

      <div class="card">
        <div class="badge">Admin/Booster tools (later)</div>
        <p class="help" style="margin: 10px 0 0">
          Admin assign booster: <code>POST /api/orders/{orderId}/assign</code>. Booster/user update status: <code>POST /api/orders/{orderId}/status</code>.
        </p>
      </div>
    </div>
  </div>
</template>

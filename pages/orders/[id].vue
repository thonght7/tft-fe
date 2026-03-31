<script setup lang="ts">
import type { BoosterProfileResponse, OrderResponse, PaymentResponse, ProgressUpdateResponse } from '~/types/domain'
import type { BankTransferInitResponseDto } from '~/types/payment'
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

const paying = ref(false)

async function payMock(succeed: boolean) {
  if (!order.value) return
  if (!hasBoosterSelected.value) {
    errorMsg.value = 'Vui lòng chọn một booster trước khi thanh toán.'
    return
  }

  paying.value = true
  errorMsg.value = null
  try {
    await fetch(`/api/orders/${order.value.id}/assign`, {
      method: 'POST',
      body: { boosterUserId: selectedBoosterUserId.value }
    })

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

const bankTransfer = ref<BankTransferInitResponseDto | null>(null)
const bankTransferLoading = ref(false)

async function initBankTransfer() {
  if (!order.value) return
  if (!hasBoosterSelected.value) {
    errorMsg.value = 'Vui lòng chọn một booster trước khi thanh toán.'
    return
  }

  bankTransferLoading.value = true
  errorMsg.value = null
  try {
    await fetch(`/api/orders/${order.value.id}/assign`, {
      method: 'POST',
      body: { boosterUserId: selectedBoosterUserId.value }
    })

    bankTransfer.value = await fetch<BankTransferInitResponseDto>(`/api/payments/orders/${order.value.id}/bank-transfer/init`, {
      method: 'POST'
    })
  } catch (e: unknown) {
    const err = e as { data?: { message?: string } }
    errorMsg.value = err?.data?.message ?? 'Failed to init bank transfer'
  } finally {
    bankTransferLoading.value = false
  }
}

interface VnPayInitResponseDto {
  paymentId: string
  orderId: string
  paymentUrl: string
}

const vnpayLoading = ref(false)

async function payVnPay() {
  if (!order.value) return
  if (!hasBoosterSelected.value) {
    errorMsg.value = 'Vui lòng chọn một booster trước khi thanh toán.'
    return
  }

  vnpayLoading.value = true
  errorMsg.value = null
  try {
    await fetch(`/api/orders/${order.value.id}/assign`, {
      method: 'POST',
      body: { boosterUserId: selectedBoosterUserId.value }
    })

    const res = await fetch<VnPayInitResponseDto>(`/api/payments/orders/${order.value.id}/vnpay/init`, {
      method: 'POST',
      body: {}
    })
    window.location.href = res.paymentUrl
  } catch (e: unknown) {
    const err = e as { data?: { message?: string } }
    errorMsg.value = err?.data?.message ?? 'Failed to init VNPay'
  } finally {
    vnpayLoading.value = false
  }
}

const boosters = ref<BoosterProfileResponse[]>([])
const boosterQuery = ref('')
const selectedBoosterUserId = ref<string | null>(null)
const selectedBoosterEmail = ref<string | null>(null)
const boostersLoading = ref(false)

const assignError = ref<string | null>(null)

async function onSelectBooster(userId: string) {
  const picked = boosters.value.find((b) => b.userId === userId) || null
  selectedBoosterUserId.value = userId
  selectedBoosterEmail.value = picked?.email ?? null

  // Bind selected booster into the input for better UX.
  // We only persist (assign) when the user clicks Pay (server will validate).
  boosterQuery.value = picked?.email ?? boosterQuery.value

  // Close the suggestion list.
  boosters.value = []
}

const hasBoosterSelected = computed(() => !!selectedBoosterUserId.value)

let boosterTimer: ReturnType<typeof setTimeout> | null = null
watch(boosterQuery, (v) => {
  if (boosterTimer) clearTimeout(boosterTimer)
  const q = v.trim()
  if (!q) {
    boosters.value = []
    return
  }
  boosterTimer = setTimeout(() => {
    void searchBoosters(q)
  }, 250)
})

async function searchBoosters(q: string) {
  boostersLoading.value = true
  try {
    // Backend supports filtering by status; we fetch ACTIVE boosters and then apply client-side text search.
    // If you want true server-side search, we can extend backend with ?q=...
    const list = await fetch<BoosterProfileResponse[]>('/api/boosters', {
      query: { status: 'ACTIVE' }
    })

    const qq = q.toLowerCase()
    boosters.value = list
      .filter((b) => String(b.status || '').toUpperCase() === 'ACTIVE')
      .filter((b) =>
        b.email.toLowerCase().includes(qq) ||
        String(b.currentRank || '').toLowerCase().includes(qq)
      )
  } catch {
    boosters.value = []
  } finally {
    boostersLoading.value = false
  }
}

const filteredBoosters = computed(() => {
  // Already filtered in searchBoosters; keep computed for template consistency.
  return boosters.value
})

async function loadBoosters() {
  // no-op: we now lazy search by query
}

function statusTone(s: string | null | undefined): 'neutral' | 'success' | 'warn' | 'danger' {
  const v = String(s || '').toUpperCase()
  if (v === 'SUCCESS' || v === 'COMPLETED') return 'success'
  if (v === 'PENDING' || v === 'IN_PROGRESS') return 'warn'
  if (v === 'FAILED' || v === 'CANCELLED') return 'danger'
  return 'neutral'
}

function moneyVnd(v: any): string {
  const n = Number(v || 0)
  return `${n.toLocaleString()} VND`
}

onMounted(() => {
  load()
})
</script>

<template>
  <div class="orderGrid">
    <div class="leftCol">
      <div class="card">
        <div class="headerRow">
          <h2 style="margin: 0">Order details</h2>
          <div v-if="order" class="pill" :class="'pill-' + statusTone(order.status)">
            {{ order.status }}
          </div>
        </div>

        <div v-if="loading">Loading…</div>
        <div v-else-if="errorMsg" class="card" style="border-color: rgba(255,77,77,.4)">{{ errorMsg }}</div>

        <div v-else-if="order" class="grid" style="gap: 14px">
          <div class="row cards2">
            <div class="card soft">
              <div class="help">From</div>
              <div class="big">{{ order.currentRank }}</div>
            </div>
            <div class="card soft">
              <div class="help">To</div>
              <div class="big">{{ order.targetRank }}</div>
            </div>
          </div>

          <div class="row cards2">
            <div class="card soft">
              <div class="help">Price</div>
              <div class="big">{{ moneyVnd(order.price) }}</div>
            </div>

            <div class="card soft">
              <div class="help">Payment</div>

              <div v-if="payment" class="row" style="justify-content: space-between; margin-top: 8px">
                <div>
                  <div class="help">Status</div>
                  <div class="pill" :class="'pill-' + statusTone(payment.status)">{{ payment.status }}</div>
                </div>
                <div style="text-align: right">
                  <div class="help">Provider</div>
                  <div class="pill pill-neutral">{{ payment.provider }}</div>
                </div>
              </div>
              <div v-else class="help" style="margin-top: 8px">No payment yet.</div>
            </div>
          </div>

          <div class="card soft">
            <div class="help" style="margin-bottom: 8px">Progress</div>

            <div v-if="progress.length === 0" class="help">Chưa có cập nhật.</div>

            <div v-else class="grid" style="gap: 10px">
              <div v-for="p in progress" :key="p.id" class="card" style="padding: 12px">
                <div class="row" style="align-items: center">
                  <div class="pill pill-neutral">{{ p.percent }}%</div>
                  <div class="help">{{ formatDateTime(p.createdAt) }}</div>
                </div>
                <div style="margin-top: 8px">{{ p.message }}</div>
                <div class="help" style="margin-top: 6px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace">
                  boosterUserId: {{ p.boosterUserId.slice(0, 8) }}…
                </div>
              </div>
            </div>

            <div v-if="canUpdateProgress" class="card" style="margin-top: 12px">
              <div class="pill pill-neutral">Booster update</div>

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

            <div class="card soft" style="margin-top: 12px">
              <div class="help" style="margin-bottom: 8px">Request Booster</div>
              <div class="help" style="margin-top: -4px">Looking for a specific booster?</div>

              <div class="row" style="margin-top: 10px; gap: 10px; align-items: flex-start">
                <div style="flex: 1">
                  <input v-model="boosterQuery" class="input" placeholder="Search for a booster…" />

                  <div v-if="selectedBoosterEmail" class="help" style="margin-top: 8px">
                    Selected: <b>{{ selectedBoosterEmail }}</b>
                  </div>

                  <div v-if="boosterQuery.trim() && boostersLoading" class="help" style="margin-top: 8px">Searching…</div>

                  <div class="boostList" v-else-if="filteredBoosters.length">
                    <button
                      v-for="b in filteredBoosters.slice(0, 8)"
                      :key="b.id"
                      type="button"
                      class="boostItem"
                      :class="{ on: selectedBoosterUserId === b.userId }"
                      @click="onSelectBooster(b.userId)"
                    >
                      <div style="font-weight: 900">{{ b.email }}</div>
                      <div class="help">{{ b.currentRank }} • WR {{ Number(b.winrate).toFixed(0) }}% • {{ b.status }}</div>
                    </button>
                  </div>
                  <div v-else-if="boosterQuery.trim()" class="help" style="margin-top: 8px">No boosters found.</div>
                </div>

                <div v-if="assignError" class="help" style="margin-top: 10px; color: rgba(255,77,77,1)">
                  {{ assignError }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="rightCol">
      <div class="card">
        <div class="headerRow">
          <h3 style="margin: 0">Thanh toán</h3>
          <div class="pill pill-neutral">Pay now</div>
        </div>

        <div v-if="hasBoosterSelected" class="payWith" style="margin-top: 10px">
          <button class="payMethod" type="button" :disabled="bankTransferLoading || loading || !order" @click="initBankTransfer">
            <span class="radio on" />
            <span style="font-weight: 800">Chuyển khoản (VietQR)</span>
            <span class="help" style="margin-left:auto">QR</span>
          </button>

          <button class="payMethod" type="button" :disabled="vnpayLoading || loading || !order" @click="payVnPay">
            <span class="radio" />
            <span style="font-weight: 800">VNPay (Sandbox)</span>
            <span class="help" style="margin-left:auto">Redirect</span>
          </button>
        </div>
        <div v-else class="help" style="margin-top: 10px">
          Vui lòng chọn một booster trước khi thanh toán.
        </div>

        <div v-if="bankTransfer" class="card" style="margin-top: 12px">
          <div class="pill pill-neutral">Thông tin chuyển khoản</div>

          <div class="row" style="align-items: flex-start; gap: 12px; margin-top: 10px">
            <div style="width: 180px; flex: 0 0 auto">
              <img :src="bankTransfer.vietQr" alt="VietQR" style="width: 180px; height: 180px; object-fit: contain; border-radius: 12px; border: 1px solid var(--border); background: rgba(255,255,255,.03)" />
              <div class="help" style="margin-top: 6px">Quét QR để chuyển khoản</div>
            </div>

            <div style="flex: 1">
              <div class="help">Số tiền</div>
              <div style="font-weight: 900; font-size: 18px">{{ moneyVnd(bankTransfer.amount) }}</div>

              <div class="help" style="margin-top: 10px">Ngân hàng</div>
              <div style="font-weight: 800">{{ bankTransfer.bankCode }}</div>

              <div class="help" style="margin-top: 10px">Số tài khoản</div>
              <div style="font-weight: 900; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace">
                {{ bankTransfer.bankAccountNo }}
              </div>

              <div class="help" style="margin-top: 10px">Chủ tài khoản</div>
              <div style="font-weight: 800">{{ bankTransfer.bankAccountName }}</div>

              <div class="help" style="margin-top: 10px">Nội dung chuyển khoản (bắt buộc)</div>
              <div style="font-weight: 900; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace">
                {{ bankTransfer.transferContent }}
              </div>

              <div class="help" style="margin-top: 10px">
                Sau khi chuyển khoản, đội ngũ sẽ xác nhận và cập nhật trạng thái đơn hàng.
              </div>
            </div>
          </div>
        </div>

        <div class="divider" style="margin: 16px 0" />

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
        <div class="pill pill-neutral">Admin/Booster tools (later)</div>
        <p class="help" style="margin: 10px 0 0">
          Admin assign booster: <code>POST /api/orders/{orderId}/assign</code>. Booster/user update status: <code>POST /api/orders/{orderId}/status</code>.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.orderGrid{display:grid; gap:16px; grid-template-columns: 1.3fr .9fr; align-items:start}
.leftCol{display:grid; gap:16px}
.rightCol{display:grid; gap:16px}

.headerRow{display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom: 10px}

.cards2{display:grid; grid-template-columns: 1fr 1fr; gap: 10px; width:100%}
.big{font-size: 20px; font-weight: 900}

.card.soft{background: rgba(255,255,255,.02)}

.pill{display:inline-flex; align-items:center; gap:8px; padding: 6px 10px; border-radius: 999px; font-weight: 800; border: 1px solid rgba(255,255,255,.14); background: rgba(255,255,255,.03)}
.pill-neutral{border-color: rgba(255,255,255,.16)}
.pill-success{border-color: rgba(80, 220, 140, .55); color: rgba(80, 220, 140, 1); background: rgba(80, 220, 140, .08)}
.pill-warn{border-color: rgba(255, 192, 70, .55); color: rgba(255, 192, 70, 1); background: rgba(255, 192, 70, .09)}
.pill-danger{border-color: rgba(255,77,77,.5); color: rgba(255,77,77,1); background: rgba(255,77,77,.09)}

.boostList{margin-top: 8px; border: 1px solid var(--border); border-radius: 14px; overflow:hidden; background: rgba(255,255,255,.02)}
.boostItem{width:100%; text-align:left; padding: 10px 12px; background: transparent; border: none; color: var(--text); cursor:pointer}
.boostItem:hover{background: rgba(255,255,255,.05)}
.boostItem.on{background: rgba(40, 160, 255, .10)}

.payWith{display:grid; gap:10px}
.payMethod{width:100%; display:flex; align-items:center; gap:10px; padding: 14px 14px; border-radius: 14px; border: 1px solid rgba(40, 160, 255, .45); background: rgba(255,255,255,.03); color: var(--text); cursor:pointer}
.payMethod:hover{background: rgba(255,255,255,.05)}
.radio{width: 14px; height:14px; border-radius:999px; border:2px solid rgba(40, 160, 255, .55); position: relative}
.radio.on{border-color: rgba(40, 160, 255, .95)}
.radio.on::after{content:''; position:absolute; inset:3px; border-radius:999px; background: rgba(40, 160, 255, .95)}

@media (max-width: 980px){
  .orderGrid{grid-template-columns: 1fr}
  .cards2{grid-template-columns: 1fr}
}
</style>

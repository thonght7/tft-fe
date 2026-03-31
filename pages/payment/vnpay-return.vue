<script setup lang="ts">
import type { PaymentResponse } from '~/types/domain'

type PaymentDetailsDto = PaymentResponse

const route = useRoute()
const router = useRouter()
const { fetch } = useApi()

const paymentId = computed(() => String(route.query.paymentId || ''))
const vnpResponseCode = computed(() => String(route.query.vnp_ResponseCode || ''))

const payment = ref<PaymentDetailsDto | null>(null)
const loading = ref(true)
const errorMsg = ref<string | null>(null)

const statusText = computed(() => {
  if (!payment.value) return null
  if (payment.value.status === 'SUCCESS') return 'Thanh toán thành công'
  if (payment.value.status === 'FAILED') return 'Thanh toán thất bại'
  return 'Đang xử lý thanh toán…'
})

const toneStyle = computed<Record<string, string>>(() => {
  if (!payment.value) return { borderColor: 'rgba(255,255,255,.12)' }
  if (payment.value.status === 'SUCCESS') return { borderColor: 'rgba(80, 220, 140, .55)' }
  if (payment.value.status === 'FAILED') return { borderColor: 'rgba(255,77,77,.4)' }
  return { borderColor: 'rgba(255,255,255,.12)' }
})

async function loadPaymentOnce() {
  if (!paymentId.value) return
  payment.value = await fetch<PaymentDetailsDto>(`/api/payments/${paymentId.value}`)
}

function redirectToLogin() {
  const redirect = encodeURIComponent(route.fullPath)
  router.replace(`/login?redirect=${redirect}`)
}

async function pollPaymentStatus() {
  if (!paymentId.value) {
    loading.value = false
    errorMsg.value = 'Missing paymentId'
    return
  }

  loading.value = true
  errorMsg.value = null

  const maxAttempts = 12 // ~30s
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await loadPaymentOnce()

      if (payment.value?.status === 'SUCCESS' || payment.value?.status === 'FAILED') {
        loading.value = false

        // Auto-redirect back to order page after a short delay.
        const orderId = payment.value.orderId
        if (orderId) {
          setTimeout(() => {
            router.replace(`/orders/${orderId}`)
          }, 1200)
        }

        return
      }
    } catch (e: any) {
      const status = e?.status || e?.data?.statusCode
      const msg = e?.data?.message || e?.message || 'Failed to load payment'

      // If user is not authenticated, send them to login.
      if (status === 401) {
        redirectToLogin()
        return
      }

      errorMsg.value = msg
    }

    await new Promise((r) => setTimeout(r, 2500))
  }

  loading.value = false
}

onMounted(pollPaymentStatus)
</script>

<template>
  <div class="card" style="max-width: 720px; margin: 0 auto">
    <h2 style="margin-top: 0">VNPay Result</h2>

    <div v-if="errorMsg" class="card" style="border-color: rgba(255,77,77,.4); margin-bottom: 12px">{{ errorMsg }}</div>

    <div class="row" style="justify-content: space-between; gap: 10px">
      <div>
        <div class="help">Payment ID</div>
        <div style="font-weight: 900; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace">
          {{ paymentId }}
        </div>
      </div>
      <div>
        <div class="help">VNPay response</div>
        <div class="badge">{{ vnpResponseCode }}</div>
      </div>
    </div>

    <div v-if="loading" class="help" style="margin-top: 12px">Đang kiểm tra trạng thái thanh toán…</div>

    <div v-else-if="payment" class="card" :style="toneStyle" style="margin-top: 12px">
      <div class="badge">{{ statusText }}</div>
      <div class="help" style="margin-top: 8px">Provider: {{ payment.provider }} • Amount: {{ Number(payment.amount).toLocaleString() }} VND</div>
      <div class="help" style="margin-top: 6px">Status: {{ payment.status }}</div>

      <div class="help" style="margin-top: 10px">Đang tự động quay về trang Order…</div>

      <NuxtLink class="btn" style="margin-top: 12px; display: inline-block" :to="`/orders/${payment.orderId}`">
        Về trang Order ngay
      </NuxtLink>
    </div>

    <div v-else class="help" style="margin-top: 12px">
      Không lấy được trạng thái thanh toán. Bạn có thể quay lại trang Orders để kiểm tra.
    </div>

    <NuxtLink class="btn" style="margin-top: 12px; display: inline-block" to="/orders">
      Danh sách Orders
    </NuxtLink>
  </div>
</template>


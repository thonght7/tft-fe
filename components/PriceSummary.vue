<script setup lang="ts">
import type { PriceBreakdown } from '~/utils/boostPricing'

const props = defineProps<{
  price: PriceBreakdown
  discountPercent?: number
}>()

const discountPercent = computed(() => props.discountPercent ?? 15)
const discounted = computed(() => Math.round(props.price.finalPrice * (1 - discountPercent.value / 100)))
</script>

<template>
  <div class="card">
    <div class="row" style="justify-content: space-between; align-items: baseline">
      <div>
        <div class="help">Base price</div>
        <div class="base">{{ props.price.basePrice.toLocaleString() }} VND</div>
      </div>
      <div class="badge">+{{ props.price.percentIncreaseTotal }}%</div>
    </div>

    <div class="divider" />

    <div class="row" style="justify-content: space-between; align-items: baseline">
      <div>
        <div class="help">Original</div>
        <div class="orig">{{ props.price.finalPrice.toLocaleString() }} VND</div>
      </div>
      <div style="text-align:right">
        <div class="help">After discount</div>
        <div class="final">{{ discounted.toLocaleString() }} VND</div>
      </div>
    </div>

    <div class="help" style="margin-top: 10px">
      Priority x{{ props.price.priorityMultiplier.toFixed(2) }} · Stream x{{ props.price.streamMultiplier.toFixed(2) }}
    </div>
  </div>
</template>

<style scoped>
.base{font-size:18px; font-weight:700}
.orig{font-size:20px; font-weight:800; text-decoration: line-through; opacity: .75}
.final{font-size:24px; font-weight:900}
</style>

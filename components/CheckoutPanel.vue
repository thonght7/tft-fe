<script setup lang="ts">
import PriceSummary from '~/components/PriceSummary.vue'
import type { Rank } from '~/types/domain'
import type { BoostOptions, PriceBreakdown, QueueMode } from '~/utils/boostPricing'
import { formatRankShort } from '~/utils/boostRanks'
import { emblemUrlForRank } from '~/utils/rankEmblems'

const props = defineProps<{
  currentRank: Rank
  desiredRank: Rank
  estimatedTimeText?: string
  price: PriceBreakdown | null
  canCheckout: boolean
  errorText?: string | null
  tab?: 'division' | 'wins' | 'placements' | 'normals'
  winsCount?: number
  gamesCount?: number

  // Master+ LP display (optional)
  currentLp?: number
  desiredLp?: number

  // checkout-side controls
  queue?: QueueMode
  options?: BoostOptions
  showQueueAndAddons?: boolean
}>()

const emit = defineEmits<{
  (e: 'checkout' | 'paypal'): void
  (e: 'update:queue', v: QueueMode): void
  (e: 'toggleOption', key: keyof BoostOptions): void
  (e: 'applyDiscount', code: string): void
}>()

const discountOpen = ref(false)
const discountCode = ref('')

function onApplyDiscount() {
  emit('applyDiscount', discountCode.value.trim())
}

function isMasterPlusRank(r: Rank) {
  return r === 'Cao Thủ' || r === 'Đại Cao Thủ' || r === 'Thách Đấu'
}

function formatRankWithLp(rank: Rank, lp?: number) {
  const base = formatRankShort(rank)
  if (!isMasterPlusRank(rank)) return base
  if (lp == null) return base
  return `${base} (${lp} LP)`
}
</script>

<template>
  <div class="panel">
    <div class="card">
      <div class="badge">Checkout</div>
      <h2 class="h2" style="margin: 10px 0 8px">Summary</h2>

      <div v-if="props.tab === 'normals'" class="rankline">
        <div class="rankchip">
          <div>
            <div class="help">Target</div>
            <div class="rk">{{ props.gamesCount ?? 0 }} Games</div>
          </div>
        </div>
      </div>

      <div v-else-if="props.tab === 'placements'" class="rankline">
        <div class="rankchip">
          <img class="emblem" :src="emblemUrlForRank(props.currentRank)" alt="" loading="lazy" />
          <div>
            <div class="help">Current</div>
            <div class="rk">{{ formatRankShort(props.currentRank) }}</div>
          </div>
        </div>
        <div class="arrow">→</div>
        <div class="rankchip">
          <div>
            <div class="help">Target</div>
            <div class="rk">{{ props.gamesCount ?? 0 }} Games</div>
          </div>
        </div>
      </div>

      <div v-else-if="props.tab === 'wins'" class="rankline">
        <div class="rankchip">
          <img class="emblem" :src="emblemUrlForRank(props.currentRank)" alt="" loading="lazy" />
          <div>
            <div class="help">Current</div>
            <div class="rk">{{ formatRankShort(props.currentRank) }}</div>
          </div>
        </div>
        <div class="arrow">→</div>
        <div class="rankchip">
          <div>
            <div class="help">Target</div>
            <div class="rk">{{ props.winsCount ?? 0 }} Wins</div>
          </div>
        </div>
      </div>

      <div v-else class="rankstack">
        <div class="rankchip">
          <img class="emblem" :src="emblemUrlForRank(props.currentRank)" alt="" loading="lazy" />
          <div>
            <div class="help">Current</div>
            <div class="rk">{{ formatRankWithLp(props.currentRank, props.currentLp) }}</div>
          </div>
        </div>

        <div class="arrow down">↓</div>
        <div class="arrow right">→</div>

        <div class="rankchip">
          <img class="emblem" :src="emblemUrlForRank(props.desiredRank)" alt="" loading="lazy" />
          <div>
            <div class="help">Desired</div>
            <div class="rk">{{ formatRankWithLp(props.desiredRank, props.desiredLp) }}</div>
          </div>
        </div>
      </div>

      <div v-if="props.showQueueAndAddons" class="divider" />

      <div v-if="props.showQueueAndAddons" class="section">
        <div class="label">Queue</div>
        <div class="pillGroup" style="margin-top: 8px">
          <button
            class="btn pillBtn"
            :class="{ primary: props.queue === 'solo' }"
            type="button"
            @click="emit('update:queue', 'solo')"
          >
            Solo
          </button>
          <button
            class="btn pillBtn"
            :class="{ primary: props.queue === 'double_up' }"
            type="button"
            @click="emit('update:queue', 'double_up')"
          >
            Double Up
          </button>
        </div>

        <div class="label" style="margin-top: 12px">Add-ons</div>
        <div class="addons" style="margin-top: 8px">
          <button class="addonRow" type="button" @click="emit('toggleOption', 'priority')">
            <span>Priority Order</span>
            <span class="right">
              <span class="badge">+25%</span>
              <span class="dot" :class="{ on: !!props.options?.priority }" />
            </span>
          </button>
          <button class="addonRow" type="button" @click="emit('toggleOption', 'stream')">
            <span>Live Stream</span>
            <span class="right">
              <span class="badge">+15%</span>
              <span class="dot" :class="{ on: !!props.options?.stream }" />
            </span>
          </button>
        </div>
      </div>

      <div class="divider" />

      <button class="discountHeader" type="button" @click="discountOpen = !discountOpen">
        <span>Discount Code</span>
        <span class="chev">{{ discountOpen ? '▾' : '▸' }}</span>
      </button>

      <div v-if="discountOpen" class="discountBody">
        <input v-model="discountCode" class="input" placeholder="Enter code" />
        <button class="btn" type="button" @click="onApplyDiscount">Apply</button>
      </div>

      <div class="divider" />

      <div class="row" style="justify-content: space-between">
        <div>
          <div class="help">Estimated time</div>
          <div style="font-weight: 800">{{ props.estimatedTimeText ?? '2–4 days' }}</div>
        </div>
        <div class="badge">24/7 Support</div>
      </div>

      <div style="margin-top: 12px">
        <PriceSummary v-if="props.price" :price="props.price" />
        <div v-else class="card" style="margin-top: 12px">
          <div class="help">Price</div>
          <div style="font-size: 22px; font-weight: 900">—</div>
        </div>
      </div>

      <div v-if="props.errorText" class="card" style="margin-top: 12px; border-color: rgba(255,77,77,.4)">
        {{ props.errorText }}
      </div>

      <button class="btn primary" style="width: 100%; margin-top: 12px" :disabled="!props.canCheckout" @click="emit('checkout')">
        Checkout
      </button>
      <button class="btn" style="width: 100%; margin-top: 10px" :disabled="!props.canCheckout" @click="emit('paypal')">
        Pay with PayPal
      </button>

      <div class="help" style="margin-top: 10px">
        Demo UI. Hook these buttons to your real payment flow later.
      </div>
    </div>
  </div>
</template>

<style scoped>
.panel{position: sticky; top: 92px}
.rankline{display:flex; align-items:center; justify-content:space-between; gap:10px}
.rankstack{display:flex; flex-direction:row; align-items:center; justify-content:space-between; gap:10px}
.rankchip{display:flex; align-items:center; gap:10px; min-width: 0}
.emblem{width: 34px; height: 34px; object-fit: contain; filter: drop-shadow(0 10px 18px rgba(0,0,0,.25))}
.rk{font-weight: 900; line-height: 1.1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis}
.arrow{opacity:.7; font-weight: 900}
.arrow.down{display:none; align-self:center}

.section{display:block}
.pillGroup{display:flex; gap:10px}

.addons{display:grid; gap:8px}
.addonRow{
  width:100%;
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: rgba(255,255,255,.03);
  cursor:pointer;
  color: var(--text);
}
.addonRow:hover{background: rgba(255,255,255,.06)}
.right{display:flex; align-items:center; gap:10px}
.dot{width:12px; height:12px; border-radius: 999px; background: rgba(255,255,255,.22); border:1px solid rgba(255,255,255,.22)}
.dot.on{background: rgba(0,200,120,.95); border-color: rgba(0,200,120,.65)}

.discountHeader{
  width:100%;
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding: 10px 0;
  background: transparent;
  border: none;
  color: var(--text);
  font-weight: 900;
  cursor:pointer;
}
.chev{opacity:.7}
.discountBody{display:grid; grid-template-columns: 1fr auto; gap:10px; margin-top: 10px}

.arrow.right{display:inline}
@media (max-width: 900px){
  .rankstack{flex-direction:column; align-items:stretch}
  .arrow.down{display:inline; align-self:center}
  .arrow.right{display:none}
  .panel{position: static}
}
</style>

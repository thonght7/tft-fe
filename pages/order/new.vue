<script setup lang="ts">
import type { PurchaseTab } from '~/utils/boostPricing'
import type { TierName, Division } from '~/utils/rankTiers'
import { TIER_OPTIONS, tierIndex, divisionIndex } from '~/utils/rankTiers'
import type { OrderResponse } from '~/types/domain'

const store = useBoostPurchaseStore()

const tabs = [
  { id: 'division' as const, label: 'Division' },
  { id: 'wins' as const, label: 'Wins/Games' },
  { id: 'placements' as const, label: 'Placements' },
  { id: 'normals' as const, label: 'Normals' }
]

// Local-only divisions removed: now bind to store.

const servers = ['Vietnam', 'NA', 'EUW', 'EUNE', 'KR'] as const

const errorText = computed(() => store.validationMessage)

onMounted(() => {
  // Ensure initial price exists.
  store.recalcPrice()
})

function onTabChange(v: PurchaseTab) {
  store.setTab(v)
}

async function createDraftCheckout() {
  if (!store.price) {
    alert('Chưa có giá. Vui lòng thử lại.')
    return
  }

  const api = useApi()

  try {
    const res = await api.fetch<OrderResponse>('/api/orders', {
      method: 'POST',
      body: {
        currentRank: store.tab === 'placements' ? store.lastSplitRank : store.currentRank,
        targetRank: store.desiredRank,
        price: store.price.finalPrice
      }
    })

    await navigateTo(`/orders/${res.id}`)
  } catch (e: any) {
    const status = e?.status || e?.data?.statusCode
    const msg = e?.data?.message || e?.message || 'Tạo order thất bại'

    if (status === 401) {
      const route = useRoute()
      const redirect = encodeURIComponent(route.fullPath)
      await navigateTo(`/login?redirect=${redirect}`)
      return
    }

    alert(msg)
  }
}

const currentTierIdx = computed(() => tierIndex(store.currentTier))

function isDesiredTierDisabled(tier: TierName) {
  // Only disable tiers strictly below the current tier.
  if (tierIndex(tier) < currentTierIdx.value) return true

  // If current tier has divisions and user is already at Division I,
  // disallow choosing the same tier for Desired (since no higher division exists).
  const curOpt = TIER_OPTIONS.find((t) => t.id === store.currentTier)
  if (curOpt?.hasDivisions && store.currentDivision === 'I') {
    return tier === store.currentTier
  }

  // For Master+ tiers, allow choosing the same tier (Master -> Master) and validate via LP.
  return false
}

function isDesiredDivisionDisabled(div: Division): boolean {
  if (store.currentTier !== store.desiredTier) return false
  if (store.isDesiredMasterPlus) return true
  // Only allow divisions strictly higher than current (I higher than II/III/IV)
  return divisionIndex(div) >= divisionIndex(store.currentDivision)
}

function onApplyDiscount(code: string) {
  store.setDiscountCode(code)
}

const selectedPaymentMethod = ref<'bank_transfer' | 'vnpay'>('bank_transfer')
</script>

<template>
  <div class="purchase">
    <div class="grid left">
      <div class="card hero" style="padding: 18px">
        <div class="badge">TFT BOOST</div>
        <h1 class="h1" style="margin: 10px 0 6px">Boost Purchase</h1>
        <p class="help" style="margin: 0">Select your current rank, desired rank and add-ons.</p>
      </div>

      <PurchaseTabs :model-value="store.tab" :tabs="tabs" @update:model-value="onTabChange" />

      <!-- PLACEMENTS TAB (max 5 games) -->
      <template v-if="store.tab === 'placements'">
        <RankSelector
          title="Last Split Rank"
          :model-value="store.lastSplitRank"
          :hide-divisions="true"
          :columns="5"
          @update:model-value="store.setLastSplitRank"
        />

        <div class="card" style="padding: 18px">
          <div class="sectionTitle">
            <div class="t">Server</div>
            <div class="d">Choose region</div>
          </div>
          <select v-model="store.server" class="input">
            <option v-for="s in servers" :key="s" :value="s">{{ s }}</option>
          </select>
        </div>

        <GamesSlider :model-value="store.placementsGames" :min="1" :max="5" :step="1" label="Number of Games" @update:model-value="store.setPlacementsGames" />

        <div class="card" style="padding: 12px; border-color: rgba(0, 170, 255, .35)">
          <div class="help" style="font-weight: 800; color: var(--text)">
            Placement matches are limited to 5 games at the start of the season.
          </div>
        </div>
      </template>

      <!-- WINS/GAMES TAB (matches screenshot) -->
      <template v-else-if="store.tab === 'wins'">
        <div class="card">
          <div class="sectionTitle">
            <div class="t">Current Rank</div>
            <div class="d">Select your current tier and division.</div>
          </div>

          <TierSelect :model-value="store.currentTier" :options="TIER_OPTIONS" :columns="4" @update:model-value="store.setCurrentTier" />

          <div class="row" style="margin-top: 14px">
            <div v-if="store.isCurrentMasterPlus" style="flex:1">
              <div class="label">Current LP range</div>
              <select
                :value="store.masterLpRange"
                class="input"
                @change="store.setMasterLpRange(($event.target as HTMLSelectElement).value as any)"
              >
                <option value="0-20">0-20 LP</option>
                <option value="21-40">21-40 LP</option>
                <option value="41-60">41-60 LP</option>
                <option value="61-80">61-80 LP</option>
                <option value="81-100">81-100 LP</option>
              </select>
            </div>

            <div v-else style="flex:1">
              <div class="label">Division</div>
              <DivisionSelector :model-value="store.currentDivision" @update:model-value="store.setCurrentDivision" />
            </div>

            <div style="flex:1">
              <div class="label">Avg. LP per win</div>
              <select v-model="store.avgLpPerWin" class="input">
                <option value="18-23">18-23 LP</option>
                <option value="23-28">23-28 LP</option>
                <option value="28-33">28-33 LP</option>
              </select>
            </div>

            <div style="flex:1.2">
              <div class="label">Server</div>
              <select v-model="store.server" class="input">
                <option v-for="s in servers" :key="s" :value="s">{{ s }}</option>
              </select>
            </div>
          </div>
        </div>

        <WinsSlider :model-value="store.winsCount" label="Number of Wins" :min="1" :max="25" :step="1" @update:model-value="store.setWinsCount" />

        <div class="card" style="padding: 14px">
          <div class="row" style="align-items:center; justify-content:space-between">
            <div style="font-weight:900">What happens if a game is lost during my Wins?</div>
            <div class="badge">FAQ</div>
          </div>
          <p class="help" style="margin: 10px 0 0; line-height: 1.55">
            Your order is based on guaranteed wins, not games played. Each loss simply becomes an extra win added to your order,
            and we keep playing until every guaranteed win has been fully delivered.
          </p>
        </div>

        <div class="card" style="padding: 12px; border-color: rgba(0, 170, 255, .35)">
          <div class="help" style="font-weight: 800; color: var(--text)">
            Set 16: Lore and Legends is in progress! Get your boost today and take advantage of our premium service.
          </div>
        </div>
      </template>

      <!-- NORMALS TAB (games only, no rank) -->
      <template v-else-if="store.tab === 'normals'">
        <div class="card">
          <div class="sectionTitle">
            <div class="t">Select Games</div>
            <div class="d">Choose the number of games for your normal boost.</div>
          </div>

          <div style="margin-top: 14px">
            <div class="label">Server</div>
            <select v-model="store.server" class="input">
              <option v-for="s in servers" :key="s" :value="s">{{ s }}</option>
            </select>
          </div>
        </div>

        <GamesSlider :model-value="store.normalsGames" :min="1" :max="300" :step="1" label="Number of Games" @update:model-value="store.setNormalsGames" />

        <div class="card" style="padding: 12px; border-color: rgba(0, 170, 255, .35)">
          <div class="help" style="font-weight: 800; color: var(--text)">
            Normal games are played to help you practice and improve. They do not affect your rank.
          </div>
        </div>
      </template>

      <!-- DIVISION TAB (existing layout) -->
      <template v-else>
        <!-- Tier + bậc full width; then (LP control | Server) split 1/2; Desired below -->
        <div class="grid">
          <div class="card">
            <div class="sectionTitle">
              <div class="t">Current Rank</div>
              <div class="d">Select your current tier and division.</div>
            </div>

            <TierSelect :model-value="store.currentTier" :options="TIER_OPTIONS" :columns="4" @update:model-value="store.setCurrentTier" />

            <div style="margin-top: 12px">
              <DivisionSelector v-if="!store.isCurrentMasterPlus" :model-value="store.currentDivision" @update:model-value="store.setCurrentDivision" />
            </div>

            <div class="rangeServerRow" style="margin-top: 12px">
              <div>
                <template v-if="!store.isCurrentMasterPlus">
                  <div class="label">Current LP range</div>
                  <select
                    :value="store.lp"
                    class="input"
                    @change="store.lp = ($event.target as HTMLSelectElement).value as any; store.recalcPrice()"
                  >
                    <option value="0-20">0-20 LP</option>
                    <option value="21-40">21-40 LP</option>
                    <option value="41-60">41-60 LP</option>
                    <option value="61-80">61-80 LP</option>
                    <option value="81-100">81-100 LP</option>
                  </select>
                </template>

                <template v-else>
                  <LpStepper :model-value="store.currentLp" label="Current LP" :min="0" :max="1400" :step="1" @update:model-value="store.setCurrentLp" />
                </template>
              </div>

              <div>
                <div class="label">Server</div>
                <select v-model="store.server" class="input">
                  <option v-for="s in servers" :key="s" :value="s">{{ s }}</option>
                </select>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="sectionTitle">
              <div class="t">Desired Rank</div>
              <div class="d">Select your desired tier and division.</div>
            </div>
            <TierSelect :model-value="store.desiredTier" :options="TIER_OPTIONS" :columns="4" :is-disabled="isDesiredTierDisabled" @update:model-value="store.setDesiredTier" />

            <div class="halfRow" style="margin-top: 12px">
              <div>
                <DivisionSelector
                  v-if="!store.isDesiredMasterPlus"
                  :model-value="store.desiredDivision"
                  :is-disabled="isDesiredDivisionDisabled"
                  @update:model-value="store.setDesiredDivision"
                />
                <LpStepper v-else-if="store.showDesiredLpInput" :model-value="store.desiredLp" label="Desired LP" :min="0" :max="1400" :step="1" @update:model-value="store.setDesiredLp" />
              </div>
              <div />
            </div>
          </div>
        </div>
      </template>
    </div>

    <CheckoutPanel
      :tab="store.tab"
      :wins-count="store.winsCount"
      :games-count="store.tab === 'placements' ? store.placementsGames : store.tab === 'normals' ? store.normalsGames : 0"
      :current-rank="store.tab === 'placements' ? store.lastSplitRank : store.currentRank"
      :desired-rank="store.desiredRank"
      :current-lp="store.isCurrentMasterPlus ? store.currentLp : undefined"
      :desired-lp="store.isDesiredMasterPlus ? store.desiredLp : undefined"
      :price="store.price"
      :can-checkout="(store.tab === 'wins' ? store.winsCount > 0 : store.tab === 'placements' ? store.placementsGames > 0 : store.tab === 'normals' ? store.normalsGames > 0 : store.isValid) && !!store.price"
      :error-text="errorText"
      :discount-error="store.discountError"
      :show-queue-and-addons="store.tab === 'division'"
      :queue="store.queue"
      :options="store.options"
      :selected-payment-method="selectedPaymentMethod"
      @update:payment-method="selectedPaymentMethod = $event"
      @update:queue="store.setQueue"
      @toggle-option="store.toggleOption"
      @apply-discount="onApplyDiscount"
      @checkout="createDraftCheckout"
      @pay:bank-transfer="createDraftCheckout"
      @pay:vnpay="createDraftCheckout"
    />
  </div>
</template>

<style scoped>
.purchase{display:grid; gap:16px; grid-template-columns: 1.35fr .85fr; align-items:start}

.rangeServerRow{display:grid; grid-template-columns: 1fr 1fr; gap:16px; align-items:start}
.halfRow{display:grid; grid-template-columns: 1fr 1fr; gap:16px; align-items:start}

@media (max-width: 980px){
  .purchase{grid-template-columns: 1fr}
  .rangeServerRow{grid-template-columns: 1fr}
  .halfRow{grid-template-columns: 1fr}
}
</style>

import { defineStore } from 'pinia'
import type { Rank } from '~/types/domain'
import { compareRanks } from '~/utils/boostRanks'
import type { BoostOptions, PriceBreakdown, PurchaseTab, QueueMode } from '~/utils/boostPricing'
import type { Division, TierName } from '~/utils/rankTiers'
import { TIER_OPTIONS, tierDivisionToRank, tierIndex, divisionIndex } from '~/utils/rankTiers'
import type { CalculatePriceRequestDto, CalculatePriceResponseDto, PricingPurchaseType } from '~/types/pricing'

export type LpBracket = '0-20' | '21-40' | '41-60' | '61-80' | '81-100'
export type ServerRegion = 'Vietnam' | 'NA' | 'EUW' | 'EUNE' | 'KR'
export type AvgLpPerWin = '18-23' | '23-28' | '28-33'
export type MasterLpRange = '0-20' | '21-40' | '41-60' | '61-80' | '81-100' | '1001+'

const DEFAULT_CURRENT_TIER: TierName = 'Platinum'
const DEFAULT_CURRENT_DIV: Division = 'I'
const DEFAULT_TARGET_TIER: TierName = 'Diamond'
const DEFAULT_TARGET_DIV: Division = 'IV'

function lpForMasterRange(r: MasterLpRange): number {
  // Use a representative numeric LP so Summary can render '(x LP)'.
  // Midpoints for 0–100 ranges; keep 1001+ as 1001.
  if (r === '0-20') return 10
  if (r === '21-40') return 30
  if (r === '41-60') return 50
  if (r === '61-80') return 70
  if (r === '81-100') return 90
  return 1001
}

export const useBoostPurchaseStore = defineStore('boostPurchase', {
  state: () => ({
    tab: 'division' as PurchaseTab,

    currentTier: DEFAULT_CURRENT_TIER as TierName,
    currentDivision: DEFAULT_CURRENT_DIV as Division,

    desiredTier: DEFAULT_TARGET_TIER as TierName,
    desiredDivision: DEFAULT_TARGET_DIV as Division,

    lp: '0-20' as LpBracket,
    server: 'Vietnam' as ServerRegion,

    queue: 'solo' as QueueMode,
    options: {
      priority: false,
      stream: false
    } as BoostOptions,

    price: null as PriceBreakdown | null,
    lastGoodPrice: null as PriceBreakdown | null,

    currentLp: 0,
    desiredLp: 50,

    winsCount: 10,
    avgLpPerWin: '18-23' as AvgLpPerWin,
    masterLpRange: '0-20' as MasterLpRange,

    // Placements: rank-only (no divisions)
    lastSplitRankKey: 'Platinum IV' as Rank,
    placementsGames: 5,

    normalsGames: 10,

    discountCode: '' as string,
    discountError: null as string | null,

    _recalcTimer: null as ReturnType<typeof setTimeout> | null,
  }),
  getters: {
    currentRank(s): Rank {
      const tierOpt = TIER_OPTIONS.find((t) => t.id === s.currentTier)
      const div = tierOpt?.hasDivisions ? s.currentDivision : null
      return tierDivisionToRank(s.currentTier, div)
    },
    desiredRank(s): Rank {
      const tierOpt = TIER_OPTIONS.find((t) => t.id === s.desiredTier)
      const div = tierOpt?.hasDivisions ? s.desiredDivision : null
      return tierDivisionToRank(s.desiredTier, div)
    },
    isValid(): boolean {
      // For Master+ -> Master+ orders, LP decides validity.
      if (this.isCurrentMasterPlus && this.isDesiredMasterPlus) {
        return this.desiredLp > this.currentLp
      }
      return compareRanks(this.desiredRank, this.currentRank) > 0
    },
    validationMessage(): string | null {
      if (this.isCurrentMasterPlus && this.isDesiredMasterPlus) {
        if (this.desiredLp <= this.currentLp) return 'Desired LP must be higher than current LP.'
        return null
      }
      if (compareRanks(this.desiredRank, this.currentRank) <= 0) return 'Desired rank must be higher than current rank.'
      return null
    },
    pricingError(): string | null {
      // Prefer showing discount error under the discount box, but still expose if needed.
      return this.discountError
    },
    isCurrentMasterPlus(): boolean {
      return ['Master'].includes(this.currentTier)
    },
    isDesiredMasterPlus(): boolean {
      return ['Master'].includes(this.desiredTier)
    },
    lastSplitRank(): Rank {
      return this.lastSplitRankKey
    },
    showDesiredLpInput(): boolean {
      return this.isCurrentMasterPlus && this.isDesiredMasterPlus
    },
  },
  actions: {
    setTab(tab: PurchaseTab) {
      this.tab = tab
      // Avoid showing stale price from previous tab while the new request is in-flight.
      this.price = null
      this.discountError = null
      this.recalcPrice()
    },
    normalizeDesired() {
      // Ensure desired rank is strictly higher than current.
      const curTier = this.currentTier
      const desTier = this.desiredTier

      const curIdx = tierIndex(curTier)
      const desIdx = tierIndex(desTier)

      // If desired tier is below current tier -> bump to next tier.
      if (desIdx < curIdx) {
        const next = this.nextTier(curTier)
        if (next) this.desiredTier = next
      }

      // If same tier and divisional,, desired division must be higher than current (e.g. current II -> desired I).
      const curOpt = TIER_OPTIONS.find((t) => t.id === this.currentTier)
      const desOpt = TIER_OPTIONS.find((t) => t.id === this.desiredTier)

      if (curOpt?.hasDivisions && desOpt?.hasDivisions && this.currentTier === this.desiredTier) {
        // desired must be strictly higher => smaller divisionIndex
        if (divisionIndex(this.desiredDivision) >= divisionIndex(this.currentDivision)) {
          this.desiredDivision = 'I'
          if (divisionIndex(this.desiredDivision) >= divisionIndex(this.currentDivision)) {
            // If current is already I, bump tier.
            const next = this.nextTier(this.currentTier)
            if (next) {
              this.desiredTier = next
              const nextOpt = TIER_OPTIONS.find((t) => t.id === this.desiredTier)
              if (nextOpt?.hasDivisions) this.desiredDivision = 'IV'
            }
          }
        }
      }

      // If current is divisional but desired is non-divisional (Master+), division doesn't matter.
      if (!desOpt?.hasDivisions) {
        this.desiredDivision = 'IV'
      }
    },
    nextTier(tier: TierName): TierName | null {
      const idx = tierIndex(tier)
      if (idx < 0) return null
      const order: TierName[] = ['Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master']
      return idx + 1 < order.length ? order[idx + 1] : null
    },
    setCurrentTier(tier: TierName) {
      this.currentTier = tier
      const curOpt = TIER_OPTIONS.find((t) => t.id === this.currentTier)
      if (!curOpt?.hasDivisions) {
        this.currentDivision = 'IV'
        // Entering Master+ tiers: keep LP input and ensure currentLp has a sane default.
        this.currentLp = Math.max(0, Math.min(1400, Math.round(this.currentLp ?? 0)))
      } else {
        // Non-Master+ tiers: default LP bracket to the first option.
        this.lp = '0-20'
      }
      this.normalizeDesired()
      this.recalcPrice()
    },
    setCurrentDivision(div: Division) {
      this.currentDivision = div
      this.normalizeDesired()
      this.recalcPrice()
    },
    setDesiredTier(tier: TierName) {
      this.desiredTier = tier

      // If user targets Master while still below Master, we don't ask for desired LP.
      // Keep desired LP fixed at 0.
      if (this.isDesiredMasterPlus && !this.isCurrentMasterPlus) {
        this.desiredLp = 0
      }

      this.normalizeDesired()
      this.recalcPrice()
    },
    setDesiredDivision(div: Division) {
      this.desiredDivision = div
      this.normalizeDesired()
      this.recalcPrice()
    },
    toggleOption(key: keyof BoostOptions) {
      this.options[key] = !this.options[key]
      this.recalcPrice()
    },
    setCurrentLp(v: number) {
      this.currentLp = Math.max(0, Math.min(1400, Math.round(v)))

      // If both ends are Master+ and user makes Current LP >= Desired LP,
      // auto-adjust Desired LP upwards to keep the order valid.
      if (this.isCurrentMasterPlus && this.isDesiredMasterPlus) {
        if (this.currentLp >= this.desiredLp) {
          this.desiredLp = Math.max(0, Math.min(1400, this.currentLp + 50))
        }
      }

      // Debounce to avoid spamming backend while user taps +/-.
      this.recalcPriceDebounced()
    },
    setDesiredLp(v: number) {
      const next = Math.max(0, Math.min(1400, Math.round(v)))

      // If both ends are Master+ and user picks Desired LP <= Current LP,
      // auto-adjust Desired LP upwards to keep the order valid.
      if (this.isCurrentMasterPlus && this.isDesiredMasterPlus && next <= this.currentLp) {
        this.desiredLp = Math.max(0, Math.min(1400, this.currentLp + 50))
      } else {
        this.desiredLp = next
      }

      // Debounce to avoid spamming backend while user taps +/-.
      this.recalcPriceDebounced()
    },
    setQueue(queue: QueueMode) {
      this.queue = queue
      this.recalcPrice()
    },
    setWinsCount(v: number) {
      this.winsCount = Math.max(1, Math.min(25, Math.round(v)))
      this.recalcPrice()
    },
    setAvgLpPerWin(v: AvgLpPerWin) {
      this.avgLpPerWin = v
      this.recalcPrice()
    },
    setMasterLpRange(v: MasterLpRange) {
      this.masterLpRange = v

      // Keep currentLp in sync with the selected range for Master+.
      if (this.isCurrentMasterPlus) {
        this.currentLp = lpForMasterRange(v)

        // Maintain invariant desiredLp > currentLp when both are Master+
        if (this.isDesiredMasterPlus && this.desiredLp <= this.currentLp) {
          this.desiredLp = Math.max(0, Math.min(1400, this.currentLp + 50))
        }
      }

      this.recalcPrice()
    },
    setLastSplitRank(v: Rank) {
      this.lastSplitRankKey = v
      this.recalcPrice()
    },
    setPlacementsGames(v: number) {
      this.placementsGames = Math.max(1, Math.min(5, Math.round(v)))
      this.recalcPrice()
    },
    setNormalsGames(v: number) {
      this.normalsGames = Math.max(1, Math.min(300, Math.round(v)))
      this.recalcPrice()
    },
    setDiscountCode(code: string) {
      this.discountCode = code
      this.discountError = null
      this.recalcPrice()
    },

    recalcPriceDebounced() {
      if (this._recalcTimer) clearTimeout(this._recalcTimer)
      this._recalcTimer = setTimeout(() => {
        this._recalcTimer = null
        void this.recalcPrice()
      }, 250)
    },

    async recalcPrice() {
      const api = useApi()

      const purchaseType: PricingPurchaseType =
        this.tab === 'division' ? 'DIVISION' : this.tab === 'wins' ? 'WINS' : this.tab === 'placements' ? 'PLACEMENTS' : 'NORMALS'

      const req: CalculatePriceRequestDto = {
        game: 'tft_ranked',
        purchaseType,
        currentRank: purchaseType === 'DIVISION' ? this.currentRank : null,
        targetRank: purchaseType === 'DIVISION' ? this.desiredRank : null,
        quantity:
          purchaseType === 'WINS'
            ? this.winsCount
            : purchaseType === 'PLACEMENTS'
              ? this.placementsGames
              : purchaseType === 'NORMALS'
                ? this.normalsGames
                : null,

        // LP affects pricing for the first step.
        // For Master+ -> Master+ orders, the first step is at 'currentRank' (Master+) and the LP context should be the LP
        // the user is currently at (the input shown under Desired LP in the UI is the user's current LP in Master).
        currentLpBracket: purchaseType === 'DIVISION' && !this.isCurrentMasterPlus ? this.lp : null,
        currentLp: purchaseType === 'DIVISION' && this.isCurrentMasterPlus ? this.currentLp : null,
        desiredLp: purchaseType === 'DIVISION' && this.isCurrentMasterPlus ? this.desiredLp : null,

        options: {
          priority: this.options.priority,
          stream: this.options.stream,
          discountCode: this.discountCode?.trim() ? this.discountCode.trim() : null,
          queue: this.queue
        },

        lastSplitRank: purchaseType === 'PLACEMENTS' ? this.lastSplitRank : null,
      }

      // Keep existing form validation for division.
      if (purchaseType === 'DIVISION' && !this.isValid) {
        this.price = null
        return
      }

      try {
        const res = await api.fetch<CalculatePriceResponseDto>('/api/pricing/calculate-price', {
          method: 'POST',
          auth: false,
          body: req as unknown as Record<string, unknown>
        })

        this.discountError = null

        const basePrice = Number(res.basePrice)
        const finalPrice = Number(res.finalPrice)

        // For UI breakdown.
        const priorityMultiplier = this.options.priority ? 1.25 : 1
        const streamMultiplier = this.options.stream ? 1.15 : 1
        const queueMultiplier = this.queue === 'double_up' ? 1.2 : 1
        const finalMult = priorityMultiplier * streamMultiplier * queueMultiplier

        const nextPrice: PriceBreakdown = {
          basePrice: Math.round(basePrice),
          finalPrice: Math.round(finalPrice),
          priorityMultiplier,
          streamMultiplier,
          percentIncreaseTotal: Math.round((finalMult - 1) * 100)
        }

        this.price = nextPrice
        this.lastGoodPrice = nextPrice
      } catch (e: any) {
        const msg = e?.data?.message || e?.data?.error || e?.message
        const code = e?.data?.code || e?.data?.errorCode

        // Invalid discount code: show message and revert to original price by recalculating without the code.
        if (code === 'DISCOUNT_CODE_INVALID') {
          this.discountError = msg || 'Mã giảm giá không hợp lệ.'

          // Keep the user's input, but our stored discountCode should not affect pricing while invalid.
          const prev = this.discountCode
          this.discountCode = ''

          try {
            const res2 = await api.fetch<CalculatePriceResponseDto>('/api/pricing/calculate-price', {
              method: 'POST',
              auth: false,
              body: {
                ...req,
                options: { ...req.options, discountCode: null }
              } as unknown as Record<string, unknown>
            })

            const basePrice2 = Number(res2.basePrice)
            const finalPrice2 = Number(res2.finalPrice)

            const priorityMultiplier = this.options.priority ? 1.25 : 1
            const streamMultiplier = this.options.stream ? 1.15 : 1
            const finalMult = priorityMultiplier * streamMultiplier

            const nextPrice2: PriceBreakdown = {
              basePrice: Math.round(basePrice2),
              finalPrice: Math.round(finalPrice2),
              priorityMultiplier,
              streamMultiplier,
              percentIncreaseTotal: Math.round((finalMult - 1) * 100)
            }

            this.price = nextPrice2
            this.lastGoodPrice = nextPrice2
          } catch (e2: any) {
            // If fallback calc fails, at least don't keep the discounted price.
            this.price = null
          } finally {
            // Restore what user typed in the input field (UI uses store.discountCode).
            this.discountCode = prev
          }

          return
        }

        if (this.discountCode?.trim()) {
          this.discountError = 'Mã giảm giá không đúng hoặc đã hết hạn.'

          // Revert pricing to non-discounted when code fails.
          const prev = this.discountCode
          this.discountCode = ''

          try {
            const res2 = await api.fetch<CalculatePriceResponseDto>('/api/pricing/calculate-price', {
              method: 'POST',
              auth: false,
              body: {
                ...req,
                options: { ...req.options, discountCode: null }
              } as unknown as Record<string, unknown>
            })

            const basePrice2 = Number(res2.basePrice)
            const finalPrice2 = Number(res2.finalPrice)

            const priorityMultiplier = this.options.priority ? 1.25 : 1
            const streamMultiplier = this.options.stream ? 1.15 : 1
            const finalMult = priorityMultiplier * streamMultiplier

            const nextPrice2: PriceBreakdown = {
              basePrice: Math.round(basePrice2),
              finalPrice: Math.round(finalPrice2),
              priorityMultiplier,
              streamMultiplier,
              percentIncreaseTotal: Math.round((finalMult - 1) * 100)
            }

            this.price = nextPrice2
            this.lastGoodPrice = nextPrice2
          } catch (e2: any) {
            this.price = null
          } finally {
            this.discountCode = prev
          }

          return
        }

        // Other errors: pricing really failed.
        this.discountError = null
        this.price = null
        // eslint-disable-next-line no-console
        console.warn('Failed to calculate price', e)
      }
    }
  }
})

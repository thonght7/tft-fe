import { defineStore } from 'pinia'
import type { Rank } from '~/types/domain'
import { compareRanks } from '~/utils/boostRanks'
import type { BoostOptions, PriceBreakdown, PurchaseTab, QueueMode } from '~/utils/boostPricing'
import { computePrice } from '~/utils/boostPricing'
import type { Division, TierName } from '~/utils/rankTiers'
import { TIER_OPTIONS, tierDivisionToRank, tierIndex, divisionIndex } from '~/utils/rankTiers'

export type LpBracket = '0-20' | '20-40' | '40-60' | '60-80' | '80-100'
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

    currentLp: 0,
    desiredLp: 50,

    winsCount: 10,
    avgLpPerWin: '18-23' as AvgLpPerWin,
    masterLpRange: '0-20' as MasterLpRange,

    // Placements: rank-only (no divisions)
    lastSplitRankKey: 'Platinum IV' as Rank,
    placementsGames: 5,

    normalsGames: 10,
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
      return compareRanks(this.desiredRank, this.currentRank) > 0
    },
    validationMessage(): string | null {
      if (compareRanks(this.desiredRank, this.currentRank) <= 0) return 'Desired rank must be higher than current rank.'
      return null
    },
    isCurrentMasterPlus(): boolean {
      return ['Master', 'Grandmaster', 'Challenger'].includes(this.currentTier)
    },
    isDesiredMasterPlus(): boolean {
      return ['Master', 'Grandmaster', 'Challenger'].includes(this.desiredTier)
    },
    lastSplitRank(): Rank {
      return this.lastSplitRankKey
    }
  },
  actions: {
    setTab(tab: PurchaseTab) {
      this.tab = tab
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
      return (idx + 1 < 9 ? (['Iron','Bronze','Silver','Gold','Platinum','Diamond','Master','Grandmaster','Challenger'][idx + 1] as TierName) : null)
    },
    setCurrentTier(tier: TierName) {
      this.currentTier = tier
      const curOpt = TIER_OPTIONS.find((t) => t.id === this.currentTier)
      if (!curOpt?.hasDivisions) {
        this.currentDivision = 'IV'
        // Entering Master+ tiers: keep LP input and ensure currentLp has a sane default.
        this.currentLp = Math.max(0, Math.min(1400, Math.round(this.currentLp ?? 0)))
      } else {
        // Non-Master+ tiers: default LP range to the first option.
        this.masterLpRange = '0-20'
        this.currentLp = lpForMasterRange(this.masterLpRange)
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

      this.recalcPrice()
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

      this.recalcPrice()
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
    recalcPrice() {
      if (this.tab === 'normals') {
        // Mock: normals pricing
        const basePerGame = 12_000
        const base = this.normalsGames * basePerGame
        const mult = (this.options.priority ? 1.25 : 1) * (this.options.stream ? 1.15 : 1)
        this.price = {
          basePrice: base,
          finalPrice: Math.round(base * mult),
          priorityMultiplier: this.options.priority ? 1.25 : 1,
          streamMultiplier: this.options.stream ? 1.15 : 1,
          percentIncreaseTotal: Math.round((mult - 1) * 100)
        }
        return
      }

      if (this.tab === 'placements') {
        // Mock: placements pricing (max 5 games)
        const basePerGame = 25_000
        const base = this.placementsGames * basePerGame
        const mult = (this.options.priority ? 1.25 : 1) * (this.options.stream ? 1.15 : 1)
        this.price = {
          basePrice: base,
          finalPrice: Math.round(base * mult),
          priorityMultiplier: this.options.priority ? 1.25 : 1,
          streamMultiplier: this.options.stream ? 1.15 : 1,
          percentIncreaseTotal: Math.round((mult - 1) * 100)
        }
        return
      }

      if (this.tab === 'wins') {
        // Mock: wins pricing
        const basePerWin = 40_000
        const base = this.winsCount * basePerWin
        const mult = (this.options.priority ? 1.25 : 1) * (this.options.stream ? 1.15 : 1)
        this.price = {
          basePrice: base,
          finalPrice: Math.round(base * mult),
          priorityMultiplier: this.options.priority ? 1.25 : 1,
          streamMultiplier: this.options.stream ? 1.15 : 1,
          percentIncreaseTotal: Math.round((mult - 1) * 100)
        }
        return
      }

      // Division pricing
      if (!this.isValid) {
        this.price = null
        return
      }
      this.price = computePrice(this.currentRank, this.desiredRank, this.options)
    }
  }
})

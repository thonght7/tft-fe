import type { Rank } from '~/types/domain'
import { compareRanks } from '~/utils/boostRanks'

export type PurchaseTab = 'division' | 'wins' | 'placements' | 'normals'
export type QueueMode = 'solo' | 'double_up'

export interface BoostOptions {
  priority: boolean
  stream: boolean
}

export interface PriceBreakdown {
  basePrice: number
  finalPrice: number
  priorityMultiplier: number
  streamMultiplier: number
  percentIncreaseTotal: number
}

export function calcOptionsMultiplier(options: BoostOptions): PriceBreakdown {
  const priorityMultiplier = options.priority ? 1.25 : 1
  const streamMultiplier = options.stream ? 1.15 : 1
  const finalMult = priorityMultiplier * streamMultiplier

  return {
    basePrice: 0,
    finalPrice: 0,
    priorityMultiplier,
    streamMultiplier,
    percentIncreaseTotal: Math.round((finalMult - 1) * 100)
  }
}

// Client-only pricing used for the UI demo. Keeps logic deterministic.
// If you later want to rely on backend for base price, swap `basePrice`.
export function estimateBasePriceVnd(current: Rank, target: Rank): number {
  const cmp = compareRanks(current, target)
  if (cmp >= 0) return 0

  // Simple step pricing: each tier step adds 45k VND.
  const tiers = Math.abs(compareRanks(current, target))
  const step = 45_000
  const base = tiers * step

  // Minimum order.
  return Math.max(base, 120_000)
}

export function computePrice(current: Rank, target: Rank, options: BoostOptions): PriceBreakdown {
  const basePrice = estimateBasePriceVnd(current, target)

  const priorityMultiplier = options.priority ? 1.25 : 1
  const streamMultiplier = options.stream ? 1.15 : 1
  const finalPrice = Math.round(basePrice * priorityMultiplier * streamMultiplier)

  return {
    basePrice,
    finalPrice,
    priorityMultiplier,
    streamMultiplier,
    percentIncreaseTotal: Math.round((finalPrice / basePrice - 1) * 100)
  }
}

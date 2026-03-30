import type { Rank } from '~/types/domain'
import { RANKS } from '~/utils/ranks'

// Division is now modeled in `utils/rankTiers.ts` (tier + division selection UI).
// Keep this file focused on rank comparisons.

// export const DIVISIONS = ['IV', 'III', 'II', 'I'] as const
// export type Division = (typeof DIVISIONS)[number]

export const RANK_GROUPS = [
  { id: 'iron', label: 'Iron', ranks: ['Sắt'] as const },
  { id: 'bronze', label: 'Bronze', ranks: ['Đồng'] as const },
  { id: 'silver', label: 'Silver', ranks: ['Bạc'] as const },
  { id: 'gold', label: 'Gold', ranks: ['Vàng'] as const },
  { id: 'platinum', label: 'Platinum', ranks: ['Bạch Kim'] as const },
  { id: 'diamond', label: 'Diamond', ranks: ['Kim Cương'] as const },
  { id: 'master', label: 'Master+', ranks: ['Cao Thủ', 'Đại Cao Thủ', 'Thách Đấu'] as const }
] as const

export function tierOf(rank: Rank): number {
  const found = RANKS.find((r) => r.key === rank)
  return found?.tier ?? 0
}

// Returns negative if a < b, 0 if equal, positive if a > b.
export function compareRanks(a: Rank, b: Rank): number {
  return tierOf(a) - tierOf(b)
}

export function isHigherThan(a: Rank, b: Rank): boolean {
  return compareRanks(a, b) > 0
}

export function validTargetRanks(current: Rank): Rank[] {
  const currentTier = tierOf(current)
  return RANKS.filter((r) => r.tier > currentTier).map((r) => r.key)
}

export function clampTargetRank(current: Rank, desired: Rank): Rank {
  if (compareRanks(desired, current) > 0) return desired
  const choices = validTargetRanks(current)
  return choices[0] ?? current
}

export function formatRankShort(rank: Rank): string {
  return rank
    .replace('Sắt', 'Iron')
    .replace('Đồng', 'Bronze')
    .replace('Bạc', 'Silver')
    .replace('Vàng', 'Gold')
    .replace('Bạch Kim', 'Platinum')
    .replace('Kim Cương', 'Diamond')
    .replace('Cao Thủ', 'Master')
    .replace('Đại Cao Thủ', 'Grandmaster')
    .replace('Thách Đấu', 'Challenger')
}

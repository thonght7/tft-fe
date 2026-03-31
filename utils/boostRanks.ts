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
  const r = String(rank ?? '').trim()

  // Master+ exact matches
  if (r === 'Cao Thủ') return 'Master'
  if (r === 'Đại Cao Thủ') return 'Grandmaster'
  if (r === 'Thách Đấu') return 'Challenger'

  // Divisional tiers
  const m = r.match(/^(Sắt|Đồng|Bạc|Vàng|Bạch Kim|Kim Cương)\s+(IV|III|II|I)$/)
  if (m) {
    const viTier = m[1]
    const div = m[2]

    const enTier =
      viTier === 'Sắt'
        ? 'Iron'
        : viTier === 'Đồng'
          ? 'Bronze'
          : viTier === 'Bạc'
            ? 'Silver'
            : viTier === 'Vàng'
              ? 'Gold'
              : viTier === 'Bạch Kim'
                ? 'Platinum'
                : 'Diamond'

    return `${enTier} ${div}`
  }

  // Fallback: return as-is (avoid creating weird strings)
  return r
}

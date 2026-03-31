import type { Rank } from '~/types/domain'

export type TierName = 'Iron' | 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Master'
export type Division = 'IV' | 'III' | 'II' | 'I'

export interface TierOption {
  id: TierName
  label: TierName
  // For tiers with divisions, store the corresponding backend prefix
  backendPrefix?: string
  hasDivisions: boolean
}

export const TIER_OPTIONS: TierOption[] = [
  { id: 'Iron', label: 'Iron', backendPrefix: 'Sắt', hasDivisions: true },
  { id: 'Bronze', label: 'Bronze', backendPrefix: 'Đồng', hasDivisions: true },
  { id: 'Silver', label: 'Silver', backendPrefix: 'Bạc', hasDivisions: true },
  { id: 'Gold', label: 'Gold', backendPrefix: 'Vàng', hasDivisions: true },
  { id: 'Platinum', label: 'Platinum', backendPrefix: 'Bạch Kim', hasDivisions: true },
  { id: 'Diamond', label: 'Diamond', backendPrefix: 'Kim Cương', hasDivisions: true },
  { id: 'Master', label: 'Master', backendPrefix: 'Cao Thủ', hasDivisions: false }
]

export const DIVISION_OPTIONS: { id: Division; label: Division }[] = [
  { id: 'IV', label: 'IV' },
  { id: 'III', label: 'III' },
  { id: 'II', label: 'II' },
  { id: 'I', label: 'I' }
]

export const TIER_ORDER: TierName[] = [
  'Iron',
  'Bronze',
  'Silver',
  'Gold',
  'Platinum',
  'Diamond',
  'Master'
]

export function rankToTierDivision(rank: Rank): { tier: TierName; division: Division | null } {
  // Divisional ranks
  const divMatch = rank.match(/^(Sắt|Đồng|Bạc|Vàng|Bạch Kim|Kim Cương)\s+(IV|III|II|I)$/)
  if (divMatch) {
    const [, viTier, div] = divMatch as unknown as [string, string, Division]
    const tier = TIER_OPTIONS.find((t) => t.backendPrefix === viTier)?.id
    if (tier) return { tier, division: div }
  }

  // Non-divisional (treat any Master+ as Master for UI selection)
  if (rank === 'Cao Thủ' || rank === 'Đại Cao Thủ' || rank === 'Thách Đấu') return { tier: 'Master', division: null }
  return { tier: 'Master', division: null }
}

export function tierDivisionToRank(tier: TierName, division: Division | null): Rank {
  const opt = TIER_OPTIONS.find((t) => t.id === tier)
  if (!opt) return 'Bạc I'

  if (!opt.hasDivisions) {
    // map to single-string backend key
    return opt.backendPrefix as Rank
  }

  const div = division ?? 'IV'
  return `${opt.backendPrefix} ${div}` as Rank
}

export function tierIndex(tier: TierName): number {
  return TIER_ORDER.indexOf(tier)
}

export function divisionIndex(div: Division): number {
  // Lower is higher (I highest). We'll use it for comparisons.
  if (div === 'I') return 0
  if (div === 'II') return 1
  if (div === 'III') return 2
  return 3
}

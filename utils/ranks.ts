import type { Rank } from '~/types/domain'

// Note: Backend stores ranks as free-form strings (see seed data). We model them as `Rank` union on FE.
export const RANKS: { key: Rank; label: string; tier: number }[] = [
  { key: 'Sắt IV', label: 'Iron IV', tier: 1 },
  { key: 'Sắt III', label: 'Iron III', tier: 2 },
  { key: 'Sắt II', label: 'Iron II', tier: 3 },
  { key: 'Sắt I', label: 'Iron I', tier: 4 },

  { key: 'Đồng IV', label: 'Bronze IV', tier: 5 },
  { key: 'Đồng III', label: 'Bronze III', tier: 6 },
  { key: 'Đồng II', label: 'Bronze II', tier: 7 },
  { key: 'Đồng I', label: 'Bronze I', tier: 8 },

  { key: 'Bạc IV', label: 'Silver IV', tier: 9 },
  { key: 'Bạc III', label: 'Silver III', tier: 10 },
  { key: 'Bạc II', label: 'Silver II', tier: 11 },
  { key: 'Bạc I', label: 'Silver I', tier: 12 },

  { key: 'Vàng IV', label: 'Gold IV', tier: 13 },
  { key: 'Vàng III', label: 'Gold III', tier: 14 },
  { key: 'Vàng II', label: 'Gold II', tier: 15 },
  { key: 'Vàng I', label: 'Gold I', tier: 16 },

  { key: 'Bạch Kim IV', label: 'Platinum IV', tier: 17 },
  { key: 'Bạch Kim III', label: 'Platinum III', tier: 18 },
  { key: 'Bạch Kim II', label: 'Platinum II', tier: 19 },
  { key: 'Bạch Kim I', label: 'Platinum I', tier: 20 },

  { key: 'Kim Cương IV', label: 'Diamond IV', tier: 21 },
  { key: 'Kim Cương III', label: 'Diamond III', tier: 22 },
  { key: 'Kim Cương II', label: 'Diamond II', tier: 23 },
  { key: 'Kim Cương I', label: 'Diamond I', tier: 24 },

  { key: 'Cao Thủ', label: 'Master', tier: 25 },
  { key: 'Đại Cao Thủ', label: 'Grandmaster', tier: 26 },
  { key: 'Thách Đấu', label: 'Challenger', tier: 27 }
]

export function rankLabel(rank: Rank) {
  return RANKS.find((r) => r.key === rank)?.label ?? rank
}

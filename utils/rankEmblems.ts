import type { Rank } from '~/types/domain'

export type RankTierKey =
  | 'iron'
  | 'bronze'
  | 'silver'
  | 'gold'
  | 'platinum'
  | 'emerald'
  | 'diamond'
  | 'master'
  | 'grandmaster'
  | 'challenger'

export function tierKeyFromRank(rank: Rank): RankTierKey {
  if (rank.startsWith('Sắt')) return 'iron'
  if (rank.startsWith('Đồng')) return 'bronze'
  if (rank.startsWith('Bạc')) return 'silver'
  if (rank.startsWith('Vàng')) return 'gold'
  if (rank.startsWith('Bạch Kim')) return 'platinum'
  if (rank.startsWith('Kim Cương')) return 'diamond'
  if (rank === 'Cao Thủ') return 'master'
  if (rank === 'Đại Cao Thủ') return 'grandmaster'
  return 'challenger'
}

// We avoid hotlinking third-party assets by default because many hosts block it (Cloudflare 403 challenge).
// Put your own copies under /public/emblems and we’ll reference them here.

export const LOCAL_EMBLEM_URLS: Record<RankTierKey, string> = {
  iron: '/emblems/iron.png',
  bronze: '/emblems/bronze.png',
  silver: '/emblems/silver.png',
  gold: '/emblems/gold.png',
  platinum: '/emblems/platinum.png',
  emerald: '/emblems/emerald.png',
  diamond: '/emblems/diamond.png',
  master: '/emblems/master.png',
  grandmaster: '/emblems/grandmaster.png',
  challenger: '/emblems/challenger.png'
}

// NOTE: The originally provided remote URLs are often blocked (Cloudflare challenge 403),
// so we intentionally don't keep them in code. Store copies in /public/emblems instead.

export function emblemUrlForRank(rank: Rank): string {
  return LOCAL_EMBLEM_URLS[tierKeyFromRank(rank)]
}

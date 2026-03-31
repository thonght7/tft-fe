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

function normalizeRankKey(rank: Rank): string {
  return String(rank ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
}

export function tierKeyFromRank(rank: Rank): RankTierKey {
  const r = normalizeRankKey(rank)

  // Support Vietnamese + English labels (after formatRankShort)
  if (r.startsWith('sắt') || r.startsWith('iron')) return 'iron'
  if (r.startsWith('đồng') || r.startsWith('bronze')) return 'bronze'

  // IMPORTANT: check platinum first so corrupted strings don't match 'bạc' accidentally.
  if (r.startsWith('bạch kim') || r.startsWith('platinum')) return 'platinum'

  if (r.startsWith('bạc') || r.startsWith('silver')) return 'silver'
  if (r.startsWith('vàng') || r.startsWith('gold')) return 'gold'
  if (r.startsWith('kim cương') || r.startsWith('diamond')) return 'diamond'

  if (r === 'cao thủ' || r === 'master') return 'master'
  if (r === 'đại cao thủ' || r === 'grandmaster') return 'grandmaster'
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

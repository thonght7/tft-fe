export type PricingPurchaseType = 'DIVISION' | 'WINS' | 'PLACEMENTS' | 'NORMALS'

export interface CalculatePriceRequestDto {
  game: string
  purchaseType: PricingPurchaseType
  currentRank?: string | null
  targetRank?: string | null
  quantity?: number | null

  // Division LP context
  // NOTE: For ranks below Master, pricing is currently the same for all LP brackets.
  // We keep `currentLpBracket` for future rule expansion / analytics.
  currentLpBracket?: string | null

  // For Master+ ranks, backend pricing may depend on exact LP.
  currentLp?: number | null
  desiredLp?: number | null

  // Placements pricing context
  lastSplitRank?: string | null

  options: {
    priority: boolean
    stream: boolean
    discountCode?: string | null
    queue?: 'solo' | 'double_up' | string | null
  }
}

export interface CalculatePriceResponseDto {
  game: string
  purchaseType: PricingPurchaseType
  currentRank?: string | null
  targetRank?: string | null
  quantity?: number | null
  basePrice: string // BigDecimal serialized by Spring
  optionsMultiplier: string
  discountAmount: string
  finalPrice: string
}

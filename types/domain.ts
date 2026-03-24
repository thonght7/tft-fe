export type Role = 'USER' | 'BOOSTER' | 'ADMIN'

// Backend /api/auth/* returns `UserMe` record
export interface UserMe {
  id: string
  email: string
  role: Role
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  tokenType: 'Bearer' | string
  expiresInSeconds: number
  me: UserMe
}

// --------- existing domain types kept for non-auth modules ---------

export type Rank =
  | 'Sắt IV'
  | 'Sắt III'
  | 'Sắt II'
  | 'Sắt I'
  | 'Đồng IV'
  | 'Đồng III'
  | 'Đồng II'
  | 'Đồng I'
  | 'Bạc IV'
  | 'Bạc III'
  | 'Bạc II'
  | 'Bạc I'
  | 'Vàng IV'
  | 'Vàng III'
  | 'Vàng II'
  | 'Vàng I'
  | 'Bạch Kim IV'
  | 'Bạch Kim III'
  | 'Bạch Kim II'
  | 'Bạch Kim I'
  | 'Kim Cương IV'
  | 'Kim Cương III'
  | 'Kim Cương II'
  | 'Kim Cương I'
  | 'Cao Thủ'
  | 'Đại Cao Thủ'
  | 'Thách Đấu'

export type BoosterStatus = 'AVAILABLE' | 'BUSY'

export type OrderStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'

// Backend booster DTO
export interface BoosterProfileResponse {
  id: string
  userId: string
  email: string
  currentRank: string
  winrate: number
  status: BoosterStatus | string
}

// Legacy (will be removed when syncing user module)
export interface UserProfile {
  id: string
  email: string
  displayName: string
  roles: Role[]
}

export interface Tokens {
  accessToken: string
  refreshToken: string
  expiresInSeconds?: number
}

// Pricing
export interface CalculatePriceRequest {
  game: string
  currentRank: string
  targetRank: string
}

export interface CalculatePriceResponse {
  game: string
  currentRank: string
  targetRank: string
  price: number
}

// Orders (backend DTO)
export type BackendOrderStatus = string

export interface OrderResponse {
  id: string
  userId: string
  boosterUserId: string | null
  currentRank: string
  targetRank: string
  price: number
  status: BackendOrderStatus
}

// Payments (backend DTO)
export interface PaymentResponse {
  id: string
  orderId: string
  amount: number
  status: string
  provider: string
}

// Tracking
export interface ProgressUpdateRequest {
  message: string
  percent: number
}

export interface ProgressUpdateResponse {
  id: string
  orderId: string
  boosterUserId: string
  message: string
  percent: number
  createdAt: string
}

export interface BoosterProfile {
  id: string
  userId: string
  currentRank: Rank
  winRate: number
  status: BoosterStatus
}

export interface Order {
  id: string
  userId: string
  boosterId?: string | null
  currentRank: Rank
  targetRank: Rank
  price: number
  status: OrderStatus
  createdAt: string
}

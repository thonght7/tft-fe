export interface BankTransferInitResponseDto {
  paymentId: string
  orderId: string
  amount: number
  bankCode: string
  bankAccountNo: string
  bankAccountName: string
  transferContent: string
  vietQr: string
}

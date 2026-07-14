import { BaseApi } from './base-api'
import { uploadFile } from './api'

export interface Settlement {
  merchant_id: string
  terminal_id: string
  pan: string
  rrn: number
  amount: number
  amount_impact: number
  acquirer_fee: number
  status_message: string
  transaction_time: string
  create_at: string
}

export interface SettlementDetail extends Settlement {
  merchant_name: string
  merchant_address: string
  card_sheme: string
  currency: string
  stan: number
  mti: number
  source_account_number: number
  source_account_type: string
  settlement_account_number: number
  beneficiary_account: string
  card_account_number: string
  description: string
  response_message: string
  category: string
  region: string
  bank: string
}

class SettlementApi extends BaseApi<Settlement> {
  constructor() {
    super('settlements')
  }

  uploadSettlement = async (file: File) => {
    return uploadFile('/settlements/upload', file)
  }
}

export const settlementApi = new SettlementApi()

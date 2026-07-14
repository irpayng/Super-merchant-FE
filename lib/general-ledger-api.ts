import { BaseApi } from './base-api'

export interface GeneralLedger {
  id: string
  account: {
    name: string
    id: string
  }
  product: {
    code: string
    name: string
    id: string
  }
  provider: {
    name: string
    id: string
  }
  description: string
  credit: string
  debit: string
  previous_balance: string
  current_balance: string
  created_at: string
}

class GeneralLedgerApi extends BaseApi<GeneralLedger> {
  constructor() {
    super('general-ledger')
  }
}

export const generalLedgerApi = new GeneralLedgerApi()

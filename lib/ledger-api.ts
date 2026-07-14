import { BaseApi } from './base-api'

export interface Ledger {
  id: string
  name: string
  code: string
  category: string
  sub_category: string
  balance: number
  description: string | null
  on_credit: string
  on_debit: string
}

class LedgerApi extends BaseApi<Ledger> {
  constructor() {
    super('ledgers')
  }
}

export const ledgerApi = new LedgerApi()

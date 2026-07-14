import { BaseApi } from './base-api'

export interface TrialBalance {
  category: string
  sub_category: string
  debit: number
  credit: number
}

class TrialBalanceApi extends BaseApi<TrialBalance> {
  constructor() {
    super('trial-balances')
  }
}

export const trialBalanceApi = new TrialBalanceApi()

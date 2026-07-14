import { BaseApi } from './base-api'

export interface Wallet {
  id: string
  user: {
    name: string
    id: string
  }
  type: string
  balance: string
}

class WalletApi extends BaseApi<Wallet> {
  constructor() {
    super('wallets')
  }
}

export const walletApi = new WalletApi()

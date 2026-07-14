import { BaseApi } from './base-api'

export interface User {
  id: number
  name: string
  email: string
  phone_number: string
  wallet_id: string
  tier: { name: string; id: number }
  trade_partner: { name: string; id: number } | null
  created_at: string
}

class UserApi extends BaseApi<User> {
  constructor() {
    super('users')
  }
}

export const userApi = new UserApi()

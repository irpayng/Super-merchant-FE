import { BaseApi, PaginatedResponse } from './base-api'

export interface Transaction {
  id: string
  reference: string
  transactable: {
    reference: string
    phone_number: string
    network: string
    id: number
  }
  user: {
    name: string
    id: number
  }
  product: {
    name: string
    id: number
  }
  provider: {
    name: string
    id: number
  }
  channel: {
    name: string
    id: number
  }
  payment_method: {
    name: string
    code: string
    id: number
  }
  amount: number
  status: {
    code: string
    context: string
    description: string | null
    id: number
  }
}

class TransactionApi extends BaseApi<Transaction> {
  constructor() {
    super('transactions')
  }
}

export const transactionApi = new TransactionApi()

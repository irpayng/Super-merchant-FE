import { apiRequest } from './api'

export interface ManualCreditInitializeRequest {
  amount: string
  beneficiary: string
  wallet_type: string
  provider_id: string
}

export interface ManualCreditInitializeResponse {
  data: {
    reference: string
    beneficiary: string
    beneficiary_name: string
    wallet_type: string
    amount: number
    amount_to_received: number
    vat: number
    service_charge: number
    commission: number
    date: string
  }
  code: number
  message: string
}

export interface ManualCreditCompleteRequest {
  reference: string
}

export interface ManualCreditCompleteResponse {
  data: {
    reference: string
    beneficiary: string
    beneficiary_name: string
    wallet_type: string
    amount: number
    amount_received: number
    vat: number
    service_charge: number
    commission: number
    date: string
  }
  code: number
  message: string
}

export const manualCreditApi = {
  initialize: async (data: ManualCreditInitializeRequest) => {
    return apiRequest<ManualCreditInitializeResponse>('/manual-credits/initialize', {
      method: 'POST',
      body: data as any
    })
  },

  complete: async (data: ManualCreditCompleteRequest) => {
    return apiRequest<ManualCreditCompleteResponse>('/manual-credits/complete', {
      method: 'POST',
      body: data as any
    })
  }
}

export const manualDebitApi = {
  initialize: async (data: ManualCreditInitializeRequest) => {
    return apiRequest<ManualCreditInitializeResponse>('/manual-debits/initialize', {
      method: 'POST',
      body: data as any
    })
  },

  complete: async (data: ManualCreditCompleteRequest) => {
    return apiRequest<ManualCreditCompleteResponse>('/manual-debits/complete', {
      method: 'POST',
      body: data as any
    })
  }
}

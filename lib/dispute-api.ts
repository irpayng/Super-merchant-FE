import { BaseApi } from './base-api'
import { apiRequest } from './api'

export interface DisputeConversation {
    id: number
    user_id: number | null
    sender_type: 'user' | 'admin' | 'agent'
    message: string
    createdAt: string
    created_at?: string
}

export interface DisputeUser {
    id: number
    name: string | null
    email: string | null
    phone_number: string | null
}

export interface DisputeTransaction {
    id: number
    reference: string | null
    amount: string | null
    status: { code: string; name: string } | null
    product: string | null
    created_at: string | null
}

export interface Dispute {
    id: number
    transaction_id: number
    transaction_reference: string | null
    user_id: number | null
    reason: string
    description: string | null
    status_code: string
    user?: DisputeUser | null
    transaction?: DisputeTransaction | null
    conversations?: DisputeConversation[]
    created_at: string
    updated_at: string
}

class DisputeApi extends BaseApi<Dispute> {
    constructor() {
        super('disputes')
    }

    addConversation = async (id: number, message: string) => {
        return apiRequest(`/disputes/${id}/add-conversation`, {
            method: 'POST',
            body: { message },
            suppressToast: true,
        })
    }

    close = async (id: number) => {
        return apiRequest(`/disputes/${id}/close`, {
            method: 'PATCH',
        })
    }
}

export const disputeApi = new DisputeApi()

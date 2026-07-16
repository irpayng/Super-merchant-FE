import { BaseApi } from './base-api'
import { uploadFile, downloadFile, apiRequest } from './api'

export interface TerminalId {
  id: number
  user_id: number | null
  terminal_id: string
  merchant_id: string
  merchant_name: string
  bank_acc_no: string
  merchant_category_code: string
  state_code: string
  merchant_physical_addr: string
  merchant_address_lga_code: string
  email: string
  internal: boolean
  processor: string | null
  created_at: string
}

class TerminalIdApi extends BaseApi<TerminalId> {
  constructor() {
    super('tids')
  }

  uploadTerminalIds = async (file: File, options?: { internal?: boolean }) => {
    return uploadFile('/tids', file, options)
  }

  downloadSample = async () => {
    return downloadFile('/tids/download-sample', {}, 'terminal-ids-sample')
  }

  toggleInternal = async (id: number) => {
    return apiRequest(`/tids/${id}/toggle-internal`, { method: 'POST' })
  }

  setProcessor = async (id: number, processor: string) => {
    return apiRequest(`/tids/${id}/processor`, { method: 'POST', body: { processor } })
  }
}

export const terminalIdApi = new TerminalIdApi()

import { BaseApi } from './base-api'
import { uploadFile } from './api'

export interface TerminalId {
  id: number
  merchant_id: string
  merchant_name: string
  terminal_id: string
  bank_code: string
  bank_acc_no: string
  merchant_physical_addr: string
  created_at: string
}

class TerminalIdApi extends BaseApi<TerminalId> {
  constructor() {
    super('tids')
  }

  uploadTerminalIds = async (file: File) => {
    return uploadFile('/tids', file)
  }
}

export const terminalIdApi = new TerminalIdApi()

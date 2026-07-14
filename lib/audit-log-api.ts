import { BaseApi } from './base-api'

export interface AuditLog {
  id: string
  // List rows return a flat admin_name; the detail view returns a nested admin.
  admin_name: string | null
  admin: {
    id: string
    name: string | null
    email: string | null
  } | null
  admin_role: string | null
  action: string
  description: string
  // The entity the action targeted, e.g. actionable_type "Address" + id 4213.
  actionable_type: string | null
  actionable_id: number | null
  // Request context captured by the logging aspect.
  ip_address: string | null
  user_agent: string | null
  // Field-level before/after diff of what the admin changed (update actions).
  changes: Record<string, { from: any; to: any }> | null
  created_at: string
}

class AuditLogApi extends BaseApi<AuditLog> {
  constructor() {
    super('activities')
  }
}

export const auditLogApi = new AuditLogApi()

import { BaseApi } from './base-api';
import { apiRequest } from './api';

export interface Admin {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  roles: Array<{ id: string; name: string }>;
  created_at: string;
}

class AdminApi extends BaseApi<Admin> {
  constructor() {
    super('admins');
  }

  assignRole = async (admin_id: string, roles: string[]) => {
    return apiRequest('/roles/assign', {
      method: 'POST',
      body: JSON.stringify({ admin_id, roles }),
      headers: { 'Content-Type': 'application/json' },
    });
  };

  unassignRole = async (admin_id: string, roles: string[]) => {
    return apiRequest('/roles/unassign', {
      method: 'POST',
      body: JSON.stringify({ admin_id, roles }),
      headers: { 'Content-Type': 'application/json' },
    });
  };

  toggleStatus = async (id: string, path: string) => {
    return apiRequest(`/admins/${id}/${path}`, {
      method: 'POST',
      body: JSON.stringify({ reason: '-' }),
      headers: { 'Content-Type': 'application/json' },
      suppressToast: true,
    });
  };

  updateInformation = async (id: string, payload: any) => {
    return apiRequest(`/admins/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
      suppressToast: true,
    });
  };
  
}

export const adminApi = new AdminApi();

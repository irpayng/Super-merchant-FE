import { BaseApi } from './base-api';
import { apiRequest } from './api';

export interface Role {
  id: number;
  merchantId: number;
  name: string;
  slug: string;
  description: string;
  systemRole: boolean;
  privileges: Array<{ id: number; code: string; name: string; module: string }>;
  createdAt: string;
  updatedAt: string;
}

class RolesApi extends BaseApi<Role> {
  constructor() {
    super('roles');
  }
}

export const createRole = async (payload: {
  name: string;
  slug: string;
  description?: string;
  privilegeIds?: number[];
}) => {
  return apiRequest<{ code: number; message: string; data: Role }>('/roles', {
    method: 'POST',
    body: payload,
  });
};

export const updateRole = async (
  id: number,
  payload: { name: string; description?: string; privilegeIds?: number[] },
) => {
  return apiRequest<{ code: number; message: string; data: Role }>(
    `/roles/${id}`,
    { method: 'PUT', body: payload },
  );
};

export const deleteRole = async (id: number) => {
  return apiRequest(`/roles/${id}`, { method: 'DELETE' });
};

export const assignRoleToUser = async (userId: number, roleId: number) => {
  return apiRequest(`/roles/assign/${userId}`, {
    method: 'POST',
    body: { roleId },
  });
};

export const rolesApi = new RolesApi();

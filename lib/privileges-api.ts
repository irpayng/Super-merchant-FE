import { BaseApi } from './base-api';

export interface Privilege {
  id: number;
  code: string;
  name: string;
  module: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

class PrivilegesApi extends BaseApi<Privilege> {
  constructor() {
    super('privileges');
  }
}

export const privilegesApi = new PrivilegesApi();

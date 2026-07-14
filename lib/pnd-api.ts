import { apiRequest } from './api'

export interface PndRequest {
  expression: {
    user: string
  }
  description: string
  value: string
}

export const pndApi = {
  apply: async (userEmail: string, description: string, password?: string) => {
    return apiRequest('/pnds', {
      method: 'POST',
      body: {
        expression: { user: userEmail },
        description,
        value: 'true',
        password: password || ""
      } as any
    })
  },

  remove: async (userEmail: string, description: string, password?: string) => {
    return apiRequest('/pnds', {
      method: 'POST',
      body: {
        expression: { user: userEmail },
        description,
        value: 'false',
        password: password || ""
      } as any
    })
  }
}

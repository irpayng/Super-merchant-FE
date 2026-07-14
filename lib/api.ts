import { redirect } from 'next/navigation';
import { clearAuthToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

let toastHandler:
  | ((message: string, type: 'success' | 'error' | 'info') => void)
  | null = null;
let refreshHandler: (() => void) | null = null;

export function setToastHandler(
  handler: (message: string, type: 'success' | 'error' | 'info') => void,
) {
  toastHandler = handler;
}

export function setRefreshHandler(handler: () => void) {
  refreshHandler = handler;
}

async function getToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  return cookieStore.get('token')?.value || null;
}

function handleAuthError() {
  if (typeof window !== 'undefined') {
    clearAuthToken();
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
  } else {
    redirect('/login');
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: Omit<RequestInit, 'body'> & { suppressToast?: boolean; body?: any; _retried?: boolean } = {},
): Promise<T> {
  const token = await getToken();
  const method = options.method?.toUpperCase() || 'GET';

  const requestOptions: RequestInit = {
    ...options,
    headers: {
      ...(!(options.body instanceof FormData) && {
        'Content-Type': 'application/json',
      }),
      'X-Requested-With': 'XMLHttpRequest',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  if (
    options.body &&
    typeof options.body === 'object' &&
    !(options.body instanceof FormData)
  ) {
    requestOptions.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);

  if (!response.ok) {
    if (response.status === 401) {
      handleAuthError();
      return Promise.reject(new Error('Unauthenticated'));
    }

    const errorData = await response
      .json()
      .catch(() => ({ message: response.statusText }));
    const errorMessage =
      errorData?.message || `API Error: ${response.statusText}`;

    if (toastHandler && !options.suppressToast) {
      toastHandler(errorMessage, 'error');
    }

    throw new Error(errorMessage);
  }

  const data = await response.json();

  if (
    method !== 'GET' &&
    toastHandler &&
    data?.message &&
    !options.suppressToast
  ) {
    toastHandler(data.message, 'success');
  }

  if (method !== 'GET' && refreshHandler) {
    refreshHandler();
  }

  return data;
}

export function buildQueryString(params: Record<string, any>): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach((item) => query.append(`${key}[]`, item.toString()));
      } else {
        query.append(key, String(value));
      }
    }
  });
  return query.toString();
}

export async function downloadFile(
  endpoint: string,
  params: Record<string, any>,
  filename: string,
) {
  const query = buildQueryString(params);
  const token = await getToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}?${query}`, {
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      handleAuthError();
      return Promise.reject(new Error('Unauthenticated'));
    }

    const errorData = await response
      .json()
      .catch(() => ({ message: `Failed to download ${filename}` }));
    const errorMessage = errorData?.message || `Failed to download ${filename}`;

    if (toastHandler) {
      toastHandler(errorMessage, 'error');
    }

    throw new Error(errorMessage);
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}-${Date.now()}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);

  if (toastHandler) {
    toastHandler('Export completed successfully', 'success');
  }
}

export async function uploadFile(
  endpoint: string,
  file: File,
  options?: Record<string, any>,
) {
  const formData = new FormData();
  formData.append('file', file);

  if (options) {
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
  }

  return apiRequest(endpoint, {
    method: 'POST',
    body: formData,
    headers: {},
  });
}

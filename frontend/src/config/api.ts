/**
 * Konfigurasi dan Helper Pemanggilan API Terpusat (Sesuai SOP Capstone)
 * Menggunakan base URL dari environment variable (.env) dan menyertakan token autentikasi otomatis.
 */

export const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

export function getApiUrl(endpoint: string): string {
  let path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // Mencegah duplikasi jika base URL sudah menyertakan '/api'
  if (API_BASE_URL.endsWith('/api') && path.startsWith('/api')) {
    path = path.substring(4);
  }
  
  return `${API_BASE_URL}${path}`;
}

interface RequestOptions extends RequestInit {
  data?: any;
}

export async function apiRequest<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const url = getApiUrl(endpoint);
  const token = localStorage.getItem('admin_token');

  const headers = new Headers(options.headers || {});
  
  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let body = options.body;
  if (options.data !== undefined) {
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    body = JSON.stringify(options.data);
  }

  const response = await fetch(url, {
    ...options,
    headers,
    body,
  });

  if (!response.ok) {
    let errorMsg = `HTTP Error ${response.status}: ${response.statusText}`;
    try {
      const errorJson = await response.json();
      if (errorJson && (errorJson.message || errorJson.error)) {
        errorMsg = errorJson.message || errorJson.error;
      }
    } catch {
      // bukan response JSON
    }
    const error = new Error(errorMsg) as any;
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const api = {
  get: <T = any>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),
  post: <T = any>(endpoint: string, data?: any, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: 'POST', data }),
  put: <T = any>(endpoint: string, data?: any, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: 'PUT', data }),
  delete: <T = any>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};

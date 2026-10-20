const getApiBase = (): string => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL as string;
  }
  // Fallback for standalone local Vite dev server without proxy
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost' && window.location.port === '5173') {
    return 'http://localhost:5000/api';
  }
  // Default to relative /api for Vercel multi-service rewrites
  return '/api';
};

const API_BASE = getApiBase();

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

class ApiClient {
  private token: string | null = null;
  private onUnauthorized?: () => void;

  setOnUnauthorized(cb: () => void) {
    this.onUnauthorized = cb;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {} } = options;

    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    const reqHeaders: Record<string, string> = { ...headers };
    if (!isFormData) {
      reqHeaders['Content-Type'] = 'application/json';
    }

    const config: RequestInit = {
      method,
      headers: reqHeaders,
      credentials: 'include' as RequestCredentials,
    };

    if (this.token) {
      (config.headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }

    if (body && method !== 'GET') {
      config.body = isFormData ? (body as FormData) : JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE}${endpoint}`, config);
    let data: Record<string, any>;
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch {
        const text = await response.text();
        data = { message: text };
      }
    } else {
      const text = await response.text();
      data = { message: text || `Server error (${response.status})` };
    }

    if (!response.ok) {
      if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
        this.onUnauthorized?.();
      }
      throw new ApiError(data.message || `Request failed (${response.status})`, response.status, data.errors);
    }

    return data as T;
  }

  get<T>(endpoint: string) {
    return this.request<T>(endpoint);
  }

  post<T>(endpoint: string, body?: unknown) {
    return this.request<T>(endpoint, { method: 'POST', body });
  }

  put<T>(endpoint: string, body?: unknown) {
    return this.request<T>(endpoint, { method: 'PUT', body });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  upload<T>(endpoint: string, formData: FormData) {
    return this.request<T>(endpoint, { method: 'POST', body: formData });
  }
}

export class ApiError extends Error {
  status: number;
  errors?: string[];

  constructor(message: string, status: number, errors?: string[]) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

export const api = new ApiClient();

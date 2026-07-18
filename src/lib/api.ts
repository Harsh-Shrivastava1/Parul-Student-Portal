/**
 * Shared API client for the Student Internship Portal.
 * All frontend services must use this client — never call fetch() directly.
 *
 * The Vite dev server proxies /api → http://localhost:5000 (see vite.config.ts)
 */

const BASE = '/api';

type RequestOptions = {
  headers?: Record<string, string>;
};

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  options: RequestOptions = {}
): Promise<T> {
  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  if (body !== undefined) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE}${path}`, config);

  if (!response.ok) {
    let errorMessage = `API error ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch {
      // ignore parse error
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  // All API responses follow { success: boolean, data: T }
  return data.data !== undefined ? data.data : data;
}

export const api = {
  get: <T>(path: string, options?: RequestOptions): Promise<T> =>
    request<T>('GET', path, undefined, options),

  post: <T>(path: string, body: unknown, options?: RequestOptions): Promise<T> =>
    request<T>('POST', path, body, options),

  put: <T>(path: string, body: unknown, options?: RequestOptions): Promise<T> =>
    request<T>('PUT', path, body, options),

  patch: <T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> =>
    request<T>('PATCH', path, body, options),

  delete: <T>(path: string, options?: RequestOptions): Promise<T> =>
    request<T>('DELETE', path, undefined, options),
};

/**
 * HTTP utilities
 */

export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface RequestOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public response?: Response,
    message?: string
  ) {
    super(message || `HTTP ${status}: ${statusText}`);
    this.name = 'ApiError';
  }
}

/**
 * Enhanced fetch with timeout, retries, and error handling
 */
export async function apiRequest<T = any>(
  url: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const {
    timeout = 10000,
    retries = 3,
    retryDelay = 1000,
    ...fetchOptions
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new ApiError(
          response.status,
          response.statusText,
          response,
          `Request failed with status ${response.status}`
        );
      }

      const data = await response.json();
      return {
        data,
        success: true,
      };
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
      }
    }
  }

  throw lastError || new Error('Request failed after all retries');
}

/**
 * GET request helper
 */
export async function get<T = any>(
  url: string,
  options: Omit<RequestOptions, 'method' | 'body'> = {}
): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, { ...options, method: 'GET' });
}

/**
 * POST request helper
 */
export async function post<T = any>(
  url: string,
  data?: any,
  options: Omit<RequestOptions, 'method'> = {}
): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
}

/**
 * PUT request helper
 */
export async function put<T = any>(
  url: string,
  data?: any,
  options: Omit<RequestOptions, 'method'> = {}
): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, {
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
}

/**
 * DELETE request helper
 */
export async function del<T = any>(
  url: string,
  options: Omit<RequestOptions, 'method' | 'body'> = {}
): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, { ...options, method: 'DELETE' });
}

/**
 * CORS middleware for Express
 */
export function cors(req: any, res: any, next: Function) {
  const origin = req.headers.origin || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization,X-API-Key");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    return res.end();
  }
  
  next();
}

/**
 * Request logging middleware
 */
export function requestLogger(req: any, res: any, next: Function) {
  const start = Date.now();
  const { method, url } = req;
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const { statusCode } = res;
    console.log(`${method} ${url} ${statusCode} - ${duration}ms`);
  });
  
  next();
}

/**
 * Error handling middleware
 */
export function errorHandler(err: any, req: any, res: any, next: Function) {
  console.error('Error:', err);
  
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
      errors: [err.message],
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    errors: ['An unexpected error occurred'],
  });
}
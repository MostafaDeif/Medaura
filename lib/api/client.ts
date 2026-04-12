// API Client utility for Backend for Frontend pattern
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:3001";

export interface FetchOptions extends RequestInit {
  token?: string;
  timeout?: number;
}

export class ApiClient {
  private static instance: ApiClient;
  private baseUrl: string;

  private constructor(baseUrl: string = BACKEND_URL) {
    this.baseUrl = baseUrl;
  }

  public static getInstance(baseUrl?: string): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient(baseUrl);
    }
    return ApiClient.instance;
  }

  private async fetchWithTimeout(
    url: string,
    options: FetchOptions = {}
  ): Promise<Response> {
    const { timeout = 30000, token, ...fetchOptions } = options;

    const headers = new Headers(fetchOptions.headers);
    const body = fetchOptions.body;

    if (!(body instanceof FormData) && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        signal: controller.signal,
      });
      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  public async get<T = any>(
    endpoint: string,
    options?: FetchOptions
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await this.fetchWithTimeout(url, {
      method: "GET",
      ...options,
    });
    return this.handleResponse<T>(response);
  }

  private serializeBody(body: any) {
    if (body instanceof FormData) {
      return body;
    }

    if (body === undefined) {
      return undefined;
    }

    return JSON.stringify(body);
  }

  public async post<T = any>(
    endpoint: string,
    body?: any,
    options?: FetchOptions
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await this.fetchWithTimeout(url, {
      method: "POST",
      body: this.serializeBody(body),
      ...options,
    });
    return this.handleResponse<T>(response);
  }

  public async put<T = any>(
    endpoint: string,
    body?: any,
    options?: FetchOptions
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await this.fetchWithTimeout(url, {
      method: "PUT",
      body: this.serializeBody(body),
      ...options,
    });
    return this.handleResponse<T>(response);
  }

  public async patch<T = any>(
    endpoint: string,
    body?: any,
    options?: FetchOptions
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await this.fetchWithTimeout(url, {
      method: "PATCH",
      body: this.serializeBody(body),
      ...options,
    });
    return this.handleResponse<T>(response);
  }

  public async delete<T = any>(
    endpoint: string,
    options?: FetchOptions
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await this.fetchWithTimeout(url, {
      method: "DELETE",
      ...options,
    });
    return this.handleResponse<T>(response);
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get("content-type");
    const isJson = contentType?.includes("application/json");

    let data: any;

    try {
      data = isJson ? await response.json() : await response.text();
    } catch (error) {
      throw new Error(`Failed to parse response: ${error}`);
    }

    if (!response.ok) {
      const error = new Error(
        data?.message || data?.error || response.statusText
      );
      (error as any).status = response.status;
      (error as any).data = data;
      throw error;
    }

    return data as T;
  }

  public setBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl;
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }
}

export const apiClient = ApiClient.getInstance();

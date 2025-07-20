// apps/web/src/services/api.ts
import type { Dog, CreateDogRequest, ApiResponse } from '@fetch/shared';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Custom error type (not a class)
export interface ApiError {
  name: 'ApiError';
  status: number;
  message: string;
}

const createApiError = (status: number, message: string): ApiError => ({
  name: 'ApiError',
  status,
  message,
});

export const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    error.name === 'ApiError'
  );
};

const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE}${endpoint}`;

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw createApiError(
        response.status,
        errorData.message || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    if (isApiError(error)) {
      throw error;
    }

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    throw createApiError(0, `Network error: ${errorMessage}`);
  }
};

export const dogApi = {
  // Get all dogs
  getAll: (): Promise<ApiResponse<Dog[]>> => {
    return apiRequest<ApiResponse<Dog[]>>('/dogs');
  },

  // Get dog by ID
  getById: (id: string): Promise<ApiResponse<Dog>> => {
    return apiRequest<ApiResponse<Dog>>(`/dogs/${id}`);
  },

  // Create new dog
  create: (dog: CreateDogRequest): Promise<ApiResponse<Dog>> => {
    return apiRequest<ApiResponse<Dog>>('/dogs', {
      method: 'POST',
      body: JSON.stringify(dog),
    });
  },

  // Health check
  health: (): Promise<{ status: string; message: string }> => {
    return apiRequest<{ status: string; message: string }>('/health');
  },
} as const;

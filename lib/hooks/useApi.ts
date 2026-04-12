import { useState, useCallback } from "react";

export interface UseApiOptions {
  initialData?: any;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export interface UseApiResult<T = any> {
  data: T | null;
  loading: boolean;
  error: any | null;
  execute: (
    url: string,
    options?: RequestInit
  ) => Promise<T | null>;
}

/**
 * Custom hook for making API calls to the BFF
 *
 * @example
 * const { data, loading, error, execute } = useApi();
 *
 * // Fetch data
 * useEffect(() => {
 *   execute("/api/doctors/list?specialist=عظام");
 * }, [execute]);
 *
 * // Manual execute with POST
 * const handleCreate = async () => {
 *   const result = await execute("/api/bookings/create", {
 *     method: "POST",
 *     headers: { Authorization: `Bearer ${token}` },
 *     body: JSON.stringify(bookingData),
 *   });
 * };
 */
export function useApi<T = any>(
  options: UseApiOptions = {}
): UseApiResult<T> {
  const [data, setData] = useState<T | null>(options.initialData || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any | null>(null);

  const execute = useCallback(
    async (url: string, fetchOptions?: RequestInit): Promise<T | null> => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(url, {
          ...fetchOptions,
          headers: {
            "Content-Type": "application/json",
            ...fetchOptions?.headers,
          },
        });

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || "API request failed");
        }

        setData(result.data);
        options.onSuccess?.(result.data);

        return result.data as T;
      } catch (err: any) {
        setError(err);
        options.onError?.(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [options]
  );

  return { data, loading, error, execute };
}

import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/http';
import type { components } from '@/lib/types/openapi';

// Type aliases for better readability
type BookListResponse = components['schemas']['BookListResponse'];

// Query key factory following the factory pattern
export const bookKeys = {
  all: () => ['books'] as const,
  lists: () => [...bookKeys.all(), 'list'] as const,
  list: (page: number, pageSize: number) => [...bookKeys.lists(), { page, pageSize }] as const,
};

/**
 * Hook to fetch paginated list of books
 * @param page - Page number (1-indexed)
 * @param pageSize - Number of items per page
 * @returns Query result with book list and pagination info
 */
export function useBooks(page = 1, pageSize = 10) {
  return useQuery({
    queryKey: bookKeys.list(page, pageSize),
    queryFn: async () => {
      const response = await client.GET<BookListResponse>(
        `/api/books?page=${page}&pageSize=${pageSize}`
      );
      return response.data;
    },
  });
}

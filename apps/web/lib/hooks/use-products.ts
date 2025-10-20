import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import type { Product, ProductResponse, ProductsResponse, PagedResult } from '@/lib/types/api'
import { toPagedResult } from '@/lib/types/api'

export const productKeys = {
  all: () => ['products'] as const,
  list: (page: number, pageSize: number) => [...productKeys.all(), 'list', { page, pageSize }] as const,
  detail: (code: string) => [...productKeys.all(), 'detail', code] as const,
}

const mapProduct = (payload: ProductResponse): Product => payload as Product

const mapProducts = (payload: ProductsResponse): PagedResult<Product> =>
  toPagedResult(payload, (item) => item as Product)

export const useProducts = (page = 1, pageSize = 10) =>
  useQuery({
    queryKey: productKeys.list(page, pageSize),
    queryFn: async () => {
      const searchParams = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      })

      const response = await apiClient.get<ProductsResponse>(`/api/products?${searchParams.toString()}`)
      return mapProducts(response)
    },
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  })

export const useProduct = (code: string | null | undefined) =>
  useQuery({
    queryKey: code ? productKeys.detail(code) : productKeys.detail(''),
    queryFn: async () => {
      if (!code) {
        return null
      }
      const response = await apiClient.get<ProductResponse>(`/api/products/${encodeURIComponent(code)}`)
      return mapProduct(response)
    },
    enabled: !!code,
  })

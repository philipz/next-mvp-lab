import type { Product } from '@/lib/types/api'
import { ProductCard } from './product-card'

interface ProductGridProps {
  products: Product[]
  onBuy: (code: string) => void
  loading?: boolean
}

export function ProductGrid({ products, onBuy, loading = false }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={`skeleton-${index}`}
            className="h-full flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm animate-pulse"
          >
            {/* Skeleton image */}
            <div className="h-80 w-full bg-gray-200 rounded-t-lg" />
            {/* Skeleton content */}
            <div className="p-4 flex-grow space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="h-5 bg-gray-200 rounded w-1/4" />
            </div>
            {/* Skeleton button */}
            <div className="p-4 pt-0">
              <div className="h-10 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No books available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {products.map((product) => (
        <ProductCard key={product.code} product={product} onBuy={onBuy} />
      ))}
    </div>
  );
}

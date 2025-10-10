import type { components } from '@/lib/types/openapi';
import { ProductCard } from './product-card';

type Book = components['schemas']['Book'];

interface ProductGridProps {
  books: Book[];
  onBuy: (code: string) => void;
  loading?: boolean;
}

/**
 * ProductGrid component displays a responsive grid of book cards
 * Layout: 1 column on mobile, 3 columns on tablet, 5 columns on desktop
 * @param books - Array of books to display
 * @param onBuy - Callback function triggered when Buy button is clicked
 * @param loading - Optional loading state to show skeleton UI
 */
export function ProductGrid({ books, onBuy, loading = false }: ProductGridProps) {
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

  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No books available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {books.map((book) => (
        <ProductCard key={book.code} book={book} onBuy={onBuy} />
      ))}
    </div>
  );
}

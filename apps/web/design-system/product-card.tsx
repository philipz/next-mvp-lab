import Image from 'next/image';
import type { components } from '@/lib/types/openapi';

type Book = components['schemas']['Book'];

interface ProductCardProps {
  book: Book;
  onBuy: (code: string) => void;
}

/**
 * ProductCard component displays a single book with cover image, details, and Buy button
 * @param book - Book object with code, name, author, price, imageUrl
 * @param onBuy - Callback function triggered when Buy button is clicked
 */
export function ProductCard({ book, onBuy }: ProductCardProps) {
  return (
    <div className="card h-full flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      {/* Book Cover Image */}
      <div className="relative h-80 w-full">
        <Image
          src={book.imageUrl}
          alt={`Cover of ${book.name}`}
          fill
          className="object-cover rounded-t-lg"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
          loading="lazy"
        />
      </div>

      {/* Book Details */}
      <div className="card-body p-4 flex-grow">
        <h6
          className="card-title text-base font-semibold text-gray-900 line-clamp-2 mb-2"
          title={book.name}
        >
          {book.name}
        </h6>
        <p className="text-sm text-gray-600 mb-1">{book.author}</p>
        <p className="text-lg font-bold text-gray-900">
          ${book.price.toFixed(2)}
        </p>
      </div>

      {/* Buy Button */}
      <div className="card-footer p-4 pt-0">
        <button
          onClick={() => onBuy(book.code)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
          aria-label={`Buy ${book.name}`}
        >
          Buy
        </button>
      </div>
    </div>
  );
}

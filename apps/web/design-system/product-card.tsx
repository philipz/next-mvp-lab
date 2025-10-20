import Image from 'next/image'
import type { Product } from '@/lib/types/api'

interface ProductCardProps {
  product: Product
  onBuy: (code: string) => void
}

export function ProductCard({ product, onBuy }: ProductCardProps) {
  const displayImage = product.imageUrl ?? '/images/books.png'

  return (
    <div className="card h-full flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-80 w-full">
        <Image
          src={displayImage}
          alt={product.name}
          fill
          className="object-cover rounded-t-lg"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
          loading="lazy"
        />
      </div>

      <div className="card-body p-4 flex-grow">
        <h6 className="card-title text-base font-semibold text-gray-900 line-clamp-2 mb-2" title={product.name}>
          {product.name}
        </h6>
        {product.description ? (
          <p className="text-sm text-gray-600 mb-1 line-clamp-2">{product.description}</p>
        ) : null}
        <p className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</p>
      </div>

      <div className="card-footer p-4 pt-0">
        <button
          onClick={() => onBuy(product.code)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
          aria-label={`Buy ${product.name}`}
        >
          Buy
        </button>
      </div>
    </div>
  )
}

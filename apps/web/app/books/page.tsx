'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useBooks } from '@/features/books/api/queries'
import { useAddToCart } from '@/features/cart/api/queries'
import { ProductGrid } from '@/design-system/product-grid'
import { Pagination } from '@/design-system/pagination'

const PAGE_SIZE = 10

export default function BooksPage() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)

  const { data, isLoading, isError, error } = useBooks(currentPage, PAGE_SIZE)
  const addToCart = useAddToCart()

  const handleBuy = async (code: string) => {
    try {
      await addToCart.mutateAsync({ code, quantity: 1 })
      // Redirect to cart page on success
      router.push('/cart')
    } catch (err) {
      console.error('Failed to add to cart:', err)
      // Error handling - could show a toast/alert here
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Optionally scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Books</h1>
        <ProductGrid products={[]} onBuy={handleBuy} loading />
      </div>
    )
  }

  // Error state
  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Books</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700">
            Failed to load books. Please try again later.
          </p>
          {error && (
            <p className="text-sm text-red-600 mt-2">
              Error: {error instanceof Error ? error.message : 'Unknown error'}
            </p>
          )}
        </div>
      </div>
    )
  }

  const products = data?.data ?? []
  const totalPages = data?.totalPages ?? 0

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Books</h1>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <p className="text-blue-700">No books available at the moment.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Books</h1>

      <ProductGrid products={products} onBuy={handleBuy} loading={addToCart.isPending} />

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  )
}

'use client'

import Link from 'next/link'
import { useOrders } from '@/features/orders/api/queries'

export default function OrdersPage() {
  const { data, isLoading, isError, error } = useOrders()

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32" />
                  <div className="h-3 bg-gray-200 rounded w-24" />
                </div>
                <div className="h-6 bg-gray-200 rounded w-20" />
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-48" />
                <div className="h-3 bg-gray-200 rounded w-36" />
                <div className="h-4 bg-gray-200 rounded w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Error state
  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-red-800 mb-2">
            Unable to load orders
          </h3>
          <p className="text-red-600">
            {error instanceof Error ? error.message : 'An error occurred while loading your orders.'}
          </p>
        </div>
      </div>
    )
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">You haven't placed any orders yet.</p>
          <Link
            href="/books"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
      
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((order) => (
              <tr key={order.orderNumber} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    href={`/orders/${order.orderNumber}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    order.status === 'NEW'
                      ? 'bg-yellow-100 text-yellow-800'
                      : order.status === 'IN_PROCESS'
                      ? 'bg-blue-100 text-blue-800'
                      : order.status === 'DELIVERED'
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'CANCELLED'
                      ? 'bg-gray-200 text-gray-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

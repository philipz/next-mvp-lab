'use client'

import Link from 'next/link'
import { useOrder } from '@/features/orders/api/queries'

interface OrderDetailPageProps {
  params: {
    orderNumber: string
  }
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { orderNumber } = params
  const { data: order, isLoading, isError, error } = useOrder(orderNumber)

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/orders"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            ← Back to Orders
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-6">Order Details</h1>
        
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading order details...</span>
        </div>
      </div>
    )
  }

  // Error state
  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/orders"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            ← Back to Orders
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-6">Order Details</h1>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-red-800 mb-2">
            Order not found
          </h3>
          <p className="text-red-600">
            {error instanceof Error ? error.message : 'The requested order could not be found.'}
          </p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/orders"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            ← Back to Orders
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-6">Order Details</h1>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-700">Order details not available.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/orders"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          ← Back to Orders
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Order Details</h1>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Order Information</h2>
        </div>
        
        <div className="px-6 py-4 space-y-4">
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Order Number</dt>
              <dd className="text-lg font-mono">{order.orderNumber}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    order.status === 'NEW'
                      ? 'bg-yellow-100 text-yellow-800'
                      : order.status === 'IN_PROCESS'
                      ? 'bg-blue-100 text-blue-800'
                      : order.status === 'DELIVERED'
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'CANCELLED'
                      ? 'bg-gray-200 text-gray-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {order.status}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Order Date</dt>
              <dd>{new Date(order.createdAt).toLocaleDateString()}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Total Amount</dt>
              <dd className="text-lg font-semibold">${(order.totalAmount ?? 0).toFixed(2)}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-6 bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Customer Information</h2>
        </div>
        
        <div className="px-6 py-4 space-y-4">
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd>{order.customer.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd>{order.customer.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd>{order.customer.phone}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Delivery Address</dt>
              <dd>{order.deliveryAddress}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-6 bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Items</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[order.item]
                .filter(Boolean)
                .map((item, index) => (
                <tr key={`${item!.code}-${index}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{item!.name}</div>
                    <div className="text-sm text-gray-500">Code: {item!.code}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    ${(item!.price ?? 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    {item!.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                    ${((item!.price ?? 0) * (item!.quantity ?? 0)).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

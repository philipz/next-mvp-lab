import { components } from '@/lib/types/openapi'

type Cart = components['schemas']['Cart']

export interface CartTableProps {
  cart: Cart | null
  onQuantityChange: (code: string, quantity: number) => void
  loading?: boolean
}

export function CartTable({ cart, onQuantityChange, loading }: CartTableProps) {
  // Loading state
  if (loading) {
    return (
      <div className="col-md-8 offset-md-2">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading cart...</span>
        </div>
      </div>
    )
  }

  // Error state (cart is null)
  if (cart === null) {
    return (
      <div className="col-md-8 offset-md-2">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium text-gray-900">
            We couldn&apos;t load your cart right now.{' '}
            <a href="/" className="text-blue-600 hover:text-blue-800 underline">
              Continue shopping
            </a>
          </h3>
        </div>
      </div>
    )
  }

  // Empty cart state (cart.item is null or undefined)
  if (!cart.item) {
    return (
      <div className="col-md-8 offset-md-2">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium text-gray-900">
            Your cart is empty.{' '}
            <a href="/" className="text-blue-600 hover:text-blue-800 underline">
              Continue shopping
            </a>
          </h3>
        </div>
      </div>
    )
  }

  // Cart has items
  const item = cart.item
  const subtotal = item.price * item.quantity

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value, 10)
    if (newQuantity > 0) {
      onQuantityChange(item.code, newQuantity)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Mobile-friendly card layout on small screens, table on larger screens */}
      <div className="hidden md:block">
        <table className="table w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th scope="col" className="text-left py-3 px-4 font-semibold text-gray-700">
                Product Name
              </th>
              <th scope="col" className="text-left py-3 px-4 font-semibold text-gray-700">
                Price
              </th>
              <th scope="col" className="text-left py-3 px-4 font-semibold text-gray-700">
                Quantity
              </th>
              <th scope="col" className="text-left py-3 px-4 font-semibold text-gray-700">
                Sub Total
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-3 px-4">
                <span>{item.name}</span>
              </td>
              <td className="py-3 px-4">
                <span>${item.price.toFixed(2)}</span>
              </td>
              <td className="py-3 px-4">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={handleQuantityChange}
                  aria-label="Update quantity"
                  className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </td>
              <td className="py-3 px-4">
                <span>${subtotal.toFixed(2)}</span>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th colSpan={3} className="py-3 px-4"></th>
              <th colSpan={1} className="py-3 px-4 text-left font-semibold text-gray-900">
                Total Amount: <span>${cart.totalAmount.toFixed(2)}</span>
              </th>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Mobile card layout */}
      <div className="md:hidden">
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">{item.name}</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Price:</span>
              <span className="font-medium">${item.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Quantity:</span>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={handleQuantityChange}
                aria-label="Update quantity"
                className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Sub Total:</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total Amount:</span>
            <span>${cart.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

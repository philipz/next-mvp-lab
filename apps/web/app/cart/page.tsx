'use client'

import { useRouter } from 'next/navigation'
import { useCart, useUpdateCart } from '@/features/cart/api/queries'
import { useCreateOrder } from '@/features/orders/api/queries'
import { CartTable } from '@/design-system/cart-table'
import { OrderForm } from '@/design-system/order-form'
import type { components } from '@/lib/types/openapi'

type OrderFormData = components['schemas']['OrderFormData']

export default function CartPage() {
  const router = useRouter()
  const { data: cart, isLoading: cartLoading, isError: cartError } = useCart()
  const updateCart = useUpdateCart()
  const createOrder = useCreateOrder()

  const handleQuantityChange = async (code: string, quantity: number) => {
    try {
      await updateCart.mutateAsync({ code, quantity })
    } catch (error) {
      console.error('Failed to update cart:', error)
      // Error handling - could show a toast/alert here
    }
  }

  const handleOrderSubmit = async (orderData: OrderFormData) => {
    try {
      const order = await createOrder.mutateAsync(orderData)
      // Redirect to orders page or order confirmation on success
      router.push('/orders')
    } catch (error) {
      console.error('Failed to create order:', error)
      throw error // Re-throw to let OrderForm handle the error display
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      
      <div className="space-y-8">
        {/* Cart Table */}
        <CartTable
          cart={cart || null}
          onQuantityChange={handleQuantityChange}
          loading={cartLoading}
        />
        
        {/* Order Form - only show if cart has items */}
        {cart?.item && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Place Your Order</h2>
            <OrderForm
              onSubmit={handleOrderSubmit}
              loading={createOrder.isPending}
            />
          </div>
        )}
      </div>
    </div>
  )
}
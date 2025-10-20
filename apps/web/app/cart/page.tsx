'use client'

import { useRouter } from 'next/navigation'
import { useCart, useUpdateCart } from '@/features/cart/api/queries'
import { useCreateOrder } from '@/features/orders/api/queries'
import { CartTable } from '@/design-system/cart-table'
import { OrderForm } from '@/design-system/order-form'
import type { OrderFormData } from '@/design-system/order-form'
import type { CreateOrderRequest } from '@/lib/types/api'

export default function CartPage() {
  const router = useRouter()
  const { data: cart, isLoading: cartLoading } = useCart()
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
    const cartItem = cart?.items?.[0]
    const { customer, deliveryAddress } = orderData

    if (
      !cartItem ||
      !cartItem.code ||
      !cartItem.name ||
      cartItem.price === undefined ||
      cartItem.price === null ||
      cartItem.quantity === undefined ||
      cartItem.quantity === null
    ) {
      console.error('Cannot submit order because the cart item is missing required information', cartItem)
      return
    }

    if (!customer?.name || !customer.email || !customer.phone || !deliveryAddress) {
      console.error('Cannot submit order because customer information is incomplete', customer)
      return
    }

    const orderPayload: CreateOrderRequest = {
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      },
      deliveryAddress,
      item: {
        code: cartItem.code,
        name: cartItem.name,
        price: Number(cartItem.price),
        quantity: cartItem.quantity,
      },
    }

    try {
      await createOrder.mutateAsync(orderPayload)
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
        {(cart?.items?.length ?? 0) > 0 && (
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

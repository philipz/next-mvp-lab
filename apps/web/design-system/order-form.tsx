'use client'

import { useState } from 'react'
import { z } from 'zod'

// Zod validation schema
const orderFormSchema = z.object({
  customer: z.object({
    name: z.string().min(1, 'Customer name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(1, 'Phone number is required'),
  }),
  deliveryAddress: z.string().min(1, 'Delivery address is required'),
})

export type OrderFormData = z.infer<typeof orderFormSchema>

export interface OrderFormProps {
  onSubmit: (data: OrderFormData) => Promise<void>
  loading?: boolean
}

interface FormErrors {
  'customer.name'?: string
  'customer.email'?: string
  'customer.phone'?: string
  deliveryAddress?: string
}

export function OrderForm({ onSubmit, loading = false }: OrderFormProps) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    deliveryAddress: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error for this field when user starts typing
    const errorKey = name.replace('customer', 'customer.') as keyof FormErrors
    if (errors[errorKey]) {
      setErrors((prev) => ({
        ...prev,
        [errorKey]: undefined,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Prepare data for validation
    const dataToValidate = {
      customer: {
        name: formData.customerName,
        email: formData.customerEmail,
        phone: formData.customerPhone,
      },
      deliveryAddress: formData.deliveryAddress,
    }

    // Validate with Zod
    const result = orderFormSchema.safeParse(dataToValidate)

    if (!result.success) {
      // Extract errors from Zod
      const newErrors: FormErrors = {}
      result.error.errors.forEach((err) => {
        const path = err.path.join('.')
        newErrors[path as keyof FormErrors] = err.message
      })
      setErrors(newErrors)
      return
    }

    // Submit the form
    setIsSubmitting(true)
    try {
      await onSubmit(result.data)
      // Reset form on success
      setFormData({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        deliveryAddress: '',
      })
      setErrors({})
    } catch (error) {
      // Error handling is done by parent component
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isLoading = loading || isSubmitting

  return (
    <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
      <div className="col-span-1">
        <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
          Customer Name <span className="text-red-600" aria-hidden="true">*</span>
        </label>
        <input
          type="text"
          id="customerName"
          name="customerName"
          value={formData.customerName}
          onChange={handleChange}
          required
          aria-required="true"
          aria-invalid={!!errors['customer.name']}
          aria-describedby={errors['customer.name'] ? 'customerNameError' : undefined}
          className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors['customer.name'] ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors['customer.name'] && (
          <div id="customerNameError" className="mt-1 text-sm text-red-600">
            {errors['customer.name']}
          </div>
        )}
      </div>

      <div className="col-span-1">
        <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-1">
          Customer Email <span className="text-red-600" aria-hidden="true">*</span>
        </label>
        <input
          type="email"
          id="customerEmail"
          name="customerEmail"
          value={formData.customerEmail}
          onChange={handleChange}
          required
          aria-required="true"
          aria-invalid={!!errors['customer.email']}
          aria-describedby={errors['customer.email'] ? 'customerEmailError' : undefined}
          className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors['customer.email'] ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors['customer.email'] && (
          <div id="customerEmailError" className="mt-1 text-sm text-red-600">
            {errors['customer.email']}
          </div>
        )}
      </div>

      <div className="col-span-1">
        <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-1">
          Customer Phone <span className="text-red-600" aria-hidden="true">*</span>
        </label>
        <input
          type="text"
          id="customerPhone"
          name="customerPhone"
          value={formData.customerPhone}
          onChange={handleChange}
          required
          aria-required="true"
          aria-invalid={!!errors['customer.phone']}
          aria-describedby={errors['customer.phone'] ? 'customerPhoneError' : undefined}
          className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors['customer.phone'] ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors['customer.phone'] && (
          <div id="customerPhoneError" className="mt-1 text-sm text-red-600">
            {errors['customer.phone']}
          </div>
        )}
      </div>

      <div className="col-span-1">
        <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700 mb-1">
          Delivery Address <span className="text-red-600" aria-hidden="true">*</span>
        </label>
        <input
          type="text"
          id="deliveryAddress"
          name="deliveryAddress"
          value={formData.deliveryAddress}
          onChange={handleChange}
          required
          aria-required="true"
          aria-invalid={!!errors.deliveryAddress}
          aria-describedby={errors.deliveryAddress ? 'deliveryAddressError' : undefined}
          className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.deliveryAddress ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.deliveryAddress && (
          <div id="deliveryAddressError" className="mt-1 text-sm text-red-600">
            {errors.deliveryAddress}
          </div>
        )}
      </div>

      <div className="col-span-full">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Placing Order...' : 'Place Order'}
        </button>
      </div>
    </form>
  )
}

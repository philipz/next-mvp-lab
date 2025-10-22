import { http, HttpResponse, delay, type PathParams } from 'msw'
import type {
  Product,
  Cart,
  CartItem,
  AddToCartRequest,
  UpdateQuantityRequest,
  OrderSummary,
  OrderDetail,
  CreateOrderRequest,
  CreateOrderResponse,
} from '@/lib/types/api'
import { HttpError } from '@/lib/api/errors'
import type { components } from '@/lib/types/openapi'

type OrderItem = components['schemas']['OrderItem']

const NETWORK_DELAY_MS = 300

const mockProducts: Product[] = [
  {
    code: 'book-001',
    name: 'A Game of Thrones',
    description: 'The first book in A Song of Ice and Fire series.',
    imageUrl: 'https://images.gr-assets.com/books/1436732693l/13496.jpg',
    price: 32.0,
  },
  {
    code: 'book-002',
    name: 'A Thousand Splendid Suns',
    description: 'A powerful friendship forged in Afghanistan.',
    imageUrl: 'https://images.gr-assets.com/books/1345958969l/128029.jpg',
    price: 15.5,
  },
  {
    code: 'book-003',
    name: "Charlotte's Web",
    description: 'A classic children’s tale about friendship.',
    imageUrl: 'https://images.gr-assets.com/books/1439632243l/24178.jpg',
    price: 14.0,
  },
  {
    code: 'book-004',
    name: 'Fifty Shades of Grey',
    description: 'A modern romance phenomenon.',
    imageUrl: 'https://images.gr-assets.com/books/1385207843l/10818853.jpg',
    price: 27.0,
  },
  {
    code: 'book-005',
    name: 'Gone with the Wind',
    description: 'An epic historical romance.',
    imageUrl: 'https://images.gr-assets.com/books/1328025229l/18405.jpg',
    price: 44.5,
  },
  {
    code: 'book-006',
    name: "One Flew Over the Cuckoo's Nest",
    description: 'A battle of wills within a psychiatric hospital.',
    imageUrl: 'https://images.gr-assets.com/books/1516211014l/332613.jpg',
    price: 23.0,
  },
  {
    code: 'book-007',
    name: 'The Alchemist',
    description: 'A journey of self-discovery and destiny.',
    imageUrl: 'https://images.gr-assets.com/books/1483412266l/865.jpg',
    price: 12.0,
  },
  {
    code: 'book-008',
    name: 'The Book Thief',
    description: 'Hope and words in the midst of war-torn Germany.',
    imageUrl: 'https://images.gr-assets.com/books/1522157426l/19063.jpg',
    price: 30.0,
  },
  {
    code: 'book-009',
    name: 'The Chronicles of Narnia',
    description: 'Classic tales from the magical world of Narnia.',
    imageUrl: 'https://images.gr-assets.com/books/1449868701l/11127.jpg',
    price: 44.5,
  },
  {
    code: 'book-010',
    name: 'The Da Vinci Code',
    description: 'A symbologist unravels a secret society mystery.',
    imageUrl: 'https://images.gr-assets.com/books/1303252999l/968.jpg',
    price: 14.5,
  },
]

let cartItems: CartItem[] = []
const orders: OrderDetail[] = []

const resolveParam = (value: string | readonly string[] | undefined): string | undefined => {
  if (Array.isArray(value)) {
    return value[0]
  }
  return typeof value === 'string' ? value : undefined
}

const getCart = (): Cart => {
  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 0), 0)
  const itemCount = cartItems.reduce((sum, item) => sum + (item.quantity ?? 0), 0)
  return {
    items: cartItems,
    totalAmount,
    itemCount,
  }
}

const ensureCartHasItem = (code: string): CartItem | undefined => cartItems.find((item) => item.code === code)

const upsertCartItem = (product: Product, quantity: number) => {
  const existing = ensureCartHasItem(product.code)
  if (existing) {
    existing.quantity = quantity
    existing.subtotal = product.price * quantity
    existing.price = product.price
    existing.name = product.name
    return
  }

  cartItems = [
    ...cartItems,
    {
      code: product.code,
      name: product.name,
      price: product.price,
      quantity,
      subtotal: product.price * quantity,
    },
  ]
}

const removeCartItem = (code: string) => {
  cartItems = cartItems.filter((item) => item.code !== code)
}

const createOrder = (request: CreateOrderRequest): OrderDetail => {
  const cart = getCart()
  if (!cart.items || cart.items.length === 0) {
    throw new HttpError(400, 'Cart is empty')
  }

  const [firstItem] = cart.items
  if (!firstItem) {
    throw new HttpError(400, 'Cart is empty')
  }

  const orderNumber = `ORD-${Date.now()}`
  const order: OrderDetail = {
    orderNumber,
    status: 'NEW',
    customer: request.customer,
    deliveryAddress: request.deliveryAddress,
    item: toOrderItem(firstItem),
    createdAt: new Date().toISOString(),
    totalAmount: cart.totalAmount,
  }

  orders.push(order)
  cartItems = []

  return order
}

const buildOrderSummary = (order: OrderDetail): OrderSummary => ({
  orderNumber: order.orderNumber,
  status: order.status,
  customer: order.customer,
})

const simulateLatency = async () => delay(NETWORK_DELAY_MS)

const toOrderItem = (item: CartItem): OrderItem => ({
  code: item.code ?? 'unknown',
  name: item.name ?? 'Unknown product',
  price: item.price ?? 0,
  quantity: item.quantity ?? 0,
})

export const handlers = [
  http.get('/api/products', async ({ request }: { request: Request }) => {
    await simulateLatency()
    const url = new URL(request.url)
    const page = Math.max(parseInt(url.searchParams.get('page') || '1', 10), 1)
    const pageSize = Math.max(parseInt(url.searchParams.get('pageSize') || '10', 10), 1)

    const startIndex = (page - 1) * pageSize
    const data = mockProducts.slice(startIndex, startIndex + pageSize)
    const totalElements = mockProducts.length
    const totalPages = Math.max(Math.ceil(totalElements / pageSize), 1)

    const response = {
      data,
      totalElements,
      pageNumber: page,
      totalPages,
      isFirst: page <= 1,
      isLast: page >= totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    }

    return HttpResponse.json(response)
  }),

  http.get('/api/products/:code', async ({ params }: { params: PathParams<'code'> }) => {
    await simulateLatency()
    const code = resolveParam(params.code)
    const product = mockProducts.find((item) => item.code === code)
    if (!product) {
      return HttpResponse.json({ message: 'Product not found' }, { status: 404 })
    }
    return HttpResponse.json(product)
  }),

  http.get('/api/cart', async () => {
    await simulateLatency()
    return HttpResponse.json(getCart())
  }),

  http.post('/api/cart/items', async ({ request }: { request: Request }) => {
    await simulateLatency()
    const body = (await request.json()) as AddToCartRequest
    const product = mockProducts.find((item) => item.code === body.code)

    if (!product) {
      return HttpResponse.json({ message: 'Product not found' }, { status: 404 })
    }

    const toAdd = Math.max(body.quantity ?? 1, 1)
    const existing = ensureCartHasItem(product.code)
    const newQuantity = (existing?.quantity ?? 0) + toAdd
    upsertCartItem(product, newQuantity)

    return HttpResponse.json(getCart(), { status: 201 })
  }),

  http.put('/api/cart/items/:code', async ({ params, request }: { params: PathParams<'code'>; request: Request }) => {
    await simulateLatency()
    const code = resolveParam(params.code)
    const body = (await request.json()) as UpdateQuantityRequest
    const quantity = Math.max(body.quantity, 1)

    if (!code) {
      return HttpResponse.json({ message: 'Cart item not found' }, { status: 404 })
    }

    const product = mockProducts.find((item) => item.code === code)
    if (!product || !ensureCartHasItem(code)) {
      return HttpResponse.json({ message: 'Cart item not found' }, { status: 404 })
    }

    upsertCartItem(product, quantity)
    return HttpResponse.json(getCart())
  }),

  http.delete('/api/cart/items/:code', async ({ params }: { params: PathParams<'code'> }) => {
    await simulateLatency()
    const code = resolveParam(params.code)
    if (!code || !ensureCartHasItem(code)) {
      return HttpResponse.json({ message: 'Cart item not found' }, { status: 404 })
    }

    removeCartItem(code)
    return HttpResponse.json(getCart(), { status: 200 })
  }),

  http.get('/api/orders', async ({ request }: { request: Request }) => {
    await simulateLatency()
    const url = new URL(request.url)
    if (url.searchParams.get('simulate') === 'error') {
      return HttpResponse.json({ message: 'Orders service unavailable' }, { status: 500 })
    }

    const summaries = orders.map(buildOrderSummary)
    return HttpResponse.json(summaries)
  }),

  http.get('/api/orders/:orderNumber', async ({ params }: { params: PathParams<'orderNumber'> }) => {
    await simulateLatency()
    const orderNumber = resolveParam(params.orderNumber)
    const order = orders.find((item) => item.orderNumber === orderNumber)

    if (!order) {
      return HttpResponse.json({ message: 'Order not found' }, { status: 404 })
    }

    return HttpResponse.json(order)
  }),

  http.post('/api/orders', async ({ request }: { request: Request }) => {
    await simulateLatency()
    const body = (await request.json()) as CreateOrderRequest

    if (!body.customer?.name || !body.customer.email || !body.customer.phone || !body.deliveryAddress) {
      return HttpResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    try {
      const order = createOrder(body)
      const payload: CreateOrderResponse = { orderNumber: order.orderNumber }
      return HttpResponse.json(payload, { status: 201 })
    } catch (error) {
      if (error instanceof HttpError) {
        return HttpResponse.json({ message: error.message }, { status: error.status })
      }
      return HttpResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
  }),
]

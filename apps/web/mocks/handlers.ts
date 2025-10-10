import { http, HttpResponse } from 'msw';

// Mock book data based on sample HTML files
// Using real book cover images from Goodreads
const mockBooks = [
  {
    code: 'book-001',
    name: 'A Game of Thrones',
    author: 'George R.R. Martin',
    price: 32.0,
    imageUrl: 'https://images.gr-assets.com/books/1436732693l/13496.jpg'
  },
  {
    code: 'book-002',
    name: 'A Thousand Splendid Suns',
    author: 'Khaled Hosseini',
    price: 15.50,
    imageUrl: 'https://images.gr-assets.com/books/1345958969l/128029.jpg'
  },
  {
    code: 'book-003',
    name: "Charlotte's Web",
    author: 'E.B. White',
    price: 14.00,
    imageUrl: 'https://images.gr-assets.com/books/1439632243l/24178.jpg'
  },
  {
    code: 'book-004',
    name: 'Fifty Shades of Grey',
    author: 'E.L. James',
    price: 27.00,
    imageUrl: 'https://images.gr-assets.com/books/1385207843l/10818853.jpg'
  },
  {
    code: 'book-005',
    name: 'Gone with the Wind',
    author: 'Margaret Mitchell',
    price: 44.50,
    imageUrl: 'https://images.gr-assets.com/books/1328025229l/18405.jpg'
  },
  {
    code: 'book-006',
    name: 'One Flew Over the Cuckoo\'s Nest',
    author: 'Ken Kesey',
    price: 23.00,
    imageUrl: 'https://images.gr-assets.com/books/1516211014l/332613.jpg'
  },
  {
    code: 'book-007',
    name: 'The Alchemist',
    author: 'Paulo Coelho',
    price: 12.00,
    imageUrl: 'https://images.gr-assets.com/books/1483412266l/865.jpg'
  },
  {
    code: 'book-008',
    name: 'The Book Thief',
    author: 'Markus Zusak',
    price: 30.00,
    imageUrl: 'https://images.gr-assets.com/books/1522157426l/19063.jpg'
  },
  {
    code: 'book-009',
    name: 'The Chronicles of Narnia',
    author: 'C.S. Lewis',
    price: 44.50,
    imageUrl: 'https://images.gr-assets.com/books/1449868701l/11127.jpg'
  },
  {
    code: 'book-010',
    name: 'The Da Vinci Code',
    author: 'Dan Brown',
    price: 14.50,
    imageUrl: 'https://images.gr-assets.com/books/1303252999l/968.jpg'
  }
];

// Mock cart state (simplified - single item cart)
let mockCart: {
  item: {
    code: string;
    name: string;
    price: number;
    quantity: number;
  } | null;
  totalAmount: number;
} = {
  item: null,
  totalAmount: 0
};

// Mock orders storage
const mockOrders: Array<{
  orderNumber: string;
  status: 'NEW' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  deliveryAddress: string;
  items: Array<{
    code: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  totalAmount: number;
  createdAt: string;
}> = [];

export const handlers = [
  // Books API
  http.get('/api/books', ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedBooks = mockBooks.slice(startIndex, endIndex);

    return HttpResponse.json({
      data: paginatedBooks,
      pagination: {
        page,
        pageSize,
        totalPages: Math.ceil(mockBooks.length / pageSize),
        totalItems: mockBooks.length
      }
    });
  }),

  // Cart API - Get cart
  http.get('/api/cart', () => {
    return HttpResponse.json(mockCart);
  }),

  // Cart API - Add to cart
  http.post('/api/cart', async ({ request }) => {
    const body = await request.json() as { code: string };
    const book = mockBooks.find(b => b.code === body.code);

    if (!book) {
      return HttpResponse.json(
        { error: 'Book not found' },
        { status: 400 }
      );
    }

    // Simplified: single item cart, replace existing item
    mockCart = {
      item: {
        code: book.code,
        name: book.name,
        price: book.price,
        quantity: 1
      },
      totalAmount: book.price
    };

    return HttpResponse.json(mockCart);
  }),

  // Cart API - Update cart quantity
  http.post('/api/cart/update', async ({ request }) => {
    const body = await request.json() as { code: string; quantity: number };

    if (!mockCart.item || mockCart.item.code !== body.code) {
      return HttpResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      );
    }

    if (body.quantity < 1) {
      return HttpResponse.json(
        { error: 'Invalid quantity' },
        { status: 400 }
      );
    }

    mockCart.item.quantity = body.quantity;
    mockCart.totalAmount = mockCart.item.price * body.quantity;

    return HttpResponse.json(mockCart);
  }),

  // Orders API - Create order
  http.post('/api/orders', async ({ request }) => {
    const body = await request.json() as {
      customer: {
        name: string;
        email: string;
        phone: string;
      };
      deliveryAddress: string;
    };

    // Validate required fields
    if (!body.customer?.name || !body.customer?.email || !body.customer?.phone || !body.deliveryAddress) {
      return HttpResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.customer.email)) {
      return HttpResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if cart has items
    if (!mockCart.item) {
      return HttpResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Create order
    const orderNumber = `ORD-${Date.now()}`;
    const order = {
      orderNumber,
      status: 'NEW' as const,
      customer: body.customer,
      deliveryAddress: body.deliveryAddress,
      items: [mockCart.item],
      totalAmount: mockCart.totalAmount,
      createdAt: new Date().toISOString()
    };

    mockOrders.push(order);

    // Clear cart after order
    mockCart = {
      item: null,
      totalAmount: 0
    };

    return HttpResponse.json(order, { status: 201 });
  }),

  // Orders API - List orders
  http.get('/api/orders', () => {
    const orderSummaries = mockOrders.map(order => ({
      orderNumber: order.orderNumber,
      status: order.status
    }));

    return HttpResponse.json({
      orders: orderSummaries
    });
  }),

  // Orders API - Get order details
  http.get('/api/orders/:orderNumber', ({ params }) => {
    const { orderNumber } = params;
    const order = mockOrders.find(o => o.orderNumber === orderNumber);

    if (!order) {
      return HttpResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      order
    });
  })
];

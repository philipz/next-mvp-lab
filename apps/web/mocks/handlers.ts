import { http, HttpResponse } from 'msw';

const data = [
  { id: '1', name: 'Alice', tier: 'Gold' },
  { id: '2', name: 'Bob', tier: 'Silver' },
  { id: '3', name: 'Carol', tier: 'Bronze' }
];

export const handlers = [
  http.get('/api/customers', ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get('q')?.toLowerCase() ?? '';
    const items = data.filter(d => d.name.toLowerCase().includes(q));
    return HttpResponse.json({ items, total: items.length });
  })
];

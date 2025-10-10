import { NextResponse } from 'next/server'

const data = [
  { id: '1', name: 'Alice', tier: 'Gold' },
  { id: '2', name: 'Bob', tier: 'Silver' },
  { id: '3', name: 'Carol', tier: 'Bronze' }
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').toLowerCase();
  const items = data.filter(d => d.name.toLowerCase().includes(q));
  return NextResponse.json({ items, total: items.length });
}

export default function HomePage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">SDD Frontend Template</h1>
      <p className="mt-2">Start by editing <code>docs/specs/api/openapi.yaml</code> and the customers UI spec, then run <code>pnpm gen:types</code> and <code>pnpm gen:page</code>.</p>
      <a className="underline mt-4 inline-block" href="/customers">Go to Customers</a>
    </main>
  );
}

/* generated from apps/web/features/customers/spec/page.customer-list.yml */
"use client";
import { DataTable } from "@/design-system/data-table";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from '@/lib/api/client'

interface Customer {
  name: string;
  tier: string;
}

interface CustomerListResponse {
  items: Customer[];
}

export default function CustomerList() {
  const { data, isLoading, isError, error } = useQuery<CustomerListResponse>({
    queryKey: ['customers', 'list'],
    queryFn: async () => apiClient.get<CustomerListResponse>('/api/customers'),
  })

  if (isError) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Customers</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700">Failed to load customers. Please try again later.</p>
          {error && (
            <p className="text-sm text-red-600 mt-2">
              Error: {error instanceof Error ? error.message : 'Unknown error'}
            </p>
          )}
        </div>
      </main>
    )
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Customers</h1>
      <DataTable
        loading={isLoading}
        rows={data?.items ?? []}
        columns={[
          { id: "name", header: "Name" },
          { id: "tier", header: "Tier" }
        ]}
      />
    </main>
  );
}

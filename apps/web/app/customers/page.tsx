/* generated from apps/web/features/customers/spec/page.customer-list.yml */
"use client";
import { DataTable } from "@/design-system/data-table";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/http";

export default function CustomerList(){
  const { data, isLoading } = useQuery({
    queryKey: ["customers","list"],
    queryFn: () => client.GET("/api/customers").then(r=>r.data)
  });
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Customers</h1>
      <DataTable
        loading={isLoading}
        rows={(data?.items ?? []) as any[]}
        columns={[
          { id: "name", header: "Name" }
,
          { id: "tier", header: "Tier" }
]}
      />
    </main>
  );
}

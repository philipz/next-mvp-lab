import fs from "node:fs";
import yaml from "js-yaml";

const specPath = process.argv[2];
if (!specPath) {
  console.error("Usage: ts-node scripts/gen-page-from-spec.ts <spec.yml>");
  process.exit(1);
}
const spec = yaml.load(fs.readFileSync(specPath, "utf8")) as any;

const route = spec.route || "/generated";
const pageName = spec.page || "GeneratedPage";
const columns = (spec.view?.columns ?? []).map((c:any)=> `
          { id: "${c.id}", header: "${c.header}" }
`).join(",");

const code = `/* generated from ${specPath} */
"use client";
import { DataTable } from "@/design-system/data-table";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

export default function ${pageName}(){
  const { data, isLoading } = useQuery({
    queryKey: ${JSON.stringify(spec.data?.queryKey || ["generated"]) as string},
    queryFn: async () => apiClient.get("${spec.data?.source?.split(" ").slice(-1)[0] ?? "/api/_"}")
  });
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">${spec.layout?.title ?? "Generated Page"}</h1>
      <DataTable
        loading={isLoading}
        rows={(data?.items ?? []) as any[]}
        columns={[${columns}]}
      />
    </main>
  );
}
`;

const out = `apps/web/app${route}/page.tsx`;
fs.mkdirSync(`apps/web/app${route}`, { recursive: true });
fs.writeFileSync(out, code);
console.log("Generated:", out);

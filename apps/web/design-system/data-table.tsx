'use client'
import * as React from 'react';

type Col<T> = { id: string; header: string; render?: (row: T)=>React.ReactNode };
type Props<T> = {
  rows: T[];
  columns: Col<T>[];
  loading?: boolean;
};
export function DataTable<T>({ rows, columns, loading }: Props<T>) {
  if (loading) return <div>Loading...</div>;
  return (
    <table className="min-w-full border border-gray-200">
      <thead className="bg-gray-50">
        <tr>{columns.map(c => <th key={c.id} className="text-left p-2 border-b">{c.header}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="odd:bg-white even:bg-gray-50">
            {columns.map(c => (
              <td key={c.id} className="p-2 border-b">
                {c.render ? c.render(row) : (row as any)[c.id]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

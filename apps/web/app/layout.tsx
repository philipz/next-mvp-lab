import "../styles/globals.css";
import type { ReactNode } from "react";
import { Providers } from "./providers";
import Link from "next/link";
import Image from "next/image";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="bg-gray-900 text-white">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-xl font-semibold hover:text-gray-300">
              <Image
                src="/images/books.png"
                alt="Books Logo"
                width={40}
                height={40}
              />
              <span>BookStore</span>
            </Link>
            <div>
              <Link href="/orders" className="hover:text-gray-300">
                Orders
              </Link>
            </div>
          </div>
        </nav>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

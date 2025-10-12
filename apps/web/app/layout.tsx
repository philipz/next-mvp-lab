import "../styles/globals.css";
import type { ReactNode } from "react";
import { Providers } from "./providers";
import { ErrorBoundary } from "@/components/error-boundary";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: {
    default: 'BookStore - Online Book Shopping',
    template: '%s | BookStore'
  },
  description: 'Browse and purchase books from our extensive online catalog. Find your next great read with easy ordering and fast delivery.',
  keywords: ['books', 'online bookstore', 'book shopping', 'literature', 'reading'],
  authors: [{ name: 'BookStore' }],
  creator: 'BookStore',
  publisher: 'BookStore',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://bookstore.example.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'BookStore - Online Book Shopping',
    description: 'Browse and purchase books from our extensive online catalog.',
    url: 'https://bookstore.example.com',
    siteName: 'BookStore',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BookStore - Online Book Shopping',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BookStore - Online Book Shopping',
    description: 'Browse and purchase books from our extensive online catalog.',
    images: ['/images/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="text-white" style={{ backgroundColor: '#212529' }} role="navigation" aria-label="Main navigation">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-xl font-semibold hover:text-gray-300 transition-colors duration-200" aria-label="BookStore home">
              <Image
                src="/images/books.png"
                alt="Books Logo"
                width={40}
                height={40}
                className="md:w-10 md:h-10 w-8 h-8"
              />
              <span className="hidden sm:block md:text-xl text-lg">BookStore</span>
            </Link>
            <div>
              <Link href="/orders" className="hover:text-gray-300 transition-colors duration-200 text-sm md:text-base" aria-label="View your orders">
                Orders
              </Link>
            </div>
          </div>
        </nav>
        <ErrorBoundary>
          <Providers>{children}</Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}

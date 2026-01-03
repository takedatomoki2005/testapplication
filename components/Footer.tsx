'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Footer() {
  const pathname = usePathname()

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <nav className="flex justify-center gap-8">
          <Link
            href="/"
            className={`px-4 py-2 rounded-[5px] text-sm font-medium transition-colors ${
              pathname === '/'
                ? 'bg-[#336B87] bg-opacity-20 text-[#336B87]'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Visited Records
          </Link>
          <Link
            href="/my-page"
            className={`px-4 py-2 rounded-[5px] text-sm font-medium transition-colors ${
              pathname === '/my-page'
                ? 'bg-[#336B87] bg-opacity-20 text-[#336B87]'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            My Page
          </Link>
        </nav>
      </div>
    </footer>
  )
}


import { createServerClient } from '@/utils/supabase/server'
import { getVisitedCountries } from '@/app/actions/countries'
import Link from 'next/link'
import HeaderUserInfo from './HeaderUserInfo'

export default async function Header() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const countries = user ? await getVisitedCountries() : []
  const countriesCount = countries.length

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side: Logo and Site Name */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-[#336B87] rounded-[5px] flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 21h16.5M4.5 3h15m-7.5 0v18m-7.5-18v18M9 3.75h6M9 6.75h6m-6 3h6m-6 3h6m-6 3h6"
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">Travel Record</span>
          </Link>

          {/* Right side: User Email and Profile Icon */}
          <HeaderUserInfo user={user} countriesCount={countriesCount} />
        </div>
      </div>
    </header>
  )
}


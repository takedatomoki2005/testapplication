'use client'

import { useTransition } from 'react'
import { signOut } from '@/app/actions/auth'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'

interface HeaderUserInfoProps {
  user: User | null
}

export default function HeaderUserInfo({ user }: HeaderUserInfoProps) {
  const [isPending, startTransition] = useTransition()

  const handleSignOut = () => {
    startTransition(async () => {
      await signOut()
    })
  }

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="text-sm text-gray-600 hover:text-[#336B87] transition-colors"
        >
          Sign In
        </Link>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      {/* User Email */}
      <div className="hidden sm:flex items-center gap-2">
        <span className="text-sm text-gray-600">
          <span className="font-medium text-gray-900">{user.email}</span>
        </span>
      </div>

      {/* Profile Icon/Link */}
      <Link
        href="/my-page"
        className="flex items-center justify-center w-10 h-10 bg-[#336B87] bg-opacity-10 rounded-[5px] hover:bg-opacity-20 transition-colors"
        title="My Page"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="#336B87"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
          />
        </svg>
      </Link>

      {/* Sign Out Button */}
      <button
        onClick={handleSignOut}
        disabled={isPending}
        className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-[5px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? '...' : 'Sign Out'}
      </button>
    </div>
  )
}


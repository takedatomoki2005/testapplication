'use client'

import { useTransition } from 'react'
import { signOut } from '@/app/actions/auth'

interface AuthButtonProps {
  userEmail: string
}

export default function AuthButton({ userEmail }: AuthButtonProps) {
  const [isPending, startTransition] = useTransition()

  const handleSignOut = () => {
    startTransition(async () => {
      await signOut()
    })
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-600">
        Signed in as <span className="font-semibold">{userEmail}</span>
      </span>
      <button
        onClick={handleSignOut}
        disabled={isPending}
        className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-[5px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? 'Signing out...' : 'Sign Out'}
      </button>
    </div>
  )
}


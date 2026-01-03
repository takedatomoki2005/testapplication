'use client'

import { useState } from 'react'
import { changeEmail } from '@/app/actions/profile'

interface ChangeEmailFormProps {
  currentEmail: string
}

export default function ChangeEmailForm({ currentEmail }: ChangeEmailFormProps) {
  const [newEmail, setNewEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (!newEmail.includes('@')) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' })
      return
    }

    setIsSubmitting(true)

    const result = await changeEmail(newEmail, password)

    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'Email changed successfully! Please check your new email for verification.' })
      setNewEmail('')
      setPassword('')
    }

    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Email
        </label>
        <input
          type="email"
          value={currentEmail}
          disabled
          className="w-full px-3 py-2 border border-gray-300 rounded-[5px] shadow-sm bg-gray-100 text-gray-500"
        />
      </div>

      <div>
        <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700 mb-2">
          New Email
        </label>
        <input
          type="email"
          id="newEmail"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-[5px] shadow-sm focus:outline-none focus:ring-[#336B87] focus:border-[#336B87]"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Password (for verification)
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-[5px] shadow-sm focus:outline-none focus:ring-[#336B87] focus:border-[#336B87]"
        />
      </div>

      {message && (
        <div
          className={`p-3 rounded-[5px] ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#336B87] text-white py-2 px-4 rounded-[5px] hover:bg-[#2a5a70] focus:outline-none focus:ring-2 focus:ring-[#336B87] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Changing...' : 'Change Email'}
      </button>
    </form>
  )
}


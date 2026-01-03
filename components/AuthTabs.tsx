'use client'

import { useState } from 'react'
import SignInForm from './SignInForm'
import SignUpForm from './SignUpForm'

export default function AuthTabs() {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin')

  return (
    <div className="max-w-md mx-auto">
      <div className="flex border-b border-gray-200 mb-4">
        <button
          onClick={() => setActiveTab('signin')}
          className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
            activeTab === 'signin'
              ? 'text-[#336B87] border-b-2 border-[#336B87]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => setActiveTab('signup')}
          className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
            activeTab === 'signup'
              ? 'text-[#336B87] border-b-2 border-[#336B87]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Sign Up
        </button>
      </div>
      
      {activeTab === 'signin' ? <SignInForm /> : <SignUpForm />}
    </div>
  )
}


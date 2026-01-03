'use client'

import { useState } from 'react'
import { updateUserProfile } from '@/app/actions/profile'
import { countries } from '@/data/countries'
import { languages } from '@/data/languages'
import { hobbies } from '@/data/hobbies'

interface ProfileFormProps {
  initialProfile: {
    nationality: string | null
    language: string | null
    hobbies: string[] | null
  }
}

export default function ProfileForm({ initialProfile }: ProfileFormProps) {
  const [nationality, setNationality] = useState(initialProfile.nationality || '')
  const [language, setLanguage] = useState(initialProfile.language || '')
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>(
    initialProfile.hobbies || []
  )
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const toggleHobby = (hobby: string) => {
    setSelectedHobbies((prev) =>
      prev.includes(hobby) ? prev.filter((h) => h !== hobby) : [...prev, hobby]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    const result = await updateUserProfile(
      nationality || null,
      language || null,
      selectedHobbies
    )

    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
    }

    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-2">
          Nationality
        </label>
        <select
          id="nationality"
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-[5px] shadow-sm focus:outline-none focus:ring-[#336B87] focus:border-[#336B87]"
        >
          <option value="">Select nationality</option>
          {countries.map((country) => (
            <option key={country.code} value={country.name}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
          Language
        </label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-[5px] shadow-sm focus:outline-none focus:ring-[#336B87] focus:border-[#336B87]"
        >
          <option value="">Select language</option>
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hobbies (select multiple)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {hobbies.map((hobby) => (
            <label
              key={hobby}
              className="flex items-center space-x-2 p-2 border border-gray-300 rounded-[5px] cursor-pointer hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={selectedHobbies.includes(hobby)}
                onChange={() => toggleHobby(hobby)}
                className="rounded-[5px] border-gray-300 text-[#336B87] focus:ring-[#336B87]"
              />
              <span className="text-sm text-gray-700">{hobby}</span>
            </label>
          ))}
        </div>
        {selectedHobbies.length > 0 && (
          <p className="mt-2 text-sm text-gray-500">
            Selected: {selectedHobbies.join(', ')}
          </p>
        )}
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
        {isSubmitting ? 'Saving...' : 'Save Profile'}
      </button>
    </form>
  )
}


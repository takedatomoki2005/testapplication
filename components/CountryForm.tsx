'use client'

import { useState, useTransition } from 'react'
import { addVisitedCountry, type VisitedCountry } from '@/app/actions/countries'
import { countries } from '@/data/countries'
import { getCountryFlag } from '@/utils/flags'

interface CountryFormProps {
  existingCountries: VisitedCountry[]
}

export default function CountryForm({ existingCountries }: CountryFormProps) {
  const [selectedCountry, setSelectedCountry] = useState('')
  const [notes, setNotes] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(e.target.value)
  }

  const isDuplicate = (countryName: string, countryCode?: string) => {
    return existingCountries.some(
      (existing) =>
        existing.country_name.toLowerCase() === countryName.toLowerCase() ||
        (existing.country_code && countryCode && 
         existing.country_code.toUpperCase() === countryCode.toUpperCase())
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!selectedCountry) {
      setError('Please select a country')
      return
    }

    const country = countries.find(c => c.name === selectedCountry)
    if (!country) {
      setError('Invalid country selected')
      return
    }

    if (isDuplicate(country.name, country.code)) {
      setError(`You have already added ${country.name}. Please select a different country.`)
      return
    }

    startTransition(async () => {
      const result = await addVisitedCountry(
        country.name,
        country.code,
        notes.trim() || undefined
      )

      if (result.error) {
        setError(result.error)
      } else {
        setSelectedCountry('')
        setNotes('')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-[5px] shadow-md mb-8">
      <h2 className="text-2xl font-bold mb-4">Add Visited Country</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="countryName" className="block text-sm font-medium text-gray-700 mb-1">
            Country <span className="text-red-500">*</span>
          </label>
          <select
            id="countryName"
            value={selectedCountry}
            onChange={handleCountryChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-[5px] focus:ring-2 focus:ring-[#336B87] focus:border-[#336B87] bg-white"
            disabled={isPending}
            required
          >
            <option value="">Select a country...</option>
            {countries.map((country) => {
              const alreadyAdded = isDuplicate(country.name, country.code)
              return (
                <option 
                  key={country.code} 
                  value={country.name}
                  disabled={alreadyAdded}
                >
                  {getCountryFlag(country.code)} {country.name} ({country.code}){alreadyAdded ? ' - Already added' : ''}
                </option>
              )
            })}
          </select>
          {selectedCountry && (
            <p className="mt-1 text-sm text-gray-500">
              Country code: <span className="font-semibold">
                {countries.find(c => c.name === selectedCountry)?.code}
              </span>
            </p>
          )}
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes about your visit..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-[5px] focus:ring-2 focus:ring-[#336B87] focus:border-[#336B87]"
            disabled={isPending}
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-[#336B87] text-white py-2 px-4 rounded-[5px] hover:bg-[#2a5a70] focus:outline-none focus:ring-2 focus:ring-[#336B87] focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? 'Adding...' : 'Add Country'}
        </button>
      </div>
    </form>
  )
}


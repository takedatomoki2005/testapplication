'use client'

import { useTransition } from 'react'
import { deleteVisitedCountry, type VisitedCountry } from '@/app/actions/countries'
import { getCountryFlag } from '@/utils/flags'

interface CountryListProps {
  countries: VisitedCountry[]
}

export default function CountryList({ countries }: CountryListProps) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this country?')) return
    startTransition(async () => {
      await deleteVisitedCountry(id)
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (countries.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <p className="text-gray-500">No countries visited yet. Add your first country above!</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-2xl font-bold">Visited Countries ({countries.length})</h2>
      </div>
      
      <div className="divide-y divide-gray-200">
        {countries.map((country) => (
          <div key={country.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {country.country_code && (
                    <span className="text-lg" role="img" aria-label={`${country.country_name} flag`}>
                      {getCountryFlag(country.country_code)}
                    </span>
                  )}
                  <h3 className="text-xl font-semibold text-gray-900">{country.country_name}</h3>
                  {country.country_code && (
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                      {country.country_code}
                    </span>
                  )}
                </div>
                {country.notes && <p className="text-gray-600 mb-2">{country.notes}</p>}
                <p className="text-sm text-gray-500">Visited on {formatDate(country.visited_at)}</p>
              </div>
              <button
                onClick={() => handleDelete(country.id)}
                disabled={isPending}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


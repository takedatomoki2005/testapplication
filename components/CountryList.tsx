'use client'

import { useTransition } from 'react'
import { deleteVisitedCountry, type VisitedCountry } from '@/app/actions/countries'
import { getCountryFlag } from '@/utils/flags'
import { getCountryInfo, formatPopulation } from '@/utils/countryInfo'

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
      <div className="bg-white p-8 rounded-[5px] shadow-md text-center">
        <p className="text-gray-500">No countries visited yet. Add your first country above!</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-[5px] shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-2xl font-bold">Visited Countries ({countries.length})</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Country</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider hidden md:table-cell">Region</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider hidden lg:table-cell">Language</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider hidden xl:table-cell">Description</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider hidden lg:table-cell">Population</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Visited</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {countries.map((country) => {
              const countryInfo = country.country_code 
                ? getCountryInfo(country.country_code, true)
                : getCountryInfo(country.country_name)
              
              return (
                <tr key={country.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {country.country_code && (
                        <span className="text-lg" role="img" aria-label={`${country.country_name} flag`}>
                          {getCountryFlag(country.country_code)}
                        </span>
                      )}
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{country.country_name}</div>
                        {country.country_code && (
                          <div className="text-xs text-gray-500">{country.country_code}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap hidden md:table-cell">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-[5px]">
                      {countryInfo?.region || 'N/A'}
                    </span>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <div className="text-sm text-gray-900">{countryInfo?.language || 'N/A'}</div>
                  </td>
                  <td className="px-4 py-4 hidden xl:table-cell">
                    <div className="text-sm text-gray-600 max-w-xs">{countryInfo?.description || 'N/A'}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap hidden lg:table-cell">
                    <div className="text-sm text-gray-900">
                      {countryInfo?.population ? formatPopulation(countryInfo.population) : 'N/A'}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-500">{formatDate(country.visited_at)}</div>
                    {country.notes && (
                      <div className="text-xs text-gray-400 mt-1 italic">{country.notes}</div>
                    )}
                    {/* Show additional info on mobile */}
                    <div className="md:hidden mt-2 space-y-1">
                      {countryInfo?.region && (
                        <div className="text-xs">
                          <span className="font-medium">Region:</span> {countryInfo.region}
                        </div>
                      )}
                      {countryInfo?.language && (
                        <div className="text-xs">
                          <span className="font-medium">Language:</span> {countryInfo.language}
                        </div>
                      )}
                      {countryInfo?.population && (
                        <div className="text-xs">
                          <span className="font-medium">Population:</span> {formatPopulation(countryInfo.population)}
                        </div>
                      )}
                      {countryInfo?.description && (
                        <div className="text-xs text-gray-600 mt-1">{countryInfo.description}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleDelete(country.id)}
                      disabled={isPending}
                      className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-[5px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}


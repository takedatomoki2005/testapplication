import { countries, type Country } from '@/data/countries'

export function getCountryInfo(countryName: string): Country | undefined
export function getCountryInfo(countryCode: string, byCode: true): Country | undefined
export function getCountryInfo(identifier: string, byCode?: boolean): Country | undefined {
  if (byCode) {
    return countries.find(c => c.code.toUpperCase() === identifier.toUpperCase())
  }
  return countries.find(c => c.name.toLowerCase() === identifier.toLowerCase())
}

export function formatPopulation(population: number): string {
  if (population >= 1000) {
    return `${(population / 1000).toFixed(1)}B`
  }
  return `${population.toFixed(1)}M`
}


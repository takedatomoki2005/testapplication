import { countries } from '@/data/countries'

// Create a mapping from country code to country name
export const countryCodeToName: Record<string, string> = {}

countries.forEach(country => {
  countryCodeToName[country.code.toUpperCase()] = country.name
})

// Extended mapping for common country codes that might appear in map data
const extendedMappings: Record<string, string> = {
  'US': 'United States',
  'GB': 'United Kingdom',
  'KR': 'South Korea',
  'KP': 'North Korea',
  'RU': 'Russia',
  'CN': 'China',
  'JP': 'Japan',
  'DE': 'Germany',
  'FR': 'France',
  'IT': 'Italy',
  'ES': 'Spain',
  'CA': 'Canada',
  'AU': 'Australia',
  'BR': 'Brazil',
  'IN': 'India',
  'MX': 'Mexico',
  'AR': 'Argentina',
  'ZA': 'South Africa',
  'EG': 'Egypt',
  'NG': 'Nigeria',
  'PK': 'Pakistan',
  'BD': 'Bangladesh',
  'ID': 'Indonesia',
  'PH': 'Philippines',
  'VN': 'Vietnam',
  'TH': 'Thailand',
  'MY': 'Malaysia',
  'SG': 'Singapore',
  'NZ': 'New Zealand',
  'PL': 'Poland',
  'NL': 'Netherlands',
  'BE': 'Belgium',
  'CH': 'Switzerland',
  'AT': 'Austria',
  'SE': 'Sweden',
  'NO': 'Norway',
  'DK': 'Denmark',
  'FI': 'Finland',
  'IE': 'Ireland',
  'PT': 'Portugal',
  'GR': 'Greece',
  'CZ': 'Czech Republic',
  'HU': 'Hungary',
  'RO': 'Romania',
  'BG': 'Bulgaria',
  'HR': 'Croatia',
  'IS': 'Iceland',
  'TR': 'Turkey',
  'SA': 'Saudi Arabia',
  'AE': 'United Arab Emirates',
  'IL': 'Israel',
  'IR': 'Iran',
  'IQ': 'Iraq',
  'AF': 'Afghanistan',
  'LK': 'Sri Lanka',
  'NP': 'Nepal',
  'MM': 'Myanmar',
  'KH': 'Cambodia',
  'LA': 'Laos',
  'TW': 'Taiwan',
  'HK': 'Hong Kong',
  'MO': 'Macau',
  'KZ': 'Kazakhstan',
  'UZ': 'Uzbekistan',
  'MN': 'Mongolia',
  'UA': 'Ukraine',
  'BY': 'Belarus',
  'MD': 'Moldova',
  'GE': 'Georgia',
  'AM': 'Armenia',
  'AZ': 'Azerbaijan',
  'AL': 'Albania',
  'RS': 'Serbia',
  'BA': 'Bosnia and Herzegovina',
  'ME': 'Montenegro',
  'MK': 'North Macedonia',
  'SI': 'Slovenia',
  'SK': 'Slovakia',
  'LT': 'Lithuania',
  'LV': 'Latvia',
  'EE': 'Estonia',
  'CL': 'Chile',
  'PE': 'Peru',
  'CO': 'Colombia',
  'VE': 'Venezuela',
  'EC': 'Ecuador',
  'BO': 'Bolivia',
  'PY': 'Paraguay',
  'UY': 'Uruguay',
  'CR': 'Costa Rica',
  'PA': 'Panama',
  'GT': 'Guatemala',
  'HN': 'Honduras',
  'SV': 'El Salvador',
  'NI': 'Nicaragua',
  'CU': 'Cuba',
  'DO': 'Dominican Republic',
  'HT': 'Haiti',
  'JM': 'Jamaica',
  'KE': 'Kenya',
  'ET': 'Ethiopia',
  'TZ': 'Tanzania',
  'UG': 'Uganda',
  'GH': 'Ghana',
  'CI': 'Ivory Coast',
  'SN': 'Senegal',
  'CM': 'Cameroon',
  'AO': 'Angola',
  'MZ': 'Mozambique',
  'MW': 'Malawi',
  'ZM': 'Zambia',
  'ZW': 'Zimbabwe',
  'BW': 'Botswana',
  'NA': 'Namibia',
}

// Merge extended mappings
Object.assign(countryCodeToName, extendedMappings)

// Function to get country name from code
export function getCountryNameFromCode(code: string | null | undefined): string {
  if (!code) return 'Unknown Country'
  const normalizedCode = code.toUpperCase().trim()
  if (!normalizedCode) return 'Unknown Country'
  
  // Check if we have the name in our mapping
  if (countryCodeToName[normalizedCode]) {
    return countryCodeToName[normalizedCode]
  }
  
  // If not found, return the code itself (better than "Unknown Country")
  return normalizedCode
}


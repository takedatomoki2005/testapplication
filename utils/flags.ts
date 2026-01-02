/**
 * Converts a country code (ISO 3166-1 alpha-2) to a flag emoji
 * @param countryCode - Two-letter country code (e.g., "US", "JP", "FR")
 * @returns Flag emoji string
 */
export function getCountryFlag(countryCode: string | null | undefined): string {
  if (!countryCode || countryCode.length !== 2) {
    return '🏳️' // Default flag if code is invalid
  }

  const code = countryCode.toUpperCase()
  
  // Convert each letter to regional indicator symbol
  // Regional Indicator Symbol Letter A (U+1F1E6) is the base
  const base = 0x1F1E6 // Regional Indicator Symbol Letter A
  const A = 65 // ASCII code for 'A'
  
  const firstChar = code.charCodeAt(0) - A + base
  const secondChar = code.charCodeAt(1) - A + base
  
  // Check if conversion is valid (both characters are A-Z)
  if (firstChar < base || firstChar > base + 25 || secondChar < base || secondChar > base + 25) {
    return '🏳️' // Default flag if invalid
  }
  
  return String.fromCodePoint(firstChar, secondChar)
}


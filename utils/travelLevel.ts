import { countries } from '@/data/countries'

export const TOTAL_COUNTRIES = countries.length

export interface TravelLevel {
  level: number | 'MAX'
  levelNumber: number
  countriesVisited: number
  countriesNeeded: number
  progress: number
  levelName: string
}

export function calculateTravelLevel(countriesVisited: number): TravelLevel {
  const totalCountries = TOTAL_COUNTRIES

  // MAX level: visited all countries
  if (countriesVisited >= totalCountries) {
    return {
      level: 'MAX',
      levelNumber: 11,
      countriesVisited,
      countriesNeeded: 0,
      progress: 100,
      levelName: 'MAX',
    }
  }

  // Level 1: 1-5 countries
  if (countriesVisited >= 1 && countriesVisited <= 5) {
    const progress = ((countriesVisited / 5) * 100)
    return {
      level: 1,
      levelNumber: 1,
      countriesVisited,
      countriesNeeded: 6 - countriesVisited,
      progress: Math.min(progress, 100),
      levelName: '01',
    }
  }

  // Level 2: 6-10 countries
  if (countriesVisited >= 6 && countriesVisited <= 10) {
    const progress = (((countriesVisited - 5) / 5) * 100)
    return {
      level: 2,
      levelNumber: 2,
      countriesVisited,
      countriesNeeded: 11 - countriesVisited,
      progress: Math.min(progress, 100),
      levelName: '02',
    }
  }

  // Level 3: 11-15 countries
  if (countriesVisited >= 11 && countriesVisited <= 15) {
    const progress = (((countriesVisited - 10) / 5) * 100)
    return {
      level: 3,
      levelNumber: 3,
      countriesVisited,
      countriesNeeded: 16 - countriesVisited,
      progress: Math.min(progress, 100),
      levelName: '03',
    }
  }

  // Level 4: 16-20 countries
  if (countriesVisited >= 16 && countriesVisited <= 20) {
    const progress = (((countriesVisited - 15) / 5) * 100)
    return {
      level: 4,
      levelNumber: 4,
      countriesVisited,
      countriesNeeded: 21 - countriesVisited,
      progress: Math.min(progress, 100),
      levelName: '04',
    }
  }

  // Level 5: 21-25 countries
  if (countriesVisited >= 21 && countriesVisited <= 25) {
    const progress = (((countriesVisited - 20) / 5) * 100)
    return {
      level: 5,
      levelNumber: 5,
      countriesVisited,
      countriesNeeded: 26 - countriesVisited,
      progress: Math.min(progress, 100),
      levelName: '05',
    }
  }

  // Level 6: 26-35 countries
  if (countriesVisited >= 26 && countriesVisited <= 35) {
    const progress = (((countriesVisited - 25) / 10) * 100)
    return {
      level: 6,
      levelNumber: 6,
      countriesVisited,
      countriesNeeded: 36 - countriesVisited,
      progress: Math.min(progress, 100),
      levelName: '06',
    }
  }

  // Level 7: 36-50 countries
  if (countriesVisited >= 36 && countriesVisited <= 50) {
    const progress = (((countriesVisited - 35) / 15) * 100)
    return {
      level: 7,
      levelNumber: 7,
      countriesVisited,
      countriesNeeded: 51 - countriesVisited,
      progress: Math.min(progress, 100),
      levelName: '07',
    }
  }

  // Level 8: 51-65 countries
  if (countriesVisited >= 51 && countriesVisited <= 65) {
    const progress = (((countriesVisited - 50) / 15) * 100)
    return {
      level: 8,
      levelNumber: 8,
      countriesVisited,
      countriesNeeded: 66 - countriesVisited,
      progress: Math.min(progress, 100),
      levelName: '08',
    }
  }

  // Level 9: 66-80 countries
  if (countriesVisited >= 66 && countriesVisited <= 80) {
    const progress = (((countriesVisited - 65) / 15) * 100)
    return {
      level: 9,
      levelNumber: 9,
      countriesVisited,
      countriesNeeded: 81 - countriesVisited,
      progress: Math.min(progress, 100),
      levelName: '09',
    }
  }

  // Level 10: 81+ countries (but less than MAX)
  if (countriesVisited >= 81) {
    const progress = (((countriesVisited - 80) / (totalCountries - 80)) * 100)
    return {
      level: 10,
      levelNumber: 10,
      countriesVisited,
      countriesNeeded: totalCountries - countriesVisited,
      progress: Math.min(progress, 100),
      levelName: '10',
    }
  }

  // Default: Level 0 (no countries visited)
  return {
    level: 0,
    levelNumber: 0,
    countriesVisited: 0,
    countriesNeeded: 1,
    progress: 0,
    levelName: '00',
  }
}


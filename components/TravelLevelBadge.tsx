'use client'

import { TravelLevel } from '@/utils/travelLevel'

interface TravelLevelBadgeProps {
  travelLevel: TravelLevel
  showProgress?: boolean
  size?: 'sm' | 'md' | 'lg'
}

function getLevelStyle(levelNumber: number, isMax: boolean) {
  if (isMax) {
    return {
      bg: 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600',
      text: 'text-yellow-900',
      border: 'border-2 border-yellow-300',
      shadow: 'shadow-lg shadow-yellow-500/50',
      icon: '👑',
    }
  }
  
  if (levelNumber >= 8) {
    return {
      bg: 'bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500',
      text: 'text-yellow-900',
      border: 'border-2 border-yellow-200',
      shadow: 'shadow-md shadow-yellow-400/40',
      icon: '🥇',
    }
  }
  
  if (levelNumber >= 5) {
    return {
      bg: 'bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500',
      text: 'text-amber-900',
      border: 'border-2 border-amber-200',
      shadow: 'shadow-md shadow-amber-400/40',
      icon: '🥈',
    }
  }
  
  if (levelNumber >= 3) {
    return {
      bg: 'bg-gradient-to-br from-orange-300 via-orange-400 to-orange-500',
      text: 'text-orange-900',
      border: 'border-2 border-orange-200',
      shadow: 'shadow shadow-orange-300/30',
      icon: '🥉',
    }
  }
  
  return {
    bg: 'bg-gradient-to-br from-[#336B87] to-[#2a5a70]',
    text: 'text-white',
    border: 'border-2 border-[#336B87]',
    shadow: 'shadow shadow-[#336B87]/30',
    icon: '✈️',
  }
}

export default function TravelLevelBadge({
  travelLevel,
  showProgress = true,
  size = 'md',
}: TravelLevelBadgeProps) {
  const isMax = travelLevel.level === 'MAX'
  const levelNumber = travelLevel.levelNumber
  const style = getLevelStyle(levelNumber, isMax)
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  }
  
  const iconSize = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${sizeClasses[size]} ${style.bg} ${style.text} ${style.border} ${style.shadow} rounded-[5px] font-bold flex items-center gap-2 relative overflow-hidden`}
      >
        <span className={`${iconSize[size]} relative z-10`}>{style.icon}</span>
        <span className="relative z-10">Level</span>
        <span className={`relative z-10 ${size === 'lg' ? 'text-xl' : size === 'md' ? 'text-lg' : 'text-base'}`}>
          {travelLevel.levelName}
        </span>
        {isMax && <span className="relative z-10 ml-1 animate-pulse">⭐</span>}
      </div>
      {showProgress && (
        <div className="flex items-center gap-2">
          <div className="text-xs text-gray-600">
            {travelLevel.countriesVisited} / {travelLevel.countriesNeeded > 0 
              ? travelLevel.countriesNeeded + travelLevel.countriesVisited 
              : travelLevel.countriesVisited} countries
          </div>
          {!isMax && travelLevel.countriesNeeded > 0 && (
            <div className="text-xs text-gray-500">
              ({travelLevel.countriesNeeded} to next level)
            </div>
          )}
        </div>
      )}
    </div>
  )
}


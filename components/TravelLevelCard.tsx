'use client'

import { TravelLevel, TOTAL_COUNTRIES } from '@/utils/travelLevel'
import TravelLevelBadge from './TravelLevelBadge'

interface TravelLevelCardProps {
  travelLevel: TravelLevel
}

function getLevelGradient(levelNumber: number, isMax: boolean) {
  if (isMax) {
    return 'from-yellow-400 via-yellow-500 to-yellow-600'
  }
  if (levelNumber >= 8) {
    return 'from-yellow-300 via-yellow-400 to-yellow-500'
  }
  if (levelNumber >= 5) {
    return 'from-amber-300 via-amber-400 to-amber-500'
  }
  if (levelNumber >= 3) {
    return 'from-orange-300 via-orange-400 to-orange-500'
  }
  return 'from-[#336B87] to-[#2a5a70]'
}

export default function TravelLevelCard({ travelLevel }: TravelLevelCardProps) {
  const isMax = travelLevel.level === 'MAX'
  const levelNumber = travelLevel.levelNumber
  const gradient = getLevelGradient(levelNumber, isMax)

  return (
    <div className="bg-white p-6 rounded-[5px] shadow-lg border-4 border-yellow-400">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Travel Level</h2>
          <p className="text-sm text-gray-500">Track your journey around the world</p>
        </div>
        <TravelLevelBadge travelLevel={travelLevel} showProgress={false} size="lg" />
      </div>

      <div className="space-y-6">
        {/* Level Icon Display */}
        <div className="flex justify-center">
          <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg border-4 border-white relative`}>
            <div className="text-5xl">
              {isMax ? '👑' : levelNumber >= 8 ? '🥇' : levelNumber >= 5 ? '🥈' : levelNumber >= 3 ? '🥉' : '✈️'}
            </div>
            {isMax && (
              <div className="absolute -top-1 -right-1 text-2xl animate-bounce">⭐</div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span className="font-medium">Progress to {isMax ? 'MAX' : `Level ${String(travelLevel.levelNumber + 1).padStart(2, '0')}`}</span>
            <span className="font-bold text-[#336B87]">{Math.round(travelLevel.progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
            <div
              className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${gradient} relative overflow-hidden`}
              style={{ width: `${travelLevel.progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className={`text-center p-4 rounded-[5px] border-2 ${
            isMax || levelNumber >= 8 
              ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200' 
              : levelNumber >= 5
              ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200'
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className={`text-3xl font-bold ${
              isMax || levelNumber >= 8 
                ? 'text-yellow-700' 
                : levelNumber >= 5
                ? 'text-amber-700'
                : 'text-[#336B87]'
            }`}>
              {travelLevel.countriesVisited}
            </div>
            <div className="text-xs text-gray-600 mt-1 font-medium">Countries Visited</div>
          </div>
          <div className={`text-center p-4 rounded-[5px] border-2 ${
            isMax || levelNumber >= 8 
              ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200' 
              : levelNumber >= 5
              ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200'
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className={`text-3xl font-bold ${
              isMax 
                ? 'text-yellow-700' 
                : levelNumber >= 8
                ? 'text-yellow-700'
                : levelNumber >= 5
                ? 'text-amber-700'
                : 'text-gray-700'
            }`}>
              {isMax ? '👑' : travelLevel.countriesNeeded}
            </div>
            <div className="text-xs text-gray-600 mt-1 font-medium">
              {isMax ? 'MAX Level!' : 'To Next Level'}
            </div>
          </div>
        </div>

        {/* Level Info */}
        {!isMax && (
          <div className="pt-4 border-t border-gray-200 bg-gray-50 rounded-[5px] p-4">
            <p className="text-sm text-gray-700 text-center">
              Visit <span className={`font-bold ${
                levelNumber >= 8 
                  ? 'text-yellow-700' 
                  : levelNumber >= 5
                  ? 'text-amber-700'
                  : 'text-[#336B87]'
              }`}>{travelLevel.countriesNeeded}</span> more 
              {travelLevel.countriesNeeded === 1 ? ' country' : ' countries'} to reach{' '}
              <span className={`font-bold ${
                levelNumber >= 7 
                  ? 'text-yellow-700' 
                  : levelNumber >= 4
                  ? 'text-amber-700'
                  : 'text-[#336B87]'
              }`}>Level {String(travelLevel.levelNumber + 1).padStart(2, '0')}</span>
            </p>
          </div>
        )}

        {isMax && (
          <div className="pt-4 border-t-2 border-yellow-300 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-[5px] p-4">
            <div className="text-center">
              <div className="text-3xl mb-2">🎉👑🎉</div>
              <p className="text-base font-bold text-yellow-800 mb-1">
                Congratulations! You&apos;ve reached MAX Level!
              </p>
              <p className="text-sm text-yellow-700">
                You&apos;ve visited all {TOTAL_COUNTRIES} countries! You are a true world traveler! 🌍
              </p>
            </div>
          </div>
        )}

        {/* What is Travel Level Section */}
        <div className="pt-6 border-t-4 border-yellow-400 mt-6">
          <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-2xl">📚</span>
            What is Travel Level?
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Your Travel Level increases as you visit more countries. Each level represents your progress as a world traveler. 
            Reach MAX level by visiting all {TOTAL_COUNTRIES} countries!
          </p>
          
          {/* Level Blocks Visualization */}
          <div className="space-y-2">
            <div className="grid grid-cols-5 md:grid-cols-11 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 'MAX'].map((level, index) => {
                const levelNum = level === 'MAX' ? 11 : level as number
                const isCurrentLevel = levelNum === levelNumber
                const isCompleted = levelNum < levelNumber
                const isMax = level === 'MAX'
                
                let blockStyle = ''
                if (isMax) {
                  blockStyle = isCurrentLevel
                    ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 border-4 border-yellow-300 shadow-lg scale-110'
                    : isCompleted
                    ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 border-2 border-yellow-200'
                    : 'bg-gray-200 border-2 border-gray-300'
                } else if (levelNum >= 8) {
                  blockStyle = isCurrentLevel
                    ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 border-4 border-yellow-300 shadow-lg scale-110'
                    : isCompleted
                    ? 'bg-gradient-to-br from-yellow-200 to-yellow-400 border-2 border-yellow-200'
                    : 'bg-gray-200 border-2 border-gray-300'
                } else if (levelNum >= 5) {
                  blockStyle = isCurrentLevel
                    ? 'bg-gradient-to-br from-amber-300 to-amber-500 border-4 border-amber-300 shadow-lg scale-110'
                    : isCompleted
                    ? 'bg-gradient-to-br from-amber-200 to-amber-400 border-2 border-amber-200'
                    : 'bg-gray-200 border-2 border-gray-300'
                } else if (levelNum >= 3) {
                  blockStyle = isCurrentLevel
                    ? 'bg-gradient-to-br from-orange-300 to-orange-500 border-4 border-orange-300 shadow-lg scale-110'
                    : isCompleted
                    ? 'bg-gradient-to-br from-orange-200 to-orange-400 border-2 border-orange-200'
                    : 'bg-gray-200 border-2 border-gray-300'
                } else {
                  blockStyle = isCurrentLevel
                    ? 'bg-gradient-to-br from-[#336B87] to-[#2a5a70] border-4 border-[#336B87] shadow-lg scale-110 text-white'
                    : isCompleted
                    ? 'bg-gradient-to-br from-[#336B87] to-[#2a5a70] border-2 border-[#336B87] text-white'
                    : 'bg-gray-200 border-2 border-gray-300 text-gray-500'
                }
                
                return (
                  <div
                    key={level}
                    className={`${blockStyle} rounded-[5px] p-2 text-center transition-all duration-300 ${
                      isCurrentLevel ? 'z-10 relative' : ''
                    }`}
                    title={
                      isMax 
                        ? 'MAX: All countries visited'
                        : `Level ${String(level).padStart(2, '0')}: ${getLevelRange(levelNum)}`
                    }
                  >
                    <div className={`text-xs font-bold ${
                      isCurrentLevel || isCompleted || isMax
                        ? isMax || levelNum >= 8 ? 'text-yellow-900' : levelNum >= 5 ? 'text-amber-900' : levelNum >= 3 ? 'text-orange-900' : 'text-white'
                        : 'text-gray-500'
                    }`}>
                      {isMax ? '👑' : String(level).padStart(2, '0')}
                    </div>
                    {isCurrentLevel && (
                      <div className="absolute -top-1 -right-1 text-xs animate-pulse">✨</div>
                    )}
                  </div>
                )
              })}
            </div>
            
            {/* Level Ranges Legend */}
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <div className="text-gray-600">
                <span className="font-semibold">Levels 1-2:</span> 1-10 countries
              </div>
              <div className="text-gray-600">
                <span className="font-semibold">Levels 3-4:</span> 11-20 countries
              </div>
              <div className="text-gray-600">
                <span className="font-semibold">Levels 5-7:</span> 21-50 countries
              </div>
              <div className="text-gray-600">
                <span className="font-semibold">Levels 8-10:</span> 51-80+ countries
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function getLevelRange(levelNum: number): string {
  if (levelNum === 1) return '1-5 countries'
  if (levelNum === 2) return '6-10 countries'
  if (levelNum === 3) return '11-15 countries'
  if (levelNum === 4) return '16-20 countries'
  if (levelNum === 5) return '21-25 countries'
  if (levelNum === 6) return '26-35 countries'
  if (levelNum === 7) return '36-50 countries'
  if (levelNum === 8) return '51-65 countries'
  if (levelNum === 9) return '66-80 countries'
  if (levelNum === 10) return '81+ countries'
  return ''
}


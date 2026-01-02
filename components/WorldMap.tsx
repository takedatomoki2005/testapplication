'use client'

import { useState, useRef, useEffect } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

interface WorldMapProps {
  visitedCountryCodes: string[]
}

export default function WorldMap({ visitedCountryCodes }: WorldMapProps) {
  const [tooltip, setTooltip] = useState<{ code: string; x: number; y: number } | null>(null)
  const [currentCode, setCurrentCode] = useState<string | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  // Normalize codes to uppercase for comparison and remove null/undefined
  const normalizedCodes = new Set(
    visitedCountryCodes
      .map(code => code?.toUpperCase()?.trim())
      .filter((code): code is string => Boolean(code))
  )
  
  const getCountryColor = (isoCode: string | null | undefined) => {
    if (!isoCode) return '#D1D5DB'
    const code = isoCode.toUpperCase().trim()
    return normalizedCodes.has(code) ? '#3B82F6' : '#D1D5DB'
  }

  // Track global mouse position
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', handleGlobalMouseMove)
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove)
  }, [])

  // Update tooltip position on mouse move when hovering over a country
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY }
      if (currentCode && mapContainerRef.current) {
        const rect = mapContainerRef.current.getBoundingClientRect()
        setTooltip({
          code: currentCode,
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }
    }

    if (currentCode) {
      // Set initial tooltip position immediately using last known mouse position
      if (mapContainerRef.current) {
        const rect = mapContainerRef.current.getBoundingClientRect()
        const { x, y } = mousePositionRef.current
        setTooltip({
          code: currentCode,
          x: x - rect.left,
          y: y - rect.top,
        })
      }
      
      window.addEventListener('mousemove', handleMouseMove)
      return () => window.removeEventListener('mousemove', handleMouseMove)
    } else {
      setTooltip(null)
    }
  }, [currentCode])

  const handleMouseEnter = (code: string, countryName: string) => {
    const trimmedCode = code?.trim()
    const displayText = trimmedCode && trimmedCode !== '' ? trimmedCode : countryName || 'Unknown'
    
    if (displayText) {
      setCurrentCode(displayText)
    }
  }

  const handleMouseLeave = () => {
    setCurrentCode(null)
    setTooltip(null)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Visited Countries Map</h2>
      {normalizedCodes.size === 0 && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
          No countries marked as visited yet. Add countries below to see them highlighted on the map.
        </div>
      )}
      <div 
        ref={mapContainerRef}
        className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 relative"
      >
        <ComposableMap
          projectionConfig={{
            scale: 147,
            center: [0, 20],
          }}
          className="w-full"
          style={{ width: '100%', height: '500px' }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const props = geo.properties
                // Try common ISO code property names
                const isoCode = props.ISO_A2 || props.ISO_A2_EH || props.ISO_A2_LD || props.ISO || props.ADM0_A3 || props.ISO_A3
                const code = (isoCode || '').toUpperCase().trim()
                const countryName = props.NAME || props.NAME_LONG || props.NAME_EN || props.ADMIN || 'Unknown'
                const fillColor = getCountryColor(code)
                const isVisited = normalizedCodes.has(code)
                
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fillColor}
                    stroke="#FFFFFF"
                    strokeWidth={0.5}
                    onMouseEnter={() => {
                      handleMouseEnter(code, countryName)
                    }}
                    onMouseLeave={handleMouseLeave}
                    style={{
                      default: { outline: 'none' },
                      hover: { 
                        outline: 'none',
                        fill: isVisited ? '#2563EB' : '#9CA3AF',
                        cursor: 'pointer'
                      },
                      pressed: { outline: 'none' },
                    }}
                  />
                )
              })
            }
          </Geographies>
        </ComposableMap>
        {tooltip && tooltip.code && (
          <div
            className="absolute pointer-events-none z-[9999] bg-gray-900 text-white text-xs font-semibold px-2 py-1 rounded shadow-lg whitespace-nowrap"
            style={{
              left: `${Math.max(10, tooltip.x + 10)}px`,
              top: `${Math.max(10, tooltip.y - 10)}px`,
              transform: 'translateY(-100%)',
            }}
          >
            {tooltip.code}
          </div>
        )}
      </div>
      <div className="mt-4 flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-gray-700">Visited ({normalizedCodes.size})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-400 rounded"></div>
          <span className="text-gray-700">Not Visited</span>
        </div>
      </div>
    </div>
  )
}

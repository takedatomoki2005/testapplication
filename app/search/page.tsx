'use client'

import { useState, FormEvent } from 'react'

const searchEngines = [
  {
    name: 'Google',
    url: 'https://www.google.com/search?q=',
    color: 'bg-blue-500 hover:bg-blue-600',
    icon: '🔍'
  },
  {
    name: 'Yahoo',
    url: 'https://search.yahoo.com/search?p=',
    color: 'bg-purple-500 hover:bg-purple-600',
    icon: '🔎'
  },
  {
    name: 'Bing',
    url: 'https://www.bing.com/search?q=',
    color: 'bg-green-500 hover:bg-green-600',
    icon: '🌐'
  },
  {
    name: 'DuckDuckGo',
    url: 'https://duckduckgo.com/?q=',
    color: 'bg-yellow-500 hover:bg-yellow-600',
    icon: '🦆'
  },
  {
    name: 'Baidu',
    url: 'https://www.baidu.com/s?wd=',
    color: 'bg-red-500 hover:bg-red-600',
    icon: '🇨🇳'
  },
  {
    name: 'Yandex',
    url: 'https://yandex.com/search/?text=',
    color: 'bg-orange-500 hover:bg-orange-600',
    icon: '🔴'
  }
]

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [selectedEngines, setSelectedEngines] = useState<Set<string>>(
    new Set(['Google', 'Yahoo'])
  )

  const handleSearch = (engine: typeof searchEngines[0], e?: FormEvent) => {
    e?.preventDefault()
    if (!query.trim()) return

    const encodedQuery = encodeURIComponent(query.trim())
    const searchUrl = `${engine.url}${encodedQuery}`
    window.open(searchUrl, '_blank', 'noopener,noreferrer')
  }

  const handleMultiSearch = (e: FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    selectedEngines.forEach(engineName => {
      const engine = searchEngines.find(e => e.name === engineName)
      if (engine) {
        handleSearch(engine)
      }
    })
  }

  const toggleEngine = (engineName: string) => {
    const newSelected = new Set(selectedEngines)
    if (newSelected.has(engineName)) {
      newSelected.delete(engineName)
    } else {
      newSelected.add(engineName)
    }
    setSelectedEngines(newSelected)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
            複数検索エンジン検索
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Multiple Search Engine Search
          </p>

          {/* Search Form */}
          <form onSubmit={handleMultiSearch} className="mb-8">
            <div className="flex gap-4 mb-6">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="検索キーワードを入力..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
              <button
                type="submit"
                disabled={!query.trim() || selectedEngines.size === 0}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold text-lg transition-colors"
              >
                選択した検索エンジンで検索
              </button>
            </div>

            {/* Search Engine Selection */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                検索エンジンを選択 ({selectedEngines.size} 個選択中)
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {searchEngines.map((engine) => (
                  <button
                    key={engine.name}
                    type="button"
                    onClick={() => toggleEngine(engine.name)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedEngines.has(engine.name)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{engine.icon}</div>
                    <div className="text-sm font-medium text-gray-700">
                      {engine.name}
                    </div>
                    {selectedEngines.has(engine.name) && (
                      <div className="text-xs text-blue-600 mt-1">✓ 選択中</div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </form>

          {/* Individual Search Buttons */}
          <div className="border-t pt-6">
            <p className="text-sm font-semibold text-gray-700 mb-4">
              個別に検索
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {searchEngines.map((engine) => (
                <button
                  key={engine.name}
                  onClick={() => handleSearch(engine)}
                  disabled={!query.trim()}
                  className={`${engine.color} text-white px-4 py-3 rounded-lg font-semibold transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                >
                  <span>{engine.icon}</span>
                  <span>{engine.name}で検索</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


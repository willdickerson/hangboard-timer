import React, { useEffect, useState } from 'react'
import Timer from './components/Timer'

const App: React.FC = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme')
      if (stored) {
        return stored === 'dark'
      }
      return true
    }
    return true
  })

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  return (
    <div
      className={`fixed inset-0 flex flex-col 
      ${
        isDark
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200'
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-50 text-gray-800'
      }`}
    >
      <div
        className={`shrink-0 border-b ${
          isDark ? 'border-gray-700/50' : 'border-gray-200'
        }`}
      >
        <header className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-xl tracking-wide bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              Hangboard Timer
            </span>
          </div>

          <nav className="flex items-center space-x-4">
            <a
              href="https://github.com/willdickerson/hangboard-timer"
              className={`group text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} hover:text-green-400 transition-colors flex items-center gap-2`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                role="img"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-600'} group-hover:text-green-400 transition-colors`}
              >
                <title>GitHub icon</title>
                <path d="M12 .3a12 12 0 0 0-3.789 23.418c.6.113.82-.26.82-.577v-2.234c-3.338.725-4.04-1.418-4.04-1.418-.547-1.386-1.338-1.757-1.338-1.757-1.094-.748.084-.733.084-.733 1.21.084 1.845 1.24 1.845 1.24 1.076 1.852 2.83 1.317 3.515 1.007.108-.8.42-1.317.763-1.62-2.665-.3-5.467-1.334-5.467-5.934 0-1.313.47-2.387 1.24-3.228-.124-.302-.54-1.523.12-3.176 0 0 1.012-.324 3.31 1.23a10.84 10.84 0 0 1 6.018 0c2.3-1.554 3.31-1.23 3.31-1.23.66 1.653.244 2.874.12 3.176.77.84 1.24 1.915 1.24 3.228 0 4.61-2.807 5.633-5.48 5.928.42.36.81 1.1.81 2.22v3.293c0 .31.21.698.82.58A12 12 0 0 0 12 .3" />
              </svg>
              GitHub
            </a>
          </nav>
        </header>
      </div>

      <main className="flex-1 overflow-y-auto mt-10">
        <div className="min-h-full w-full flex justify-center px-6">
          <Timer isDark={isDark} onThemeToggle={() => setIsDark(!isDark)} />
        </div>
      </main>

      <div
        className={`shrink-0 border-t ${
          isDark ? 'border-gray-700/50' : 'border-gray-200'
        }`}
      >
        <footer className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-center">
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            Made by{' '}
            <a
              href="https://github.com/willdickerson"
              className="text-green-400 hover:text-green-300 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              @willdickerson
            </a>
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App

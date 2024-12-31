import React from 'react'
import { Sun, Moon } from 'lucide-react'

interface ThemeToggleProps {
  isDark: boolean
  onToggle: () => void
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="p-2 rounded-lg hover:bg-gray-700/50 dark:hover:bg-gray-700/50 hover:bg-gray-200/50 transition-colors"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  )
}

export default ThemeToggle

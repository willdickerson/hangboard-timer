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
      className={`relative p-2 rounded-lg overflow-hidden
        before:absolute before:inset-0 before:transition-opacity before:duration-300
        before:bg-gray-100 dark:before:bg-gray-700/50
        hover:before:opacity-100 before:opacity-0
      `}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="relative z-10">
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </span>
    </button>
  )
}

export default ThemeToggle

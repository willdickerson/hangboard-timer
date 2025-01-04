import React from 'react'
import { Volume2, VolumeX, Dumbbell } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

interface TimerHeaderProps {
  isMuted: boolean
  showSettings: boolean
  isDark: boolean
  onMuteToggle: () => void
  onSettingsToggle: () => void
  onThemeToggle: () => void
}

const TimerHeader: React.FC<TimerHeaderProps> = ({
  isMuted,
  showSettings,
  isDark,
  onMuteToggle,
  onSettingsToggle,
  onThemeToggle,
}) => {
  return (
    <div className="flex justify-end space-x-2">
      <button
        onClick={onMuteToggle}
        className={`relative p-2 rounded-lg overflow-hidden
          before:absolute before:inset-0 before:transition-opacity before:duration-300
          before:bg-gray-100 dark:before:bg-gray-700/50
          hover:before:opacity-100 before:opacity-0
        `}
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        <span className="relative z-10">
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </span>
      </button>

      <ThemeToggle isDark={isDark} onToggle={onThemeToggle} />

      <button
        onClick={onSettingsToggle}
        className={`relative p-2 rounded-lg overflow-hidden
          ${showSettings ? 'text-green-400 dark:text-green-400' : ''}
          before:absolute before:inset-0 before:transition-opacity before:duration-300
          ${
            showSettings
              ? 'before:opacity-100 before:bg-gray-100 dark:before:bg-gray-700/50'
              : 'before:opacity-0 hover:before:opacity-100 before:bg-gray-100 dark:before:bg-gray-700/50'
          }
        `}
        aria-label="Toggle Settings"
      >
        <span className="relative z-10">
          <Dumbbell size={20} />
        </span>
      </button>
    </div>
  )
}

export default TimerHeader

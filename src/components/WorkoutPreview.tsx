import React from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { WorkoutPreviewProps } from '../types/workout'

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const WorkoutPreview: React.FC<WorkoutPreviewProps> = ({
  steps,
  currentStep,
  isExpanded,
  onToggle,
  isDark,
}) => {
  return (
    <div
      className={`w-full ${
        isDark ? 'bg-gray-800/50' : 'bg-white'
      } backdrop-blur-sm rounded-xl overflow-hidden border ${
        isDark ? 'border-gray-700' : 'border-gray-200'
      }`}
    >
      <button
        onClick={onToggle}
        className={`w-full p-4 flex items-center justify-between ${
          isDark
            ? 'text-gray-200 hover:bg-gray-700/50'
            : 'text-gray-600 hover:bg-gray-100'
        } transition-colors`}
        aria-expanded={isExpanded}
        aria-controls="workout-steps"
      >
        <span className="font-medium">Workout Overview</span>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {isExpanded && (
        <div id="workout-steps" className="p-4 max-h-96 overflow-y-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex justify-between py-3 px-4 rounded-lg mb-2 transition-colors ${
                index === currentStep
                  ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-600'
                  : `${isDark ? 'text-gray-300 hover:bg-gray-700/30' : 'text-gray-600 hover:bg-gray-50'}`
              }`}
              aria-current={index === currentStep ? 'step' : undefined}
            >
              <span>{step.name}</span>
              <span className="font-mono">{formatTime(step.duration)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default WorkoutPreview

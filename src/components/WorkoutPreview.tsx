import React from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { WorkoutStep } from '../types/workout'

interface WorkoutPreviewProps {
  steps: readonly WorkoutStep[]
  currentStep: number
  isExpanded: boolean
  onToggle: () => void
  isDark: boolean
  workoutName: string
  onStepClick?: (index: number) => void
}

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
  workoutName,
  onStepClick,
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
        className={`w-full p-4 flex items-center justify-between hover:transition-colors ${
          isDark
            ? 'text-gray-200 hover:bg-gray-700/50'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        aria-expanded={isExpanded}
        aria-controls="workout-steps"
      >
        <div className="flex items-center gap-2">
          <span className="font-medium">Workout Overview</span>
          <span
            className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
          >
            / {workoutName}
            <span className="ml-1 opacity-75">
              (
              {Math.round(
                steps.reduce((acc, step) => acc + step.duration, 0) / 60
              )}
              m)
            </span>
          </span>
        </div>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {isExpanded && (
        <div
          id="workout-steps"
          data-testid="workout-steps"
          role="region"
          aria-label="Workout steps"
          className={`p-4 max-h-96 overflow-y-auto scrollbar-thin ${
            isDark
              ? 'scrollbar-thumb-gray-600 scrollbar-track-gray-800/50'
              : 'scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-track-transparent'
          }`}
        >
          {steps.map((step, index) => (
            <button
              key={index}
              onClick={() => onStepClick?.(index)}
              disabled={!onStepClick}
              className={`w-full p-2 rounded text-left transition-colors ${
                index === currentStep
                  ? isDark
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-green-50 text-green-600'
                  : isDark
                    ? 'hover:bg-gray-700/50 text-gray-300'
                    : 'hover:bg-gray-50 text-gray-600'
              } ${onStepClick ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <div className="flex justify-between items-center">
                <span>{step.name}</span>
                <span
                  className={`text-sm ${
                    index === currentStep
                      ? ''
                      : isDark
                        ? 'text-gray-500'
                        : 'text-gray-400'
                  }`}
                >
                  {formatTime(step.duration)}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default WorkoutPreview

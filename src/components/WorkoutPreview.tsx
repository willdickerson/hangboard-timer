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
}) => {
  return (
    <div className="w-full bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between text-gray-200 hover:bg-gray-700/50 transition-colors"
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
                  ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                  : 'text-gray-300 hover:bg-gray-700/30'
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

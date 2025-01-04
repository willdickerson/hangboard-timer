import React from 'react'
import type { Workout } from '../workouts/types'

interface WorkoutSettingsProps {
  workouts: Record<string, Workout>
  selectedWorkoutId: string
  onWorkoutChange: (workoutId: string) => void
  isDark: boolean
}

const WorkoutSettings: React.FC<WorkoutSettingsProps> = ({
  workouts,
  selectedWorkoutId,
  onWorkoutChange,
  isDark,
}) => {
  return (
    <div
      className={`${
        isDark ? 'bg-gray-800/50' : 'bg-white'
      } p-4 rounded-xl border ${
        isDark ? 'border-gray-700' : 'border-gray-200'
      } text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
    >
      <h3
        className={`font-medium ${
          isDark ? 'text-white' : 'text-gray-600'
        } mb-4`}
      >
        Workout Selection
      </h3>
      <div className="space-y-3">
        {Object.values(workouts).map(workout => (
          <button
            key={workout.id}
            onClick={() => onWorkoutChange(workout.id)}
            className={`w-full p-3 text-left rounded-lg border transition-all duration-200 
              ${
                selectedWorkoutId === workout.id
                  ? 'border-green-500/50 bg-green-500/10 text-green-500'
                  : `${
                      isDark
                        ? 'border-gray-700/50 hover:bg-gray-700/20 text-gray-300 border-transparent'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-600 border-transparent'
                    }`
              }`}
          >
            <div>
              <span className="font-medium">{workout.name}</span>
              <p className="text-xs mt-1 opacity-75">
                Duration: {Math.round(workout.duration / 60)}m
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default WorkoutSettings

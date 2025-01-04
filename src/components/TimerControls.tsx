import React from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'

interface TimerControlsProps {
  isStarted: boolean
  isPaused: boolean
  currentStepIndex: number
  onStart: () => void
  onPause: () => void
  onReset: () => void
}

const TimerControls: React.FC<TimerControlsProps> = ({
  isStarted,
  isPaused,
  currentStepIndex,
  onStart,
  onPause,
  onReset,
}) => {
  return (
    <div className="flex justify-center gap-4 mt-6">
      {!isStarted && currentStepIndex === -1 ? (
        <button
          onClick={onStart}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 
            text-white px-8 py-4 rounded-xl flex items-center gap-2 font-medium 
            transition-all duration-300 transform hover:scale-105"
          aria-label="Start Workout"
        >
          <Play size={24} /> Start Workout
        </button>
      ) : (
        <>
          {currentStepIndex !== -2 && (
            <button
              onClick={onPause}
              className={`px-6 py-3 rounded-xl flex items-center gap-2 font-medium 
                ${isPaused ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-amber-600 hover:bg-amber-700'} 
                text-white transition-all duration-300`}
              aria-label={isPaused ? 'Resume Workout' : 'Pause Workout'}
            >
              {isPaused ? <Play size={20} /> : <Pause size={20} />}
              {isPaused ? 'Resume' : 'Pause'}
            </button>
          )}
          <button
            onClick={onReset}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 
              font-medium transition-all duration-300"
            aria-label="Reset Workout"
          >
            <RotateCcw size={20} /> Reset
          </button>
        </>
      )}
    </div>
  )
}

export default TimerControls

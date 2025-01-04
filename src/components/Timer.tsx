import React, { useState, useCallback } from 'react'
import WorkoutPreview from './WorkoutPreview'
import ProgressBar from './ProgressBar'
import TimerHeader from './TimerHeader'
import TimerControls from './TimerControls'
import WorkoutSettings from './WorkoutSettings'
import { workouts } from '../workouts'
import { useTimer } from '../hooks/useTimer'
import { formatTime } from '../utils/time'

interface TimerProps {
  isDark: boolean
  onThemeToggle: () => void
}

const Timer: React.FC<TimerProps> = ({ isDark, onThemeToggle }) => {
  const [isPreviewExpanded, setIsPreviewExpanded] = useState<boolean>(false)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [showSettings, setShowSettings] = useState<boolean>(false)
  const [selectedWorkoutId, setSelectedWorkoutId] =
    useState<string>('dave-macleod')

  const currentWorkout = workouts[selectedWorkoutId]
  const {
    currentStepIndex,
    timeLeft,
    isPaused,
    isStarted,
    getNextStepName,
    getCurrentStepName,
    startTimer,
    resetTimer,
    togglePause,
    jumpToStep,
  } = useTimer(currentWorkout)

  const handleWorkoutChange = useCallback(
    (workoutId: string) => {
      if (isStarted) {
        resetTimer()
      }
      setSelectedWorkoutId(workoutId)
    },
    [isStarted, resetTimer]
  )

  return (
    <div className="w-full max-w-md space-y-4 py-2">
      <TimerHeader
        isMuted={isMuted}
        showSettings={showSettings}
        isDark={isDark}
        onMuteToggle={() => setIsMuted(!isMuted)}
        onSettingsToggle={() => setShowSettings(!showSettings)}
        onThemeToggle={onThemeToggle}
      />

      {showSettings && (
        <WorkoutSettings
          workouts={workouts}
          selectedWorkoutId={selectedWorkoutId}
          onWorkoutChange={handleWorkoutChange}
          isDark={isDark}
        />
      )}

      <WorkoutPreview
        steps={currentWorkout.steps}
        currentStep={currentStepIndex}
        isExpanded={isPreviewExpanded}
        onToggle={() => setIsPreviewExpanded(!isPreviewExpanded)}
        isDark={isDark}
        workoutName={currentWorkout.name}
        onStepClick={jumpToStep}
      />

      <div
        className={`${
          isDark ? 'bg-gray-800/50' : 'bg-white'
        } p-6 rounded-xl border ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}
      >
        <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
          {getCurrentStepName()}
        </h1>

        <div
          className={`text-7xl font-bold my-6 font-mono tabular-nums ${
            isDark ? 'text-gray-100' : 'text-gray-800'
          }`}
        >
          {formatTime(timeLeft)}
        </div>

        {getNextStepName() && (
          <div className={isDark ? 'text-gray-400' : 'text-gray-500'}>
            Next: {getNextStepName()}
          </div>
        )}
        <ProgressBar
          current={currentStepIndex + 1}
          total={currentWorkout.steps.length}
          isDark={isDark}
        />

        <TimerControls
          isStarted={isStarted}
          isPaused={isPaused}
          currentStepIndex={currentStepIndex}
          onStart={() => startTimer(isMuted)}
          onPause={togglePause}
          onReset={resetTimer}
        />
      </div>

      <div className={isDark ? 'text-gray-400' : 'text-gray-500'}>
        <p className="text-sm text-center">
          Workout adapted from {currentWorkout.attribution.name}{' '}
          <a
            href={currentWorkout.attribution.url}
            className="text-green-400 hover:text-green-300 underline transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            follow along workout
          </a>
          .
        </p>
      </div>
    </div>
  )
}

export default Timer

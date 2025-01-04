import React, { useState, useEffect, useCallback } from 'react'
import NoSleep from 'nosleep.js'

import WorkoutPreview from './WorkoutPreview'
import ProgressBar from './ProgressBar'
import TimerHeader from './TimerHeader'
import TimerControls from './TimerControls'
import WorkoutSettings from './WorkoutSettings'
import { sounds } from '../audio/sounds'
import { formatTime } from '../utils/time'
import { workouts } from '../workouts'
import type { SoundType } from '../types/workout'

const noSleep = new NoSleep()

interface TimerProps {
  isDark: boolean
  onThemeToggle: () => void
}

const Timer: React.FC<TimerProps> = ({ isDark, onThemeToggle }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1)
  const [timeLeft, setTimeLeft] = useState<number>(15)
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const [isPreviewExpanded, setIsPreviewExpanded] = useState<boolean>(false)
  const [isStarted, setIsStarted] = useState<boolean>(false)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [showSettings, setShowSettings] = useState<boolean>(false)
  const [isAudioUnlocked, setIsAudioUnlocked] = useState<boolean>(false)
  const [selectedWorkoutId, setSelectedWorkoutId] =
    useState<string>('dave-macleod')

  const currentWorkout = workouts[selectedWorkoutId]

  const unlockAudio = useCallback(async (): Promise<void> => {
    try {
      const playPromises = Object.values(sounds).map(async audio => {
        audio.muted = true
        try {
          await audio.play()
          await audio.pause()
          audio.currentTime = 0
        } catch (error) {
          console.error('Error in unlockAudio:', error)
        }
      })
      await Promise.all(playPromises)
      Object.values(sounds).forEach(audio => {
        audio.muted = false
      })
      setIsAudioUnlocked(true)
    } catch (error) {
      console.error('Error in unlockAudio:', error)
    }
  }, [])

  const playSound = useCallback(
    (type: SoundType) => {
      if (!isMuted && sounds[type]) {
        sounds[type].currentTime = 0
        sounds[type].play().catch((error: Error) => {
          console.log('Error playing sound:', error)
          if (!isAudioUnlocked) {
            unlockAudio()
          }
        })
      }
    },
    [isMuted, isAudioUnlocked, unlockAudio]
  )

  const nextStep = useCallback(() => {
    const nextStepIndex = currentStepIndex + 1
    if (nextStepIndex >= currentWorkout.steps.length) {
      setCurrentStepIndex(-2) // Set to complete state
      setIsStarted(false)
      playSound('rest')
      return
    }

    setCurrentStepIndex(nextStepIndex)
    setTimeLeft(currentWorkout.steps[nextStepIndex].duration)
    playSound(currentWorkout.steps[nextStepIndex].sound)
  }, [currentStepIndex, currentWorkout.steps, playSound])

  const getNextStepName = useCallback((): string => {
    if (currentStepIndex === -1) {
      return currentWorkout.steps[0]?.name || ''
    }
    const nextIndex = currentStepIndex + 1
    if (nextIndex >= currentWorkout.steps.length) {
      return ''
    }
    return currentWorkout.steps[nextIndex]?.name || ''
  }, [currentStepIndex, currentWorkout.steps])

  const getCurrentStepName = useCallback((): string => {
    if (currentStepIndex === -1) return 'Get Ready!'
    if (currentStepIndex === -2) return 'Workout Complete!'
    return currentWorkout.steps[currentStepIndex]?.name || 'Unknown Step'
  }, [currentStepIndex, currentWorkout.steps])

  useEffect(() => {
    let interval: number | null = null

    if (isStarted && currentStepIndex >= -1 && !isPaused) {
      interval = window.setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 0) {
            if (interval) clearInterval(interval)
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isStarted, currentStepIndex, isPaused])

  useEffect(() => {
    if (isStarted && timeLeft === 0) {
      if (currentStepIndex === -1) {
        if (currentWorkout.steps.length > 0) {
          setCurrentStepIndex(0)
          setTimeLeft(currentWorkout.steps[0].duration)
          playSound(currentWorkout.steps[0].sound)
        }
      } else {
        nextStep()
      }
    }
  }, [
    timeLeft,
    isStarted,
    currentStepIndex,
    nextStep,
    playSound,
    currentWorkout.steps,
  ])

  const startTimer = useCallback(async () => {
    if (currentStepIndex === -1) {
      if (!isAudioUnlocked) {
        await unlockAudio()
      }
      noSleep.enable()
      setIsStarted(true)
      setTimeLeft(15)
      playSound('begin')
    }
  }, [currentStepIndex, isAudioUnlocked, unlockAudio, playSound])

  const resetTimer = useCallback(() => {
    setCurrentStepIndex(-1)
    setTimeLeft(15)
    setIsPaused(false)
    setIsStarted(false)
    noSleep.disable()
  }, [])

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev)
  }, [])

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
          onStart={startTimer}
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

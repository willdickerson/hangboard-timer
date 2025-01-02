import React, { useState, useEffect, useCallback } from 'react'
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Settings,
} from 'lucide-react'
import NoSleep from 'nosleep.js'

import WorkoutPreview from './WorkoutPreview'
import ProgressBar from './ProgressBar'
import {
  DAVE_MACLEOD_WORKOUT,
  EMIL_ABRAHAMSSON_WORKOUT,
  sounds,
  formatTime,
} from '../constants/workout'
import type { SoundType } from '../types/workout'

const noSleep = new NoSleep()

interface TimerProps {
  isDark: boolean
  onThemeToggle: () => void
}

const WORKOUTS = {
  daveMacleod: {
    steps: DAVE_MACLEOD_WORKOUT,
    attribution: {
      name: "Dave MacLeod's",
      url: 'https://www.youtube.com/watch?v=PebF3NyEGPc',
    },
  },
  emilAbrahamsson: {
    steps: EMIL_ABRAHAMSSON_WORKOUT,
    attribution: {
      name: "Emil Abrahamsson's",
      url: 'https://www.youtube.com/watch?v=3FNZdixeuZw',
    },
  },
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
  const [selectedWorkout, setSelectedWorkout] = useState<
    'daveMacleod' | 'emilAbrahamsson'
  >('daveMacleod')

  const currentWorkout = WORKOUTS[selectedWorkout]

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

  const handleWorkoutChange = (workout: 'daveMacleod' | 'emilAbrahamsson') => {
    if (isStarted) {
      resetTimer()
    }
    setSelectedWorkout(workout)
  }

  return (
    <div className="w-full max-w-md space-y-4 py-2">
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`p-2 rounded-lg ${
            isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100'
          } transition-colors`}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>

        <button
          onClick={onThemeToggle}
          className={`p-2 rounded-lg ${
            isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100'
          } transition-colors`}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`p-2 rounded-lg ${
            isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100'
          } transition-colors`}
          aria-label="Toggle Settings"
        >
          <Settings size={20} />
        </button>
      </div>

      {showSettings && (
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
            <button
              onClick={() => handleWorkoutChange('daveMacleod')}
              className={`w-full p-3 text-left rounded-lg border transition-all duration-200 
                ${
                  selectedWorkout === 'daveMacleod'
                    ? 'border-green-500/50 bg-green-500/10 text-green-500'
                    : `${
                        isDark
                          ? 'border-gray-700/50 hover:bg-gray-700/20 text-gray-300 border-transparent'
                          : 'border-gray-200 hover:bg-gray-50 text-gray-600 border-transparent'
                      }`
                }`}
            >
              <span className="font-medium">Dave&apos;s 30m Routine</span>
            </button>

            <button
              onClick={() => handleWorkoutChange('emilAbrahamsson')}
              className={`w-full p-3 text-left rounded-lg border transition-all duration-200 
                ${
                  selectedWorkout === 'emilAbrahamsson'
                    ? 'border-green-500/50 bg-green-500/10 text-green-500'
                    : `${
                        isDark
                          ? 'border-gray-700/50 hover:bg-gray-700/20 text-gray-300 border-transparent'
                          : 'border-gray-200 hover:bg-gray-50 text-gray-600 border-transparent'
                      }`
                }`}
            >
              <span className="font-medium">Emil&apos;s 10m Routine</span>
            </button>
          </div>
        </div>
      )}

      <WorkoutPreview
        steps={currentWorkout.steps}
        currentStep={currentStepIndex}
        isExpanded={isPreviewExpanded}
        onToggle={() => setIsPreviewExpanded(!isPreviewExpanded)}
        isDark={isDark}
        workoutName={
          selectedWorkout === 'daveMacleod'
            ? "Dave's 30m Routine"
            : "Emil's 10m Routine"
        }
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

        <div className="flex justify-center gap-4 mt-6">
          {!isStarted && currentStepIndex === -1 ? (
            <button
              onClick={startTimer}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 
                text-white px-8 py-4 rounded-xl flex items-center gap-2 font-medium 
                transition-all duration-300 transform hover:scale-105"
              aria-label="Start Workout"
            >
              <Play size={24} /> Start Workout
            </button>
          ) : (
            <>
              <button
                onClick={togglePause}
                className={`px-6 py-3 rounded-xl flex items-center gap-2 font-medium transition-all duration-300 
                  ${isPaused ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-amber-600 hover:bg-amber-700'} 
                  text-white`}
                disabled={currentStepIndex === -2}
                aria-label={isPaused ? 'Resume Workout' : 'Pause Workout'}
              >
                {isPaused ? <Play size={20} /> : <Pause size={20} />}
                {isPaused ? 'Resume' : 'Pause'}
              </button>
              <button
                onClick={resetTimer}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 
                  font-medium transition-colors"
                aria-label="Reset Workout"
              >
                <RotateCcw size={20} /> Reset
              </button>
            </>
          )}
        </div>
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

import React from 'react'
import { useState, useEffect, useCallback } from 'react'
import { Play, Pause, RotateCcw, Volume2, VolumeX, Info } from 'lucide-react'
import NoSleep from 'nosleep.js'

import WorkoutPreview from './WorkoutPreview'
import ProgressBar from './ProgressBar'
import { WORKOUT_STEPS, sounds, formatTime } from '../constants/workout'

const noSleep = new NoSleep()

const Timer = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(-1)
  const [timeLeft, setTimeLeft] = useState(15)
  const [isPaused, setIsPaused] = useState(false)
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false)
  const [isStarted, setIsStarted] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [isAudioUnlocked, setIsAudioUnlocked] = useState(false)

  const unlockAudio = useCallback(async () => {
    for (const audio of Object.values(sounds)) {
      audio.muted = true
      try {
        await audio.play()
        audio.pause()
        audio.currentTime = 0
      } catch (error) {
        console.log('Error unlocking audio:', error)
      }
    }
    for (const audio of Object.values(sounds)) {
      audio.muted = false
    }
    setIsAudioUnlocked(true)
  }, [])

  const playSound = useCallback(
    type => {
      if (!isMuted && sounds[type]) {
        sounds[type].currentTime = 0
        sounds[type].play().catch(error => {
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
    if (currentStepIndex + 1 < WORKOUT_STEPS.length) {
      const nextStepIndex = currentStepIndex + 1
      setCurrentStepIndex(nextStepIndex)
      setTimeLeft(WORKOUT_STEPS[nextStepIndex].duration)
      playSound(WORKOUT_STEPS[nextStepIndex].sound)
    } else {
      setCurrentStepIndex(-2)
      setIsStarted(false)
      playSound('rest')
    }
  }, [currentStepIndex, playSound])

  useEffect(() => {
    let interval = null

    if (isStarted && currentStepIndex >= -1 && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1)
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [currentStepIndex, isPaused, timeLeft, isStarted])

  useEffect(() => {
    if (isStarted && timeLeft === 0) {
      if (currentStepIndex === -1) {
        setCurrentStepIndex(0)
        setTimeLeft(WORKOUT_STEPS[0].duration)
        playSound(WORKOUT_STEPS[0].sound)
      } else {
        nextStep()
      }
    }
  }, [timeLeft, isStarted, currentStepIndex, nextStep, playSound])

  const startTimer = useCallback(async () => {
    if (currentStepIndex === -1) {
      if (!isAudioUnlocked) {
        await unlockAudio()
      }

      noSleep.enable()
      setIsStarted(true)
      setTimeLeft(15)
      setCurrentStepIndex(-1)
      playSound('begin')
    }
  }, [currentStepIndex, isAudioUnlocked, unlockAudio, playSound])

  const resetTimer = useCallback(() => {
    setCurrentStepIndex(-1)
    setTimeLeft(15)
    setIsPaused(false)
    setIsStarted(false)
  }, [])

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev)
  }, [])

  const getCurrentStepName = useCallback(() => {
    if (currentStepIndex === -1) return 'Get Ready!'
    if (currentStepIndex === -2) return 'Workout Complete!'
    return WORKOUT_STEPS[currentStepIndex].name
  }, [currentStepIndex])

  const getNextStepName = useCallback(() => {
    if (currentStepIndex === -1) return WORKOUT_STEPS[0].name
    if (currentStepIndex >= WORKOUT_STEPS.length - 1) return ''
    return WORKOUT_STEPS[currentStepIndex + 1].name
  }, [currentStepIndex])

  return (
    <div className="w-full max-w-md space-y-4 py-2">
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
          aria-label="Toggle Information"
        >
          <Info size={20} />
        </button>
      </div>

      {showInfo && (
        <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-700 text-sm text-gray-300">
          <h3 className="font-medium text-white mb-2">About this workout</h3>
          <p>
            This hangboard workout is designed for intermediate climbers to
            improve finger strength and endurance. Always warm up properly and
            listen to your body. Stop if you experience any pain.
          </p>
        </div>
      )}

      <WorkoutPreview
        steps={WORKOUT_STEPS}
        currentStep={currentStepIndex}
        isExpanded={isPreviewExpanded}
        onToggle={() => setIsPreviewExpanded(!isPreviewExpanded)}
      />

      <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 shadow-lg">
        <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
          {getCurrentStepName()}
        </h1>

        <div className="text-7xl font-bold my-6 font-mono tabular-nums">
          {formatTime(timeLeft)}
        </div>

        {getNextStepName() && (
          <div className="text-gray-400 mb-4">Next: {getNextStepName()}</div>
        )}

        <ProgressBar
          current={currentStepIndex + 1}
          total={WORKOUT_STEPS.length}
        />

        <div className="flex justify-center gap-4 mt-6">
          {!isStarted && currentStepIndex === -1 ? (
            <button
              onClick={startTimer}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 
                         text-white px-8 py-4 rounded-xl flex items-center gap-2 font-medium shadow-lg 
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
                  ${
                    isPaused
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-yellow-600 hover:bg-yellow-700'
                  }`}
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

      <div className="text-gray-400 text-sm text-center">
        Workout adapted from Dave MacLeod&apos;s&nbsp;
        <a
          href="https://www.youtube.com/watch?v=PebF3NyEGPc"
          className="text-green-400 hover:text-green-300 underline transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          follow along workout
        </a>
        .
      </div>
    </div>
  )
}

export default Timer

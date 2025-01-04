import { useState, useEffect, useCallback } from 'react'
import NoSleep from 'nosleep.js'
import { sounds } from '../audio/sounds'
import type { SoundType, Workout } from '../types/workout'
import {
  TIMER_STATES,
  COUNTDOWN_DURATION,
  TIMER_INTERVAL,
  MESSAGES,
} from '../constants/timer'

const noSleep = new NoSleep()

export const useTimer = (workout: Workout) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(
    TIMER_STATES.READY
  )
  const [timeLeft, setTimeLeft] = useState<number>(COUNTDOWN_DURATION)
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const [isStarted, setIsStarted] = useState<boolean>(false)
  const [isAudioUnlocked, setIsAudioUnlocked] = useState<boolean>(false)

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
    (type: SoundType, isMuted: boolean) => {
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
    [isAudioUnlocked, unlockAudio]
  )

  const nextStep = useCallback(
    (isMuted: boolean) => {
      const nextStepIndex = currentStepIndex + 1
      if (nextStepIndex >= workout.steps.length) {
        setCurrentStepIndex(TIMER_STATES.COMPLETE)
        setIsStarted(false)
        playSound('rest', isMuted)
        return
      }

      setCurrentStepIndex(nextStepIndex)
      setTimeLeft(workout.steps[nextStepIndex].duration)
      playSound(workout.steps[nextStepIndex].sound, isMuted)
    },
    [currentStepIndex, workout.steps, playSound]
  )

  const getNextStepName = useCallback((): string => {
    if (currentStepIndex === TIMER_STATES.READY) {
      return workout.steps[0]?.name || ''
    }
    const nextIndex = currentStepIndex + 1
    if (nextIndex >= workout.steps.length) {
      return ''
    }
    return workout.steps[nextIndex]?.name || ''
  }, [currentStepIndex, workout.steps])

  const getCurrentStepName = useCallback((): string => {
    if (currentStepIndex === TIMER_STATES.READY) return MESSAGES.GET_READY
    if (currentStepIndex === TIMER_STATES.COMPLETE)
      return MESSAGES.WORKOUT_COMPLETE
    return workout.steps[currentStepIndex]?.name || MESSAGES.UNKNOWN_STEP
  }, [currentStepIndex, workout.steps])

  useEffect(() => {
    let interval: number | null = null

    if (isStarted && currentStepIndex >= TIMER_STATES.READY && !isPaused) {
      interval = window.setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 0) {
            if (interval) clearInterval(interval)
            return 0
          }
          return prevTime - 1
        })
      }, TIMER_INTERVAL)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isStarted, currentStepIndex, isPaused])

  useEffect(() => {
    if (isStarted && timeLeft === 0) {
      if (currentStepIndex === TIMER_STATES.READY) {
        if (workout.steps.length > 0) {
          setCurrentStepIndex(0)
          setTimeLeft(workout.steps[0].duration)
          playSound(workout.steps[0].sound, false)
        }
      } else {
        nextStep(false)
      }
    }
  }, [
    timeLeft,
    isStarted,
    currentStepIndex,
    nextStep,
    playSound,
    workout.steps,
  ])

  const startTimer = useCallback(
    async (isMuted: boolean) => {
      if (currentStepIndex === TIMER_STATES.READY) {
        if (!isAudioUnlocked) {
          await unlockAudio()
        }
        noSleep.enable()
        setIsStarted(true)
        setTimeLeft(COUNTDOWN_DURATION)
        playSound('begin', isMuted)
      }
    },
    [currentStepIndex, isAudioUnlocked, unlockAudio, playSound]
  )

  const resetTimer = useCallback(() => {
    setCurrentStepIndex(TIMER_STATES.READY)
    setTimeLeft(COUNTDOWN_DURATION)
    setIsPaused(false)
    setIsStarted(false)
    noSleep.disable()
  }, [])

  return {
    currentStepIndex,
    timeLeft,
    isPaused,
    isStarted,
    getNextStepName,
    getCurrentStepName,
    startTimer,
    resetTimer,
    togglePause: () => setIsPaused(prev => !prev),
  }
}

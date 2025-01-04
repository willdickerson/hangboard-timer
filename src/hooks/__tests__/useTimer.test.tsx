import { renderHook, act } from '@testing-library/react'
import { describe, it, vi, expect, beforeEach } from 'vitest'
import { useTimer } from '../useTimer'
import type { Workout } from '../../types/workout'
import { TIMER_STATES } from '../../constants/timer'

// Mock NoSleep
vi.mock('nosleep.js', () => ({
  default: vi.fn().mockImplementation(() => ({
    enable: vi.fn(),
    disable: vi.fn(),
  })),
}))

// Mock audio
vi.mock('../../audio/sounds', () => ({
  sounds: {
    begin: {
      play: vi.fn().mockImplementation(() => Promise.resolve()),
      pause: vi.fn(),
      currentTime: 0,
      muted: false,
    },
    hang: {
      play: vi.fn().mockImplementation(() => Promise.resolve()),
      pause: vi.fn(),
      currentTime: 0,
      muted: false,
    },
    rest: {
      play: vi.fn().mockImplementation(() => Promise.resolve()),
      pause: vi.fn(),
      currentTime: 0,
      muted: false,
    },
  },
}))

// Import the mocked sounds after the mock is defined
const { sounds: mockSounds } = await import('../../audio/sounds')

const mockWorkout: Workout = {
  id: 'test',
  name: 'Test Workout',
  description: 'Test Description',
  duration: 30,
  attribution: {
    name: 'Test Author',
    url: 'https://test.com',
  },
  steps: [
    { name: 'Step 1', duration: 10, sound: 'hang' },
    { name: 'Step 2', duration: 20, sound: 'rest' },
  ],
}

describe('useTimer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes with correct default values', () => {
    const { result } = renderHook(() => useTimer(mockWorkout))
    expect(result.current.currentStepIndex).toBe(TIMER_STATES.READY)
    expect(result.current.isPaused).toBe(false)
    expect(result.current.isStarted).toBe(false)
  })

  it('handles jumpToStep correctly', () => {
    const { result } = renderHook(() => useTimer(mockWorkout))

    act(() => {
      result.current.jumpToStep(0)
    })

    expect(result.current.currentStepIndex).toBe(0)
    expect(result.current.timeLeft).toBe(mockWorkout.steps[0].duration)
    expect(result.current.isPaused).toBe(true)
    expect(result.current.isStarted).toBe(true)
  })

  it('plays hang sound when unpausing after jumping to hang step', async () => {
    const { result } = renderHook(() => useTimer(mockWorkout))

    act(() => {
      result.current.jumpToStep(0) // Jump to hang step
    })

    expect(mockSounds.hang.play).not.toHaveBeenCalled() // No sound on jump

    await act(async () => {
      result.current.togglePause() // Unpause
    })

    expect(mockSounds.hang.play).toHaveBeenCalled() // Should play hang sound
  })

  it('does not play sound when unpausing after jumping to rest step', async () => {
    const { result } = renderHook(() => useTimer(mockWorkout))

    act(() => {
      result.current.jumpToStep(1) // Jump to rest step
    })

    await act(async () => {
      result.current.togglePause() // Unpause
    })

    expect(mockSounds.rest.play).not.toHaveBeenCalled() // Should not play sound for rest
  })

  it('resets hasJustJumped flag after playing sound', async () => {
    const { result } = renderHook(() => useTimer(mockWorkout))

    act(() => {
      result.current.jumpToStep(0)
    })

    await act(async () => {
      result.current.togglePause() // First unpause, should play sound
    })

    await act(async () => {
      result.current.togglePause() // Pause
      result.current.togglePause() // Second unpause, should not play sound
    })

    expect(mockSounds.hang.play).toHaveBeenCalledTimes(1) // Sound should only play once
  })
})

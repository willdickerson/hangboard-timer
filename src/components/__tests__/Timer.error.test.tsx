import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import Timer from '../Timer'
import { sounds } from '../../constants/workout'

vi.mock('nosleep.js', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      enable: vi.fn(),
      disable: vi.fn(),
    })),
  }
})

describe('Timer Error Handling', () => {
  const mockThemeToggle = vi.fn()

  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllTimers()
    vi.clearAllMocks()

    // Reset all sound mocks
    Object.values(sounds).forEach(sound => {
      sound.play = vi.fn().mockResolvedValue(undefined)
      sound.pause = vi.fn()
      sound.currentTime = 0
      sound.muted = false
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  // Test error handling in playSound function
  it('handles audio play errors and attempts to unlock audio', async () => {
    const mockError = new Error('Failed to play')
    sounds.begin.play = vi.fn().mockRejectedValue(mockError)

    const consoleSpy = vi.spyOn(console, 'log')

    render(<Timer isDark={false} onThemeToggle={mockThemeToggle} />)

    // Start the workout to trigger sound play
    await act(async () => {
      fireEvent.click(screen.getByLabelText('Start Workout'))
    })

    // Verify error was logged and unlock attempted
    expect(consoleSpy).toHaveBeenCalledWith('Error playing sound:', mockError)

    // Verify unlock attempt - all sounds should be initialized
    Object.values(sounds).forEach(sound => {
      if (sound !== sounds.begin) {
        expect(sound.play).toHaveBeenCalled()
      }
    })
  })

  // Test error handling in unlockAudio function
  it('handles errors during audio unlock process', async () => {
    const mockError = new Error('Failed to unlock')

    // Mock all sounds to fail during the unlock process
    Object.values(sounds).forEach(sound => {
      sound.play = vi.fn().mockRejectedValue(mockError)
      sound.pause = vi.fn().mockRejectedValue(mockError) // Also make pause fail
    })

    const consoleSpy = vi.spyOn(console, 'error')

    render(<Timer isDark={false} onThemeToggle={mockThemeToggle} />)

    await act(async () => {
      fireEvent.click(screen.getByLabelText('Start Workout'))
      // Ensure all promises are rejected
      await Promise.allSettled(Object.values(sounds).map(sound => sound.play()))
    })

    // Since all audio unlocking failed, we should see error logged
    expect(consoleSpy).toHaveBeenCalledWith('Error in unlockAudio:', mockError)
  })

  // Test error handling in startTimer with failed audio unlock
  it('continues workout even if audio unlock fails', async () => {
    const mockError = new Error('Failed to unlock')
    sounds.begin.play = vi.fn().mockRejectedValue(mockError)

    render(<Timer isDark={false} onThemeToggle={mockThemeToggle} />)

    // Start workout
    await act(async () => {
      fireEvent.click(screen.getByLabelText('Start Workout'))
    })

    // Verify workout started despite audio error
    expect(screen.getByText('Get Ready!')).toBeInTheDocument()
    expect(screen.getByText('0:15')).toBeInTheDocument()
  })

  // Test error handling in unlockAudio function
  it('handles errors during audio unlock process', async () => {
    const mockError = new Error('Failed to unlock')

    // Mock all sounds to fail during the unlock process
    Object.values(sounds).forEach(sound => {
      sound.play = vi.fn().mockRejectedValue(mockError)
      sound.pause = vi.fn().mockRejectedValue(mockError) // Also make pause fail
    })

    const consoleSpy = vi.spyOn(console, 'error')

    render(<Timer isDark={false} onThemeToggle={mockThemeToggle} />)

    await act(async () => {
      fireEvent.click(screen.getByLabelText('Start Workout'))
      // Ensure all promises are rejected
      await Promise.allSettled(Object.values(sounds).map(sound => sound.play()))
    })

    // Since all audio unlocking failed, we should see error logged
    expect(consoleSpy).toHaveBeenCalledWith('Error in unlockAudio:', mockError)
  })

  // Test error handling in unlockAudio with Promise.all rejection
  it('handles Promise.all rejection in unlockAudio', async () => {
    const mockError = new Error('Promise.all failed')

    // Mock Promise.all to fail
    const originalPromiseAll = Promise.all
    Promise.all = vi.fn().mockRejectedValue(mockError)

    const consoleSpy = vi.spyOn(console, 'error')

    render(<Timer isDark={false} onThemeToggle={mockThemeToggle} />)

    await act(async () => {
      fireEvent.click(screen.getByLabelText('Start Workout'))
    })

    // Verify error was logged
    expect(consoleSpy).toHaveBeenCalledWith('Error in unlockAudio:', mockError)

    // Restore original Promise.all
    Promise.all = originalPromiseAll
  })
})

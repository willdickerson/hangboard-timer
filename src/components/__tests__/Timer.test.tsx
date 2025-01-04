import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import Timer from '../Timer'
import { daveMacleodWorkout } from '../../workouts/dave-macleod'
import { sounds } from '../../audio/sounds'

// Mock NoSleep.js
vi.mock('nosleep.js', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      enable: vi.fn(),
      disable: vi.fn(),
    })),
  }
})

describe('Timer', () => {
  const mockThemeToggle = vi.fn()

  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllTimers()
    vi.clearAllMocks()

    // Setup sound mocks
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

  // Core Timer Functionality
  describe('Workout Flow', () => {
    it('advances through all steps, shows "Workout Complete!" and hides pause button', async () => {
      render(<Timer isDark={false} onThemeToggle={vi.fn()} />)

      await act(async () => {
        fireEvent.click(screen.getByLabelText(/Start Workout/i))
      })

      // Advance through "Get Ready" phase
      await act(async () => {
        await vi.advanceTimersByTimeAsync(15000)
      })

      expect(screen.getByText(/Warm-up: Hang on Jug/i)).toBeInTheDocument()
      expect(screen.getByLabelText('Pause Workout')).toBeInTheDocument()

      // Advance through each workout step
      for (let i = 0; i < daveMacleodWorkout.steps.length; i++) {
        await act(async () => {
          await vi.advanceTimersByTimeAsync(
            daveMacleodWorkout.steps[i].duration * 1000
          )
          await vi.runOnlyPendingTimersAsync()
        })
      }

      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveTextContent('Workout Complete!')

      // Verify pause button is no longer visible
      expect(screen.queryByLabelText('Pause Workout')).not.toBeInTheDocument()
      expect(screen.queryByLabelText('Resume Workout')).not.toBeInTheDocument()

      // Reset button should still be visible
      expect(screen.getByLabelText('Reset Workout')).toBeInTheDocument()
    })

    describe('Workout Controls', () => {
      it('handles pause and resume functionality', async () => {
        render(<Timer isDark={false} onThemeToggle={mockThemeToggle} />)

        // Start and initial state
        await act(async () => {
          fireEvent.click(screen.getByLabelText('Start Workout'))
        })
        expect(screen.getByText('0:15')).toBeInTheDocument()

        // Advance and check time
        await act(async () => {
          await vi.advanceTimersByTimeAsync(5000)
        })
        expect(screen.getByText('0:10')).toBeInTheDocument()

        // Test pause
        fireEvent.click(screen.getByLabelText('Pause Workout'))
        await act(async () => {
          await vi.advanceTimersByTimeAsync(5000)
        })
        expect(screen.getByText('0:10')).toBeInTheDocument()

        // Test resume
        fireEvent.click(screen.getByLabelText('Resume Workout'))
        await act(async () => {
          await vi.advanceTimersByTimeAsync(5000)
        })
        expect(screen.getByText('0:05')).toBeInTheDocument()
      })

      it('handles reset functionality', async () => {
        render(<Timer isDark={false} onThemeToggle={mockThemeToggle} />)

        await act(async () => {
          fireEvent.click(screen.getByLabelText('Start Workout'))
        })

        await act(async () => {
          await vi.advanceTimersByTimeAsync(5000)
        })

        fireEvent.click(screen.getByLabelText('Reset Workout'))

        expect(screen.getByText('0:15')).toBeInTheDocument()
        expect(screen.getByText('Get Ready!')).toBeInTheDocument()
        expect(screen.getByLabelText('Start Workout')).toBeInTheDocument()
      })
    })
  })

  // Audio Functionality
  describe('Audio Features', () => {
    it('toggles mute state when mute button is clicked', () => {
      render(<Timer isDark={false} onThemeToggle={mockThemeToggle} />)

      expect(screen.getByLabelText('Mute')).toBeInTheDocument()

      fireEvent.click(screen.getByLabelText('Mute'))
      expect(screen.getByLabelText('Unmute')).toBeInTheDocument()

      fireEvent.click(screen.getByLabelText('Unmute'))
      expect(screen.getByLabelText('Mute')).toBeInTheDocument()
    })

    it('unlocks audio when starting workout', async () => {
      render(<Timer isDark={false} onThemeToggle={mockThemeToggle} />)

      await act(async () => {
        fireEvent.click(screen.getByLabelText('Start Workout'))
      })

      Object.values(sounds).forEach(sound => {
        expect(sound.play).toHaveBeenCalled()
      })
    })
  })

  // UI and Theming
  describe('User Interface', () => {
    describe('Theme Functionality', () => {
      it('calls theme toggle callback when theme button is clicked', () => {
        render(<Timer isDark={false} onThemeToggle={mockThemeToggle} />)

        fireEvent.click(screen.getByLabelText('Switch to dark mode'))
        expect(mockThemeToggle).toHaveBeenCalledTimes(1)
      })

      it('renders with correct theme classes', () => {
        const { rerender } = render(
          <Timer isDark={false} onThemeToggle={mockThemeToggle} />
        )

        // Light theme
        expect(screen.getByText('Get Ready!')).toHaveClass(
          'bg-clip-text',
          'text-transparent'
        )
        expect(screen.getByRole('progressbar').parentElement).toHaveClass(
          'bg-gray-300/50'
        )

        // Dark theme
        rerender(<Timer isDark={true} onThemeToggle={mockThemeToggle} />)
        expect(screen.getByText('Get Ready!')).toHaveClass(
          'bg-clip-text',
          'text-transparent'
        )
        expect(screen.getByRole('progressbar').parentElement).toHaveClass(
          'bg-gray-700/50'
        )
      })
    })
  })

  // Timer Settings Functionality
  describe('Timer Settings Functionality', () => {
    const mockThemeToggle = vi.fn()

    it('opens and closes settings panel', () => {
      render(<Timer isDark={false} onThemeToggle={mockThemeToggle} />)

      // Settings panel should not be visible initially
      expect(screen.queryByText('Workout Selection')).not.toBeInTheDocument()

      // Open settings panel
      fireEvent.click(screen.getByLabelText('Toggle Settings'))
      expect(screen.getByText('Workout Selection')).toBeInTheDocument()

      // Close settings panel
      fireEvent.click(screen.getByLabelText('Toggle Settings'))
      expect(screen.queryByText('Workout Selection')).not.toBeInTheDocument()
    })

    it('allows the user to toggle settings and select a workout', () => {
      render(<Timer isDark={false} onThemeToggle={mockThemeToggle} />)

      // Open settings panel
      fireEvent.click(screen.getByLabelText('Toggle Settings'))
      expect(screen.getByText('Workout Selection')).toBeInTheDocument()

      // Select Dave MacLeod's workout
      const daveWorkoutButton = screen
        .getByText("Dave's Routine")
        .closest('button')
      fireEvent.click(daveWorkoutButton!)
      expect(daveWorkoutButton).toHaveClass(
        'border-green-500/50 bg-green-500/10 text-green-500'
      )

      // Select Emil Abrahamsson's workout
      const emilWorkoutButton = screen
        .getByText("Emil's Routine")
        .closest('button')
      fireEvent.click(emilWorkoutButton!)
      expect(emilWorkoutButton).toHaveClass(
        'border-green-500/50 bg-green-500/10 text-green-500'
      )
    })

    it('resets timer when changing workout during an active workout', async () => {
      render(<Timer isDark={false} onThemeToggle={mockThemeToggle} />)

      // Start the workout
      await act(async () => {
        fireEvent.click(screen.getByLabelText('Start Workout'))
      })

      // Open settings and change workout
      fireEvent.click(screen.getByLabelText('Toggle Settings'))
      const emilWorkoutButton = screen
        .getByText("Emil's Routine")
        .closest('button')
      fireEvent.click(emilWorkoutButton!)

      // Verify timer was reset
      expect(screen.getByText('Get Ready!')).toBeInTheDocument()
      expect(screen.getByText('0:15')).toBeInTheDocument()
      expect(screen.getByLabelText('Start Workout')).toBeInTheDocument()
    })

    it('renders workout selection buttons with correct dark mode styles', () => {
      render(<Timer isDark={true} onThemeToggle={mockThemeToggle} />)

      // Open settings panel
      fireEvent.click(screen.getByLabelText('Toggle Settings'))

      // Check unselected button styles in dark mode
      const daveWorkoutButton = screen
        .getByText("Dave's Routine")
        .closest('button')
      expect(daveWorkoutButton).toHaveClass(
        'border-green-500/50',
        'bg-green-500/10',
        'text-green-500'
      )

      // Check the other button's dark mode styles
      const emilWorkoutButton = screen
        .getByText("Emil's Routine")
        .closest('button')
      expect(emilWorkoutButton).toHaveClass(
        'border-gray-700/50',
        'text-gray-300',
        'border-transparent'
      )

      // Click Emil's workout to switch selection
      fireEvent.click(emilWorkoutButton!)

      // Verify Dave's workout button now has dark mode unselected styles
      expect(daveWorkoutButton).toHaveClass(
        'border-gray-700/50',
        'text-gray-300',
        'border-transparent'
      )
    })

    it('applies correct styles to settings button when settings are open/closed', () => {
      render(<Timer isDark={false} onThemeToggle={mockThemeToggle} />)

      const settingsButton = screen.getByLabelText('Toggle Settings')

      // Initial state (closed)
      expect(settingsButton).not.toHaveClass('text-green-400')
      expect(settingsButton).toHaveClass(
        'before:bg-gray-100',
        'before:opacity-0',
        'hover:before:opacity-100'
      )

      // Open settings
      fireEvent.click(settingsButton)
      expect(settingsButton).toHaveClass(
        'text-green-400',
        'before:bg-gray-100',
        'before:opacity-100'
      )

      // Close settings
      fireEvent.click(settingsButton)
      expect(settingsButton).not.toHaveClass('text-green-400')
      expect(settingsButton).toHaveClass(
        'before:bg-gray-100',
        'before:opacity-0',
        'hover:before:opacity-100'
      )
    })

    it('applies correct dark mode styles to settings button when settings are open/closed', () => {
      render(<Timer isDark={true} onThemeToggle={mockThemeToggle} />)

      const settingsButton = screen.getByLabelText('Toggle Settings')

      // Initial state (closed)
      expect(settingsButton).not.toHaveClass('text-green-400')
      expect(settingsButton).toHaveClass(
        'dark:before:bg-gray-700/50',
        'before:opacity-0',
        'hover:before:opacity-100'
      )

      // Open settings
      fireEvent.click(settingsButton)
      expect(settingsButton).toHaveClass(
        'text-green-400',
        'dark:before:bg-gray-700/50',
        'before:opacity-100'
      )

      // Close settings
      fireEvent.click(settingsButton)
      expect(settingsButton).not.toHaveClass('text-green-400')
      expect(settingsButton).toHaveClass(
        'dark:before:bg-gray-700/50',
        'before:opacity-0',
        'hover:before:opacity-100'
      )
    })
  })
})

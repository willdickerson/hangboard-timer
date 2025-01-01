import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import Timer from '../Timer'
import { DAVE_MACLEOD_WORKOUT } from '../../constants/workout'
import { sounds } from '../../constants/workout'

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
    it('advances through all steps and shows "Workout Complete!"', async () => {
      render(<Timer isDark={false} onThemeToggle={vi.fn()} />)

      await act(async () => {
        fireEvent.click(screen.getByLabelText(/Start Workout/i))
      })

      // Advance through "Get Ready" phase
      await act(async () => {
        await vi.advanceTimersByTimeAsync(15000)
      })

      expect(screen.getByText(/Warm-up: Hang on Jug/i)).toBeInTheDocument()

      // Advance through each workout step
      for (let i = 0; i < DAVE_MACLEOD_WORKOUT.length; i++) {
        await act(async () => {
          await vi.advanceTimersByTimeAsync(
            DAVE_MACLEOD_WORKOUT[i].duration * 1000
          )
          await vi.runOnlyPendingTimersAsync()
        })
      }

      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveTextContent('Workout Complete!')
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

    describe('Information Panel', () => {
      it('toggles workout information when info button is clicked', () => {
        render(<Timer isDark={false} onThemeToggle={mockThemeToggle} />)

        expect(screen.queryByText(/About this workout/)).not.toBeInTheDocument()

        fireEvent.click(screen.getByLabelText('Toggle Information'))
        expect(screen.getByText(/About this workout/)).toBeInTheDocument()

        const infoContainer = screen
          .getByText(/About this workout/)
          .closest('div')
        expect(infoContainer).toHaveClass(
          'bg-white',
          'border-gray-200',
          'text-gray-600'
        )
        expect(screen.getByText(/About this workout/)).toHaveClass(
          'text-gray-600'
        )

        fireEvent.click(screen.getByLabelText('Toggle Information'))
        expect(screen.queryByText(/About this workout/)).not.toBeInTheDocument()
      })

      it('displays info panel with correct dark theme classes', () => {
        render(<Timer isDark={true} onThemeToggle={mockThemeToggle} />)

        fireEvent.click(screen.getByLabelText('Toggle Information'))

        const infoContainer = screen
          .getByText(/About this workout/)
          .closest('div')
        expect(infoContainer).toHaveClass(
          'bg-gray-800/50',
          'border-gray-700',
          'text-gray-300'
        )
        expect(screen.getByText(/About this workout/)).toHaveClass('text-white')
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
        .getByText("Dave MacLeod's Workout")
        .closest('button')
      fireEvent.click(daveWorkoutButton!)
      expect(daveWorkoutButton).toHaveClass(
        'border-green-500/50 bg-green-500/10 text-green-500'
      )

      // Select Emil Abrahamsson's workout
      const emilWorkoutButton = screen
        .getByText("Emil Abrahamsson's Workout")
        .closest('button')
      fireEvent.click(emilWorkoutButton!)
      expect(emilWorkoutButton).toHaveClass(
        'border-green-500/50 bg-green-500/10 text-green-500'
      )
    })
  })
})

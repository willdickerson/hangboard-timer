import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Timer from '../Timer'

describe('Timer', () => {
  it('renders initial state with "Get Ready!"', () => {
    render(<Timer />)
    expect(screen.getByText('Get Ready!')).toBeInTheDocument()
  })

  it('starts timer on "Start Workout" button click', () => {
    render(<Timer />)
    fireEvent.click(screen.getByLabelText(/Start Workout/i))
    expect(screen.getByText(/Get Ready!/i)).toBeInTheDocument()
  })

  it('pauses and resumes timer', async () => {
    render(<Timer />)

    // Start the timer
    fireEvent.click(screen.getByLabelText(/Start Workout/i))

    // Wait for the Pause button to appear
    const pauseButton = await screen.findByLabelText(/Pause Workout/i)
    fireEvent.click(pauseButton)

    // Check if Resume button appears
    expect(screen.getByLabelText(/Resume Workout/i)).toBeInTheDocument()

    // Resume the timer
    fireEvent.click(screen.getByLabelText(/Resume Workout/i))

    // Check if Pause button appears again
    expect(screen.getByLabelText(/Pause Workout/i)).toBeInTheDocument()
  })

  it('resets timer', async () => {
    render(<Timer />)

    // Start the timer
    fireEvent.click(screen.getByLabelText(/Start Workout/i))

    // Wait for the Reset button to appear
    const resetButton = await screen.findByLabelText(/Reset Workout/i)
    fireEvent.click(resetButton)

    // Ensure timer is reset to initial state
    expect(screen.getByText('Get Ready!')).toBeInTheDocument()
  })

  it('mutes and unmutes sound', () => {
    render(<Timer />)

    // Mute sound
    fireEvent.click(screen.getByLabelText(/Mute/i))
    expect(screen.getByLabelText(/Unmute/i)).toBeInTheDocument()

    // Unmute sound
    fireEvent.click(screen.getByLabelText(/Unmute/i))
    expect(screen.getByLabelText(/Mute/i)).toBeInTheDocument()
  })
})

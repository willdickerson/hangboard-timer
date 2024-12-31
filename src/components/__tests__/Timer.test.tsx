import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import Timer from '../Timer'

describe('Timer', () => {
  beforeEach(() => {
    render(<Timer />)
  })

  it('renders initial state with "Get Ready!"', () => {
    expect(screen.getByText('Get Ready!')).toBeInTheDocument()
  })

  it('starts timer on "Start Workout" button click', () => {
    fireEvent.click(screen.getByLabelText(/Start Workout/i))
    expect(screen.getByText(/Get Ready!/i)).toBeInTheDocument()
  })

  it('pauses and resumes timer', async () => {
    // Start the timer
    fireEvent.click(screen.getByLabelText(/Start Workout/i))

    // Wait for the Pause button to appear
    const pauseButton =
      await screen.findByLabelText<HTMLButtonElement>(/Pause Workout/i)
    fireEvent.click(pauseButton)

    // Check if Resume button appears
    expect(screen.getByLabelText(/Resume Workout/i)).toBeInTheDocument()

    // Resume the timer
    fireEvent.click(screen.getByLabelText(/Resume Workout/i))

    // Check if Pause button appears again
    expect(screen.getByLabelText(/Pause Workout/i)).toBeInTheDocument()
  })

  it('resets timer', async () => {
    // Start the timer
    fireEvent.click(screen.getByLabelText(/Start Workout/i))

    // Wait for the Reset button to appear
    const resetButton =
      await screen.findByLabelText<HTMLButtonElement>(/Reset Workout/i)
    fireEvent.click(resetButton)

    // Ensure timer is reset to initial state
    expect(screen.getByText('Get Ready!')).toBeInTheDocument()
  })

  it('mutes and unmutes sound', () => {
    // Mute sound
    fireEvent.click(screen.getByLabelText(/Mute/i))
    expect(screen.getByLabelText(/Unmute/i)).toBeInTheDocument()

    // Unmute sound
    fireEvent.click(screen.getByLabelText(/Unmute/i))
    expect(screen.getByLabelText(/Mute/i)).toBeInTheDocument()
  })
})

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, vi, expect } from 'vitest'
import WorkoutPreview from '../WorkoutPreview'
import type { WorkoutStep } from '../../types/workout'

const steps: WorkoutStep[] = [
  { name: 'Step 1', duration: 10, sound: 'start' },
  { name: 'Step 2', duration: 20, sound: 'rest' },
]

describe('WorkoutPreview', () => {
  it('renders workout steps when expanded', () => {
    render(
      <WorkoutPreview
        steps={steps}
        currentStep={0}
        isExpanded={true}
        onToggle={vi.fn()}
        isDark={false}
        workoutName="Test Workout"
      />
    )
    expect(screen.getByText('Step 1')).toBeInTheDocument()
    expect(screen.getByText('Step 2')).toBeInTheDocument()
  })

  it('does not render workout steps when collapsed', () => {
    render(
      <WorkoutPreview
        steps={steps}
        currentStep={0}
        isExpanded={false}
        onToggle={vi.fn()}
        isDark={false}
        workoutName="Test Workout"
      />
    )
    expect(screen.queryByText('Step 1')).not.toBeInTheDocument()
    expect(screen.queryByText('Step 2')).not.toBeInTheDocument()
  })

  it('calls onToggle when toggle button is clicked', () => {
    const onToggleMock = vi.fn()
    render(
      <WorkoutPreview
        steps={steps}
        currentStep={0}
        isExpanded={false}
        onToggle={onToggleMock}
        isDark={false}
        workoutName="Test Workout"
      />
    )
    fireEvent.click(screen.getByRole('button', { name: /Workout Overview/i }))
    expect(onToggleMock).toHaveBeenCalled()
  })

  it('renders with dark mode scrollbar styles when isDark is true', () => {
    render(
      <WorkoutPreview
        steps={steps}
        currentStep={0}
        isExpanded={true}
        onToggle={vi.fn()}
        isDark={true}
        workoutName="Test Workout"
      />
    )
    const scrollContainer =
      screen.getByRole('list') || screen.getByTestId('workout-steps')
    expect(scrollContainer).toHaveClass(
      'scrollbar-thumb-gray-600',
      'scrollbar-track-gray-800/50'
    )
  })
})

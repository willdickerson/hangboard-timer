import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, vi, expect } from 'vitest'
import WorkoutPreview from '../WorkoutPreview'
import type { WorkoutStep } from '../../types/workout'

const steps: WorkoutStep[] = [
  { name: 'Step 1', duration: 10, sound: 'hang' },
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
    const scrollContainer = screen.getByRole('region', {
      name: /workout steps/i,
    })
    expect(scrollContainer).toHaveClass(
      'scrollbar-thin',
      'scrollbar-thumb-gray-600'
    )
  })

  it('calls onStepClick when a step is clicked', () => {
    const onStepClickMock = vi.fn()
    render(
      <WorkoutPreview
        steps={steps}
        currentStep={0}
        isExpanded={true}
        onToggle={vi.fn()}
        onStepClick={onStepClickMock}
        isDark={false}
        workoutName="Test Workout"
      />
    )
    fireEvent.click(screen.getByText('Step 2'))
    expect(onStepClickMock).toHaveBeenCalledWith(1)
  })

  it('disables step clicks when onStepClick is not provided', () => {
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
    const stepButton = screen.getByText('Step 1').closest('button')
    expect(stepButton).toBeDisabled()
  })

  it('shows workout duration in the overview', () => {
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
    // Total duration is 30s = 0.5m
    const button = screen.getByRole('button')
    expect(button).toHaveTextContent('Workout Overview/ Test Workout(1m)')
  })
})

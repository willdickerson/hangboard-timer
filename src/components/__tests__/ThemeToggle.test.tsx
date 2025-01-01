import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ThemeToggle from '../ThemeToggle'

describe('ThemeToggle', () => {
  it('renders sun icon in dark mode', () => {
    const mockToggle = vi.fn()
    render(<ThemeToggle isDark={true} onToggle={mockToggle} />)

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Switch to light mode')
  })

  it('renders moon icon in light mode', () => {
    const mockToggle = vi.fn()
    render(<ThemeToggle isDark={false} onToggle={mockToggle} />)

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode')
  })

  it('calls onToggle when clicked', () => {
    const mockToggle = vi.fn()
    render(<ThemeToggle isDark={false} onToggle={mockToggle} />)

    fireEvent.click(screen.getByRole('button'))
    expect(mockToggle).toHaveBeenCalledTimes(1)
  })
})

import React from 'react'
import { render, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Confetti from '../Confetti'

// Mock react-confetti
vi.mock('react-confetti', () => {
  return {
    default: vi
      .fn()
      .mockImplementation(({ width, height, run }) => (
        <div
          data-testid="mock-confetti"
          data-width={width}
          data-height={height}
          data-run={run}
        />
      )),
  }
})

describe('Confetti', () => {
  const originalInnerWidth = window.innerWidth
  const originalInnerHeight = window.innerHeight

  beforeEach(() => {
    // Reset window dimensions before each test
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: originalInnerHeight,
    })
  })

  it('renders nothing when not active', () => {
    const { container } = render(<Confetti active={false} />)
    expect(container.firstChild).toHaveStyle({ opacity: '0' })
  })

  it('renders with opacity 1 when active', () => {
    const { container } = render(<Confetti active={true} />)
    expect(container.firstChild).toHaveStyle({ opacity: '1' })
  })

  it('updates dimensions on window resize', () => {
    const { getByTestId } = render(<Confetti active={true} />)
    const mockConfetti = getByTestId('mock-confetti')

    const initialWidth = Number(mockConfetti.dataset.width)
    const initialHeight = Number(mockConfetti.dataset.height)

    // Simulate window resize
    act(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 800,
      })
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 600,
      })
      window.dispatchEvent(new Event('resize'))
    })

    // Check if dimensions were updated
    expect(Number(mockConfetti.dataset.width)).toBe(800)
    expect(Number(mockConfetti.dataset.height)).toBe(600)
    expect(Number(mockConfetti.dataset.width)).not.toBe(initialWidth)
    expect(Number(mockConfetti.dataset.height)).not.toBe(initialHeight)
  })

  it('removes resize listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
    const { unmount } = render(<Confetti active={true} />)

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'resize',
      expect.any(Function)
    )
  })

  it('passes run prop to ReactConfetti based on active prop', () => {
    const { getByTestId, rerender } = render(<Confetti active={true} />)
    expect(getByTestId('mock-confetti').dataset.run).toBe('true')

    rerender(<Confetti active={false} />)
    expect(getByTestId('mock-confetti').dataset.run).toBe('false')
  })
})

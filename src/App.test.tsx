import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import App from './App'

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('App', () => {
  beforeEach(() => {
    localStorageMock.clear()
    document.documentElement.classList.remove('dark')
  })

  it('renders with default dark theme when no theme is stored', () => {
    render(<App />)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('loads theme from localStorage', () => {
    localStorage.setItem('theme', 'light')
    render(<App />)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('toggles theme when theme button is clicked', () => {
    render(<App />)

    // Initially dark
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    // Find and click theme toggle button
    const themeButton = screen.getByLabelText('Switch to light mode')
    fireEvent.click(themeButton)

    // Should switch to light
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(localStorage.getItem('theme')).toBe('light')
  })

  it('renders header with title and GitHub link', () => {
    render(<App />)

    expect(screen.getByText('Hangboard Timer')).toBeInTheDocument()
    expect(screen.getByText('GitHub')).toHaveAttribute(
      'href',
      'https://github.com/willdickerson/hangboard-timer'
    )
  })

  it('renders footer with attribution', () => {
    render(<App />)

    expect(screen.getByText('Made by')).toBeInTheDocument()
    expect(screen.getByText('@willdickerson')).toHaveAttribute(
      'href',
      'https://github.com/willdickerson'
    )
  })
})

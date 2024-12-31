import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import ProgressBar from '../ProgressBar'

describe('ProgressBar', () => {
  test('renders the correct width based on props', () => {
    render(<ProgressBar current={5} total={10} />)
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '50')
  })
})

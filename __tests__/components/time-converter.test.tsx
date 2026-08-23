import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import TimeConverter from '../../components/time/TimeConverter'

function mockFetchOk(body: unknown) {
  return vi.fn(() =>
    Promise.resolve(
      new Response(JSON.stringify(body), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    ),
  )
}

describe('TimeConverter', () => {
  beforeEach(() => {
    global.fetch = mockFetchOk({ value: 120, from: 'hour', to: 'minute', unit: 'min' })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    cleanup()
  })

  it('renders the value input, unit selects, and convert button', () => {
    render(<TimeConverter />)
    expect(screen.getByLabelText(/value/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/from unit/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/to unit/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /convert/i })).toBeInTheDocument()
  })

  it('renders 6 time units', () => {
    render(<TimeConverter />)
    expect(screen.getByLabelText(/from unit/i).querySelectorAll('option')).toHaveLength(6)
  })

  it('converts 2 hours to minutes and shows the result', async () => {
    render(<TimeConverter />)
    fireEvent.change(screen.getByLabelText(/value/i), { target: { value: '2' } })
    fireEvent.change(screen.getByLabelText(/from unit/i), { target: { value: 'hour' } })
    fireEvent.change(screen.getByLabelText(/to unit/i), { target: { value: 'minute' } })
    fireEvent.click(screen.getByRole('button', { name: /convert/i }))

    await waitFor(() => {
      expect(screen.getByText(/120/i)).toBeInTheDocument()
    })
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/convert',
      expect.objectContaining({ method: 'POST' }),
    )
  })
})

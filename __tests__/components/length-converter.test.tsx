import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LengthConverter from '../../components/length/LengthConverter'

function mockFetchOk(body: unknown) {
  return vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(body),
    }),
  )
}

describe('LengthConverter', () => {
  beforeEach(() => {
    global.fetch = mockFetchOk({
      value: 16.404199,
      from: 'meter',
      to: 'foot',
      unit: 'ft',
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the value input, unit selects, and convert button', () => {
    render(<LengthConverter />)
    expect(screen.getByLabelText(/value/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/from unit/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/to unit/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /convert/i })).toBeInTheDocument()
  })

  it('renders meter and foot as options in both selects', () => {
    render(<LengthConverter />)
    const fromSelect = screen.getByLabelText(/from unit/i)
    const toSelect = screen.getByLabelText(/to unit/i)
    expect(fromSelect.querySelectorAll('option')).toHaveLength(8)
    expect(toSelect.querySelectorAll('option')).toHaveLength(8)
    expect(screen.getByRole('option', { name: /meter/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /foot/i })).toBeInTheDocument()
  })

  it('converts 5 meters to feet and shows the result', async () => {
    render(<LengthConverter />)
    fireEvent.change(screen.getByLabelText(/value/i), { target: { value: '5' } })
    fireEvent.change(screen.getByLabelText(/from unit/i), { target: { value: 'meter' } })
    fireEvent.change(screen.getByLabelText(/to unit/i), { target: { value: 'foot' } })
    fireEvent.click(screen.getByRole('button', { name: /convert/i }))

    await waitFor(() => {
      expect(screen.getByText(/16\.404/i)).toBeInTheDocument()
    })
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/convert',
      expect.objectContaining({ method: 'POST' }),
    )
  })

  it('shows an error message when the API request fails', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Unknown unit' }),
      }),
    )
    render(<LengthConverter />)
    fireEvent.change(screen.getByLabelText(/value/i), { target: { value: '5' } })
    fireEvent.click(screen.getByRole('button', { name: /convert/i }))

    await waitFor(() => {
      expect(screen.getByText(/unknown unit/i)).toBeInTheDocument()
    })
  })
})

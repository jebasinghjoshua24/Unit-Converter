import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, cleanup, within } from '@testing-library/react'
import TemperatureConverter from '../../components/temperature/TemperatureConverter'

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

describe('TemperatureConverter', () => {
  beforeEach(() => {
    global.fetch = mockFetchOk({
      value: 212,
      from: 'celsius',
      to: 'fahrenheit',
      unit: '°F',
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    cleanup()
  })

  it('renders the value input, unit selects, and convert button', () => {
    render(<TemperatureConverter />)
    expect(screen.getByLabelText(/value/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/from unit/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/to unit/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /convert/i })).toBeInTheDocument()
  })

  it('renders celsius, fahrenheit, and kelvin as options', () => {
    render(<TemperatureConverter />)
    const fromSelect = screen.getByLabelText(/from unit/i)
    expect(fromSelect.querySelectorAll('option')).toHaveLength(3)
    expect(within(fromSelect).getByRole('option', { name: 'Celsius' })).toBeInTheDocument()
    expect(within(fromSelect).getByRole('option', { name: 'Fahrenheit' })).toBeInTheDocument()
    expect(within(fromSelect).getByRole('option', { name: 'Kelvin' })).toBeInTheDocument()
  })

  it('converts 100 celsius to fahrenheit and shows the result', async () => {
    render(<TemperatureConverter />)
    fireEvent.change(screen.getByLabelText(/value/i), { target: { value: '100' } })
    fireEvent.change(screen.getByLabelText(/from unit/i), { target: { value: 'celsius' } })
    fireEvent.change(screen.getByLabelText(/to unit/i), { target: { value: 'fahrenheit' } })
    fireEvent.click(screen.getByRole('button', { name: /convert/i }))

    await waitFor(() => {
      expect(screen.getByText(/212/i)).toBeInTheDocument()
    })
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/convert',
      expect.objectContaining({ method: 'POST' }),
    )
  })

  it('shows an error message when the API request fails', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve(
        new Response(JSON.stringify({ error: 'Unknown unit' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    )
    render(<TemperatureConverter />)
    fireEvent.change(screen.getByLabelText(/value/i), { target: { value: '100' } })
    fireEvent.click(screen.getByRole('button', { name: /convert/i }))

    await waitFor(() => {
      expect(screen.getByText(/unknown unit/i)).toBeInTheDocument()
    })
  })
})

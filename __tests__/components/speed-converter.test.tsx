import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import SpeedConverter from '../../components/speed/SpeedConverter'

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

describe('SpeedConverter', () => {
  beforeEach(() => {
    global.fetch = mockFetchOk({ value: 62.137, from: 'kmh', to: 'mph', unit: 'mph' })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    cleanup()
  })

  it('renders the value input, unit selects, and convert button', () => {
    render(<SpeedConverter />)
    expect(screen.getByLabelText(/value/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/from unit/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/to unit/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /convert/i })).toBeInTheDocument()
  })

  it('renders 5 speed units', () => {
    render(<SpeedConverter />)
    expect(screen.getByLabelText(/from unit/i).querySelectorAll('option')).toHaveLength(5)
  })

  it('converts 100 km/h to mph and shows the result', async () => {
    render(<SpeedConverter />)
    fireEvent.change(screen.getByLabelText(/value/i), { target: { value: '100' } })
    fireEvent.change(screen.getByLabelText(/from unit/i), { target: { value: 'kmh' } })
    fireEvent.change(screen.getByLabelText(/to unit/i), { target: { value: 'mph' } })
    fireEvent.click(screen.getByRole('button', { name: /convert/i }))

    await waitFor(() => {
      expect(screen.getByText(/62\.137/i)).toBeInTheDocument()
    })
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/convert',
      expect.objectContaining({ method: 'POST' }),
    )
  })
})

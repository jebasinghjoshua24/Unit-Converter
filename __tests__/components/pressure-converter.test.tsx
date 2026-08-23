import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import PressureConverter from '../../components/pressure/PressureConverter'

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

describe('PressureConverter', () => {
  beforeEach(() => {
    global.fetch = mockFetchOk({ value: 14.696, from: 'atmosphere', to: 'psi', unit: 'psi' })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    cleanup()
  })

  it('renders the value input, unit selects, and convert button', () => {
    render(<PressureConverter />)
    expect(screen.getByLabelText(/value/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/from unit/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/to unit/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /convert/i })).toBeInTheDocument()
  })

  it('renders 6 pressure units', () => {
    render(<PressureConverter />)
    expect(screen.getByLabelText(/from unit/i).querySelectorAll('option')).toHaveLength(6)
  })

  it('converts 1 atm to psi and shows the result', async () => {
    render(<PressureConverter />)
    fireEvent.change(screen.getByLabelText(/value/i), { target: { value: '1' } })
    fireEvent.change(screen.getByLabelText(/from unit/i), { target: { value: 'atmosphere' } })
    fireEvent.change(screen.getByLabelText(/to unit/i), { target: { value: 'psi' } })
    fireEvent.click(screen.getByRole('button', { name: /convert/i }))

    await waitFor(() => {
      expect(screen.getByText(/14\.696/i)).toBeInTheDocument()
    })
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/convert',
      expect.objectContaining({ method: 'POST' }),
    )
  })
})
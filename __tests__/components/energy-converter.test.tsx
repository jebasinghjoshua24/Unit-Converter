import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import EnergyConverter from '../../components/energy/EnergyConverter'

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

describe('EnergyConverter', () => {
  beforeEach(() => {
    global.fetch = mockFetchOk({ value: 3600, from: 'kwh', to: 'kilojoule', unit: 'kJ' })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    cleanup()
  })

  it('renders the value input, unit selects, and convert button', () => {
    render(<EnergyConverter />)
    expect(screen.getByLabelText(/value/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/from unit/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/to unit/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /convert/i })).toBeInTheDocument()
  })

  it('renders 6 energy units', () => {
    render(<EnergyConverter />)
    expect(screen.getByLabelText(/from unit/i).querySelectorAll('option')).toHaveLength(6)
  })

  it('converts 1 kWh to kJ and shows the result', async () => {
    render(<EnergyConverter />)
    fireEvent.change(screen.getByLabelText(/value/i), { target: { value: '1' } })
    fireEvent.change(screen.getByLabelText(/from unit/i), { target: { value: 'kwh' } })
    fireEvent.change(screen.getByLabelText(/to unit/i), { target: { value: 'kilojoule' } })
    fireEvent.click(screen.getByRole('button', { name: /convert/i }))

    await waitFor(() => {
      expect(screen.getByText(/3600/i)).toBeInTheDocument()
    })
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/convert',
      expect.objectContaining({ method: 'POST' }),
    )
  })
})
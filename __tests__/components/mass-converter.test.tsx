import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, cleanup, within } from '@testing-library/react'
import MassConverter from '../../components/mass/MassConverter'

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

describe('MassConverter', () => {
  beforeEach(() => {
    global.fetch = mockFetchOk({
      value: 4.535924,
      from: 'pound',
      to: 'kilogram',
      unit: 'kg',
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    cleanup()
  })

  it('renders the value input, unit selects, and convert button', () => {
    render(<MassConverter />)
    expect(screen.getByLabelText(/value/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/from unit/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/to unit/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /convert/i })).toBeInTheDocument()
  })

  it('renders kilogram and pound as options in both selects', () => {
    render(<MassConverter />)
    const fromSelect = screen.getByLabelText(/from unit/i)
    const toSelect = screen.getByLabelText(/to unit/i)
    expect(fromSelect.querySelectorAll('option')).toHaveLength(7)
    expect(toSelect.querySelectorAll('option')).toHaveLength(7)
    expect(within(fromSelect).getByRole('option', { name: 'Kilogram' })).toBeInTheDocument()
    expect(within(toSelect).getByRole('option', { name: 'Pound' })).toBeInTheDocument()
  })

  it('converts 10 pounds to kilograms and shows the result', async () => {
    render(<MassConverter />)
    fireEvent.change(screen.getByLabelText(/value/i), { target: { value: '10' } })
    fireEvent.change(screen.getByLabelText(/from unit/i), { target: { value: 'pound' } })
    fireEvent.change(screen.getByLabelText(/to unit/i), { target: { value: 'kilogram' } })
    fireEvent.click(screen.getByRole('button', { name: /convert/i }))

    await waitFor(() => {
      expect(screen.getByText(/4\.535924/i)).toBeInTheDocument()
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
    render(<MassConverter />)
    fireEvent.change(screen.getByLabelText(/value/i), { target: { value: '10' } })
    fireEvent.click(screen.getByRole('button', { name: /convert/i }))

    await waitFor(() => {
      expect(screen.getByText(/unknown unit/i)).toBeInTheDocument()
    })
  })
})

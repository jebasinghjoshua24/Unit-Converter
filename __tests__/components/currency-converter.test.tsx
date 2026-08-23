import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, cleanup, within } from '@testing-library/react'
import CurrencyConverter from '../../components/currency/CurrencyConverter'

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

describe('CurrencyConverter', () => {
  beforeEach(() => {
    global.fetch = mockFetchOk({ value: 92, from: 'usd', to: 'eur', unit: 'EUR' })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    cleanup()
  })

  it('renders the value input, unit selects, and convert button', () => {
    render(<CurrencyConverter />)
    expect(screen.getByLabelText(/value/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/from unit/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/to unit/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /convert/i })).toBeInTheDocument()
  })

  it('renders 8 currency options', () => {
    render(<CurrencyConverter />)
    const fromSelect = screen.getByLabelText(/from unit/i)
    expect(fromSelect.querySelectorAll('option')).toHaveLength(8)
    expect(within(fromSelect).getByRole('option', { name: 'US Dollar' })).toBeInTheDocument()
    expect(within(fromSelect).getByRole('option', { name: 'Euro' })).toBeInTheDocument()
  })

  it('converts 100 USD to EUR and shows the result', async () => {
    render(<CurrencyConverter />)
    fireEvent.change(screen.getByLabelText(/value/i), { target: { value: '100' } })
    fireEvent.change(screen.getByLabelText(/from unit/i), { target: { value: 'usd' } })
    fireEvent.change(screen.getByLabelText(/to unit/i), { target: { value: 'eur' } })
    fireEvent.click(screen.getByRole('button', { name: /convert/i }))

    await waitFor(() => {
      expect(screen.getByText(/92/i)).toBeInTheDocument()
    })
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/convert',
      expect.objectContaining({ method: 'POST' }),
    )
  })
})

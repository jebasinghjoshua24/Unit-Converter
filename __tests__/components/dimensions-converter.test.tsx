import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, cleanup, within } from '@testing-library/react'
import DimensionsConverter from '../../components/dimensions/DimensionsConverter'

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

describe('DimensionsConverter', () => {
  beforeEach(() => {
    global.fetch = mockFetchOk({
      value: 10.7639,
      from: 'square-meter',
      to: 'square-foot',
      unit: 'ft²',
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    cleanup()
  })

  it('renders a dimension type dropdown with Area and Volume options', () => {
    render(<DimensionsConverter />)
    const select = screen.getByLabelText(/dimension/i)
    expect(within(select).getByRole('option', { name: 'Area' })).toBeInTheDocument()
    expect(within(select).getByRole('option', { name: 'Volume' })).toBeInTheDocument()
  })

  it('defaults to the Area converter (9 units)', () => {
    render(<DimensionsConverter />)
    const fromSelect = screen.getByLabelText(/from unit/i)
    expect(fromSelect.querySelectorAll('option')).toHaveLength(9)
  })

  it('switches to the Volume converter (9 units)', () => {
    render(<DimensionsConverter />)
    fireEvent.change(screen.getByLabelText(/dimension/i), { target: { value: 'volume' } })
    const fromSelect = screen.getByLabelText(/from unit/i)
    expect(fromSelect.querySelectorAll('option')).toHaveLength(9)
    expect(within(fromSelect).getByRole('option', { name: 'Gallon' })).toBeInTheDocument()
  })

  it('converts 1 square meter to square feet and shows the result', async () => {
    render(<DimensionsConverter />)
    fireEvent.change(screen.getByLabelText(/value/i), { target: { value: '1' } })
    fireEvent.change(screen.getByLabelText(/from unit/i), { target: { value: 'square-meter' } })
    fireEvent.change(screen.getByLabelText(/to unit/i), { target: { value: 'square-foot' } })
    fireEvent.click(screen.getByRole('button', { name: /convert/i }))

    await waitFor(() => {
      expect(screen.getByText(/10\.7639/i)).toBeInTheDocument()
    })
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/convert',
      expect.objectContaining({ method: 'POST' }),
    )
  })
})

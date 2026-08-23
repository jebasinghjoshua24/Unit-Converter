import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, cleanup, within } from '@testing-library/react'
import CategoryConverter from '../../components/CategoryConverter'

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

describe('CategoryConverter', () => {
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

  it('renders a category dropdown with Length and Mass options', () => {
    render(<CategoryConverter />)
    const select = screen.getByLabelText(/category/i)
    expect(within(select).getByRole('option', { name: 'Length' })).toBeInTheDocument()
    expect(within(select).getByRole('option', { name: 'Mass' })).toBeInTheDocument()
  })

  it('defaults to the Length converter', () => {
    render(<CategoryConverter />)
    const fromSelect = screen.getByLabelText(/from unit/i)
    expect(fromSelect.querySelectorAll('option')).toHaveLength(8)
  })

  it('switches to the Mass converter when Mass is selected', () => {
    render(<CategoryConverter />)
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: 'mass' } })
    const fromSelect = screen.getByLabelText(/from unit/i)
    expect(fromSelect.querySelectorAll('option')).toHaveLength(7)
    expect(within(fromSelect).getByRole('option', { name: 'Pound' })).toBeInTheDocument()
  })

  it('switches back to the Length converter', () => {
    render(<CategoryConverter />)
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: 'mass' } })
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: 'length' } })
    const fromSelect = screen.getByLabelText(/from unit/i)
    expect(fromSelect.querySelectorAll('option')).toHaveLength(8)
  })

  it('converts a value after switching to Mass', async () => {
    render(<CategoryConverter />)
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: 'mass' } })
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
})

import { describe, expect, it, vi } from 'vitest'
import request from 'supertest'
import { createServer } from 'node:http'

vi.mock('@/lib/conversion/currency', () => {
  const rates = new Map<string, number>([
    ['usd', 1],
    ['eur', 0.85477],
    ['gbp', 0.73228],
    ['jpy', 158.7],
    ['inr', 95.7],
    ['cad', 1.374],
    ['aud', 1.3951],
    ['chf', 0.79947],
  ])
  return {
    convertCurrency: (value: number, fromRate: number, toRate: number) =>
      (value * toRate) / fromRate,
    getCurrencyRates: vi.fn(() => Promise.resolve(rates)),
    convertCurrencyWithDb: vi.fn((value: number, from: string, to: string) => {
      const fromRate = rates.get(from)
      const toRate = rates.get(to)
      if (fromRate == null || toRate == null) {
        return Promise.reject(new Error('Missing currency rate'))
      }
      return Promise.resolve((value * toRate) / fromRate)
    }),
  }
})

import { POST } from '../../app/api/convert/route'

function createApp() {
  return createServer((req, res) => {
    if (req.method !== 'POST') {
      res.statusCode = 405
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: 'Method not allowed' }))
      return
    }
    let body = ''
    req.on('data', (chunk) => {
      body += chunk
    })
    req.on('end', async () => {
      const url = new URL(req.url ?? '/', 'http://localhost')
      const headers = Object.fromEntries(
        Object.entries(req.headers).map(([k, v]) => [k, String(v)]),
      )
      const nextRequest = new Request(url, {
        method: req.method,
        headers,
        body: body || undefined,
      })
      const response = await POST(nextRequest)
      res.statusCode = response.status
      response.headers.forEach((value, key) => res.setHeader(key, value))
      res.end(await response.text())
    })
  })
}

describe('POST /api/convert — currency (DB-backed rates)', () => {
  it('converts 100 USD to ~85.48 EUR', async () => {
    const app = createApp()
    const res = await request(app)
      .post('/api/convert')
      .send({ value: 100, from: 'usd', to: 'eur' })
    expect(res.status).toBe(200)
    expect(res.body).toEqual({
      value: expect.any(Number),
      from: 'usd',
      to: 'eur',
      unit: 'EUR',
    })
    expect(res.body.value).toBeCloseTo(85.477, 3)
  })

  it('converts 1000 JPY to ~6.30 USD', async () => {
    const app = createApp()
    const res = await request(app)
      .post('/api/convert')
      .send({ value: 1000, from: 'jpy', to: 'usd' })
    expect(res.status).toBe(200)
    expect(res.body.unit).toBe('USD')
    expect(res.body.value).toBeCloseTo(6.3012, 3)
  })

  it('converts 50 GBP to ~58.36 EUR', async () => {
    const app = createApp()
    const res = await request(app)
      .post('/api/convert')
      .send({ value: 50, from: 'gbp', to: 'eur' })
    expect(res.status).toBe(200)
    expect(res.body.unit).toBe('EUR')
    expect(res.body.value).toBeCloseTo(58.36, 2)
  })
})

import { describe, expect, it } from 'vitest'
import request from 'supertest'
import { createServer } from 'node:http'
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

describe('POST /api/convert', () => {
  it('returns the converted value with 200', async () => {
    const app = createApp()
    const res = await request(app)
      .post('/api/convert')
      .send({ value: 5, from: 'meter', to: 'foot' })
    expect(res.status).toBe(200)
    expect(res.body).toEqual({
      value: expect.any(Number),
      from: 'meter',
      to: 'foot',
      unit: 'ft',
    })
    expect(res.body.value).toBeCloseTo(16.404199, 5)
  })

  it('converts mass units via the same endpoint', async () => {
    const app = createApp()
    const res = await request(app)
      .post('/api/convert')
      .send({ value: 10, from: 'pound', to: 'kilogram' })
    expect(res.status).toBe(200)
    expect(res.body).toEqual({
      value: expect.any(Number),
      from: 'pound',
      to: 'kilogram',
      unit: 'kg',
    })
    expect(res.body.value).toBeCloseTo(4.535924, 5)
  })

  it('converts 1 tonne to pounds (~2204.622622)', async () => {
    const app = createApp()
    const res = await request(app)
      .post('/api/convert')
      .send({ value: 1, from: 'tonne', to: 'pound' })
    expect(res.status).toBe(200)
    expect(res.body.unit).toBe('lb')
    expect(res.body.value).toBeCloseTo(2204.622622, 5)
  })

  it('returns 400 for a missing field', async () => {
    const app = createApp()
    const res = await request(app).post('/api/convert').send({ value: 5, from: 'meter' })
    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('error')
  })

  it('returns 400 for a non-numeric value', async () => {
    const app = createApp()
    const res = await request(app)
      .post('/api/convert')
      .send({ value: 'five', from: 'meter', to: 'foot' })
    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('error')
  })

  it('returns 400 for an unknown unit', async () => {
    const app = createApp()
    const res = await request(app)
      .post('/api/convert')
      .send({ value: 5, from: 'parsec', to: 'foot' })
    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('error')
  })

  it('returns 405 for a GET request', async () => {
    const app = createApp()
    const res = await request(app).get('/api/convert')
    expect(res.status).toBe(405)
  })
})

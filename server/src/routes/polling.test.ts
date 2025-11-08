import { describe, expect, it } from 'bun:test'
import { app } from '..'

describe('Polling routes', () => {
  it('returns a response', async () => {
    const response = await app
        .handle(new Request('http://localhost/api/polling/stock'))
        .then((res) => res.json())
        
    expect(response.success).toBe(true)
    expect(response.data).toBeDefined()
  })

  it('returns stocks', async () => {
    const response = await app
        .handle(new Request('http://localhost/api/polling/stock'))
        .then((res) => res.json())
        
    expect(response.data.length).toBeGreaterThan(0)
    expect(response.data).toBeArray()
    expect(response.data).toBeArrayOfSize(5)
    expect(response.data[0].symbol).toBeDefined()
    expect(response.data[0].price).toBeDefined()
    expect(response.data[0].change).toBeDefined()
    expect(response.data[0].changePercent).toBeDefined()
    expect(response.data[0].lastUpdated).toBeDefined()
  })
})
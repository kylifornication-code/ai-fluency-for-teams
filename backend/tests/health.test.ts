import request from 'supertest'
import express from 'express'

// Mock the Express app for testing
const app = express()
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

describe('Health Check', () => {
  it('should return 200 and OK status', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200)
    
    expect(response.body.status).toBe('OK')
    expect(response.body.timestamp).toBeDefined()
  })
})

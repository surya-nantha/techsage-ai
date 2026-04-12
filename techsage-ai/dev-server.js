// dev-server.js — run this locally to test the API proxy
// Usage: node dev-server.js
// Requires: npm install express cors dotenv

import express from 'express'
import cors from 'cors'
import { readFileSync } from 'fs'
import { createServer } from 'http'

// Load .env.local
try {
  const env = readFileSync('.env.local', 'utf8')
  env.split('\n').forEach(line => {
    const [key, ...val] = line.split('=')
    if (key && val.length) process.env[key.trim()] = val.join('=').trim()
  })
  console.log('✅ Loaded .env.local')
} catch {
  console.warn('⚠️  No .env.local found — make sure OPENROUTER_API_KEY is set in environment')
}

const app = express()
app.use(cors())
app.use(express.json())

// Dynamically import the handler
app.post('/api/chat', async (req, res) => {
  const { default: handler } = await import('./api/chat.js')
  return handler(req, res)
})

app.listen(3001, () => {
  console.log('🚀 Dev API server running at http://localhost:3001')
  console.log('   React dev server should run at http://localhost:5173')
  console.log('   API calls from React will be proxied via vite.config.js')
})

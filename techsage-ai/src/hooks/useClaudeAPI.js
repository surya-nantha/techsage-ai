import { useState, useRef, useCallback } from 'react'

const MAX_REQUESTS_PER_SESSION = 20
const SESSION_KEY = 'techsage_req_count'

function getRequestCount() {
  try {
    return parseInt(sessionStorage.getItem(SESSION_KEY) || '0', 10)
  } catch {
    return 0
  }
}

function incrementRequestCount() {
  try {
    const next = getRequestCount() + 1
    sessionStorage.setItem(SESSION_KEY, String(next))
    return next
  } catch {
    return 1
  }
}

export function useClaudeAPI() {
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const abortRef = useRef(null)

  const sendMessage = useCallback(async (message, mode = 'assistant', language = 'en') => {
    if (!message || !message.trim()) return

    // Rate limiting
    if (getRequestCount() >= MAX_REQUESTS_PER_SESSION) {
      setError(`You've used all ${MAX_REQUESTS_PER_SESSION} questions for this session. Please refresh the page to start a new session, or ask a family member for help.`)
      return
    }

    // Cancel any in-flight request
    if (abortRef.current) abortRef.current.abort()
    abortRef.current = new AbortController()

    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortRef.current.signal,
        body: JSON.stringify({
          message: message.trim().slice(0, 1000), // enforce max length
          mode,
          language,
        }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || `Server error (${res.status})`)
      }

      const data = await res.json()
      incrementRequestCount()
      setResponse(data)
      return data
    } catch (err) {
      if (err.name === 'AbortError') return
      // Friendly error messages for seniors
      const msg = err.message.includes('Failed to fetch')
        ? "I'm having trouble connecting to the internet. Please check your Wi-Fi connection and try again."
        : err.message || "Something went wrong. Please try again in a moment."
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setResponse(null)
    setError(null)
    setLoading(false)
  }, [])

  const requestsRemaining = MAX_REQUESTS_PER_SESSION - getRequestCount()

  return { sendMessage, response, loading, error, reset, requestsRemaining }
}

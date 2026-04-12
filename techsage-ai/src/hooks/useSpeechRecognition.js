import { useState, useRef, useCallback } from 'react'

// Checks browser support once
const SpeechRecognition =
  typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null

export function useSpeechRecognition(language = 'en') {
  const [transcript, setTranscript] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState(null)
  const recognitionRef = useRef(null)

  const isSupported = Boolean(SpeechRecognition)

  const start = useCallback(() => {
    if (!SpeechRecognition) {
      setError('Voice input is not supported in this browser. Please type your question.')
      return
    }

    setError(null)
    setTranscript('')

    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition

    // en-IN works well for Indian English accent; ta-IN for Tamil
    recognition.lang = language === 'ta' ? 'ta-IN' : 'en-IN'
    recognition.continuous = false
    recognition.interimResults = true
    recognition.maxAlternatives = 1

    recognition.onstart = () => setIsListening(true)

    recognition.onresult = (event) => {
      let interim = ''
      let final = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          final += text
        } else {
          interim += text
        }
      }
      setTranscript(final || interim)
    }

    recognition.onerror = (event) => {
      setIsListening(false)
      if (event.error === 'no-speech') {
        setError("I didn't hear anything. Please try again.")
      } else if (event.error === 'not-allowed') {
        setError('Microphone access was denied. Please allow microphone access in your browser settings, or type your question below.')
      } else {
        setError(`Voice error: ${event.error}. Please type your question instead.`)
      }
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }, [language])

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsListening(false)
  }, [])

  const reset = useCallback(() => {
    setTranscript('')
    setError(null)
  }, [])

  return { transcript, setTranscript, isListening, isSupported, error, start, stop, reset }
}

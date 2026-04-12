import { useState, useRef, useCallback } from 'react'

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const utteranceRef = useRef(null)

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window

  const speak = useCallback((text, language = 'en') => {
    if (!isSupported) return
    // Cancel any ongoing speech first
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utteranceRef.current = utterance

    // Pick language and a slow, clear rate for seniors
    utterance.lang = language === 'ta' ? 'ta-IN' : 'en-IN'
    utterance.rate = 0.85    // slightly slower than default for clarity
    utterance.pitch = 1.0
    utterance.volume = 1.0

    // Try to pick a clear female voice if available
    const voices = window.speechSynthesis.getVoices()
    const preferred = voices.find(v =>
      v.lang.startsWith(language === 'ta' ? 'ta' : 'en') && v.name.toLowerCase().includes('female')
    ) || voices.find(v => v.lang.startsWith(language === 'ta' ? 'ta' : 'en'))
    if (preferred) utterance.voice = preferred

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
    setIsSpeaking(true)
  }, [isSupported])

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel()
    }
    setIsSpeaking(false)
  }, [isSupported])

  return { speak, stop, isSpeaking, isSupported }
}

import React, { useState, useEffect, useRef } from 'react'
import MicButton from '../components/MicButton.jsx'
import Card from '../components/Card.jsx'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition.js'
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis.js'
import { useClaudeAPI } from '../hooks/useClaudeAPI.js'
import { useSettings } from '../App.jsx'

const QUICK_QUESTIONS = {
  en: [
    'How do I send an email?',
    'How do I make a video call?',
    'What is a password and how do I make a strong one?',
    'How do I connect to Wi-Fi?',
    'What is ChatGPT and how do I use it?',
    'How do I share a photo with family?',
  ],
  ta: [
    'மின்னஞ்சல் எப்படி அனுப்புவது?',
    'வீடியோ அழைப்பு எப்படி செய்வது?',
    'வலுவான கடவுச்சொல் என்ன?',
    'Wi-Fi எப்படி இணைப்பது?',
    'ChatGPT என்னவென்று சொல்லுங்கள்',
    'புகைப்படம் குடும்பத்திற்கு அனுப்புவது எப்படி?',
  ],
}

export default function HomePage() {
  const { fontSize, language } = useSettings()
  const [micState, setMicState] = useState('idle') // idle | listening | processing | error
  const [conversation, setConversation] = useState([])
  const { transcript, setTranscript, isListening, isSupported, error: micError, start, stop, reset: resetMic } = useSpeechRecognition(language)
  const { speak, stop: stopSpeak, isSpeaking } = useSpeechSynthesis()
  const { sendMessage, loading, error: apiError, requestsRemaining } = useClaudeAPI()
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const [inputText, setInputText] = useState('')

  // Sync mic state
  useEffect(() => {
    if (isListening) setMicState('listening')
    else if (loading) setMicState('processing')
    else if (micError) setMicState('error')
    else setMicState('idle')
  }, [isListening, loading, micError])

  // Auto-fill text field with transcript
  useEffect(() => {
    if (transcript) setInputText(transcript)
  }, [transcript])

  // Scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation])

  const handleMicClick = () => {
    if (isListening) {
      stop()
    } else {
      stopSpeak()
      resetMic()
      setInputText('')
      start()
    }
  }

  const handleSubmit = async (text) => {
    const q = (text || inputText).trim()
    if (!q) return
    stopSpeak()
    setInputText('')
    resetMic()

    // Add user message
    setConversation(prev => [...prev, { role: 'user', text: q }])

    // Call API
    const data = await sendMessage(q, 'assistant', language)
    if (data?.reply) {
      setConversation(prev => [...prev, { role: 'assistant', text: data.reply }])
      speak(data.reply, language)
    }
  }

  const handleQuickQuestion = (q) => {
    setInputText(q)
    handleSubmit(q)
  }

  const questions = QUICK_QUESTIONS[language] || QUICK_QUESTIONS.en

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Welcome banner */}
      {conversation.length === 0 && (
        <Card accent="#2E75B6">
          <p style={{ fontSize: `${fontSize + 2}px`, fontWeight: '700', color: '#1F4E79', marginBottom: '6px' }}>
            {language === 'en' ? '👋 Welcome to TechSage AI!' : '👋 TechSage AI-க்கு வரவேற்கிறோம்!'}
          </p>
          <p style={{ fontSize: `${fontSize - 1}px`, color: '#374151', lineHeight: 1.7 }}>
            {language === 'en'
              ? 'Ask me anything about technology — no question is too simple! You can speak or type your question.'
              : 'தொழில்நுட்பம் பற்றி எதை வேண்டுமானாலும் கேளுங்கள் — எந்த கேள்வியும் எளிமையானதல்ல! பேசவும் அல்லது தட்டச்சு செய்யவும்.'}
          </p>
        </Card>
      )}

      {/* Conversation history */}
      {conversation.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {conversation.map((msg, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  maxWidth: '85%',
                  background: msg.role === 'user' ? '#2E75B6' : '#ffffff',
                  color: msg.role === 'user' ? '#ffffff' : '#1f2937',
                  borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  padding: '14px 18px',
                  fontSize: `${fontSize - 1}px`,
                  lineHeight: 1.7,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {msg.role === 'assistant' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '16px' }}>🤖</span>
                    <span style={{ fontSize: `${fontSize - 4}px`, fontWeight: '700', color: '#1F4E79' }}>TechSage</span>
                  </div>
                )}
                {msg.text}
                {msg.role === 'assistant' && (
                  <button
                    onClick={() => isSpeaking ? stopSpeak() : speak(msg.text, language)}
                    style={{
                      display: 'block',
                      marginTop: '10px',
                      background: 'transparent',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      fontSize: `${fontSize - 4}px`,
                      color: '#6b7280',
                      cursor: 'pointer',
                    }}
                  >
                    {isSpeaking ? '⏹ Stop' : '🔊 Read aloud'}
                  </button>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px' }}>
              <span style={{ fontSize: '20px', animation: 'spin 1s linear infinite' }}>⏳</span>
              <span style={{ fontSize: `${fontSize - 2}px`, color: '#6b7280' }}>
                {language === 'en' ? 'TechSage is thinking...' : 'யோசிக்கிறது...'}
              </span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}

      {/* Error messages */}
      {(micError || apiError) && (
        <Card accent="#d97706">
          <p style={{ fontSize: `${fontSize - 2}px`, color: '#92400e' }}>
            ⚠️ {micError || apiError}
          </p>
        </Card>
      )}

      {/* Mic + input area */}
      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <MicButton
            state={micState}
            onClick={handleMicClick}
            fontSize={fontSize}
          />

          {/* Not supported fallback notice */}
          {!isSupported && (
            <p style={{ fontSize: `${fontSize - 4}px`, color: '#9ca3af', textAlign: 'center' }}>
              Voice input not available in this browser. Please type below.
            </p>
          )}

          {/* Text input */}
          <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
            <input
              ref={inputRef}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder={language === 'en' ? 'Or type your question here...' : 'அல்லது இங்கே தட்டச்சு செய்யுங்கள்...'}
              style={{
                flex: 1,
                fontSize: `${fontSize}px`,
                padding: '14px 16px',
                borderRadius: '12px',
                border: '2px solid #d1d5db',
                outline: 'none',
                color: '#1f2937',
                background: '#f9fafb',
              }}
            />
            <button
              onClick={() => handleSubmit()}
              disabled={!inputText.trim() || loading}
              style={{
                background: '#1F4E79',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                padding: '14px 20px',
                fontSize: `${fontSize}px`,
                fontWeight: '700',
                cursor: inputText.trim() && !loading ? 'pointer' : 'not-allowed',
                opacity: inputText.trim() && !loading ? 1 : 0.5,
              }}
            >
              Send
            </button>
          </div>

          {requestsRemaining < 5 && (
            <p style={{ fontSize: `${fontSize - 5}px`, color: '#9ca3af' }}>
              {requestsRemaining} question{requestsRemaining !== 1 ? 's' : ''} remaining this session
            </p>
          )}
        </div>
      </Card>

      {/* Quick questions */}
      {conversation.length === 0 && (
        <div>
          <p style={{ fontSize: `${fontSize - 2}px`, fontWeight: '700', color: '#374151', marginBottom: '12px' }}>
            {language === 'en' ? 'Common questions — tap to ask:' : 'பொதுவான கேள்விகள் — தட்டவும்:'}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {questions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleQuickQuestion(q)}
                style={{
                  background: '#f0f7ff',
                  border: '2px solid #bfdbfe',
                  borderRadius: '24px',
                  padding: '10px 18px',
                  fontSize: `${fontSize - 3}px`,
                  color: '#1e40af',
                  cursor: 'pointer',
                  fontWeight: '500',
                  lineHeight: 1.4,
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

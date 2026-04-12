import React, { useState } from 'react'
import Card from '../components/Card.jsx'
import VerdictCard from '../components/VerdictCard.jsx'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition.js'
import { useClaudeAPI } from '../hooks/useClaudeAPI.js'
import { useSettings } from '../App.jsx'

const EXAMPLES = [
  'URGENT: Your bank account has been suspended. Call 1-800-555-1234 immediately to unlock it.',
  'Congratulations! You have won a $1000 Amazon gift card. Click here to claim: bit.ly/win-now',
  'This is your grandson. I am in trouble and need $500 in gift cards. Please do not tell anyone.',
  'Hi, this is your electricity provider. Your power will be cut in 2 hours unless you pay Rs. 1500 via UPI now.',
  'Your OTP is 847291. Do NOT share this with anyone. If you did not request this, call us.',
]

export default function ScamDetector() {
  const { fontSize, language } = useSettings()
  const [messageText, setMessageText] = useState('')
  const [result, setResult] = useState(null)
  const { isListening, start, stop, transcript } = useSpeechRecognition(language)
  const { sendMessage, loading, error } = useClaudeAPI()

  // Fill textarea from voice
  React.useEffect(() => {
    if (transcript) setMessageText(transcript)
  }, [transcript])

  const handleCheck = async () => {
    if (!messageText.trim()) return
    setResult(null)
    const data = await sendMessage(messageText, 'scam', language)
    if (data) setResult(data)
  }

  const handleExample = (ex) => {
    setMessageText(ex)
    setResult(null)
  }

  const micState = isListening ? 'listening' : 'idle'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Header */}
      <Card accent="#dc2626">
        <p style={{ fontSize: `${fontSize + 2}px`, fontWeight: '800', color: '#dc2626', marginBottom: '6px' }}>
          🛡️ {language === 'en' ? 'Scam Detector' : 'மோசடி கண்டறிவி'}
        </p>
        <p style={{ fontSize: `${fontSize - 1}px`, color: '#374151', lineHeight: 1.7 }}>
          {language === 'en'
            ? 'Got a suspicious message, email, or phone call? Paste or speak it below and I will tell you if it is safe or a scam.'
            : 'சந்தேகமான செய்தி, மின்னஞ்சல் அல்லது தொலைபேசி அழைப்பு வந்ததா? கீழே ஒட்டவும் அல்லது பேசவும்.'}
        </p>
      </Card>

      {/* Input area */}
      <Card>
        <p style={{ fontSize: `${fontSize - 1}px`, fontWeight: '700', color: '#1f2937', marginBottom: '12px' }}>
          {language === 'en' ? 'Paste or type the suspicious message:' : 'சந்தேகமான செய்தியை ஒட்டவும் அல்லது தட்டச்சு செய்யவும்:'}
        </p>
        <textarea
          value={messageText}
          onChange={e => setMessageText(e.target.value)}
          placeholder={language === 'en'
            ? 'Paste the message text here, or tap the microphone to speak it...'
            : 'இங்கே செய்தியை ஒட்டவும்...'}
          rows={5}
          style={{
            width: '100%',
            fontSize: `${fontSize - 1}px`,
            padding: '14px',
            borderRadius: '12px',
            border: '2px solid #d1d5db',
            outline: 'none',
            resize: 'vertical',
            color: '#1f2937',
            background: '#f9fafb',
            lineHeight: 1.7,
            fontFamily: 'inherit',
            boxSizing: 'border-box',
          }}
        />

        <div style={{ display: 'flex', gap: '12px', marginTop: '14px', flexWrap: 'wrap' }}>
          {/* Mic button */}
          <button
            onClick={isListening ? stop : start}
            style={{
              background: isListening ? '#fef2f2' : '#f0f7ff',
              border: `2px solid ${isListening ? '#dc2626' : '#2E75B6'}`,
              borderRadius: '12px',
              padding: '12px 20px',
              fontSize: `${fontSize - 2}px`,
              color: isListening ? '#dc2626' : '#1F4E79',
              cursor: 'pointer',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {isListening ? '⏹ Stop speaking' : '🎤 Speak the message'}
          </button>

          {/* Check button */}
          <button
            onClick={handleCheck}
            disabled={!messageText.trim() || loading}
            style={{
              background: '#1F4E79',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 24px',
              fontSize: `${fontSize - 1}px`,
              fontWeight: '700',
              cursor: messageText.trim() && !loading ? 'pointer' : 'not-allowed',
              opacity: messageText.trim() && !loading ? 1 : 0.5,
              flex: 1,
              minWidth: '160px',
            }}
          >
            {loading ? '⏳ Checking...' : '🔍 Check this message'}
          </button>

          {/* Clear */}
          {messageText && (
            <button
              onClick={() => { setMessageText(''); setResult(null) }}
              style={{
                background: 'transparent',
                border: '2px solid #d1d5db',
                borderRadius: '12px',
                padding: '12px 16px',
                fontSize: `${fontSize - 2}px`,
                color: '#6b7280',
                cursor: 'pointer',
              }}
            >
              Clear
            </button>
          )}
        </div>
      </Card>

      {/* Error */}
      {error && (
        <Card accent="#d97706">
          <p style={{ fontSize: `${fontSize - 2}px`, color: '#92400e' }}>⚠️ {error}</p>
        </Card>
      )}

      {/* Verdict */}
      {result && !loading && (
        <VerdictCard
          verdict={result.verdict || 'SUSPICIOUS'}
          redFlags={result.redFlags || []}
          recommendation={result.recommendation}
        />
      )}

      {/* Example messages */}
      <Card>
        <p style={{ fontSize: `${fontSize - 1}px`, fontWeight: '700', color: '#374151', marginBottom: '12px' }}>
          {language === 'en' ? 'Try these example messages:' : 'இந்த உதாரண செய்திகளை முயற்சிக்கவும்:'}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              onClick={() => handleExample(ex)}
              style={{
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                padding: '12px 14px',
                fontSize: `${fontSize - 4}px`,
                color: '#374151',
                cursor: 'pointer',
                textAlign: 'left',
                lineHeight: 1.5,
              }}
            >
              "{ex}"
            </button>
          ))}
        </div>
      </Card>

      {/* Safety tips */}
      <Card accent="#16a34a">
        <p style={{ fontSize: `${fontSize - 1}px`, fontWeight: '700', color: '#15803d', marginBottom: '10px' }}>
          🛡️ {language === 'en' ? 'Golden rules for staying safe:' : 'பாதுகாப்பிற்கான பொன் விதிகள்:'}
        </p>
        {[
          language === 'en' ? 'Real banks and government agencies NEVER ask for OTPs, passwords, or gift cards' : 'உண்மையான வங்கிகள் ஒருபோதும் OTP அல்லது gift card கேட்காது',
          language === 'en' ? 'If it feels urgent or scary, it is probably a scam — take your time' : 'அவசரமாக இருந்தால், அது மோசடியாக இருக்கலாம்',
          language === 'en' ? 'Call the company directly using a number from their official website' : 'நேரடியாக company-ஐ தொடர்பு கொள்ளுங்கள்',
          language === 'en' ? 'Never share your OTP, PIN, or password with anyone — ever' : 'உங்கள் OTP அல்லது PIN யாரிடமும் பகிர வேண்டாம்',
        ].map((tip, i) => (
          <p key={i} style={{ fontSize: `${fontSize - 3}px`, color: '#166534', marginBottom: '6px', paddingLeft: '16px', lineHeight: 1.6 }}>
            ✓ {tip}
          </p>
        ))}
      </Card>
    </div>
  )
}

import React, { useState } from 'react'
import ClayCard from '../components/Card.jsx'
import ClayButton from '../components/ClayButton.jsx'
import ClayInput from '../components/ClayInput.jsx'
import VerdictCard from '../components/VerdictCard.jsx'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition.js'
import { useClaudeAPI } from '../hooks/useClaudeAPI.js'
import { useSettings } from '../App.jsx'
import { C, SHADOWS, RADIUS, FONT, GRAD } from '../tokens.js'

const EXAMPLES = [
  { icon: '🏦', text: 'URGENT: Your bank account has been suspended. Call 1-800-555-1234 immediately to unlock it.' },
  { icon: '🎁', text: 'Congratulations! You have won a $1000 Amazon gift card. Click here to claim: bit.ly/win-now' },
  { icon: '👴', text: 'This is your grandson. I am in trouble and need $500 in gift cards. Please do not tell anyone.' },
  { icon: '⚡', text: 'Your electricity will be cut in 2 hours unless you pay Rs. 1500 via UPI now.' },
  { icon: '🔢', text: 'Your OTP is 847291. Do NOT share this with anyone. If you did not request this, call us.' },
]

const SAFETY_TIPS = [
  'Real banks and government agencies NEVER ask for OTPs, passwords, or gift cards',
  'If it feels urgent or scary, it is probably a scam — take your time',
  'Call the company directly using a number from their official website',
  'Never share your OTP, PIN, or password with anyone — ever',
]

export default function ScamDetector() {
  const { fontSize, language } = useSettings()
  const [messageText, setMessageText] = useState('')
  const [result, setResult] = useState(null)
  const { isListening, start, stop, transcript } = useSpeechRecognition(language)
  const { sendMessage, loading, error } = useClaudeAPI()

  React.useEffect(() => { if (transcript) setMessageText(transcript) }, [transcript])

  const handleCheck = async () => {
    if (!messageText.trim()) return
    setResult(null)
    const data = await sendMessage(messageText, 'scam', language)
    if (data) setResult(data)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Header card */}
      <ClayCard style={{ background: 'linear-gradient(135deg, rgba(254,226,226,0.5) 0%, rgba(255,255,255,0.72) 60%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #F87171 0%, #DC2626 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '30px', flexShrink: 0, boxShadow: SHADOWS.button,
            animation: 'clay-breathe 5s ease-in-out infinite',
          }}>🛡️</div>
          <div>
            <p style={{ fontFamily: FONT.heading, fontSize: `${fontSize + 3}px`, fontWeight: '900', color: '#991B1B', marginBottom: '6px' }}>
              {language === 'en' ? 'Scam Detector' : 'மோசடி கண்டறிவி'}
            </p>
            <p style={{ fontSize: `${fontSize - 1}px`, color: C.muted, lineHeight: 1.7 }}>
              {language === 'en'
                ? 'Got a suspicious message? Paste or speak it below and I will check if it is safe.'
                : 'சந்தேகமான செய்தி வந்ததா? கீழே ஒட்டவும் அல்லது பேசவும்.'}
            </p>
          </div>
        </div>
      </ClayCard>

      {/* Input card */}
      <ClayCard>
        <p style={{ fontFamily: FONT.heading, fontSize: `${fontSize - 1}px`, fontWeight: '800', color: C.foreground, marginBottom: '14px' }}>
          {language === 'en' ? 'Paste the suspicious message here:' : 'சந்தேகமான செய்தியை ஒட்டவும்:'}
        </p>
        <ClayInput
          value={messageText}
          onChange={e => setMessageText(e.target.value)}
          placeholder={language === 'en'
            ? 'Paste the message text here, or tap the microphone to speak it...'
            : 'இங்கே செய்தியை ஒட்டவும்...'}
          fontSize={fontSize - 1}
          multiline
          rows={4}
        />
        <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap' }}>
          <ClayButton
            variant={isListening ? 'danger' : 'ghost'}
            size="sm"
            onClick={isListening ? stop : start}
          >
            {isListening ? '⏹ Stop speaking' : '🎤 Speak the message'}
          </ClayButton>
          <ClayButton
            size="md"
            onClick={handleCheck}
            disabled={!messageText.trim() || loading}
            style={{ flex: 1, minWidth: '160px' }}
          >
            {loading ? '⏳ Checking...' : '🔍 Check this message'}
          </ClayButton>
          {messageText && (
            <ClayButton variant="secondary" size="sm" onClick={() => { setMessageText(''); setResult(null) }}>
              Clear
            </ClayButton>
          )}
        </div>
      </ClayCard>

      {error && (
        <ClayCard accent={C.amber} padding="18px">
          <p style={{ fontSize: `${fontSize - 2}px`, color: '#78350F', fontFamily: FONT.heading, fontWeight: '700' }}>⚠️ {error}</p>
        </ClayCard>
      )}

      {result && !loading && (
        <VerdictCard verdict={result.verdict || 'SUSPICIOUS'} redFlags={result.redFlags || []} recommendation={result.recommendation} />
      )}

      {/* Example messages */}
      <ClayCard>
        <p style={{ fontFamily: FONT.heading, fontSize: `${fontSize - 1}px`, fontWeight: '800', color: C.foreground, marginBottom: '14px' }}>
          {language === 'en' ? '🧪 Try these example messages:' : 'இந்த உதாரண செய்திகளை முயற்சிக்கவும்:'}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {EXAMPLES.map((ex, i) => (
            <ExampleChip key={i} icon={ex.icon} text={ex.text} fontSize={fontSize}
              onClick={() => { setMessageText(ex.text); setResult(null) }} />
          ))}
        </div>
      </ClayCard>

      {/* Safety tips */}
      <ClayCard style={{ background: 'linear-gradient(135deg, rgba(209,250,229,0.5) 0%, rgba(255,255,255,0.72) 60%)' }}>
        <p style={{ fontFamily: FONT.heading, fontSize: `${fontSize - 1}px`, fontWeight: '800', color: '#065F46', marginBottom: '14px' }}>
          🛡️ {language === 'en' ? 'Golden rules for staying safe:' : 'பாதுகாப்பிற்கான பொன் விதிகள்:'}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {SAFETY_TIPS.map((tip, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{
                width: '26px', height: '26px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #34D399 0%, #059669 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', color: '#fff', flexShrink: 0,
                boxShadow: SHADOWS.button,
              }}>✓</div>
              <p style={{ fontSize: `${fontSize - 3}px`, color: '#065F46', lineHeight: 1.65 }}>{tip}</p>
            </div>
          ))}
        </div>
      </ClayCard>
    </div>
  )
}

function ExampleChip({ icon, text, fontSize, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: '12px',
        background: hovered ? 'rgba(255,255,255,0.90)' : '#EFEBF5',
        border: `1.5px solid ${hovered ? C.accent + '40' : 'transparent'}`,
        borderRadius: RADIUS.md,
        padding: '12px 16px',
        cursor: 'pointer', textAlign: 'left',
        boxShadow: hovered ? SHADOWS.card : SHADOWS.pressed,
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)',
      }}
    >
      <span style={{ fontSize: '20px', flexShrink: 0 }}>{icon}</span>
      <span style={{ fontSize: `${fontSize - 4}px`, color: C.muted, lineHeight: 1.55, fontStyle: 'italic' }}>"{text}"</span>
    </button>
  )
}

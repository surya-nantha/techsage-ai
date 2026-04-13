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
  { icon: '🏛️', text: 'Your Aadhaar has been linked to illegal activity. Call CBI officer on 9876543210 within 2 hours or face arrest.' },
]

const SAFETY_TIPS = [
  'Real banks and government agencies NEVER ask for OTPs, passwords, or gift cards',
  'If it feels urgent or scary, it is probably a scam — take your time',
  'Call the Cyber Crime helpline 1930 if you suspect fraud',
  'Never share your OTP, PIN, or Aadhaar number with anyone — ever',
]

function SafeImg({ src, alt, style = {} }) {
  const [failed, setFailed] = useState(false)
  if (failed) return null
  return <img src={src} alt={alt} onError={() => setFailed(true)} style={{ display: 'block', ...style }} />
}

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

      {/* ══ HEADER CARD — confused-phone illustration ══════════
          The confused senior looking at phone perfectly captures
          the "I got a suspicious message, what do I do?" moment  */}
      <div style={{
        borderRadius: RADIUS.card,
        background: 'linear-gradient(135deg,rgba(254,226,226,0.6) 0%,rgba(255,255,255,0.82) 60%)',
        backdropFilter: 'blur(16px)',
        boxShadow: SHADOWS.card,
        display: 'flex',
        alignItems: 'flex-end',
        overflow: 'hidden',
        minHeight: '150px',
      }}>
        <div style={{ flex: 1, padding: '24px 20px 24px 24px' }}>
          <p style={{ fontFamily: FONT.heading, fontSize: `${fontSize + 3}px`, fontWeight: '900', color: '#991B1B', marginBottom: '8px' }}>
            {language === 'hi' ? '🛡️ स्कैम डिटेक्टर' : language === 'ta' ? '🛡️ மோசடி கண்டறிவி' : '🛡️ Scam Detector'}
          </p>
          <p style={{ fontSize: `${fontSize - 1}px`, color: C.muted, lineHeight: 1.7, maxWidth: '300px' }}>
            {language === 'hi' ? 'कोई संदिग्ध संदेश मिला? नीचे पेस्ट करें या बोलें — मैं बताऊंगा कि यह सुरक्षित है या घोटाला।'
             : language === 'ta' ? 'சந்தேகமான செய்தி வந்ததா? கீழே ஒட்டவும் அல்லது பேசவும் — நான் சொல்கிறேன்.'
             : 'Got a suspicious message? Paste or speak it below and I will tell you if it is safe or a scam.'}
          </p>
        </div>
        {/* Confused-phone illustration — perfectly on-topic */}
        <div style={{ flexShrink: 0, alignSelf: 'flex-end', marginRight: '8px' }}>
          <SafeImg
            src="/images/illus-confused-phone.png"
            alt="A senior citizen looking confused and concerned at a smartphone message"
            style={{ width: '110px', height: '145px', objectFit: 'contain', objectPosition: 'bottom' }}
          />
        </div>
      </div>

      {/* ══ INPUT CARD ════════════════════════════════════════ */}
      <ClayCard>
        <p style={{ fontFamily: FONT.heading, fontSize: `${fontSize - 1}px`, fontWeight: '800', color: C.foreground, marginBottom: '14px' }}>
          {language === 'hi' ? 'संदिग्ध संदेश यहाँ पेस्ट करें:' : language === 'ta' ? 'சந்தேகமான செய்தியை ஒட்டவும்:' : 'Paste or type the suspicious message here:'}
        </p>
        <ClayInput
          value={messageText}
          onChange={e => setMessageText(e.target.value)}
          placeholder={language === 'hi' ? 'संदेश यहाँ पेस्ट करें...' : language === 'ta' ? 'இங்கே செய்தியை ஒட்டவும்...' : 'Paste the message text here, or tap the microphone to speak it...'}
          fontSize={fontSize - 1}
          multiline
          rows={4}
        />
        <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap' }}>
          <ClayButton variant={isListening ? 'danger' : 'ghost'} size="sm" onClick={isListening ? stop : start}>
            {isListening ? '⏹ Stop speaking' : '🎤 Speak the message'}
          </ClayButton>
          <ClayButton size="md" onClick={handleCheck} disabled={!messageText.trim() || loading} style={{ flex: 1, minWidth: '160px' }}>
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

      {/* ══ EXAMPLE MESSAGES ═════════════════════════════════ */}
      <ClayCard>
        <p style={{ fontFamily: FONT.heading, fontSize: `${fontSize - 1}px`, fontWeight: '800', color: C.foreground, marginBottom: '14px' }}>
          {language === 'hi' ? '🧪 इन उदाहरण संदेशों को आज़माएं:' : language === 'ta' ? '🧪 இந்த உதாரண செய்திகளை முயற்சிக்கவும்:' : '🧪 Try these example messages:'}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {EXAMPLES.map((ex, i) => (
            <ExampleChip key={i} icon={ex.icon} text={ex.text} fontSize={fontSize}
              onClick={() => { setMessageText(ex.text); setResult(null) }} />
          ))}
        </div>
      </ClayCard>

      {/* ══ SAFETY TIPS — real seniors + young-helping illus ═ */}
      <div style={{
        borderRadius: RADIUS.card,
        background: 'linear-gradient(135deg,rgba(209,250,229,0.5) 0%,rgba(255,255,255,0.82) 60%)',
        backdropFilter: 'blur(16px)',
        boxShadow: SHADOWS.card,
        overflow: 'hidden',
      }}>
        {/* Real photo strip at top */}
        <div style={{ width: '100%', height: '90px', overflow: 'hidden', position: 'relative' }}>
          <SafeImg
            src="/images/real-seniors-listening.png"
            alt="Senior women attentively learning about digital safety at a Symbiosis College workshop in Pune"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(255,255,255,0.85) 100%)' }} />
          <div style={{ position: 'absolute', bottom: '8px', left: '16px' }}>
            <span style={{ fontFamily: FONT.heading, fontSize: '11px', fontWeight: '700', color: '#065F46', background: 'rgba(255,255,255,0.9)', padding: '3px 10px', borderRadius: '20px' }}>
              📸 Digital literacy workshop, Pune 2023
            </span>
          </div>
        </div>

        <div style={{ padding: '18px 22px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: FONT.heading, fontSize: `${fontSize - 1}px`, fontWeight: '800', color: '#065F46', marginBottom: '14px' }}>
                🛡️ {language === 'hi' ? 'सुरक्षित रहने के सुनहरे नियम:' : language === 'ta' ? 'பாதுகாப்பிற்கான பொன் விதிகள்:' : 'Golden rules for staying safe:'}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {SAFETY_TIPS.map((tip, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg,#34D399,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#fff', flexShrink: 0, boxShadow: SHADOWS.button }}>✓</div>
                    <p style={{ fontSize: `${fontSize - 3}px`, color: '#065F46', lineHeight: 1.65 }}>{tip}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Young-helping-senior illustration — teacher beside learner */}
            <div style={{ flexShrink: 0, alignSelf: 'flex-end' }}>
              <SafeImg
                src="/images/illus-young-helping.png"
                alt="A young person standing beside a senior citizen, guiding them at a laptop"
                style={{ width: '80px', height: '100px', objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ExampleChip({ icon, text, fontSize, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', background: hovered ? 'rgba(255,255,255,0.90)' : '#EFEBF5', border: `1.5px solid ${hovered ? C.accent + '40' : 'transparent'}`, borderRadius: RADIUS.md, padding: '12px 16px', cursor: 'pointer', textAlign: 'left', boxShadow: hovered ? SHADOWS.card : SHADOWS.pressed, transform: hovered ? 'translateY(-2px)' : 'translateY(0)', transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)' }}>
      <span style={{ fontSize: '20px', flexShrink: 0 }}>{icon}</span>
      <span style={{ fontSize: `${fontSize - 4}px`, color: C.muted, lineHeight: 1.55, fontStyle: 'italic' }}>"{text}"</span>
    </button>
  )
}

import React, { useState, useEffect, useRef } from 'react'
import MicButton from '../components/MicButton.jsx'
import ClayCard from '../components/Card.jsx'
import ClayButton from '../components/ClayButton.jsx'
import ClayInput from '../components/ClayInput.jsx'
import DailyTip from '../components/DailyTip.jsx'
import AchievementToast from '../components/AchievementToast.jsx'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition.js'
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis.js'
import { useClaudeAPI } from '../hooks/useClaudeAPI.js'
import { useProgress } from '../hooks/useProgress.js'
import { useSettings } from '../App.jsx'
import { C, SHADOWS, RADIUS, FONT, GRAD } from '../tokens.js'

const QUICK_QUESTIONS = {
  en: [
    { icon: '📧', text: 'How do I send an email?' },
    { icon: '📹', text: 'How do I make a video call?' },
    { icon: '🔐', text: 'How do I make a strong password?' },
    { icon: '📶', text: 'How do I connect to Wi-Fi?' },
    { icon: '🤖', text: 'What is ChatGPT and how do I use it?' },
    { icon: '💳', text: 'How do I stay safe with UPI payments?' },
  ],
  ta: [
    { icon: '📧', text: 'மின்னஞ்சல் எப்படி அனுப்புவது?' },
    { icon: '📹', text: 'வீடியோ அழைப்பு எப்படி செய்வது?' },
    { icon: '🔐', text: 'வலுவான கடவுச்சொல் என்ன?' },
    { icon: '📶', text: 'Wi-Fi எப்படி இணைப்பது?' },
    { icon: '🤖', text: 'ChatGPT என்னவென்று சொல்லுங்கள்' },
    { icon: '💳', text: 'UPI பணம் செலுத்துவது எப்படி பாதுகாப்பாக இருக்கும்?' },
  ],
  hi: [
    { icon: '📧', text: 'ईमेल कैसे भेजें?' },
    { icon: '📹', text: 'वीडियो कॉल कैसे करें?' },
    { icon: '🔐', text: 'मजबूत पासवर्ड कैसे बनाएं?' },
    { icon: '📶', text: 'Wi-Fi से कैसे जुड़ें?' },
    { icon: '🤖', text: 'ChatGPT क्या है और कैसे उपयोग करें?' },
    { icon: '💳', text: 'UPI से पैसे भेजते समय सुरक्षित कैसे रहें?' },
  ],
}
const ICON_GRADS = [GRAD.iconBlue, GRAD.iconPurple, GRAD.iconPink, GRAD.iconGreen, GRAD.iconAmber, GRAD.iconSky]

function SafeImg({ src, alt, style = {} }) {
  const [failed, setFailed] = useState(false)
  if (failed) return null
  return <img src={src} alt={alt} onError={() => setFailed(true)} style={{ display: 'block', ...style }} />
}

export default function HomePage() {
  const { fontSize, language } = useSettings()
  const [micState, setMicState] = useState('idle')
  const [conversation, setConversation] = useState([])
  const [toast, setToast] = useState(null)
  const { transcript, isListening, isSupported, error: micError, start, stop, reset: resetMic } = useSpeechRecognition(language)
  const { speak, stop: stopSpeak, isSpeaking } = useSpeechSynthesis()
  const { sendMessage, loading, error: apiError, requestsRemaining } = useClaudeAPI()
  const { increment, checkUnlocks, progress } = useProgress()
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const [inputText, setInputText] = useState('')

  useEffect(() => {
    if (isListening) setMicState('listening')
    else if (loading) setMicState('processing')
    else if (micError) setMicState('error')
    else setMicState('idle')
  }, [isListening, loading, micError])

  useEffect(() => { if (transcript) setInputText(transcript) }, [transcript])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [conversation])

  const handleMicClick = () => {
    if (isListening) stop()
    else { stopSpeak(); resetMic(); setInputText(''); start() }
  }

  const fireAchievement = (trigger, newVal) => {
    const unlocked = checkUnlocks(trigger, newVal)
    if (unlocked.length > 0) setToast(unlocked[0])
  }

  const handleSubmit = async (text) => {
    const q = (text || inputText).trim()
    if (!q) return
    stopSpeak(); setInputText(''); resetMic()
    setConversation(prev => [...prev, { role: 'user', text: q }])
    const newCount = (progress.question_count || 0) + 1
    increment('question_count')
    fireAchievement('question_count', newCount)
    const data = await sendMessage(q, 'assistant', language)
    if (data?.reply) {
      setConversation(prev => [...prev, { role: 'assistant', text: data.reply }])
      speak(data.reply, language)
    }
  }

  const questions = QUICK_QUESTIONS[language] || QUICK_QUESTIONS.en

  const T = {
    en: { joinBadge: 'Joining thousands of Indian seniors learning tech', quickLabel: 'Common questions — tap to ask:', encourageTitle: 'You can do this!', encourageBody: 'Seniors across India are using technology every day to connect with family and live more independently.', inputPlaceholder: 'Or type your question here...' },
    ta: { joinBadge: 'இந்தியா முழுவதும் ஆயிரக்கணக்கானோர் கற்றுக்கொள்கிறார்கள்', quickLabel: 'பொதுவான கேள்விகள் — தட்டவும்:', encourageTitle: 'நீங்கள் செய்யலாம்!', encourageBody: 'இந்தியா முழுவதும் மூத்தவர்கள் தொழில்நுட்பத்தை தினமும் பயன்படுத்துகிறார்கள்.', inputPlaceholder: 'இங்கே தட்டச்சு செய்யுங்கள்...' },
    hi: { joinBadge: 'भारत भर के हजारों बुजुर्ग तकनीक सीख रहे हैं', quickLabel: 'सामान्य सवाल — टैप करके पूछें:', encourageTitle: 'आप यह कर सकते हैं!', encourageBody: 'भारत भर के बुजुर्ग हर दिन परिवार से जुड़ने के लिए तकनीक का उपयोग कर रहे हैं।', inputPlaceholder: 'यहाँ अपना सवाल टाइप करें...' },
  }
  const t = T[language] || T.en

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <AchievementToast achievement={toast} onDismiss={() => setToast(null)} />

      {/* ══ HERO BANNER ══════════════════════════════════════════
          Left: app name + tagline + real event photo thumbnail
          Right: hero illustration (youth helping senior)         */}
      {conversation.length === 0 && (
        <div style={{
          borderRadius: RADIUS.card,
          background: 'linear-gradient(135deg, #1e3a5f 0%, #7C3AED 55%, #a21caf 100%)',
          overflow: 'hidden',
          boxShadow: SHADOWS.deep,
          display: 'flex',
          alignItems: 'flex-end',
          minHeight: '190px',
          position: 'relative',
        }}>
          {/* Left text block */}
          <div style={{ flex: 1, padding: '28px 24px 28px 28px', zIndex: 2 }}>
            <p style={{ fontFamily: FONT.heading, fontSize: `${fontSize + 10}px`, fontWeight: '900', color: '#fff', lineHeight: 1.0, marginBottom: '10px' }}>
              TechSage AI
            </p>
            <p style={{ fontSize: `${fontSize - 2}px`, color: 'rgba(255,255,255,0.82)', lineHeight: 1.65, marginBottom: '16px', maxWidth: '260px' }}>
              {language === 'hi' ? 'तकनीक के बारे में कुछ भी पूछें — माइक से बोलें या टाइप करें।'
               : language === 'ta' ? 'எதை வேண்டுமானாலும் கேளுங்கள் — பேசவும் அல்லது தட்டச்சு செய்யவும்.'
               : 'Ask me anything about technology — speak or type.'}
            </p>
            {/* Real photo thumbnail badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <SafeImg
                src="/images/real-seniors-phones.png"
                alt="Indian seniors learning at Symbiosis digital literacy event"
                style={{ width: '52px', height: '38px', objectFit: 'cover', borderRadius: '8px', border: '2px solid rgba(255,255,255,0.5)' }}
              />
              <p style={{ fontSize: `${fontSize - 5}px`, color: 'rgba(255,255,255,0.78)', fontFamily: FONT.heading, fontWeight: '700', lineHeight: 1.4, maxWidth: '180px' }}>
                {t.joinBadge}
              </p>
            </div>
          </div>
          {/* Right: hero illustration sits flush at the bottom right */}
          <div style={{ flexShrink: 0, alignSelf: 'flex-end', marginRight: 0, zIndex: 1 }}>
            <SafeImg
              src="/images/hero-youth-helping-senior.png"
              alt="A young person sitting with a senior citizen helping them use a smartphone, surrounded by app icons"
              style={{ width: '220px', height: '165px', objectFit: 'contain', objectPosition: 'bottom right' }}
            />
          </div>
        </div>
      )}

      {/* ══ DAILY TIP ════════════════════════════════════════ */}
      <DailyTip fontSize={fontSize} onRead={() => {
        const n = (progress.tip_read || 0) + 1
        increment('tip_read')
        fireAchievement('tip_read', n)
      }} />

      {/* ══ CONVERSATION ═════════════════════════════════════ */}
      {conversation.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {conversation.map((msg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '85%',
                background: msg.role === 'user' ? GRAD.primaryBtn : 'rgba(255,255,255,0.88)',
                color: msg.role === 'user' ? '#fff' : C.foreground,
                borderRadius: msg.role === 'user'
                  ? `${RADIUS.card} ${RADIUS.card} ${RADIUS.sm} ${RADIUS.card}`
                  : `${RADIUS.card} ${RADIUS.card} ${RADIUS.card} ${RADIUS.sm}`,
                padding: '16px 20px', fontSize: `${fontSize - 1}px`, lineHeight: 1.75,
                boxShadow: SHADOWS.card, backdropFilter: 'blur(12px)', whiteSpace: 'pre-wrap',
              }}>
                {msg.role === 'assistant' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: GRAD.primaryBtn, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', boxShadow: SHADOWS.button }}>🤖</div>
                    <span style={{ fontFamily: FONT.heading, fontSize: `${fontSize - 3}px`, fontWeight: '800', color: C.accent }}>TechSage</span>
                  </div>
                )}
                {msg.text}
                {msg.role === 'assistant' && (
                  <button onClick={() => isSpeaking ? stopSpeak() : speak(msg.text, language)} style={{
                    display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px',
                    background: `${C.accent}12`, border: `1.5px solid ${C.accent}30`,
                    borderRadius: RADIUS.btn, padding: '6px 14px',
                    fontSize: `${fontSize - 4}px`, color: C.accent,
                    cursor: 'pointer', fontFamily: FONT.heading, fontWeight: '700',
                  }}>
                    {isSpeaking ? '⏹ Stop' : '🔊 Read aloud'}
                  </button>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', background: 'rgba(255,255,255,0.80)', borderRadius: RADIUS.card, boxShadow: SHADOWS.card, backdropFilter: 'blur(12px)', width: 'fit-content' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: GRAD.primaryBtn, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', boxShadow: SHADOWS.button }}>🤖</div>
              <span style={{ display: 'flex', gap: '5px' }}>
                {[0,1,2].map(i => <span key={i} style={{ width: '9px', height: '9px', borderRadius: '50%', background: C.accent, animation: `dots 1.2s ease-in-out ${i*0.2}s infinite`, display: 'inline-block' }} />)}
              </span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}

      {(micError || apiError) && (
        <ClayCard accent={C.amber} padding="18px">
          <p style={{ fontSize: `${fontSize - 2}px`, color: '#78350F', fontFamily: FONT.heading, fontWeight: '700' }}>⚠️ {micError || apiError}</p>
        </ClayCard>
      )}

      {/* ══ MIC + INPUT ══════════════════════════════════════ */}
      <ClayCard>
        {/* Subtle illustration watermark top-right */}
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-16px', right: '-14px', opacity: 0.10, pointerEvents: 'none', zIndex: 0 }}>
            <SafeImg src="/images/illus-man-coffee-laptop.png" alt="" style={{ width: '100px', objectFit: 'contain' }} />
          </div>
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '22px' }}>
            <MicButton state={micState} onClick={handleMicClick} fontSize={fontSize} />
            {!isSupported && (
              <p style={{ fontSize: `${fontSize - 4}px`, color: C.muted, textAlign: 'center' }}>
                Voice input not available in this browser — please type below.
              </p>
            )}
            <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
              <ClayInput inputRef={inputRef} value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} placeholder={t.inputPlaceholder} fontSize={fontSize} style={{ flex: 1 }} />
              <ClayButton onClick={() => handleSubmit()} disabled={!inputText.trim() || loading} size="md">Send ↗</ClayButton>
            </div>
            {requestsRemaining < 5 && (
              <p style={{ fontSize: `${fontSize - 5}px`, color: C.muted, fontFamily: FONT.heading, fontWeight: '600' }}>
                {requestsRemaining} question{requestsRemaining !== 1 ? 's' : ''} remaining this session
              </p>
            )}
          </div>
        </div>
      </ClayCard>

      {/* ══ QUICK QUESTIONS ══════════════════════════════════ */}
      {conversation.length === 0 && (
        <div>
          <p style={{ fontFamily: FONT.heading, fontSize: `${fontSize - 2}px`, fontWeight: '800', color: C.foreground, marginBottom: '14px' }}>{t.quickLabel}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {questions.map((q, i) => (
              <QuickChip key={i} icon={q.icon} text={q.text} gradient={ICON_GRADS[i]} fontSize={fontSize} onClick={() => handleSubmit(q.text)} />
            ))}
          </div>
        </div>
      )}

      {/* ══ ENCOURAGEMENT CARD — real event audience photo ═══
          Research: 70+ seniors attended the Symbiosis event.
          Seeing real Indian faces builds trust and connection. */}
      {conversation.length === 0 && (
        <div style={{
          borderRadius: RADIUS.card, overflow: 'hidden',
          boxShadow: SHADOWS.card,
          background: 'rgba(255,255,255,0.80)',
          backdropFilter: 'blur(16px)',
          display: 'flex', minHeight: '130px',
        }}>
          <div style={{ width: '150px', flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
            <SafeImg
              src="/images/real-event-audience.png"
              alt="Over 70 senior citizens attending a digital literacy workshop in Pune, India"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/* Overlay gradient to blend into card */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent 60%, rgba(255,255,255,0.6) 100%)' }} />
          </div>
          <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '8px' }}>
            <p style={{ fontFamily: FONT.heading, fontSize: `${fontSize + 1}px`, fontWeight: '900', color: C.accent, lineHeight: 1.2 }}>
              {t.encourageTitle}
            </p>
            <p style={{ fontSize: `${fontSize - 3}px`, color: C.muted, lineHeight: 1.7 }}>
              {t.encourageBody}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function QuickChip({ icon, text, gradient, fontSize, onClick }) {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)
  return (
    <button onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => { setHovered(false); setPressed(false) }} onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)}
      style={{ display: 'flex', alignItems: 'center', gap: '8px', background: hovered ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.72)', border: `1.5px solid ${C.accent}22`, borderRadius: RADIUS.md, padding: '10px 16px', fontSize: `${fontSize - 3}px`, color: C.foreground, cursor: 'pointer', fontFamily: FONT.body, fontWeight: '500', lineHeight: 1.4, boxShadow: pressed ? SHADOWS.pressed : hovered ? SHADOWS.cardHover : SHADOWS.card, transform: pressed ? 'scale(0.95)' : hovered ? 'translateY(-3px)' : 'translateY(0)', transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)', backdropFilter: 'blur(10px)' }}>
      <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0, boxShadow: '2px 2px 6px rgba(0,0,0,0.15)' }}>{icon}</span>
      {text}
    </button>
  )
}

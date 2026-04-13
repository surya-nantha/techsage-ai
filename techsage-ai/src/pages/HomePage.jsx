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
    { icon: '🤖', text: 'ChatGPT क्या है और इसे कैसे उपयोग करें?' },
    { icon: '💳', text: 'UPI से पैसे भेजते समय सुरक्षित कैसे रहें?' },
  ],
}

const ICON_GRADS = [GRAD.iconBlue, GRAD.iconPurple, GRAD.iconPink, GRAD.iconGreen, GRAD.iconAmber, GRAD.iconSky]

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

    // Achievement tracking
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

  const welcomeText = {
    en: { heading: '👋 Welcome to TechSage AI!', body: 'Ask me anything about technology — no question is too simple! Speak using the microphone or type below.' },
    ta: { heading: '👋 TechSage AI-க்கு வரவேற்கிறோம்!', body: 'தொழில்நுட்பம் பற்றி எதை வேண்டுமானாலும் கேளுங்கள். பேசவும் அல்லது தட்டச்சு செய்யவும்.' },
    hi: { heading: '👋 TechSage AI में आपका स्वागत है!', body: 'तकनीक के बारे में कुछ भी पूछें — कोई भी सवाल छोटा नहीं होता! माइक से बोलें या नीचे टाइप करें।' },
  }
  const wt = welcomeText[language] || welcomeText.en

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Achievement toast */}
      <AchievementToast achievement={toast} onDismiss={() => setToast(null)} />

      {/* ── Daily Tip ────────────────────────────────────────── */}
      <DailyTip fontSize={fontSize} onRead={() => {
        const newVal = (progress.tip_read || 0) + 1
        increment('tip_read')
        fireAchievement('tip_read', newVal)
      }} />

      {/* ── Welcome banner ───────────────────────────────────── */}
      {conversation.length === 0 && (
        <ClayCard style={{ background: 'linear-gradient(135deg,rgba(167,139,250,0.18) 0%,rgba(255,255,255,0.72) 60%)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              background: GRAD.primaryBtn, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '28px', boxShadow: SHADOWS.button,
              animation: 'clay-breathe 5s ease-in-out infinite',
            }}>🤖</div>
            <div>
              <p style={{ fontFamily: FONT.heading, fontSize: `${fontSize + 3}px`, fontWeight: '900', color: C.accent, marginBottom: '8px', lineHeight: 1.2 }}>{wt.heading}</p>
              <p style={{ fontSize: `${fontSize - 1}px`, color: C.muted, lineHeight: 1.75 }}>{wt.body}</p>
            </div>
          </div>
        </ClayCard>
      )}

      {/* ── Conversation ─────────────────────────────────────── */}
      {conversation.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {conversation.map((msg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '85%',
                background: msg.role === 'user' ? GRAD.primaryBtn : 'rgba(255,255,255,0.82)',
                color: msg.role === 'user' ? '#fff' : C.foreground,
                borderRadius: msg.role === 'user'
                  ? `${RADIUS.card} ${RADIUS.card} ${RADIUS.sm} ${RADIUS.card}`
                  : `${RADIUS.card} ${RADIUS.card} ${RADIUS.card} ${RADIUS.sm}`,
                padding: '16px 20px',
                fontSize: `${fontSize - 1}px`,
                lineHeight: 1.75,
                boxShadow: SHADOWS.card,
                backdropFilter: 'blur(12px)',
                whiteSpace: 'pre-wrap',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', background: 'rgba(255,255,255,0.72)', borderRadius: RADIUS.card, boxShadow: SHADOWS.card, backdropFilter: 'blur(12px)', width: 'fit-content' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: GRAD.primaryBtn, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', boxShadow: SHADOWS.button }}>🤖</div>
              <span style={{ display: 'flex', gap: '5px' }}>
                {[0,1,2].map(i => <span key={i} style={{ width: '9px', height: '9px', borderRadius: '50%', background: C.accent, animation: `dots 1.2s ease-in-out ${i*0.2}s infinite`, display: 'inline-block' }}/>)}
              </span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}

      {/* Error */}
      {(micError || apiError) && (
        <ClayCard accent={C.amber} padding="18px">
          <p style={{ fontSize: `${fontSize - 2}px`, color: '#78350F', fontFamily: FONT.heading, fontWeight: '700' }}>⚠️ {micError || apiError}</p>
        </ClayCard>
      )}

      {/* ── Mic + input card ─────────────────────────────────── */}
      <ClayCard>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '22px' }}>
          <MicButton state={micState} onClick={handleMicClick} fontSize={fontSize} />
          {!isSupported && <p style={{ fontSize: `${fontSize - 4}px`, color: C.muted, textAlign: 'center' }}>Voice input not available — please type below.</p>}
          <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
            <ClayInput
              inputRef={inputRef}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder={language === 'hi' ? 'यहाँ अपना सवाल टाइप करें...' : language === 'ta' ? 'இங்கே தட்டச்சு செய்யுங்கள்...' : 'Or type your question here...'}
              fontSize={fontSize}
              style={{ flex: 1 }}
            />
            <ClayButton onClick={() => handleSubmit()} disabled={!inputText.trim() || loading} size="md">
              Send ↗
            </ClayButton>
          </div>
          {requestsRemaining < 5 && (
            <p style={{ fontSize: `${fontSize - 5}px`, color: C.muted, fontFamily: FONT.heading, fontWeight: '600' }}>
              {requestsRemaining} question{requestsRemaining !== 1 ? 's' : ''} remaining this session
            </p>
          )}
        </div>
      </ClayCard>

      {/* ── Quick questions ───────────────────────────────────── */}
      {conversation.length === 0 && (
        <div>
          <p style={{ fontFamily: FONT.heading, fontSize: `${fontSize - 2}px`, fontWeight: '800', color: C.foreground, marginBottom: '14px' }}>
            {language === 'hi' ? 'सामान्य सवाल — टैप करके पूछें:' : language === 'ta' ? 'பொதுவான கேள்விகள் — தட்டவும்:' : 'Common questions — tap to ask:'}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {questions.map((q, i) => (
              <QuickChip key={i} icon={q.icon} text={q.text} gradient={ICON_GRADS[i]} fontSize={fontSize}
                onClick={() => handleSubmit(q.text)} />
            ))}
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
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false) }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        background: hovered ? 'rgba(255,255,255,0.90)' : 'rgba(255,255,255,0.72)',
        border: `1.5px solid ${C.accent}22`,
        borderRadius: RADIUS.md, padding: '10px 16px',
        fontSize: `${fontSize - 3}px`, color: C.foreground,
        cursor: 'pointer', fontFamily: FONT.body, fontWeight: '500', lineHeight: 1.4,
        boxShadow: pressed ? SHADOWS.pressed : hovered ? SHADOWS.cardHover : SHADOWS.card,
        transform: pressed ? 'scale(0.95)' : hovered ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0, boxShadow: '2px 2px 6px rgba(0,0,0,0.15)' }}>{icon}</span>
      {text}
    </button>
  )
}

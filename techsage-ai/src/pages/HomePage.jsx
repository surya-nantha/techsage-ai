import React, { useState, useEffect, useRef } from 'react'
import Spline from '@splinetool/react-spline' // 1. Import Spline!
import { Bot, Mail, Video, Lock, Wifi, MessageSquare, ShieldAlert, Volume2, Square } from 'lucide-react'
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

const QUICK_QUESTIONS = {
  en: [
    { Icon: Mail, text: 'How do I send an email?' },
    { Icon: Video, text: 'How do I make a video call?' },
    { Icon: Lock, text: 'How do I make a strong password?' },
    { Icon: Wifi, text: 'How do I connect to Wi-Fi?' },
    { Icon: MessageSquare, text: 'What is ChatGPT and how do I use it?' },
    { Icon: ShieldAlert, text: 'How do I stay safe with UPI payments?' },
  ],
  ta: [
    { Icon: Mail, text: 'மின்னஞ்சல் எப்படி அனுப்புவது?' },
    { Icon: Video, text: 'வீடியோ அழைப்பு எப்படி செய்வது?' },
    { Icon: Lock, text: 'வலுவான கடவுச்சொல் என்ன?' },
    { Icon: Wifi, text: 'Wi-Fi எப்படி இணைப்பது?' },
    { Icon: MessageSquare, text: 'ChatGPT என்னவென்று சொல்லுங்கள்' },
    { Icon: ShieldAlert, text: 'UPI பணம் செலுத்துவது எப்படி பாதுகாப்பாக இருக்கும்?' },
  ],
  hi: [
<<<<<<< HEAD
    { Icon: Mail, text: 'ईमेल कैसे भेजें?' },
    { Icon: Video, text: 'वीडियो कॉल कैसे करें?' },
    { Icon: Lock, text: 'मजबूत पासवर्ड कैसे बनाएं?' },
    { Icon: Wifi, text: 'Wi-Fi से कैसे जुड़ें?' },
    { Icon: MessageSquare, text: 'ChatGPT क्या है और इसे कैसे उपयोग करें?' },
    { Icon: ShieldAlert, text: 'UPI से पैसे भेजते समय सुरक्षित कैसे रहें?' },
  ],
}

const ICON_GRADS = [
  'bg-gradient-to-br from-blue-400 to-blue-600',
  'bg-gradient-to-br from-purple-400 to-purple-600',
  'bg-gradient-to-br from-pink-400 to-pink-600',
  'bg-gradient-to-br from-wave to-ocean',
  'bg-gradient-to-br from-amber to-orange-500',
  'bg-gradient-to-br from-sky-400 to-sky-600',
]
=======
    { icon: '📧', text: 'ईमेल कैसे भेजें?' },
    { icon: '📹', text: 'वीडियो कॉल कैसे करें?' },
    { icon: '🔐', text: 'मजबूत पासवर्ड कैसे बनाएं?' },
    { icon: '📶', text: 'Wi-Fi से कैसे जुड़ें?' },
    { icon: '🤖', text: 'ChatGPT क्या है और कैसे उपयोग करें?' },
    { icon: '💳', text: 'UPI से पैसे भेजते समय सुरक्षित कैसे रहें?' },
  ],
}
const ICON_GRADS = [GRAD.iconBlue, GRAD.iconPurple, GRAD.iconPink, GRAD.iconGreen, GRAD.iconAmber, GRAD.iconSky]
>>>>>>> main

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
<<<<<<< HEAD

=======
>>>>>>> main
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

<<<<<<< HEAD
  const welcomeText = {
    en: { heading: 'Hi, I am TechSage!', body: 'Ask me anything about technology — no question is too simple! Tap the big microphone to speak, or type below.' },
    ta: { heading: 'வணக்கம், நான் TechSage!', body: 'தொழில்நுட்பம் பற்றி எதை வேண்டுமானாலும் கேளுங்கள். பேச மைக்ரோஃபோனைத் தட்டவும் அல்லது கீழே தட்டச்சு செய்யவும்.' },
    hi: { heading: 'नमस्ते, मैं TechSage हूँ!', body: 'तकनीक के बारे में कुछ भी पूछें! बोलने के लिए बड़े माइक्रोफ़ोन को टैप करें, या नीचे टाइप करें।' },
=======
  const T = {
    en: { joinBadge: 'Joining thousands of Indian seniors learning tech', quickLabel: 'Common questions — tap to ask:', encourageTitle: 'You can do this!', encourageBody: 'Seniors across India are using technology every day to connect with family and live more independently.', inputPlaceholder: 'Or type your question here...' },
    ta: { joinBadge: 'இந்தியா முழுவதும் ஆயிரக்கணக்கானோர் கற்றுக்கொள்கிறார்கள்', quickLabel: 'பொதுவான கேள்விகள் — தட்டவும்:', encourageTitle: 'நீங்கள் செய்யலாம்!', encourageBody: 'இந்தியா முழுவதும் மூத்தவர்கள் தொழில்நுட்பத்தை தினமும் பயன்படுத்துகிறார்கள்.', inputPlaceholder: 'இங்கே தட்டச்சு செய்யுங்கள்...' },
    hi: { joinBadge: 'भारत भर के हजारों बुजुर्ग तकनीक सीख रहे हैं', quickLabel: 'सामान्य सवाल — टैप करके पूछें:', encourageTitle: 'आप यह कर सकते हैं!', encourageBody: 'भारत भर के बुजुर्ग हर दिन परिवार से जुड़ने के लिए तकनीक का उपयोग कर रहे हैं।', inputPlaceholder: 'यहाँ अपना सवाल टाइप करें...' },
>>>>>>> main
  }
  const t = T[language] || T.en

  return (
<<<<<<< HEAD
    <div className="flex flex-col gap-6">
      <AchievementToast achievement={toast} onDismiss={() => setToast(null)} />

      {/* ── 2. The New Hero Section ──────────────────────────── */}
      {conversation.length === 0 && (
        <ClayCard className="bg-gradient-to-br from-wave/10 to-white/80 border-[1.5px] border-wave/20">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-10">
            
            {/* Left: 3D Robot */}
            <div className="w-full md:w-[45%] h-[260px] md:h-[320px] rounded-3xl overflow-hidden bg-wave/5 shadow-inner relative flex shrink-0">
              <Spline scene="https://prod.spline.design/SIOftQoTZs8uMjks/scene.splinecode" />
              {/* Optional overlay to prevent scrolling interference on mobile */}
              <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_20px_rgba(59,130,246,0.1)] rounded-3xl"></div>
=======
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
>>>>>>> main
            </div>

            {/* Right: Welcome & Massive Mic */}
            <div className="w-full md:w-[55%] flex flex-col items-center md:items-start text-center md:text-left gap-6 pb-2 md:pb-0">
              <div>
                <h1 className="font-heading font-black text-ocean mb-3 leading-tight" style={{ fontSize: `${fontSize + 8}px` }}>
                  {wt.heading}
                </h1>
                <p className="text-muted leading-relaxed font-medium" style={{ fontSize: `${fontSize}px` }}>
                  {wt.body}
                </p>
              </div>
              
              {/* Extra large microphone for the hero! */}
              <div className="pt-2">
                <MicButton state={micState} onClick={handleMicClick} fontSize={fontSize + 4} />
              </div>
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

<<<<<<< HEAD
      {/* ── Conversation Bubbles ─────────────────────────────── */}
=======
      {/* ══ DAILY TIP ════════════════════════════════════════ */}
      <DailyTip fontSize={fontSize} onRead={() => {
        const n = (progress.tip_read || 0) + 1
        increment('tip_read')
        fireAchievement('tip_read', n)
      }} />

      {/* ══ CONVERSATION ═════════════════════════════════════ */}
>>>>>>> main
      {conversation.length > 0 && (
        <div className="flex flex-col gap-4">
          {conversation.map((msg, i) => (
<<<<<<< HEAD
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[85%] p-4 md:px-5 backdrop-blur-md whitespace-pre-wrap ${msg.role === 'user' ? 'bg-gradient-to-br from-wave to-ocean text-white rounded-[32px_32px_16px_32px]' : 'bg-white/80 text-ink rounded-[32px_32px_32px_16px]'}`}
                style={{ fontSize: `${fontSize - 1}px`, lineHeight: 1.75, boxShadow: 'var(--shadow-clay-card)' }}
              >
=======
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
>>>>>>> main
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-wave to-ocean text-white flex items-center justify-center" style={{ boxShadow: 'var(--shadow-clay-button)' }}>
                      <Bot size={16} strokeWidth={2.5} />
                    </div>
                    <span className="font-heading font-extrabold text-ocean" style={{ fontSize: `${fontSize - 3}px` }}>TechSage</span>
                  </div>
                )}
                {msg.text}
                {msg.role === 'assistant' && (
                  <button onClick={() => isSpeaking ? stopSpeak() : speak(msg.text, language)} className="flex items-center gap-1.5 mt-3 bg-ocean/10 border-2 border-ocean/20 rounded-full px-3.5 py-1.5 text-ocean cursor-pointer font-heading font-bold hover:bg-ocean/20 transition-colors">
                    {isSpeaking ? <Square fill="currentColor" size={14} /> : <Volume2 size={16} strokeWidth={2.5}/>}
                    <span style={{ fontSize: `${fontSize - 4}px` }}>{isSpeaking ? 'Stop' : 'Read aloud'}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
          {loading && (
<<<<<<< HEAD
            <div className="flex items-center gap-3 p-4 bg-white/70 rounded-3xl backdrop-blur-md w-fit" style={{ boxShadow: 'var(--shadow-clay-card)' }}>
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-wave to-ocean text-white flex items-center justify-center" style={{ boxShadow: 'var(--shadow-clay-button)' }}>
                <Bot size={16} strokeWidth={2.5} />
              </div>
              <span className="flex gap-1.5">
                {[0,1,2].map(i => <span key={i} className="w-2.5 h-2.5 rounded-full bg-ocean animate-[dots_1.2s_ease-in-out_infinite]" style={{ animationDelay: `${i*0.2}s` }}/>)}
=======
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', background: 'rgba(255,255,255,0.80)', borderRadius: RADIUS.card, boxShadow: SHADOWS.card, backdropFilter: 'blur(12px)', width: 'fit-content' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: GRAD.primaryBtn, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', boxShadow: SHADOWS.button }}>🤖</div>
              <span style={{ display: 'flex', gap: '5px' }}>
                {[0,1,2].map(i => <span key={i} style={{ width: '9px', height: '9px', borderRadius: '50%', background: C.accent, animation: `dots 1.2s ease-in-out ${i*0.2}s infinite`, display: 'inline-block' }} />)}
>>>>>>> main
              </span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}

      {(micError || apiError) && (
        <ClayCard accent="#F59E0B" padding="p-4 md:p-5">
          <p className="font-heading font-bold text-[#78350F]" style={{ fontSize: `${fontSize - 2}px` }}>⚠️ {micError || apiError}</p>
        </ClayCard>
      )}

<<<<<<< HEAD
      {/* ── Input Box (Always Visible) ───────────────────────── */}
      <ClayCard padding="p-5">
        <div className="flex flex-col gap-4">
          
          {/* If they are in a conversation, show a mini mic button here since the hero mic is gone */}
          {conversation.length > 0 && (
             <div className="flex justify-center pb-2">
               <MicButton state={micState} onClick={handleMicClick} fontSize={fontSize - 2} />
             </div>
          )}

          {!isSupported && <p className="text-muted text-center" style={{ fontSize: `${fontSize - 4}px` }}>Voice input not available — please type below.</p>}
          
          <div className="flex gap-2.5 w-full">
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
              Send
            </ClayButton>
          </div>
          {requestsRemaining < 5 && (
            <p className="text-muted font-heading font-semibold text-center" style={{ fontSize: `${fontSize - 5}px` }}>
              {requestsRemaining} question{requestsRemaining !== 1 ? 's' : ''} remaining this session
            </p>
          )}
=======
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
>>>>>>> main
        </div>
      </ClayCard>

      {/* ══ QUICK QUESTIONS ══════════════════════════════════ */}
      {conversation.length === 0 && (
        <div>
<<<<<<< HEAD
          <p className="font-heading font-extrabold text-ink mb-3.5 pl-2" style={{ fontSize: `${fontSize - 2}px` }}>
            {language === 'hi' ? 'सामान्य सवाल — टैप करके पूछें:' : language === 'ta' ? 'பொதுவான கேள்விகள் — தட்டவும்:' : 'Common questions — tap to ask:'}
          </p>
          <div className="flex flex-wrap gap-3">
            {questions.map((q, i) => (
              <QuickChip key={i} Icon={q.Icon} text={q.text} gradientClass={ICON_GRADS[i]} fontSize={fontSize}
                onClick={() => handleSubmit(q.text)} />
=======
          <p style={{ fontFamily: FONT.heading, fontSize: `${fontSize - 2}px`, fontWeight: '800', color: C.foreground, marginBottom: '14px' }}>{t.quickLabel}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {questions.map((q, i) => (
              <QuickChip key={i} icon={q.icon} text={q.text} gradient={ICON_GRADS[i]} fontSize={fontSize} onClick={() => handleSubmit(q.text)} />
>>>>>>> main
            ))}
          </div>
        </div>
      )}

<<<<<<< HEAD
      {/* ── Daily Tip (Moved to the bottom for better layout) ── */}
      {conversation.length === 0 && (
        <div className="mt-2">
          <DailyTip fontSize={fontSize} onRead={() => {
            const newVal = (progress.tip_read || 0) + 1
            increment('tip_read')
            fireAchievement('tip_read', newVal)
          }} />
        </div>
      )}

=======
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
>>>>>>> main
    </div>
  )
}

function QuickChip({ Icon, text, gradientClass, fontSize, onClick }) {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)
  return (
<<<<<<< HEAD
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false) }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      className={`
        flex items-center gap-2.5 rounded-2xl px-4 py-2.5 text-ink cursor-pointer font-body font-medium leading-snug backdrop-blur-md border-[1.5px]
        transition-all duration-200 ease-out
        ${hovered ? 'bg-white/90 border-ocean/20' : 'bg-white/70 border-transparent'}
        ${pressed ? 'scale-95' : hovered ? '-translate-y-1' : 'translate-y-0'}
      `}
      style={{
        fontSize: `${fontSize - 3}px`,
        boxShadow: pressed ? 'var(--shadow-clay-pressed)' : hovered ? 'var(--shadow-clay-card-hover)' : 'var(--shadow-clay-card)',
      }}
    >
      <span className={`w-7 h-7 rounded-full text-white flex items-center justify-center shrink-0 shadow-md ${gradientClass}`}>
        <Icon size={14} strokeWidth={2.5} />
      </span>
=======
    <button onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => { setHovered(false); setPressed(false) }} onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)}
      style={{ display: 'flex', alignItems: 'center', gap: '8px', background: hovered ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.72)', border: `1.5px solid ${C.accent}22`, borderRadius: RADIUS.md, padding: '10px 16px', fontSize: `${fontSize - 3}px`, color: C.foreground, cursor: 'pointer', fontFamily: FONT.body, fontWeight: '500', lineHeight: 1.4, boxShadow: pressed ? SHADOWS.pressed : hovered ? SHADOWS.cardHover : SHADOWS.card, transform: pressed ? 'scale(0.95)' : hovered ? 'translateY(-3px)' : 'translateY(0)', transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)', backdropFilter: 'blur(10px)' }}>
      <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0, boxShadow: '2px 2px 6px rgba(0,0,0,0.15)' }}>{icon}</span>
>>>>>>> main
      {text}
    </button>
  )
}
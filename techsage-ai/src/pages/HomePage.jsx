import React, { useState, useEffect, useRef } from 'react'
import Spline from '@splinetool/react-spline'
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

  const welcomeText = {
    en: { heading: 'Hi, I am TechSage!', body: 'Ask me anything about technology — no question is too simple! Tap the big microphone to speak, or type below.' },
    ta: { heading: 'வணக்கம், நான் TechSage!', body: 'தொழில்நுட்பம் பற்றி எதை வேண்டுமானாலும் கேளுங்கள். பேச மைக்ரோஃபோனைத் தட்டவும் அல்லது கீழே தட்டச்சு செய்யவும்.' },
    hi: { heading: 'नमस्ते, मैं TechSage हूँ!', body: 'तकनीक के बारे में कुछ भी पूछें! बोलने के लिए बड़े माइक्रोफ़ोन को टैप करें, या नीचे टाइप करें।' },
  }
  const wt = welcomeText[language] || welcomeText.en

  return (
    <div className="flex flex-col gap-6">
      <AchievementToast achievement={toast} onDismiss={() => setToast(null)} />

      {/* ── The New Hero Section ──────────────────────────── */}
      {conversation.length === 0 && (
        <ClayCard className="bg-gradient-to-br from-wave/10 to-white/80 border-[1.5px] border-wave/20">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-10">
            
            {/* Left: 3D Robot */}
            <div className="w-full md:w-[45%] h-[260px] md:h-[320px] rounded-3xl overflow-hidden bg-wave/5 shadow-inner relative flex shrink-0">
              <Spline scene="https://prod.spline.design/SIOftQoTZs8uMjks/scene.splinecode" />
              <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_20px_rgba(59,130,246,0.1)] rounded-3xl"></div>
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
        </ClayCard>
      )}

      {/* ── Conversation Bubbles ─────────────────────────────── */}
      {conversation.length > 0 && (
        <div className="flex flex-col gap-4">
          {conversation.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[85%] p-4 md:px-5 backdrop-blur-md whitespace-pre-wrap ${msg.role === 'user' ? 'bg-gradient-to-br from-wave to-ocean text-white rounded-[32px_32px_16px_32px]' : 'bg-white/80 text-ink rounded-[32px_32px_32px_16px]'}`}
                style={{ fontSize: `${fontSize - 1}px`, lineHeight: 1.75, boxShadow: 'var(--shadow-clay-card)' }}
              >
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
            <div className="flex items-center gap-3 p-4 bg-white/70 rounded-3xl backdrop-blur-md w-fit" style={{ boxShadow: 'var(--shadow-clay-card)' }}>
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-wave to-ocean text-white flex items-center justify-center" style={{ boxShadow: 'var(--shadow-clay-button)' }}>
                <Bot size={16} strokeWidth={2.5} />
              </div>
              <span className="flex gap-1.5">
                {[0,1,2].map(i => <span key={i} className="w-2.5 h-2.5 rounded-full bg-ocean animate-[dots_1.2s_ease-in-out_infinite]" style={{ animationDelay: `${i*0.2}s` }}/>)}
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

      {/* ── Input Box (Always Visible) ───────────────────────── */}
      <ClayCard padding="p-5">
        <div className="flex flex-col gap-4">
          
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
        </div>
      </ClayCard>

      {/* ── Quick questions ───────────────────────────────────── */}
      {conversation.length === 0 && (
        <div>
          <p className="font-heading font-extrabold text-ink mb-3.5 pl-2" style={{ fontSize: `${fontSize - 2}px` }}>
            {language === 'hi' ? 'सामान्य सवाल — टैप करके पूछें:' : language === 'ta' ? 'பொதுவான கேள்விகள் — தட்டவும்:' : 'Common questions — tap to ask:'}
          </p>
          <div className="flex flex-wrap gap-3">
            {questions.map((q, i) => (
              <QuickChip key={i} Icon={q.Icon} text={q.text} gradientClass={ICON_GRADS[i]} fontSize={fontSize}
                onClick={() => handleSubmit(q.text)} />
            ))}
          </div>
        </div>
      )}

      {/* ── Daily Tip (Render the FAB) ── */}
      {conversation.length === 0 && (
        <div className="mt-2">
          <DailyTip fontSize={fontSize} onRead={() => {
            const newVal = (progress.tip_read || 0) + 1
            increment('tip_read')
            fireAchievement('tip_read', newVal)
          }} />
        </div>
      )}

    </div>
  )
}

function QuickChip({ Icon, text, gradientClass, fontSize, onClick }) {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)
  return (
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
      {text}
    </button>
  )
}
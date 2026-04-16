import React, { useState } from 'react'
import { BookOpen, Star, Volume2, Square, ArrowLeft, Mail, Video, Wifi, Image as ImageIcon, Bot, Lock, Shield, CheckCircle2 } from 'lucide-react'
import ClayCard from '../components/Card.jsx'
import ClayButton from '../components/ClayButton.jsx'
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis.js'
import { useSettings } from '../App.jsx'
import tutorials from '../data/tutorials.json'

const TUTORIAL_ICONS = { email: Mail, videocall: Video, wifi: Wifi, photos: ImageIcon, ai: Bot, passwords: Lock, privacy: Shield }

// Fixed the missing Amber!
const CARD_GRADIENTS = [ 
  'bg-gradient-to-br from-blue-400 to-blue-600', 
  'bg-gradient-to-br from-purple-400 to-purple-600', 
  'bg-gradient-to-br from-pink-400 to-pink-600', 
  'bg-gradient-to-br from-wave to-ocean', 
  'bg-amber', // Fixed!
  'bg-gradient-to-br from-sky-400 to-sky-600' 
]
const CARD_BG_TINTS = [ 'bg-gradient-to-br from-blue-100/40 to-white/70', 'bg-gradient-to-br from-purple-100/40 to-white/70', 'bg-gradient-to-br from-pink-100/40 to-white/70', 'bg-gradient-to-br from-wave/10 to-white/70', 'bg-orange-50', 'bg-gradient-to-br from-sky-100/40 to-white/70' ]

// NO MORE GREEN! Wave/Ocean for Beginner, Amber for Intermediate
const DIFFICULTY_CONFIG = { 
  Beginner: { bg: 'bg-gradient-to-br from-wave to-ocean', label: 'Beginner' }, 
  Intermediate: { bg: 'bg-amber', label: 'Intermediate' } 
}

const TUTORIAL_IMAGES = { email: '/img-email.png', videocall: '/img-video-call.png', wifi: '/img-wifi.png', photos: '/img-photo-sharing.png', ai: '/img-ai-assistant.png', passwords: '/img-password.png', privacy: '/img-online-safety.png' }

// ─── Tutorial step viewer ─────────────────────────────────────────
function TutorialViewer({ tutorial, colorIdx, onBack }) {
  const { fontSize, language } = useSettings()
  const { speak, stop, isSpeaking } = useSpeechSynthesis()
  const [step, setStep] = useState(0)
  const current = tutorial.steps[step]
  const total   = tutorial.steps.length
  
  const gradClass = CARD_GRADIENTS[colorIdx % CARD_GRADIENTS.length]
  const bgClass = CARD_BG_TINTS[colorIdx % CARD_BG_TINTS.length]
  const Icon = TUTORIAL_ICONS[tutorial.id] || BookOpen

  const goTo = (i) => { stop(); setStep(i) }
  const prev = () => goTo(Math.max(step - 1, 0))
  const next = () => { stop(); step < total - 1 ? setStep(step + 1) : onBack() }

  return (
    <div className="flex flex-col gap-5">
      <ClayButton variant="ghost" size="sm" onClick={() => { stop(); onBack() }} className="w-fit">
        <ArrowLeft size={16} className="mr-1.5" /> Back to tutorials
      </ClayButton>

      <ClayCard className={bgClass}>
        <div className="flex items-center gap-4">
          <div className={`w-[70px] h-[70px] rounded-full shrink-0 flex items-center justify-center text-white shadow-[var(--shadow-clay-button)] animate-clay-breathe ${gradClass}`}>
            <Icon size={32} strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <p className="font-heading font-black text-ink mb-1.5 leading-tight" style={{ fontSize: `${fontSize + 3}px` }}>
              {tutorial.title}
            </p>
            <p className="text-muted leading-relaxed" style={{ fontSize: `${fontSize - 3}px` }}>
              {tutorial.description}
            </p>
            {TUTORIAL_IMAGES[tutorial.id] && (
              <div className="mt-5 rounded-2xl overflow-hidden bg-white/70 p-3 shadow-[var(--shadow-clay-pressed)] border border-ocean/10">
                {/* Fixed the image cropping! */}
                <img
                  src={TUTORIAL_IMAGES[tutorial.id]}
                  alt={tutorial.title}
                  className="w-full h-auto max-h-[300px] object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </ClayCard>

      <div className="flex gap-2.5 justify-center flex-wrap items-center">
        {tutorial.steps.map((_, i) => {
          const isDone = i < step; const isCurrent = i === step
          return (
            <button key={i} onClick={() => goTo(i)} aria-label={`Step ${i + 1}`} className={`h-9 rounded-full font-heading text-sm font-extrabold transition-all duration-300 ease-out outline-none ${isCurrent ? `w-12 text-white shadow-[var(--shadow-clay-button)] ${gradClass}` : isDone ? 'w-9 bg-gradient-to-br from-wave to-ocean text-white shadow-[var(--shadow-clay-button)]' : 'w-9 bg-[#EFEBF5] text-muted shadow-[var(--shadow-clay-pressed)] hover:bg-gray-200'}`}>
              {isDone ? <CheckCircle2 size={18} className="mx-auto" strokeWidth={3}/> : i + 1}
            </button>
          )
        })}
      </div>

      <ClayCard>
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className={`rounded-xl px-4 py-1.5 shadow-[var(--shadow-clay-button)] ${gradClass}`}>
            <span className="font-heading font-black text-white tracking-wide" style={{ fontSize: `${fontSize - 3}px` }}>Step {step + 1} of {total}</span>
          </div>
          <button onClick={() => isSpeaking ? stop() : speak(`Step ${step + 1}. ${current.title}. ${current.description}`, language) } className="flex items-center gap-1.5 bg-ocean/10 border-[1.5px] border-ocean/30 rounded-full px-4 py-1.5 text-ocean cursor-pointer font-heading font-bold hover:bg-ocean/20 transition-colors outline-none" style={{ fontSize: `${fontSize - 4}px` }}>
            {isSpeaking ? <><Square size={14} fill="currentColor"/> Stop</> : <><Volume2 size={16} strokeWidth={2.5}/> Read aloud</>}
          </button>
        </div>
        <p className="font-heading font-black text-ink mb-4 leading-tight" style={{ fontSize: `${fontSize + 4}px` }}>{current.title}</p>
        <div className="bg-[#EFEBF5] rounded-2xl p-5 md:p-6 shadow-[var(--shadow-clay-pressed)] mb-6">
          <p className="text-ink leading-relaxed font-medium" style={{ fontSize: `${fontSize + 1}px` }}>{current.description}</p>
        </div>
        <div className="flex gap-3">
          <ClayButton variant={step === 0 ? 'ghost' : 'secondary'} size="lg" onClick={prev} disabled={step === 0} className="flex-1">← Previous</ClayButton>
          {step < total - 1 ? (
            <ClayButton size="lg" onClick={next} className="flex-[2]">Next step →</ClayButton>
          ) : (
            <ClayButton size="lg" onClick={next} className="flex-[2] bg-gradient-to-br from-wave to-ocean text-white border-none">
              <CheckCircle2 size={20} strokeWidth={2.5} /> Finished!
            </ClayButton>
          )}
        </div>
      </ClayCard>
      <p className="text-center text-muted font-heading font-semibold" style={{ fontSize: `${fontSize - 5}px` }}>Tap the numbered circles above to jump to any step</p>
    </div>
  )
}

// ─── Tutorials grid ───────────────────────────────────────────────
export default function Tutorials() {
  const { fontSize, language } = useSettings()
  const [selected, setSelected]   = useState(null)
  const [colorIdx, setColorIdx]   = useState(0)
  const [hoveredIdx, setHoveredIdx] = useState(null)
  
  if (selected !== null) { return <TutorialViewer tutorial={tutorials[selected]} colorIdx={colorIdx} onBack={() => setSelected(null)} /> }
  
  return (
    <div className="flex flex-col gap-6">
      <ClayCard className="bg-gradient-to-br from-purple-100/50 to-white/70">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-wave to-ocean shrink-0 flex items-center justify-center text-white shadow-[var(--shadow-clay-button)] animate-clay-breathe">
            <BookOpen size={30} strokeWidth={2.5} />
          </div>
          <div>
            <p className="font-heading font-black text-ocean mb-1.5" style={{ fontSize: `${fontSize + 3}px` }}>{language === 'en' ? 'Step-by-Step Tutorials' : 'படிப்படியான பாடங்கள்'}</p>
            <p className="text-muted leading-relaxed" style={{ fontSize: `${fontSize - 1}px` }}>{language === 'en' ? 'Pick any topic and learn at your own pace.' : 'எந்த தலைப்பையும் தேர்ந்தெடுங்கள்.'}</p>
          </div>
        </div>
      </ClayCard>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
        {tutorials.map((t, i) => {
          const gradClass = CARD_GRADIENTS[i % CARD_GRADIENTS.length]
          const diff = DIFFICULTY_CONFIG[t.difficulty] || DIFFICULTY_CONFIG.Beginner
          const hovered = hoveredIdx === i
          const Icon = TUTORIAL_ICONS[t.id] || BookOpen
          return (
            <button key={t.id} onClick={() => { setSelected(i); setColorIdx(i) }} onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)} className={`relative overflow-hidden text-left flex flex-col gap-3.5 rounded-[32px] p-6 border-[1.5px] cursor-pointer transition-all duration-400 ease-out backdrop-blur-md ${hovered ? 'bg-white/95 border-ocean/30 -translate-y-2' : 'bg-white/70 border-ocean/10 translate-y-0'}`} style={{ boxShadow: hovered ? 'var(--shadow-clay-card-hover)' : 'var(--shadow-clay-card)' }}>
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white transition-all duration-300 ${gradClass} ${hovered ? 'scale-110 shadow-[var(--shadow-clay-button)] animate-clay-breathe' : 'scale-100 shadow-[var(--shadow-clay-card)]'}`}>
                <Icon size={26} strokeWidth={2.5} />
              </div>
              <p className="font-heading font-black text-ink leading-tight" style={{ fontSize: `${fontSize + 1}px` }}>{t.title}</p>
              <p className="text-muted leading-relaxed flex-1" style={{ fontSize: `${fontSize - 4}px` }}>{t.description}</p>
              <div className="flex justify-between items-center w-full mt-2">
                <span className={`rounded-full px-3.5 py-1.5 text-white font-heading font-extrabold shadow-[var(--shadow-clay-button)] ${diff.bg}`} style={{ fontSize: `${fontSize - 5}px` }}>{diff.label}</span>
                <span className="text-muted font-heading font-bold" style={{ fontSize: `${fontSize - 5}px` }}>{t.steps.length} steps →</span>
              </div>
            </button>
          )
        })}
      </div>
      <ClayCard className="bg-gradient-to-br from-wave/10 to-pink-500/5 text-center p-5">
        <div className="flex justify-center mb-2 text-ocean"><Star size={24} strokeWidth={2.5} className="fill-ocean" /></div>
        <p className="font-heading font-extrabold text-ocean mb-1.5" style={{ fontSize: `${fontSize}px` }}>{language === 'en' ? 'Take your time — there\'s no rush!' : 'அவசரப்படாதீர்கள்!'}</p>
        <p className="text-muted leading-relaxed" style={{ fontSize: `${fontSize - 3}px` }}>{language === 'en' ? 'Each tutorial is here whenever you need it.' : 'ஒவ்வொரு பாடத்தையும் எத்தனை முறை வேண்டுமானாலும் படிக்கலாம்.'}</p>
      </ClayCard>
    </div>
  )
}
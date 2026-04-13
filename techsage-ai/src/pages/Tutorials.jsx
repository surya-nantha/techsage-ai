import React, { useState } from 'react'
import ClayCard from '../components/Card.jsx'
import ClayButton from '../components/ClayButton.jsx'
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis.js'
import { useSettings } from '../App.jsx'
import { C, SHADOWS, RADIUS, FONT, GRAD } from '../tokens.js'
import tutorials from '../data/tutorials.json'

// Each tutorial gets its own illustration that matches the topic
const TUTORIAL_META = {
  email:     { image: '/images/illus-man-coffee-laptop.png',  imageAlt: 'A senior man sitting at a laptop with coffee, writing an email',                                       grad: GRAD.iconBlue   },
  videocall: { image: '/images/illus-couple-laughing.png',    imageAlt: 'An elderly couple laughing joyfully while having a video call on their tablets',                       grad: GRAD.iconPurple },
  wifi:      { image: '/images/illus-wifi-family.png',        imageAlt: 'A family sitting together under a large Wi-Fi signal icon, using the internet',                        grad: GRAD.iconSky    },
  photos:    { image: '/images/illus-couple-selfie.png',      imageAlt: 'An elderly couple taking a selfie together with a smartphone',                                          grad: GRAD.iconPink   },
  ai:        { image: '/images/illus-man-laptop.png',         imageAlt: 'A senior gentleman with glasses sitting at a laptop, taking notes and learning about AI assistants',   grad: GRAD.iconAmber  },
  passwords: { image: '/images/illus-couple-digital-world.png', imageAlt: 'An elderly couple surrounded by digital app icons, learning to navigate the digital world safely', grad: GRAD.iconGreen  },
  privacy:   { image: '/images/illus-couple-tablet.png',      imageAlt: 'A senior couple sitting together calmly reading information on a tablet',                              grad: GRAD.iconPurple },
}

const DIFFICULTY_CONFIG = {
  Beginner:     { bg: 'linear-gradient(135deg,#34D399,#059669)', label: '🌱 Beginner'     },
  Intermediate: { bg: 'linear-gradient(135deg,#FCD34D,#D97706)', label: '⚡ Intermediate' },
}

function SafeImg({ src, alt, style = {} }) {
  const [failed, setFailed] = useState(false)
  if (failed) return null
  return <img src={src} alt={alt} onError={() => setFailed(true)} style={{ display: 'block', ...style }} />
}

// ─── Step viewer ──────────────────────────────────────────────────
function TutorialViewer({ tutorial, meta, onBack }) {
  const { fontSize, language } = useSettings()
  const { speak, stop, isSpeaking } = useSpeechSynthesis()
  const [step, setStep] = useState(0)
  const current = tutorial.steps[step]
  const total   = tutorial.steps.length
  const grad    = meta?.grad || GRAD.primaryBtn

  const goTo = (i) => { stop(); setStep(i) }
  const next = () => { stop(); step < total - 1 ? setStep(step + 1) : onBack() }
  const prev = () => { stop(); setStep(Math.max(step - 1, 0)) }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <ClayButton variant="ghost" size="sm" onClick={() => { stop(); onBack() }}>
        ← Back to tutorials
      </ClayButton>

      {/* Tutorial identity card with its illustration */}
      <div style={{
        borderRadius: RADIUS.card,
        background: 'rgba(255,255,255,0.82)',
        backdropFilter: 'blur(16px)',
        boxShadow: SHADOWS.card,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'flex-end',
        minHeight: '150px',
      }}>
        <div style={{ flex: 1, padding: '24px 20px 24px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: grad, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', boxShadow: SHADOWS.button, animation: 'clay-breathe 5s ease-in-out infinite' }}>
              {tutorial.icon}
            </div>
            <div>
              <p style={{ fontFamily: FONT.heading, fontSize: `${fontSize + 2}px`, fontWeight: '900', color: C.foreground, lineHeight: 1.2 }}>{tutorial.title}</p>
              <p style={{ fontSize: `${fontSize - 3}px`, color: C.muted, lineHeight: 1.5, marginTop: '4px' }}>{tutorial.description}</p>
            </div>
          </div>
        </div>
        {/* Topic-matched illustration */}
        {meta?.image && (
          <div style={{ flexShrink: 0, alignSelf: 'flex-end', marginRight: '8px' }}>
            <SafeImg src={meta.image} alt={meta.imageAlt} style={{ width: '120px', height: '110px', objectFit: 'contain', objectPosition: 'bottom' }} />
          </div>
        )}
      </div>

      {/* Step dots */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
        {tutorial.steps.map((_, i) => {
          const isDone    = i < step
          const isCurrent = i === step
          return (
            <button key={i} onClick={() => goTo(i)} aria-label={`Step ${i + 1}`}
              style={{ width: isCurrent ? '44px' : '36px', height: '36px', borderRadius: RADIUS.full, background: isCurrent ? grad : isDone ? 'linear-gradient(135deg,#A7F3D0,#059669)' : '#EFEBF5', border: 'none', cursor: 'pointer', fontFamily: FONT.heading, fontSize: '14px', fontWeight: '800', color: isCurrent || isDone ? '#fff' : C.muted, boxShadow: isCurrent ? SHADOWS.button : SHADOWS.pressed, transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}>
              {isDone ? '✓' : i + 1}
            </button>
          )
        })}
      </div>

      {/* Step content */}
      <ClayCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
          <div style={{ background: grad, borderRadius: RADIUS.sm, padding: '6px 16px', boxShadow: SHADOWS.button }}>
            <span style={{ fontFamily: FONT.heading, fontSize: `${fontSize - 3}px`, fontWeight: '900', color: '#fff', letterSpacing: '0.5px' }}>
              Step {step + 1} of {total}
            </span>
          </div>
          <button onClick={() => isSpeaking ? stop() : speak(`Step ${step + 1}. ${current.title}. ${current.description}`, language)}
            style={{ background: `${C.accent}12`, border: `1.5px solid ${C.accent}30`, borderRadius: RADIUS.btn, padding: '6px 16px', fontSize: `${fontSize - 4}px`, color: C.accent, cursor: 'pointer', fontFamily: FONT.heading, fontWeight: '700' }}>
            {isSpeaking ? '⏹ Stop' : '🔊 Read aloud'}
          </button>
        </div>
        <p style={{ fontFamily: FONT.heading, fontSize: `${fontSize + 4}px`, fontWeight: '900', color: C.foreground, marginBottom: '16px', lineHeight: 1.2 }}>
          {current.title}
        </p>
        <div style={{ background: '#EFEBF5', borderRadius: RADIUS.md, padding: '20px 22px', boxShadow: SHADOWS.pressed, marginBottom: '24px' }}>
          <p style={{ fontSize: `${fontSize + 1}px`, color: C.foreground, lineHeight: 1.9, fontWeight: '500' }}>
            {current.description}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <ClayButton variant={step === 0 ? 'ghost' : 'secondary'} size="lg" onClick={prev} disabled={step === 0} style={{ flex: 1 }}>
            ← Previous
          </ClayButton>
          {step < total - 1
            ? <ClayButton size="lg" onClick={next} style={{ flex: 2 }}>Next step →</ClayButton>
            : <ClayButton variant="success" size="lg" onClick={next} style={{ flex: 2 }}>✅ Finished!</ClayButton>
          }
        </div>
      </ClayCard>

      <p style={{ textAlign: 'center', fontSize: `${fontSize - 5}px`, color: C.muted, fontFamily: FONT.heading, fontWeight: '600' }}>
        Tap the numbered circles above to jump to any step
      </p>
    </div>
  )
}

// ─── Tutorials grid ───────────────────────────────────────────────
export default function Tutorials() {
  const { fontSize, language } = useSettings()
  const [selected, setSelected] = useState(null)
  const [hoveredIdx, setHoveredIdx] = useState(null)

  if (selected !== null) {
    const t = tutorials[selected]
    const meta = TUTORIAL_META[t.id] || {}
    return <TutorialViewer tutorial={t} meta={meta} onBack={() => setSelected(null)} />
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* ══ HEADER — real seniors listening + couple illustration ═
          real-seniors-listening: women attentively learning
          illus-couple-tablet: seniors exploring tech together     */}
      <div style={{
        borderRadius: RADIUS.card,
        overflow: 'hidden',
        boxShadow: SHADOWS.deep,
        position: 'relative',
        minHeight: '160px',
        background: 'linear-gradient(135deg,#4c1d95 0%,#7C3AED 60%,#0ea5e9 100%)',
      }}>
        {/* Real photo — subtle background texture */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <SafeImg
            src="/images/real-seniors-listening.png"
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', opacity: 0.18 }}
          />
        </div>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'flex-end', padding: '24px 24px 0', minHeight: '160px' }}>
          <div style={{ flex: 1, paddingBottom: '24px' }}>
            <p style={{ fontFamily: FONT.heading, fontSize: `${fontSize + 3}px`, fontWeight: '900', color: '#fff', marginBottom: '8px' }}>
              {language === 'hi' ? '📚 चरण-दर-चरण ट्यूटोरियल' : language === 'ta' ? '📚 படிப்படியான பாடங்கள்' : '📚 Step-by-Step Tutorials'}
            </p>
            <p style={{ fontSize: `${fontSize - 2}px`, color: 'rgba(255,255,255,0.82)', lineHeight: 1.65, maxWidth: '300px' }}>
              {language === 'hi' ? 'कोई भी विषय चुनें और अपनी गति से सीखें।'
               : language === 'ta' ? 'எந்த தலைப்பையும் தேர்ந்தெடுங்கள். ஒவ்வொரு படியிலும் வழிமுறைகள் இருக்கும்.'
               : 'Pick any topic and learn at your own pace. Clear, simple instructions at every step.'}
            </p>
          </div>
          {/* Couple-tablet illustration at bottom right of header */}
          <div style={{ flexShrink: 0, alignSelf: 'flex-end' }}>
            <SafeImg
              src="/images/illus-couple-tablet.png"
              alt="An elderly couple sitting together looking at a tablet computer"
              style={{ width: '130px', height: '120px', objectFit: 'contain', objectPosition: 'bottom' }}
            />
          </div>
        </div>
      </div>

      {/* ══ TUTORIAL CARDS GRID — each card has its illustration ═ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '18px' }}>
        {tutorials.map((t, i) => {
          const meta    = TUTORIAL_META[t.id] || {}
          const diff    = DIFFICULTY_CONFIG[t.difficulty] || DIFFICULTY_CONFIG.Beginner
          const hovered = hoveredIdx === i

          return (
            <button key={t.id} onClick={() => setSelected(i)} onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)}
              style={{ background: hovered ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: RADIUS.card, overflow: 'hidden', border: `1.5px solid ${hovered ? C.accent + '35' : C.accent + '15'}`, cursor: 'pointer', textAlign: 'left', display: 'flex', flexDirection: 'column', boxShadow: hovered ? SHADOWS.cardHover : SHADOWS.card, transform: hovered ? 'translateY(-8px)' : 'translateY(0)', transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)' }}>

              {/* Illustration at top of card — full bleed */}
              {meta.image && (
                <div style={{ width: '100%', height: '130px', background: hovered ? `${C.accent}08` : '#F4F1FA', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: `1px solid ${C.accent}10` }}>
                  <SafeImg
                    src={meta.image}
                    alt={meta.imageAlt || t.title}
                    style={{ width: '100%', height: '130px', objectFit: 'contain', objectPosition: 'center bottom', transform: hovered ? 'scale(1.06)' : 'scale(1)', transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)' }}
                  />
                </div>
              )}

              {/* Card body */}
              <div style={{ padding: '18px 18px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Icon + title row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: meta.grad || GRAD.primaryBtn, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', boxShadow: hovered ? SHADOWS.button : SHADOWS.card, transition: 'all 0.3s' }}>
                    {t.icon}
                  </div>
                  <p style={{ fontFamily: FONT.heading, fontSize: `${fontSize}px`, fontWeight: '900', color: C.foreground, lineHeight: 1.2 }}>{t.title}</p>
                </div>
                <p style={{ fontSize: `${fontSize - 4}px`, color: C.muted, lineHeight: 1.6, flex: 1 }}>{t.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ background: diff.bg, borderRadius: RADIUS.full, padding: '5px 14px', fontSize: `${fontSize - 5}px`, fontFamily: FONT.heading, fontWeight: '800', color: '#fff', boxShadow: SHADOWS.button }}>
                    {diff.label}
                  </span>
                  <span style={{ fontSize: `${fontSize - 5}px`, color: C.muted, fontFamily: FONT.heading, fontWeight: '700' }}>
                    {t.steps.length} steps →
                  </span>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* ══ BOTTOM ENCOURAGEMENT — walking seniors ════════════
          illus-seniors-walking: seniors out and about, active life
          Reinforces the message: tech helps you live independently */}
      <div style={{
        borderRadius: RADIUS.card,
        background: 'linear-gradient(135deg,rgba(167,139,250,0.12) 0%,rgba(219,39,119,0.06) 100%)',
        backdropFilter: 'blur(16px)',
        boxShadow: SHADOWS.card,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'flex-end',
      }}>
        <div style={{ flex: 1, padding: '22px 22px 22px 24px' }}>
          <p style={{ fontFamily: FONT.heading, fontSize: `${fontSize}px`, fontWeight: '800', color: C.accent, marginBottom: '6px' }}>
            🌟 {language === 'hi' ? 'अपना समय लें — कोई जल्दी नहीं!' : language === 'ta' ? 'அவசரப்படாதீர்கள்!' : 'Take your time — there\'s no rush!'}
          </p>
          <p style={{ fontSize: `${fontSize - 3}px`, color: C.muted, lineHeight: 1.7 }}>
            {language === 'hi' ? 'हर ट्यूटोरियल जब भी चाहें उपलब्ध है। किसी भी कदम को जितनी बार चाहें दोहराएं।'
             : language === 'ta' ? 'ஒவ்வொரு பாடத்தையும் எத்தனை முறை வேண்டுமானாலும் படிக்கலாம்.'
             : 'Each tutorial is here whenever you need it. Go through any step as many times as you like.'}
          </p>
        </div>
        <div style={{ flexShrink: 0 }}>
          <SafeImg
            src="/images/illus-seniors-walking.png"
            alt="Two senior citizens walking confidently and a senior woman walking her dog — portraying active, independent living"
            style={{ width: '200px', height: '110px', objectFit: 'contain', objectPosition: 'bottom right' }}
          />
        </div>
      </div>
    </div>
  )
}

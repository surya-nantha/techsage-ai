import React, { useState } from 'react'
import Card from '../components/Card.jsx'
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis.js'
import { useSettings } from '../App.jsx'
import tutorials from '../data/tutorials.json'

const DIFFICULTY_COLORS = {
  Beginner: { bg: '#f0fdf4', color: '#15803d', border: '#86efac' },
  Intermediate: { bg: '#fffbeb', color: '#b45309', border: '#fcd34d' },
}

function TutorialViewer({ tutorial, onBack }) {
  const { fontSize, language } = useSettings()
  const { speak, stop, isSpeaking } = useSpeechSynthesis()
  const [step, setStep] = useState(0)
  const current = tutorial.steps[step]
  const total = tutorial.steps.length

  const handleNext = () => { stop(); setStep(s => Math.min(s + 1, total - 1)) }
  const handlePrev = () => { stop(); setStep(s => Math.max(s - 1, 0)) }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Back button */}
      <button
        onClick={() => { stop(); onBack() }}
        style={{
          background: 'transparent', border: '2px solid #d1d5db',
          borderRadius: '10px', padding: '10px 18px',
          fontSize: `${fontSize - 2}px`, color: '#374151',
          cursor: 'pointer', fontWeight: '600',
          alignSelf: 'flex-start',
          display: 'flex', alignItems: 'center', gap: '6px',
        }}
      >
        ← Back to tutorials
      </button>

      {/* Tutorial title */}
      <Card accent="#2E75B6">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ fontSize: '40px' }}>{tutorial.icon}</span>
          <div>
            <p style={{ fontSize: `${fontSize + 2}px`, fontWeight: '800', color: '#1F4E79' }}>{tutorial.title}</p>
            <p style={{ fontSize: `${fontSize - 3}px`, color: '#6b7280' }}>{tutorial.description}</p>
          </div>
        </div>
      </Card>

      {/* Step dots */}
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {tutorial.steps.map((_, i) => (
          <button
            key={i}
            onClick={() => { stop(); setStep(i) }}
            aria-label={`Go to step ${i + 1}`}
            style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: i === step ? '#1F4E79' : i < step ? '#93c5fd' : '#e5e7eb',
              border: 'none', cursor: 'pointer',
              fontSize: '13px', fontWeight: '700',
              color: i === step ? '#fff' : i < step ? '#1e40af' : '#9ca3af',
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Current step */}
      <Card>
        <p style={{ fontSize: `${fontSize - 3}px`, fontWeight: '700', color: '#9ca3af', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Step {step + 1} of {total}
        </p>
        <p style={{ fontSize: `${fontSize + 2}px`, fontWeight: '800', color: '#1F4E79', marginBottom: '16px' }}>
          {current.title}
        </p>
        <p style={{ fontSize: `${fontSize}px`, color: '#1f2937', lineHeight: 1.9, marginBottom: '20px' }}>
          {current.description}
        </p>

        {/* TTS */}
        <button
          onClick={() => isSpeaking ? stop() : speak(`Step ${step + 1}. ${current.title}. ${current.description}`, language)}
          style={{
            background: '#f0f7ff', border: '1.5px solid #bfdbfe',
            borderRadius: '10px', padding: '10px 18px',
            fontSize: `${fontSize - 3}px`, color: '#1e40af',
            cursor: 'pointer', fontWeight: '600',
          }}
        >
          {isSpeaking ? '⏹ Stop reading' : '🔊 Read this step aloud'}
        </button>
      </Card>

      {/* Navigation */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={handlePrev}
          disabled={step === 0}
          style={{
            flex: 1, padding: '18px',
            background: step === 0 ? '#f3f4f6' : '#f0f7ff',
            border: `2px solid ${step === 0 ? '#e5e7eb' : '#bfdbfe'}`,
            borderRadius: '14px', fontSize: `${fontSize}px`,
            color: step === 0 ? '#9ca3af' : '#1e40af',
            fontWeight: '700', cursor: step === 0 ? 'default' : 'pointer',
          }}
        >
          ← Previous
        </button>
        {step < total - 1 ? (
          <button
            onClick={handleNext}
            style={{
              flex: 1, padding: '18px',
              background: '#1F4E79', border: 'none',
              borderRadius: '14px', fontSize: `${fontSize}px`,
              color: '#fff', fontWeight: '700', cursor: 'pointer',
            }}
          >
            Next step →
          </button>
        ) : (
          <button
            onClick={() => { stop(); onBack() }}
            style={{
              flex: 1, padding: '18px',
              background: '#16a34a', border: 'none',
              borderRadius: '14px', fontSize: `${fontSize}px`,
              color: '#fff', fontWeight: '700', cursor: 'pointer',
            }}
          >
            ✅ Finished!
          </button>
        )}
      </div>
    </div>
  )
}

export default function Tutorials() {
  const { fontSize, language } = useSettings()
  const [selected, setSelected] = useState(null)

  if (selected) {
    return <TutorialViewer tutorial={selected} onBack={() => setSelected(null)} />
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Card accent="#7c3aed">
        <p style={{ fontSize: `${fontSize + 2}px`, fontWeight: '800', color: '#4c1d95', marginBottom: '6px' }}>
          📚 {language === 'en' ? 'Step-by-Step Tutorials' : 'படிப்படியான பாடங்கள்'}
        </p>
        <p style={{ fontSize: `${fontSize - 1}px`, color: '#374151', lineHeight: 1.7 }}>
          {language === 'en'
            ? 'Pick any topic below to learn at your own pace. Each tutorial walks you through every step with clear, simple instructions.'
            : 'கீழே உள்ள எந்த தலைப்பையும் தேர்ந்தெடுங்கள். ஒவ்வொரு படியிலும் தெளிவான வழிமுறைகள் இருக்கும்.'}
        </p>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '14px' }}>
        {tutorials.map(t => {
          const diff = DIFFICULTY_COLORS[t.difficulty] || DIFFICULTY_COLORS.Beginner
          return (
            <button
              key={t.id}
              onClick={() => setSelected(t)}
              style={{
                background: '#fff', border: '2px solid #e5e7eb',
                borderRadius: '16px', padding: '20px',
                cursor: 'pointer', textAlign: 'left',
                display: 'flex', flexDirection: 'column', gap: '10px',
                transition: 'all 0.15s', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#2E75B6'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <span style={{ fontSize: '36px' }}>{t.icon}</span>
              <p style={{ fontSize: `${fontSize}px`, fontWeight: '700', color: '#1f2937' }}>{t.title}</p>
              <p style={{ fontSize: `${fontSize - 4}px`, color: '#6b7280', lineHeight: 1.5 }}>{t.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  background: diff.bg, color: diff.color, border: `1px solid ${diff.border}`,
                  borderRadius: '6px', padding: '4px 10px', fontSize: `${fontSize - 5}px`, fontWeight: '700',
                }}>
                  {t.difficulty}
                </span>
                <span style={{ fontSize: `${fontSize - 5}px`, color: '#9ca3af' }}>
                  {t.steps.length} steps →
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

import React, { useState } from 'react'
import ClayCard from '../components/Card.jsx'
import ClayButton from '../components/ClayButton.jsx'
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis.js'
import { useSettings } from '../App.jsx'
import { C, SHADOWS, RADIUS, FONT, GRAD } from '../tokens.js'
import scenarios from '../data/quizScenarios.json'

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }

export default function ScamQuiz() {
  const { fontSize, language } = useSettings()
  const { speak, stop, isSpeaking } = useSpeechSynthesis()
  const [shuffled] = useState(() => shuffle(scenarios))
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const current = shuffled[index]
  const answered = selected !== null
  const isCorrect = selected === current?.correctAnswer
  const pct = Math.round((score / shuffled.length) * 100)

  const handleAnswer = (choice) => {
    if (answered) return
    setSelected(choice)
    if (choice === current.correctAnswer) {
      setScore(s => s + 1)
      speak('Correct! ' + current.explanation, language)
    } else {
      speak('Not quite. ' + current.explanation, language)
    }
  }

  const handleNext = () => {
    stop(); setSelected(null)
    if (index + 1 >= shuffled.length) setDone(true)
    else setIndex(i => i + 1)
  }

  const handleRestart = () => { stop(); setIndex(0); setSelected(null); setScore(0); setDone(false) }

  if (done) {
    const emoji = score >= shuffled.length * 0.8 ? '🏆' : score >= shuffled.length * 0.5 ? '👍' : '💪'
    const msg = score >= shuffled.length * 0.8
      ? 'Excellent! You are great at spotting scams!'
      : score >= shuffled.length * 0.5
      ? 'Good job! Keep practising to get even better.'
      : 'Keep practising — you will improve quickly!'

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <ClayCard style={{ background: 'linear-gradient(135deg, rgba(167,139,250,0.15) 0%, rgba(255,255,255,0.72) 60%)' }}>
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{
              width: '100px', height: '100px', borderRadius: '50%',
              background: GRAD.primaryBtn, margin: '0 auto 20px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '50px', boxShadow: SHADOWS.button,
              animation: 'clay-breathe 4s ease-in-out infinite',
            }}>{emoji}</div>
            <p style={{ fontFamily: FONT.heading, fontSize: `${fontSize + 8}px`, fontWeight: '900', color: C.foreground, marginBottom: '8px' }}>
              {score} / {shuffled.length}
            </p>
            <p style={{ fontFamily: FONT.heading, fontSize: `${fontSize + 2}px`, fontWeight: '800', color: C.accent, marginBottom: '8px' }}>
              {score >= shuffled.length * 0.8 ? 'Excellent work!' : score >= shuffled.length * 0.5 ? 'Well done!' : 'Keep going!'}
            </p>
            <p style={{ fontSize: `${fontSize - 1}px`, color: C.muted, marginBottom: '28px', lineHeight: 1.6 }}>{msg}</p>
            {/* Score bar */}
            <div style={{ background: '#EFEBF5', borderRadius: '999px', height: '20px', overflow: 'hidden', marginBottom: '28px', boxShadow: SHADOWS.pressed }}>
              <div style={{
                width: `${pct}%`, height: '100%', borderRadius: '999px',
                background: pct >= 70 ? GRAD.iconGreen : pct >= 50 ? `linear-gradient(135deg, #FCD34D, #D97706)` : `linear-gradient(135deg, #F87171, #DC2626)`,
                transition: 'width 1.2s cubic-bezier(0.34,1.56,0.64,1)',
                boxShadow: SHADOWS.button,
              }}/>
            </div>
            <ClayButton size="lg" onClick={handleRestart}>🔄 Play again</ClayButton>
          </div>
        </ClayCard>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Progress header */}
      <ClayCard padding="20px">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
          <div>
            <p style={{ fontFamily: FONT.heading, fontSize: `${fontSize + 2}px`, fontWeight: '900', color: C.foreground }}>🎯 Scam Practice Quiz</p>
            <p style={{ fontSize: `${fontSize - 3}px`, color: C.muted, fontFamily: FONT.heading, fontWeight: '600' }}>
              Question {index + 1} of {shuffled.length}
            </p>
          </div>
          <div style={{
            background: GRAD.primaryBtn, borderRadius: RADIUS.md,
            padding: '12px 20px', textAlign: 'center', boxShadow: SHADOWS.button,
          }}>
            <p style={{ fontSize: `${fontSize - 4}px`, color: 'rgba(255,255,255,0.85)', fontFamily: FONT.heading, fontWeight: '700' }}>Score</p>
            <p style={{ fontFamily: FONT.heading, fontSize: `${fontSize + 6}px`, fontWeight: '900', color: '#fff' }}>{score}</p>
          </div>
        </div>
        <div style={{ background: '#EFEBF5', borderRadius: '999px', height: '10px', overflow: 'hidden', boxShadow: SHADOWS.pressed }}>
          <div style={{
            width: `${(index / shuffled.length) * 100}%`, height: '100%',
            background: GRAD.primaryBtn, borderRadius: '999px',
            transition: 'width 0.5s cubic-bezier(0.34,1.56,0.64,1)',
          }}/>
        </div>
      </ClayCard>

      {/* Scenario */}
      <ClayCard>
        <p style={{ fontFamily: FONT.heading, fontSize: `${fontSize - 3}px`, fontWeight: '800', color: C.muted, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Read this message carefully:
        </p>
        <div style={{
          background: '#EFEBF5', borderRadius: RADIUS.md,
          padding: '20px', marginBottom: '20px',
          boxShadow: SHADOWS.pressed,
        }}>
          <p style={{ fontSize: `${fontSize - 1}px`, color: C.foreground, lineHeight: 1.85, fontStyle: 'italic' }}>
            "{current.scenario}"
          </p>
        </div>
        <button
          onClick={() => isSpeaking ? stop() : speak(current.scenario, language)}
          style={{
            background: `${C.accent}12`, border: `1.5px solid ${C.accent}30`,
            borderRadius: RADIUS.btn, padding: '8px 18px',
            fontSize: `${fontSize - 4}px`, color: C.accent,
            cursor: 'pointer', fontFamily: FONT.heading, fontWeight: '700',
            marginBottom: '20px',
          }}
        >
          {isSpeaking ? '⏹ Stop' : '🔊 Read aloud'}
        </button>

        <p style={{ fontFamily: FONT.heading, fontSize: `${fontSize}px`, fontWeight: '800', color: C.foreground, marginBottom: '16px' }}>
          Is this message a scam or is it safe?
        </p>
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          {['SCAM', 'SAFE'].map(choice => {
            const isChosen = selected === choice
            const isRight = answered && choice === current.correctAnswer
            const isWrong = answered && choice === selected && !isCorrect

            let bg = choice === 'SCAM'
              ? 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)'
              : 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)'
            let border = choice === 'SCAM' ? '#DC2626' : '#10B981'
            let color = choice === 'SCAM' ? '#991B1B' : '#065F46'
            let icon = choice === 'SCAM' ? '🚨' : '✅'

            if (answered && isWrong) { bg = '#E5E7EB'; border = '#9CA3AF'; color = '#6B7280' }

            return (
              <button
                key={choice}
                onClick={() => handleAnswer(choice)}
                disabled={answered}
                style={{
                  flex: 1, minWidth: '120px',
                  background: bg, border: `3px solid ${isRight ? border : answered && !isWrong ? border + '40' : border + '60'}`,
                  borderRadius: RADIUS.md, padding: '20px',
                  fontSize: `${fontSize + 2}px`, fontFamily: FONT.heading,
                  fontWeight: '900', color,
                  cursor: answered ? 'default' : 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                  boxShadow: answered ? SHADOWS.pressed : SHADOWS.card,
                  transform: answered ? 'scale(1)' : 'scale(1)',
                  transition: 'all 0.2s',
                }}
              >
                <span style={{ fontSize: '36px' }}>{icon}</span>
                {choice}
              </button>
            )
          })}
        </div>
      </ClayCard>

      {/* Feedback */}
      {answered && (
        <ClayCard style={{ background: isCorrect
          ? 'linear-gradient(135deg, rgba(209,250,229,0.6) 0%, rgba(255,255,255,0.72) 60%)'
          : 'linear-gradient(135deg, rgba(254,226,226,0.6) 0%, rgba(255,255,255,0.72) 60%)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '50%',
              background: isCorrect ? 'linear-gradient(135deg, #34D399, #059669)' : 'linear-gradient(135deg, #F87171, #DC2626)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '22px', flexShrink: 0, boxShadow: SHADOWS.button,
            }}>{isCorrect ? '✅' : '❌'}</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: FONT.heading, fontSize: `${fontSize}px`, fontWeight: '900',
                color: isCorrect ? '#065F46' : '#7F1D1D', marginBottom: '10px' }}>
                {isCorrect ? 'Correct! Well done.' : `Not quite — this was a ${current.correctAnswer}.`}
              </p>
              <p style={{ fontSize: `${fontSize - 2}px`, color: C.muted, lineHeight: 1.75, marginBottom: '14px' }}>
                {current.explanation}
              </p>
              {current.redFlags.length > 0 && (
                <div>
                  <p style={{ fontFamily: FONT.heading, fontSize: `${fontSize - 3}px`, fontWeight: '800', color: C.foreground, marginBottom: '8px' }}>Red flags:</p>
                  {current.redFlags.map((f, i) => (
                    <p key={i} style={{ fontSize: `${fontSize - 4}px`, color: '#DC2626', paddingLeft: '12px', marginBottom: '5px' }}>⚠️ {f}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div style={{ marginTop: '18px' }}>
            <ClayButton size="md" onClick={handleNext} fullWidth>
              {index + 1 >= shuffled.length ? 'See my results →' : 'Next question →'}
            </ClayButton>
          </div>
        </ClayCard>
      )}
    </div>
  )
}

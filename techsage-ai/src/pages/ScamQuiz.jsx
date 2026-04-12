import React, { useState, useMemo } from 'react'
import Card from '../components/Card.jsx'
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis.js'
import { useSettings } from '../App.jsx'
import scenarios from '../data/quizScenarios.json'

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function ScamQuiz() {
  const { fontSize, language } = useSettings()
  const { speak, stop, isSpeaking } = useSpeechSynthesis()

  const [shuffled] = useState(() => shuffle(scenarios))
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)   // 'SCAM' | 'SAFE'
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const current = shuffled[index]
  const isCorrect = selected === current?.correctAnswer
  const answered = selected !== null

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
    stop()
    setSelected(null)
    if (index + 1 >= shuffled.length) {
      setDone(true)
    } else {
      setIndex(i => i + 1)
    }
  }

  const handleRestart = () => {
    stop()
    setIndex(0)
    setSelected(null)
    setScore(0)
    setDone(false)
  }

  const pct = Math.round((score / shuffled.length) * 100)

  if (done) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Card accent={score >= shuffled.length * 0.7 ? '#16a34a' : '#d97706'}>
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>
              {score >= shuffled.length * 0.8 ? '🏆' : score >= shuffled.length * 0.5 ? '👍' : '💪'}
            </div>
            <p style={{ fontSize: `${fontSize + 6}px`, fontWeight: '800', color: '#1f2937', marginBottom: '8px' }}>
              You scored {score} out of {shuffled.length}
            </p>
            <p style={{ fontSize: `${fontSize}px`, color: '#6b7280', marginBottom: '24px' }}>
              {score >= shuffled.length * 0.8
                ? 'Excellent! You are great at spotting scams!'
                : score >= shuffled.length * 0.5
                ? 'Good job! Keep practising to get even better.'
                : 'Keep practising — you will improve quickly!'}
            </p>
            {/* Score bar */}
            <div style={{ background: '#e5e7eb', borderRadius: '999px', height: '20px', overflow: 'hidden', marginBottom: '24px' }}>
              <div style={{
                width: `${pct}%`,
                height: '100%',
                background: pct >= 70 ? '#16a34a' : pct >= 50 ? '#d97706' : '#dc2626',
                borderRadius: '999px',
                transition: 'width 1s ease',
              }} />
            </div>
            <button
              onClick={handleRestart}
              style={{
                background: '#1F4E79', color: '#fff', border: 'none',
                borderRadius: '14px', padding: '16px 40px',
                fontSize: `${fontSize}px`, fontWeight: '700', cursor: 'pointer',
              }}
            >
              Play again
            </button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Header */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <p style={{ fontSize: `${fontSize + 2}px`, fontWeight: '800', color: '#1F4E79', marginBottom: '4px' }}>
              🎯 Scam Practice Quiz
            </p>
            <p style={{ fontSize: `${fontSize - 3}px`, color: '#6b7280' }}>
              Question {index + 1} of {shuffled.length}
            </p>
          </div>
          <div style={{
            background: '#f0f7ff', borderRadius: '12px',
            padding: '10px 18px', textAlign: 'center',
          }}>
            <p style={{ fontSize: `${fontSize - 3}px`, color: '#6b7280' }}>Score</p>
            <p style={{ fontSize: `${fontSize + 4}px`, fontWeight: '800', color: '#1F4E79' }}>{score}</p>
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ marginTop: '12px', background: '#e5e7eb', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
          <div style={{
            width: `${((index) / shuffled.length) * 100}%`,
            height: '100%', background: '#2E75B6', borderRadius: '999px',
          }} />
        </div>
      </Card>

      {/* Scenario card */}
      <Card>
        <p style={{ fontSize: `${fontSize - 3}px`, fontWeight: '700', color: '#6b7280', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Read this message carefully:
        </p>
        <div style={{
          background: '#f8fafc',
          border: '2px solid #e2e8f0',
          borderRadius: '12px',
          padding: '18px',
          marginBottom: '20px',
        }}>
          <p style={{ fontSize: `${fontSize - 1}px`, color: '#1f2937', lineHeight: 1.8, fontStyle: 'italic' }}>
            "{current.scenario}"
          </p>
        </div>

        {/* Read aloud */}
        <button
          onClick={() => isSpeaking ? stop() : speak(current.scenario, language)}
          style={{
            background: 'transparent', border: '1.5px solid #d1d5db',
            borderRadius: '10px', padding: '8px 16px',
            fontSize: `${fontSize - 4}px`, color: '#6b7280',
            cursor: 'pointer', marginBottom: '20px',
          }}
        >
          {isSpeaking ? '⏹ Stop' : '🔊 Read aloud'}
        </button>

        {/* Question */}
        <p style={{ fontSize: `${fontSize}px`, fontWeight: '700', color: '#1f2937', marginBottom: '16px' }}>
          Is this message a scam or is it safe?
        </p>

        {/* Answer buttons */}
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          {['SCAM', 'SAFE'].map(choice => {
            let bg = choice === 'SCAM' ? '#fef2f2' : '#f0fdf4'
            let border = choice === 'SCAM' ? '#fecaca' : '#bbf7d0'
            let color = choice === 'SCAM' ? '#dc2626' : '#16a34a'
            let icon = choice === 'SCAM' ? '🚨' : '✅'

            if (answered) {
              if (choice === current.correctAnswer) {
                bg = choice === 'SCAM' ? '#fef2f2' : '#f0fdf4'
                border = choice === 'SCAM' ? '#dc2626' : '#16a34a'
              } else if (choice === selected) {
                bg = '#f3f4f6'; border = '#9ca3af'; color = '#9ca3af'
              }
            }

            return (
              <button
                key={choice}
                onClick={() => handleAnswer(choice)}
                disabled={answered}
                style={{
                  flex: 1, minWidth: '120px',
                  background: bg, border: `3px solid ${border}`,
                  borderRadius: '14px', padding: '18px',
                  fontSize: `${fontSize + 2}px`, fontWeight: '800', color,
                  cursor: answered ? 'default' : 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                  transition: 'all 0.2s',
                }}
              >
                <span style={{ fontSize: '32px' }}>{icon}</span>
                {choice}
              </button>
            )
          })}
        </div>
      </Card>

      {/* Feedback */}
      {answered && (
        <Card accent={isCorrect ? '#16a34a' : '#dc2626'}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <span style={{ fontSize: '28px' }}>{isCorrect ? '✅' : '❌'}</span>
            <div>
              <p style={{ fontSize: `${fontSize}px`, fontWeight: '800', color: isCorrect ? '#15803d' : '#b91c1c', marginBottom: '8px' }}>
                {isCorrect ? 'Correct! Well done.' : `Not quite — this was a ${current.correctAnswer}.`}
              </p>
              <p style={{ fontSize: `${fontSize - 2}px`, color: '#374151', lineHeight: 1.7, marginBottom: '12px' }}>
                {current.explanation}
              </p>
              {current.redFlags.length > 0 && (
                <div>
                  <p style={{ fontSize: `${fontSize - 3}px`, fontWeight: '700', color: '#374151', marginBottom: '6px' }}>Red flags:</p>
                  {current.redFlags.map((f, i) => (
                    <p key={i} style={{ fontSize: `${fontSize - 4}px`, color: '#dc2626', paddingLeft: '12px', marginBottom: '4px' }}>
                      ⚠️ {f}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={handleNext}
            style={{
              display: 'block', width: '100%', marginTop: '16px',
              background: '#1F4E79', color: '#fff', border: 'none',
              borderRadius: '12px', padding: '14px',
              fontSize: `${fontSize}px`, fontWeight: '700', cursor: 'pointer',
            }}
          >
            {index + 1 >= shuffled.length ? 'See my results →' : 'Next question →'}
          </button>
        </Card>
      )}
    </div>
  )
}

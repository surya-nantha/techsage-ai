import React, { useState } from 'react'
import { Trophy, ThumbsUp, Award, Target, Volume2, Square, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'
import ClayCard from '../components/Card.jsx'
import ClayButton from '../components/ClayButton.jsx'
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis.js'
import { useSettings } from '../App.jsx'
import scenarios from '../data/quizScenarios.json'

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }

function SafeImg({ src, alt, style = {}, className = "" }) {
  const [failed, setFailed] = useState(false)
  if (failed) return null
  return <img src={src} alt={alt} onError={() => setFailed(true)} style={{ display: 'block', ...style }} className={className} />
}

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
    const isExcellent = score >= shuffled.length * 0.8
    const isGood = score >= shuffled.length * 0.5
    const Icon = isExcellent ? Trophy : isGood ? ThumbsUp : Award
    const msg = isExcellent
      ? 'Excellent! You are great at spotting scams!'
      : isGood
      ? 'Good job! Keep practising to get even better.'
      : 'Keep practising — you will improve quickly!'

    return (
      <div className="flex flex-col gap-6">
        <ClayCard className="bg-gradient-to-br from-wave/10 to-white/70 text-center py-8">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-wave to-ocean mb-5 flex items-center justify-center text-white shadow-[var(--shadow-clay-button)] animate-clay-breathe">
              <Icon size={48} strokeWidth={2} />
            </div>
            <p className="font-heading font-black text-ink mb-2" style={{ fontSize: `${fontSize + 8}px` }}>
              {score} / {shuffled.length}
            </p>
            <p className="font-heading font-extrabold text-ocean mb-2" style={{ fontSize: `${fontSize + 2}px` }}>
              {isExcellent ? 'Excellent work!' : isGood ? 'Well done!' : 'Keep going!'}
            </p>
            <p className="text-muted mb-7 leading-relaxed" style={{ fontSize: `${fontSize - 1}px` }}>{msg}</p>
            
            {/* Score bar */}
            <div className="bg-[#EFEBF5] rounded-full h-5 w-full max-w-md overflow-hidden mb-7 shadow-[var(--shadow-clay-pressed)]">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ease-out shadow-[var(--shadow-clay-button)] ${pct >= 70 ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' : pct >= 50 ? 'bg-gradient-to-br from-amber-400 to-amber-600' : 'bg-gradient-to-br from-red-400 to-danger'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <ClayButton size="lg" onClick={handleRestart}>
              Play again ↻
            </ClayButton>
          </div>
        </ClayCard>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">

      {/* ══ HEADER — Translated to Tailwind ════════════════════ */}
      <div className="rounded-[32px] bg-white/80 backdrop-blur-md overflow-hidden" style={{ boxShadow: 'var(--shadow-clay-card)' }}>
        
        {/* Real photo of event speaker at top */}
        <div className="w-full h-20 overflow-hidden relative">
          <SafeImg
            src="/images/real-event-audience.png"
            alt="Seniors attending the digital safety workshop at Symbiosis College, Pune"
            className="w-full h-full object-cover object-[center_40%]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/90" />
          <div className="absolute bottom-2 left-4">
            <span className="font-heading text-[11px] font-bold text-ocean bg-white/90 px-2.5 py-1 rounded-full shadow-sm">
              📸 Symbiosis Digital Literacy Event — 70+ seniors attended
            </span>
          </div>
        </div>

        <div className="p-4 px-5 pb-5">
          <div className="flex justify-between items-center flex-wrap gap-2.5 mb-3.5">
            <div>
              <p className="font-heading font-black text-ink" style={{ fontSize: `${fontSize + 2}px` }}>🎯 Scam Practice Quiz</p>
              <p className="font-heading font-semibold text-muted" style={{ fontSize: `${fontSize - 3}px` }}>Question {index + 1} of {shuffled.length}</p>
            </div>
            <div className="bg-gradient-to-br from-wave to-ocean rounded-2xl px-4 py-2.5 text-center shadow-[var(--shadow-clay-button)]">
              <p className="font-heading font-bold text-white/85" style={{ fontSize: `${fontSize - 4}px` }}>Score</p>
              <p className="font-heading font-black text-white" style={{ fontSize: `${fontSize + 6}px` }}>{score}</p>
            </div>
          </div>
          <div className="bg-[#EFEBF5] rounded-full h-2.5 w-full overflow-hidden shadow-[var(--shadow-clay-pressed)]">
            <div 
              className="h-full bg-gradient-to-br from-wave to-ocean rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(index / shuffled.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* ══ SCENARIO CARD ════════════════════════════════════ */}
      <ClayCard>
        <p className="font-heading font-extrabold text-muted mb-3 uppercase tracking-wide" style={{ fontSize: `${fontSize - 3}px` }}>
          Read this message carefully:
        </p>
        <div className="bg-[#EFEBF5] rounded-2xl p-5 mb-5 shadow-[var(--shadow-clay-pressed)]">
          <p className="text-ink leading-relaxed italic font-medium" style={{ fontSize: `${fontSize - 1}px` }}>
            "{current.scenario}"
          </p>
        </div>
        
        <button
          onClick={() => isSpeaking ? stop() : speak(current.scenario, language)}
          className="flex items-center gap-2 bg-ocean/10 border-[1.5px] border-ocean/30 rounded-[20px] px-4 py-2 text-ocean cursor-pointer font-heading font-bold mb-5 hover:bg-ocean/20 transition-colors"
          style={{ fontSize: `${fontSize - 4}px` }}
        >
          {isSpeaking ? <><Square size={14} fill="currentColor"/> Stop</> : <><Volume2 size={16} strokeWidth={2.5}/> Read aloud</>}
        </button>

        <p className="font-heading font-extrabold text-ink mb-4" style={{ fontSize: `${fontSize}px` }}>
          Is this message a scam or is it safe?
        </p>
        
        <div className="flex gap-3 flex-wrap">
          {['SCAM', 'SAFE'].map(choice => {
            const isChosen = selected === choice
            const isRight = answered && choice === current.correctAnswer
            const isWrong = answered && choice === selected && !isCorrect

            let bg = choice === 'SCAM' ? 'bg-gradient-to-br from-red-100 to-red-200' : 'bg-gradient-to-br from-emerald-100 to-emerald-200'
            let border = choice === 'SCAM' ? 'border-danger' : 'border-emerald-500'
            let color = choice === 'SCAM' ? 'text-red-900' : 'text-emerald-900'
            let Icon = choice === 'SCAM' ? AlertTriangle : CheckCircle2

            if (answered && isWrong) { 
              bg = 'bg-gray-200'; border = 'border-gray-400'; color = 'text-gray-500' 
            }

            return (
              <button
                key={choice}
                onClick={() => handleAnswer(choice)}
                disabled={answered}
                className={`flex-1 min-w-[120px] border-[3px] rounded-2xl p-5 flex flex-col items-center gap-2 transition-all duration-200 outline-none
                  ${bg} ${color} ${isRight ? border : answered && !isWrong ? border + '/40' : border + '/60'}
                  ${answered ? 'cursor-default' : 'cursor-pointer hover:-translate-y-1 hover:shadow-[var(--shadow-clay-card-hover)]'}
                `}
                style={{
                  fontSize: `${fontSize + 2}px`, 
                  fontFamily: 'Nunito, sans-serif',
                  fontWeight: '900',
                  boxShadow: answered ? 'var(--shadow-clay-pressed)' : 'var(--shadow-clay-card)',
                }}
              >
                <Icon size={36} strokeWidth={2.5} />
                {choice}
              </button>
            )
          })}
        </div>
      </ClayCard>

      {/* ══ FEEDBACK ═════════════════════════════════════════ */}
      {answered && (
        <ClayCard className={isCorrect ? 'bg-gradient-to-br from-emerald-50 to-white/70' : 'bg-gradient-to-br from-red-50 to-white/70'}>
          <div className="flex items-start gap-4">
            <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white shrink-0 shadow-[var(--shadow-clay-button)] ${isCorrect ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' : 'bg-gradient-to-br from-red-400 to-danger'}`}>
              {isCorrect ? <CheckCircle2 size={24} strokeWidth={3} /> : <XCircle size={24} strokeWidth={3} />}
            </div>
            <div className="flex-1">
              <p className={`font-heading font-black mb-2.5 ${isCorrect ? 'text-emerald-900' : 'text-red-900'}`} style={{ fontSize: `${fontSize}px` }}>
                {isCorrect ? 'Correct! Well done.' : `Not quite — this was a ${current.correctAnswer}.`}
              </p>
              <p className="text-muted leading-relaxed mb-3.5" style={{ fontSize: `${fontSize - 2}px` }}>
                {current.explanation}
              </p>
              {current.redFlags.length > 0 && (
                <div>
                  <p className="font-heading font-extrabold text-ink mb-2" style={{ fontSize: `${fontSize - 3}px` }}>Warning signs:</p>
                  {current.redFlags.map((f, i) => (
                    <p key={i} className="text-danger pl-3 mb-1.5 flex items-center gap-2" style={{ fontSize: `${fontSize - 4}px` }}>
                      <AlertTriangle size={14} /> {f}
                    </p>
                  ))}
                </div>
              )}
            </div>
            {/* Tutor illustration beside feedback */}
            <div className="shrink-0 opacity-75 hidden sm:block">
              <SafeImg src="/images/illus-tutor-laptop.png" alt="A volunteer helping a senior understand technology" className="w-[72px] h-[80px] object-contain" />
            </div>
          </div>
          <div className="mt-5">
            <ClayButton size="md" onClick={handleNext} fullWidth>
              {index + 1 >= shuffled.length ? 'See my results →' : 'Next question →'}
            </ClayButton>
          </div>
        </ClayCard>
      )}
    </div>
  )
}
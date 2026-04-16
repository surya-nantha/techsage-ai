import React, { useEffect } from 'react'
import { ShieldCheck, AlertTriangle, ShieldAlert, Square, Volume2 } from 'lucide-react'
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis.js'
import { useSettings } from '../App.jsx'
import ClayButton from './ClayButton.jsx'

const VERDICT_CONFIG = {
  SAFE: {
    gradient: 'bg-gradient-to-br from-emerald-100 to-emerald-200',
    border: 'border-emerald-500',
    iconBg: 'bg-gradient-to-br from-emerald-400 to-emerald-600',
    Icon: ShieldCheck,
    title: 'This looks safe',
    titleColor: 'text-emerald-900',
  },
  SUSPICIOUS: {
    gradient: 'bg-gradient-to-br from-amber-100 to-amber-200',
    border: 'border-amber-500',
    iconBg: 'bg-gradient-to-br from-amber-400 to-amber-600',
    Icon: AlertTriangle,
    title: 'Be careful — looks suspicious',
    titleColor: 'text-amber-900',
  },
  SCAM: {
    gradient: 'bg-gradient-to-br from-red-100 to-red-200',
    border: 'border-danger',
    iconBg: 'bg-gradient-to-br from-red-400 to-danger',
    Icon: ShieldAlert,
    title: 'WARNING: This is likely a scam!',
    titleColor: 'text-red-900',
  },
}

export default function VerdictCard({ verdict, redFlags = [], recommendation }) {
  const { fontSize, language } = useSettings()
  const { speak, stop, isSpeaking } = useSpeechSynthesis()
  const cfg = VERDICT_CONFIG[verdict] || VERDICT_CONFIG.SUSPICIOUS

  useEffect(() => {
    const text = `${cfg.title}. ${redFlags.length > 0 ? 'Warning signs: ' + redFlags.join('. ') + '.' : ''} ${recommendation || ''}`
    speak(text, language)
    return () => stop()
  }, [verdict])

  return (
    <div role="alert" aria-live="assertive" className={`rounded-[32px] border-[3px] p-6 md:p-8 mt-2 transition-all duration-300 ${cfg.gradient} ${cfg.border}`} style={{ boxShadow: 'var(--shadow-clay-card)' }}>
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-16 h-16 rounded-full flex shrink-0 items-center justify-center text-white animate-clay-breathe ${cfg.iconBg}`} style={{ boxShadow: 'var(--shadow-clay-button)' }}>
          <cfg.Icon size={32} strokeWidth={2.5} />
        </div>
        <span className={`font-heading font-black leading-tight ${cfg.titleColor}`} style={{ fontSize: `${fontSize + 4}px` }}>
          {cfg.title}
        </span>
      </div>

      {redFlags.length > 0 && (
        <div className="bg-white/55 rounded-2xl p-4 md:p-5 mb-4 backdrop-blur-md">
          <p className={`font-heading font-extrabold mb-3 ${cfg.titleColor}`} style={{ fontSize: `${fontSize - 2}px` }}>
            Warning signs found:
          </p>
          <ul className="flex flex-col gap-2 pl-5 list-disc">
            {redFlags.map((flag, i) => (
              <li key={i} className={`leading-relaxed ${cfg.titleColor}`} style={{ fontSize: `${fontSize - 2}px` }}>{flag}</li>
            ))}
          </ul>
        </div>
      )}

      {recommendation && (
        <div className="bg-white/65 rounded-2xl p-4 md:p-5 mb-6 backdrop-blur-md">
          <p className={`font-heading font-extrabold mb-1.5 ${cfg.titleColor}`} style={{ fontSize: `${fontSize - 1}px` }}>What to do:</p>
          <p className={`leading-relaxed ${cfg.titleColor}`} style={{ fontSize: `${fontSize - 1}px` }}>{recommendation}</p>
        </div>
      )}

      <ClayButton
        variant={verdict === 'SAFE' ? 'success' : verdict === 'SCAM' ? 'danger' : 'secondary'}
        size="sm"
        onClick={() => isSpeaking ? stop() : speak(`${cfg.title}. ${recommendation}`, language)}
      >
        {isSpeaking ? <><Square size={16} fill="currentColor" /> Stop reading</> : <><Volume2 size={16} strokeWidth={2.5} /> Read aloud</>}
      </ClayButton>
    </div>
  )
}
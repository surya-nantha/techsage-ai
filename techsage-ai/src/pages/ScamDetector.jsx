import React, { useState, useEffect } from 'react'
import { ShieldAlert, Building2, Gift, UserCircle, Zap, KeyRound, Mic, Square, Search, Loader2, CheckCircle } from 'lucide-react'
import ClayCard from '../components/Card.jsx'
import ClayButton from '../components/ClayButton.jsx'
import ClayInput from '../components/ClayInput.jsx'
import VerdictCard from '../components/VerdictCard.jsx'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition.js'
import { useClaudeAPI } from '../hooks/useClaudeAPI.js'
import { useSettings } from '../App.jsx'

const EXAMPLES = [
  { Icon: Building2, text: 'URGENT: Your bank account has been suspended. Call 1-800-555-1234 immediately to unlock it.' },
  { Icon: Gift, text: 'Congratulations! You have won a $1000 Amazon gift card. Click here to claim: bit.ly/win-now' },
  { Icon: UserCircle, text: 'This is your grandson. I am in trouble and need $500 in gift cards. Please do not tell anyone.' },
  { Icon: Zap, text: 'Your electricity will be cut in 2 hours unless you pay Rs. 1500 via UPI now.' },
  { Icon: KeyRound, text: 'Your OTP is 847291. Do NOT share this with anyone. If you did not request this, call us.' },
]

const SAFETY_TIPS = [
  'Real banks and government agencies NEVER ask for OTPs, passwords, or gift cards',
  'If it feels urgent or scary, it is probably a scam — take your time',
  'Call the Cyber Crime helpline 1930 if you suspect fraud',
  'Never share your OTP, PIN, or Aadhaar number with anyone — ever',
]

function SafeImg({ src, alt, style = {}, className = "" }) {
  const [failed, setFailed] = useState(false)
  if (failed) return null
  return <img src={src} alt={alt} onError={() => setFailed(true)} style={{ display: 'block', ...style }} className={className} />
}

export default function ScamDetector() {
  const { fontSize, language } = useSettings()
  const [messageText, setMessageText] = useState('')
  const [result, setResult] = useState(null)
  const { isListening, start, stop, transcript } = useSpeechRecognition(language)
  const { sendMessage, loading, error } = useClaudeAPI()

  useEffect(() => { if (transcript) setMessageText(transcript) }, [transcript])

  const handleCheck = async () => {
    if (!messageText.trim()) return
    setResult(null)
    const data = await sendMessage(messageText, 'scam', language)
    if (data) setResult(data)
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Header card */}
      <ClayCard className="bg-gradient-to-br from-red-100/50 to-white/70">
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-400 to-danger flex items-center justify-center text-white shrink-0 shadow-[var(--shadow-clay-button)] animate-clay-breathe">
              <ShieldAlert size={32} strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-heading font-black text-red-900 mb-1.5" style={{ fontSize: `${fontSize + 3}px` }}>
                {language === 'en' ? 'Scam Detector' : language === 'ta' ? 'மோசடி கண்டறிவி' : 'स्कैम डिटेक्टर'}
              </p>
              <p className="text-muted leading-relaxed" style={{ fontSize: `${fontSize - 1}px` }}>
                {language === 'en'
                    ? 'Got a suspicious message? Paste or speak it below and I will check if it is safe.'
                    : language === 'ta'
                    ? 'சந்தேகமான செய்தி வந்ததா? கீழே ஒட்டவும் அல்லது பேசவும்.'
                    : 'कोई संदिग्ध संदेश मिला? नीचे पेस्ट करें या बोलें और मैं जाँच करूँगा।'}
              </p>
            </div>
          </div>
          {/* Confused-phone illustration integrated cleanly */}
          <div className="shrink-0 -mb-2 mt-2 sm:mt-0">
            <SafeImg
              src="/images/illus-confused-phone.png"
              alt="A senior citizen looking confused and concerned at a smartphone message"
              style={{ width: '110px', height: 'auto', objectFit: 'contain' }}
            />
          </div>
        </div>
      </ClayCard>

      {/* ══ INPUT CARD ════════════════════════════════════════ */}
      <ClayCard>
        <p className="font-heading font-extrabold text-ink mb-3.5" style={{ fontSize: `${fontSize - 1}px` }}>
          {language === 'en' ? 'Paste the suspicious message here:' : language === 'ta' ? 'சந்தேகமான செய்தியை ஒட்டவும்:' : 'संदिग्ध संदेश यहाँ पेस्ट करें:'}
        </p>
        <ClayInput
          value={messageText}
          onChange={e => setMessageText(e.target.value)}
          placeholder={language === 'hi' ? 'संदेश यहाँ पेस्ट करें...' : language === 'ta' ? 'இங்கே செய்தியை ஒட்டவும்...' : 'Paste the message text here, or tap the microphone to speak it...'}
          fontSize={fontSize - 1}
          multiline
          rows={4}
        />
        <div className="flex gap-3 mt-4 flex-wrap">
          <ClayButton
            variant={isListening ? 'danger' : 'ghost'}
            size="sm"
            onClick={isListening ? stop : start}
          >
            {isListening ? <><Square size={16} fill="currentColor"/> Stop speaking</> : <><Mic size={16}/> Speak the message</>}
          </ClayButton>
          <ClayButton
            size="md"
            onClick={handleCheck}
            disabled={!messageText.trim() || loading}
            className="flex-1 min-w-[160px]"
          >
            {loading ? <><Loader2 size={18} className="animate-spin"/> Checking...</> : <><Search size={18}/> Check this message</>}
          </ClayButton>
          {messageText && (
            <ClayButton variant="secondary" size="sm" onClick={() => { setMessageText(''); setResult(null) }}>
              Clear
            </ClayButton>
          )}
        </div>
      </ClayCard>

      {error && (
        <ClayCard accent="#F59E0B" padding="p-4 md:p-5">
          <p className="font-heading font-bold text-[#78350F]" style={{ fontSize: `${fontSize - 2}px` }}>⚠️ {error}</p>
        </ClayCard>
      )}

      {result && !loading && (
        <VerdictCard verdict={result.verdict || 'SUSPICIOUS'} redFlags={result.redFlags || []} recommendation={result.recommendation} />
      )}

      {/* ══ EXAMPLE MESSAGES ═════════════════════════════════ */}
      <ClayCard>
        <p className="font-heading font-extrabold text-ink mb-3.5" style={{ fontSize: `${fontSize - 1}px` }}>
          {language === 'en' ? '🧪 Try these example messages:' : language === 'ta' ? 'இந்த உதாரண செய்திகளை முயற்சிக்கவும்:' : '🧪 इन उदाहरण संदेशों को आज़माएं:'}
        </p>
        <div className="flex flex-col gap-2.5">
          {EXAMPLES.map((ex, i) => (
            <ExampleChip key={i} Icon={ex.Icon} text={ex.text} fontSize={fontSize}
              onClick={() => { setMessageText(ex.text); setResult(null) }} />
          ))}
        </div>
      </ClayCard>

      {/* ══ SAFETY TIPS ═════════════════════════════════════ */}
      <ClayCard className="bg-gradient-to-br from-emerald-50 to-white/70">
        <div className="flex flex-col sm:flex-row justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3.5">
              <ShieldAlert size={20} className="text-emerald-700" />
              <p className="font-heading font-extrabold text-emerald-800" style={{ fontSize: `${fontSize - 1}px` }}>
                {language === 'en' ? 'Golden rules for staying safe:' : language === 'ta' ? 'பாதுகாப்பிற்கான பொன் விதிகள்:' : 'सुरक्षित रहने के सुनहरे नियम:'}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {SAFETY_TIPS.map((tip, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm mt-0.5">
                    <CheckCircle size={14} strokeWidth={3} />
                  </div>
                  <p className="text-emerald-900 leading-relaxed font-medium" style={{ fontSize: `${fontSize - 3}px` }}>{tip}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Young-helping-senior illustration integrated into Tailwind flexbox */}
          <div className="shrink-0 self-center sm:self-end">
            <SafeImg
              src="/images/illus-young-helping.png"
              alt="A young person standing beside a senior citizen, guiding them at a laptop"
              style={{ width: '100px', height: 'auto', objectFit: 'contain' }}
            />
          </div>
        </div>
      </ClayCard>
    </div>
  )
}

function ExampleChip({ Icon, text, fontSize, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        flex items-start gap-3 w-full rounded-2xl p-3.5 text-left cursor-pointer transition-all duration-200 ease-out
        ${hovered ? 'bg-white/90 border-ocean/40 border-[1.5px]' : 'bg-[#EFEBF5] border-transparent border-[1.5px]'}
      `}
      style={{
        boxShadow: hovered ? 'var(--shadow-clay-card)' : 'var(--shadow-clay-pressed)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >
      <div className="shrink-0 text-muted mt-0.5"><Icon size={20} strokeWidth={2.5} /></div>
      <span className="text-muted leading-relaxed italic" style={{ fontSize: `${fontSize - 4}px` }}>"{text}"</span>
    </button>
  )
}
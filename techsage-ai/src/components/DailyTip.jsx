import React, { useState } from 'react'
import { Lightbulb, Shield, Smartphone, CreditCard, Lock, Mail, EyeOff, Globe, Users, HeartPulse, Car, ShoppingCart, X } from 'lucide-react'
import tips from '../data/dailyTips.json'

function getTodaysTip() {
  const day = Math.floor(Date.now() / 86400000)
  return tips[day % tips.length]
}

const CAT_ICONS = {
  'Safety': Shield,
  'WhatsApp': Smartphone,
  'UPI Safety': CreditCard,
  'Passwords': Lock,
  'Email': Mail,
  'Privacy': EyeOff,
  'Internet': Globe,
  'Phone Safety': Smartphone,
  'Banking': CreditCard,
  'Social': Users,
  'Health Tech': HeartPulse,
  'Daily Life': Car,
  'Shopping': ShoppingCart,
}

// Map categories to distinct gradients. NO MORE GREEN!
const CAT_GRADS = {
  'Safety':     'linear-gradient(135deg,#F87171,#DC2626)', // Red for danger
  'WhatsApp':   'linear-gradient(135deg,#38BDF8,#0284C7)', // Deep sky blue (matches blue theme)
  'UPI Safety': 'linear-gradient(135deg,#FCD34D,#D97706)', // Amber/Orange for awareness
  'Passwords':  'linear-gradient(135deg,#A78BFA,#7C3AED)', // Purple
  'Email':      'linear-gradient(135deg,#60A5FA,#2563EB)', // Standard blue
  'Privacy':    'linear-gradient(135deg,#F472B6,#DB2777)', // Pink/Magenta
  'Internet':   'linear-gradient(135deg,#38BDF8,#0284C7)', // Sky blue
  'Phone Safety':'linear-gradient(135deg,#FCD34D,#D97706)', // Amber
  'Banking':    'linear-gradient(135deg,#2563EB,#1E40AF)', // Official "Ocean" Blue
  'Social':     'linear-gradient(135deg,#60A5FA,#2563EB)', // Standard blue
  'Health Tech':'linear-gradient(135deg,#A78BFA,#7C3AED)', // Purple (calm)
  'Daily Life': 'linear-gradient(135deg,#60A5FA,#2563EB)', // Blue
  'Shopping':   'linear-gradient(135deg,#F472B6,#DB2777)', // Pink
}

export default function DailyTip({ fontSize = 18, onRead }) {
  const [isOpen, setIsOpen] = useState(false)
  const tip = getTodaysTip()
  const grad = CAT_GRADS[tip.category] || 'linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%)'
  const Icon = CAT_ICONS[tip.category] || Lightbulb

  const handleOpen = () => {
    setIsOpen(true)
    onRead?.()
  }

  return (
    <>
      {/* ── Floating Bubble (FAB) ────────────────────────────── */}
      <button
        onClick={handleOpen}
        className="fixed bottom-8 right-8 z-40 flex items-center justify-center w-16 h-16 rounded-full text-white cursor-pointer hover:-translate-y-1 transition-all duration-300 ease-out group outline-none"
        style={{
          background: grad,
          boxShadow: 'var(--shadow-clay-button)'
        }}
        aria-label="Tip of the day"
      >
        <Icon size={28} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
        
        {/* Little pulsing notification dot */}
        <span className="absolute top-0 right-0 w-4 h-4 bg-danger rounded-full border-2 border-white animate-pulse" />
      </button>

      {/* ── Pop-up Modal Card ────────────────────────────────── */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-in fade-in duration-200">
          
          <div className="relative w-full max-w-md rounded-[32px] overflow-hidden border-[1.5px] border-amber/40 animate-in zoom-in-95 duration-200"
               style={{
                 background: 'linear-gradient(135deg, rgba(254,243,199,0.95) 0%, rgba(255,255,255,1) 60%)',
                 boxShadow: 'var(--shadow-clay-deep)'
               }}>

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/50 text-muted hover:bg-white/80 hover:text-ink transition-colors z-10 outline-none"
            >
              <X size={24} strokeWidth={2.5} />
            </button>

            <div className="p-6 md:p-8 pt-10">
              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full shrink-0 flex items-center justify-center text-white"
                     style={{ background: grad, boxShadow: 'var(--shadow-clay-button)' }}>
                  <Icon size={28} strokeWidth={2.5} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="rounded-full px-3 py-1 text-[11px] font-heading font-extrabold text-white shadow-sm"
                          style={{ background: grad }}>
                      {tip.category}
                    </span>
                    <span className="font-heading text-[11px] font-bold text-amber tracking-wide uppercase flex items-center gap-1">
                      <Lightbulb size={12} strokeWidth={3} /> Tip of the day
                    </span>
                  </div>
                  <p className="font-heading font-black text-[#78350F] leading-tight pr-4" style={{ fontSize: `${fontSize + 2}px` }}>
                    {tip.title}
                  </p>
                </div>
              </div>

              {/* Body */}
              <div className="bg-white/60 rounded-2xl p-5" style={{ boxShadow: 'inset 4px 4px 8px rgba(217,119,6,0.05)' }}>
                <p className="text-[#78350F] leading-relaxed font-medium" style={{ fontSize: `${fontSize}px` }}>
                  {tip.tip}
                </p>
              </div>

              {/* Source */}
              {tip.source && (
                <p className="text-muted mt-4 font-heading font-bold text-center" style={{ fontSize: `${fontSize - 4}px` }}>
                  Source: {tip.source}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
import React from 'react'

// Fixed animated background blobs — renders once, stays behind everything via z-index 0
export default function ClayBlobs() {
  return (
    <div className="clay-blobs">
      {/* Top-left violet */}
      <div
        className="clay-blob clay-float"
        style={{
          width: '55vw', height: '55vw',
          top: '-10%', left: '-12%',
          background: 'rgba(139,92,246,0.10)',
        }}
      />
      {/* Top-right pink */}
      <div
        className="clay-blob clay-float-delayed"
        style={{
          width: '45vw', height: '45vw',
          top: '5%', right: '-10%',
          background: 'rgba(219,39,119,0.08)',
        }}
      />
      {/* Bottom-left sky */}
      <div
        className="clay-blob clay-float-slow"
        style={{
          width: '40vw', height: '40vw',
          bottom: '-8%', left: '10%',
          background: 'rgba(14,165,233,0.07)',
        }}
      />
      {/* Centre emerald accent */}
      <div
        className="clay-blob clay-float-delayed"
        style={{
          width: '30vw', height: '30vw',
          top: '40%', right: '20%',
          background: 'rgba(16,185,129,0.06)',
        }}
      />
    </div>
  )
}

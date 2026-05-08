'use client'
// components/ui/XpToast.tsx
// Usage: showXpToast({ gained: 30, leveledUp: true, newLevel: 'Captain', levelIcon: '🎖️' })

import { useEffect, useState } from 'react'

interface XpToastProps {
  gained: number
  leveledUp?: boolean
  newLevel?: string
  levelIcon?: string
  onDone?: () => void
}

export function XpToast({ gained, leveledUp, newLevel, levelIcon, onDone }: XpToastProps) {
  const [visible, setVisible] = useState(false)
  const [phase, setPhase] = useState<'xp' | 'levelup' | 'done'>('xp')

  useEffect(() => {
    // Animate in
    setTimeout(() => setVisible(true), 50)

    if (leveledUp && newLevel) {
      // Show XP first, then level up
      setTimeout(() => setPhase('levelup'), 1500)
      setTimeout(() => { setVisible(false); setTimeout(() => onDone?.(), 400) }, 4000)
    } else {
      setTimeout(() => { setVisible(false); setTimeout(() => onDone?.(), 400) }, 2500)
    }
  }, [])

  if (phase === 'done') return null

  return (
    <div style={{
      position: 'fixed', top: 80, right: 24, zIndex: 9999,
      transform: visible ? 'translateX(0) scale(1)' : 'translateX(120%) scale(0.9)',
      opacity: visible ? 1 : 0,
      transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
    }}>
      {phase === 'xp' && (
        <div style={{
          background: '#fff',
          border: '1px solid #E5E7EB',
          borderRadius: 16,
          padding: '14px 20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          minWidth: 200,
        }}>
          <div style={{
            width: 42, height: 42, borderRadius: 10,
            background: '#ECFDF5', border: '2px solid #A7F3D0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, flexShrink: 0,
            animation: 'bounce 0.5s ease',
          }}>
            ⚡
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#10B981', lineHeight: 1, fontFamily: 'system-ui' }}>
              +{gained} XP
            </div>
            <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>
              {gained >= 50 ? 'Отличный результат!' : gained >= 30 ? 'Хорошая работа!' : 'Продолжай учиться!'}
            </div>
          </div>
        </div>
      )}

      {phase === 'levelup' && leveledUp && (
        <div style={{
          background: 'linear-gradient(135deg, #F5F3FF, #EFF6FF)',
          border: '2px solid #A78BFA',
          borderRadius: 20,
          padding: '20px 24px',
          boxShadow: '0 12px 40px rgba(139,92,246,0.2)',
          textAlign: 'center',
          minWidth: 220,
        }}>
          <div style={{ fontSize: 40, marginBottom: 8, animation: 'pop 0.5s ease' }}>
            {levelIcon ?? '🎉'}
          </div>
          <div style={{ fontSize: 12, color: '#7C3AED', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
            Новый уровень!
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#4C1D95', fontFamily: 'system-ui' }}>
            {newLevel}
          </div>
          <div style={{ fontSize: 12, color: '#8B5CF6', marginTop: 4 }}>
            🎊 Поздравляем!
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce { 0%,100%{transform:scale(1)} 50%{transform:scale(1.2)} }
        @keyframes pop { 0%{transform:scale(0.5) rotate(-10deg);opacity:0} 70%{transform:scale(1.15) rotate(5deg)} 100%{transform:scale(1) rotate(0)} }
      `}</style>
    </div>
  )
}

// ── Hook for easy use ─────────────────────────────────────────────────────────
export function useXpToast() {
  const [toast, setToast] = useState<XpToastProps | null>(null)

  const showXpToast = (props: XpToastProps) => setToast(props)
  const hideXpToast = () => setToast(null)

  const ToastComponent = toast ? (
    <XpToast {...toast} onDone={hideXpToast} />
  ) : null

  return { showXpToast, ToastComponent }
}

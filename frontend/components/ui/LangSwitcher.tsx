'use client'

import { useState } from 'react'
import { useLang } from '@/lib/lang-context'
import type { Language } from '@/lib/lang-context'

const LANGUAGES = [
  { code: 'ru' as Language, label: 'Русский',  flag: '🇷🇺' },
  { code: 'kz' as Language, label: 'Қазақша', flag: '🇰🇿' },
]

export function LangSwitcher() {
  const { lang, setLang } = useLang()
  const [open, setOpen] = useState(false)
  const current = LANGUAGES.find(l => l.code === lang) ?? LANGUAGES[0]

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 10px', borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.15)',
          background: 'rgba(255,255,255,0.08)',
          cursor: 'pointer', color: 'white',
          fontSize: 13, fontWeight: 500,
        }}
      >
        <span style={{ fontSize: 16 }}>{current.flag}</span>
        <span>{current.label}</span>
        <span style={{ fontSize: 10, opacity: 0.6 }}>▾</span>
      </button>

      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setOpen(false)} />
          <div style={{
            position: 'absolute', top: 'calc(100% + 6px)', right: 0,
            background: '#fff', border: '1px solid #E8E6E1',
            borderRadius: 10, overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            zIndex: 50, minWidth: 140,
          }}>
            {LANGUAGES.map(l => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code); setOpen(false); }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 14px', border: 'none', background: 'none', cursor: 'pointer',
                  textAlign: 'left', fontSize: 14,
                  fontWeight: lang === l.code ? 600 : 400,
                  color: lang === l.code ? '#0A1628' : '#6B6967',
                  borderLeft: lang === l.code ? '3px solid #C5A84B' : '3px solid transparent',
                }}
              >
                <span style={{ fontSize: 18 }}>{l.flag}</span>
                <span>{l.label}</span>
                {lang === l.code && <span style={{ marginLeft: 'auto', color: '#C5A84B', fontSize: 12 }}>✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
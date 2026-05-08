'use client'
// components/ui/XpLevelCard.tsx
import { useEffect, useState } from 'react'
import api from '@/lib/api'

// ── Types ────────────────────────────────────────────────────────────────────
interface LevelData {
  name: string
  icon: string
  color: string
  description: string
}

interface XpInfo {
  totalXp: number
  level: {
    current: LevelData
    next: LevelData | null
    xpIntoLevel: number
    xpNeededForNext: number | null
    progressPercent: number
    isMaxLevel: boolean
  }
  recentGains: { amount: number; reason: string; createdAt: string }[]
}

// ── Constants (mirrors backend LEVELS) ───────────────────────────────────────
const LEVELS = [
  { name: 'Beginner',  minXp: 0,    icon: '🎓', color: '#6B7280', bg: '#F3F4F6', label: 'Начало пути' },
  { name: 'Student',   minXp: 100,  icon: '📚', color: '#3B82F6', bg: '#EFF6FF', label: 'Изучаю основы' },
  { name: 'Pilot',     minXp: 300,  icon: '✈️', color: '#8B5CF6', bg: '#F5F3FF', label: 'В кабине экипажа' },
  { name: 'Captain',   minXp: 700,  icon: '🎖️', color: '#F59E0B', bg: '#FFFBEB', label: 'Командир ВС' },
  { name: 'Expert',    minXp: 1500, icon: '⭐', color: '#10B981', bg: '#ECFDF5', label: 'ICAO Expert' },
]

// ── XP Level Card ────────────────────────────────────────────────────────────
export default function XpLevelCard() {
  const [xpData, setXpData] = useState<XpInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    api.get('/api/xp/me')
      .then((r: any) => setXpData(r.data))
      .catch(() => {
        // Mock data for demo
        setXpData({
          totalXp: 340,
          level: {
            current: { name: 'Pilot', icon: '✈️', color: '#8B5CF6', description: 'В кабине экипажа' },
            next: { name: 'Captain', icon: '🎖️', color: '#F59E0B', description: 'Командир ВС' },
            xpIntoLevel: 40,
            xpNeededForNext: 400,
            progressPercent: 10,
            isMaxLevel: false,
          },
          recentGains: [
            { amount: 30, reason: 'Квиз пройден (100%): Тест: Основы', createdAt: new Date().toISOString() },
            { amount: 15, reason: 'Аудирование: Фонетический алфавит ICAO', createdAt: new Date(Date.now() - 86400000).toISOString() },
            { amount: 10, reason: 'Урок прочитан: Введение в авиационный английский', createdAt: new Date(Date.now() - 172800000).toISOString() },
          ],
        })
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 16, padding: 24, minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 28, height: 28, border: '2px solid #e5e7eb', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  if (!xpData) return null

  const { level, totalXp, recentGains } = xpData
  const currentLevel = LEVELS.find(l => l.name === level.current.name) ?? LEVELS[0]
  const nextLevel = level.next ? LEVELS.find(l => l.name === level.next!.name) : null

  return (
    <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 16, overflow: 'hidden' }}>

      {/* Header strip */}
      <div style={{ background: `linear-gradient(135deg, ${currentLevel.color}18, ${currentLevel.color}08)`, borderBottom: `1px solid ${currentLevel.color}20`, padding: '20px 24px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          {/* Level badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: currentLevel.bg, border: `2px solid ${currentLevel.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
              {currentLevel.icon}
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#111827', fontFamily: 'system-ui' }}>{level.current.name}</div>
              <div style={{ fontSize: 12, color: '#6B7280' }}>{currentLevel.label}</div>
            </div>
          </div>
          {/* Total XP */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: currentLevel.color, fontFamily: 'system-ui', lineHeight: 1 }}>{totalXp}</div>
            <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>XP</div>
          </div>
        </div>

        {/* Progress bar */}
        {!level.isMaxLevel && nextLevel ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: '#6B7280' }}>
                До уровня <strong style={{ color: nextLevel.color }}>{nextLevel.icon} {level.next!.name}</strong>
              </span>
              <span style={{ fontSize: 12, fontWeight: 600, color: currentLevel.color }}>
                {level.xpIntoLevel} / {level.xpNeededForNext} XP
              </span>
            </div>
            <div style={{ height: 10, background: '#F3F4F6', borderRadius: 5, overflow: 'hidden', position: 'relative' }}>
              <div style={{
                height: '100%',
                width: `${level.progressPercent}%`,
                background: `linear-gradient(90deg, ${currentLevel.color}, ${nextLevel.color})`,
                borderRadius: 5,
                transition: 'width 1s ease',
                position: 'relative',
              }}>
                {/* Shimmer */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)', animation: 'shimmer 2s infinite' }} />
              </div>
            </div>
            <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>
              Ещё {(level.xpNeededForNext ?? 0) - level.xpIntoLevel} XP до {level.next!.name}
            </div>
          </div>
        ) : (
          <div style={{ padding: '8px 12px', background: '#ECFDF5', borderRadius: 8, border: '1px solid #A7F3D0' }}>
            <span style={{ fontSize: 13, color: '#065F46', fontWeight: 500 }}>⭐ Максимальный уровень достигнут!</span>
          </div>
        )}
      </div>

      {/* All levels roadmap */}
      <div style={{ padding: '16px 24px' }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 12 }}>Путь уровней</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, position: 'relative' }}>
          {LEVELS.map((lvl, i) => {
            const unlocked = totalXp >= lvl.minXp
            const isCurrent = lvl.name === level.current.name
            return (
              <div key={lvl.name} style={{ display: 'flex', alignItems: 'center', flex: i < LEVELS.length - 1 ? 1 : 'none' }}>
                {/* Level node */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, zIndex: 1 }}>
                  <div style={{
                    width: isCurrent ? 42 : 34,
                    height: isCurrent ? 42 : 34,
                    borderRadius: '50%',
                    background: unlocked ? lvl.bg : '#F9FAFB',
                    border: `${isCurrent ? 3 : 1.5}px solid ${unlocked ? lvl.color : '#E5E7EB'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: isCurrent ? 18 : 14,
                    transition: 'all 0.2s',
                    boxShadow: isCurrent ? `0 0 0 4px ${lvl.color}20` : 'none',
                    opacity: unlocked ? 1 : 0.45,
                  }}>
                    {unlocked ? lvl.icon : '🔒'}
                  </div>
                  <div style={{ fontSize: 10, fontWeight: isCurrent ? 700 : 400, color: unlocked ? lvl.color : '#9CA3AF', whiteSpace: 'nowrap' }}>
                    {lvl.name}
                  </div>
                  <div style={{ fontSize: 9, color: '#9CA3AF', whiteSpace: 'nowrap' }}>{lvl.minXp} XP</div>
                </div>
                {/* Connector line */}
                {i < LEVELS.length - 1 && (
                  <div style={{ flex: 1, height: 3, background: totalXp >= LEVELS[i + 1].minXp ? `linear-gradient(90deg, ${lvl.color}, ${LEVELS[i+1].color})` : '#E5E7EB', margin: '0 4px', marginTop: -20, borderRadius: 2 }} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent XP gains */}
      {recentGains.length > 0 && (
        <div style={{ padding: '0 24px 20px', borderTop: '1px solid #F3F4F6', paddingTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#9CA3AF' }}>Последние начисления</div>
            {recentGains.length > 3 && (
              <button onClick={() => setShowAll(!showAll)} style={{ fontSize: 12, color: '#6366F1', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                {showAll ? 'Скрыть' : 'Все'}
              </button>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(showAll ? recentGains : recentGains.slice(0, 3)).map((gain, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#F9FAFB', borderRadius: 8 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: '#374151', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{gain.reason}</div>
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>
                    {new Date(gain.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#10B981', marginLeft: 12, whiteSpace: 'nowrap' }}>+{gain.amount} XP</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
      `}</style>
    </div>
  )
}
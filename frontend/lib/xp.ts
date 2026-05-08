// lib/xp.ts
// Frontend mirror of backend XP config — keep in sync with xp.service.ts

export const LEVELS = [
  { name: 'Beginner',  minXp: 0,    icon: '🎓', color: '#6B7280', bg: '#F3F4F6', label: 'Начало пути' },
  { name: 'Student',   minXp: 100,  icon: '📚', color: '#3B82F6', bg: '#EFF6FF', label: 'Изучаю основы' },
  { name: 'Pilot',     minXp: 300,  icon: '✈️', color: '#8B5CF6', bg: '#F5F3FF', label: 'В кабине экипажа' },
  { name: 'Captain',   minXp: 700,  icon: '🎖️', color: '#F59E0B', bg: '#FFFBEB', label: 'Командир ВС' },
  { name: 'Expert',    minXp: 1500, icon: '⭐', color: '#10B981', bg: '#ECFDF5', label: 'ICAO Expert' },
]

export type LevelName = typeof LEVELS[number]['name']

export function getLevelInfo(totalXp: number) {
  let current = LEVELS[0]
  let next: typeof LEVELS[number] | null = LEVELS[1]

  for (let i = 0; i < LEVELS.length; i++) {
    if (totalXp >= LEVELS[i].minXp) {
      current = LEVELS[i]
      next = (LEVELS[i + 1] as typeof LEVELS[number]) ?? null
    }
  }

  const xpIntoLevel = totalXp - current.minXp
  const xpNeededForNext = next ? next.minXp - current.minXp : null
  const progressPercent = next
    ? Math.min(100, Math.round((xpIntoLevel / xpNeededForNext!) * 100))
    : 100

  return { current, next, totalXp, xpIntoLevel, xpNeededForNext, progressPercent, isMaxLevel: !next }
}

export function getXpForLesson(type: string, score?: number): number {
  switch (type) {
    case 'READING':    return 10
    case 'LISTENING':  return 15
    case 'VOCABULARY': return 12
    case 'QUIZ':
      if (score === 100) return 50
      if (score !== undefined && score >= 80) return 30
      return 0
    default: return 10
  }
}                
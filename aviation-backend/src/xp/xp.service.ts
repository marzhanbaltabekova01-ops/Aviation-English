// src/xp/xp.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// ── XP Config ────────────────────────────────────────────────────────────────
export const XP_REWARDS = {
  LESSON_READING:    10,
  LESSON_LISTENING:  15,
  LESSON_VOCABULARY: 12,
  LESSON_QUIZ_PASS:  30,   // 80%+
  LESSON_QUIZ_PERFECT: 50, // 100%
  DAILY_LOGIN:        5,
  STREAK_BONUS:      10,   // every 7 days
  COURSE_COMPLETE:  100,
} as const;

export interface Level {
  name: string;
  minXp: number;
  icon: string;
  color: string;
  description: string;
}

export const LEVELS: Level[] = [
  { name: 'Beginner', minXp: 0,    icon: '🎓', color: '#6B7280', description: 'Начало пути' },
  { name: 'Student',  minXp: 100,  icon: '📚', color: '#3B82F6', description: 'Изучаю основы' },
  { name: 'Pilot',    minXp: 300,  icon: '✈️', color: '#8B5CF6', description: 'В кабине экипажа' },
  { name: 'Captain',  minXp: 700,  icon: '🎖️', color: '#F59E0B', description: 'Командир воздушного судна' },
  { name: 'Expert',   minXp: 1500, icon: '⭐', color: '#10B981', description: 'ICAO Expert Level' },
];

export type LevelName = string;

// ── Helpers ──────────────────────────────────────────────────────────────────
export function getLevelInfo(totalXp: number) {
  let current: Level = LEVELS[0];
  let next: Level | null = LEVELS[1];

  for (let i = 0; i < LEVELS.length; i++) {
    if (totalXp >= LEVELS[i].minXp) {
      current = LEVELS[i];
      next = LEVELS[i + 1] ?? null;
    }
  }

  const xpIntoLevel = next
    ? totalXp - current.minXp
    : totalXp - current.minXp;

  const xpNeededForNext = next
    ? next.minXp - current.minXp
    : null;

  const progressPercent = next
    ? Math.min(100, Math.round((xpIntoLevel / xpNeededForNext!) * 100))
    : 100;

  return {
    current,
    next,
    totalXp,
    xpIntoLevel,
    xpNeededForNext,
    progressPercent,
    isMaxLevel: !next,
  };
}

// ── Service ──────────────────────────────────────────────────────────────────
@Injectable()
export class XpService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserXp(userId: string): Promise<{
    totalXp: number;
    level: ReturnType<typeof getLevelInfo>;
    recentGains: { amount: number; reason: string; createdAt: Date }[];
  }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { totalXp: true },
    });

    const totalXp = user?.totalXp ?? 0;
    const level = getLevelInfo(totalXp);

    const recentGains = await this.prisma.xpLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { amount: true, reason: true, createdAt: true },
    });

    return { totalXp, level, recentGains };
  }

  async awardXp(
    userId: string,
    amount: number,
    reason: string,
  ): Promise<{ totalXp: number; gained: number; level: ReturnType<typeof getLevelInfo>; leveledUp: boolean; newLevel?: string }> {
    const before = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { totalXp: true },
    });

    const previousXp = before?.totalXp ?? 0;
    const previousLevel = getLevelInfo(previousXp);

    // Update user XP + create log in transaction
    const [updated] = await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: { totalXp: { increment: amount } },
        select: { totalXp: true },
      }),
      this.prisma.xpLog.create({
        data: { userId, amount, reason },
      }),
    ]);

    const newTotalXp = updated.totalXp;
    const newLevel = getLevelInfo(newTotalXp);

    const leveledUp = newLevel.current.name !== previousLevel.current.name;

    return {
      totalXp: newTotalXp,
      gained: amount,
      level: newLevel,
      leveledUp,
      newLevel: leveledUp ? newLevel.current.name : undefined,
    };
  }

  async getLeaderboard(limit = 10): Promise<{
    rank: number;
    userId: string;
    firstName: string;
    lastName: string;
    totalXp: number;
    level: string;
    levelIcon: string;
  }[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { totalXp: 'desc' },
      take: limit,
      select: { id: true, firstName: true, lastName: true, totalXp: true },
    });

    return users.map((u, i) => {
      const levelInfo = getLevelInfo(u.totalXp);
      return {
        rank: i + 1,
        userId: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        totalXp: u.totalXp,
        level: levelInfo.current.name,
        levelIcon: levelInfo.current.icon,
      };
    });
  }
}

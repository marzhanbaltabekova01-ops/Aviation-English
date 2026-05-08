// src/lessons/lessons.service.ts
// ── UPDATED VERSION: awards XP on lesson completion ──────────────────────────
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { XpService, XP_REWARDS } from '../xp/xp.service';

@Injectable()
export class LessonsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly xpService: XpService,
  ) {}

  async findOne(id: string, userId?: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: { course: { select: { id: true, title: true } } },
    });
    if (!lesson) throw new NotFoundException('Урок не найден');

    let isCompleted = false;
    if (userId) {
      const progress = await this.prisma.lessonProgress.findUnique({
        where: { userId_lessonId: { userId, lessonId: id } },
      });
      isCompleted = progress?.completed ?? false;
    }

    const courseLessons = await this.prisma.lesson.findMany({
      where: { courseId: lesson.courseId },
      orderBy: { order: 'asc' },
      select: { id: true, title: true, type: true, order: true, isFree: true, duration: true },
    });

    const lessonsWithStatus = userId
      ? await Promise.all(
          courseLessons.map(async (l) => {
            const p = await this.prisma.lessonProgress.findUnique({
              where: { userId_lessonId: { userId, lessonId: l.id } },
            });
            return { ...l, isCompleted: p?.completed ?? false };
          }),
        )
      : courseLessons.map((l) => ({ ...l, isCompleted: false }));

    return {
      ...lesson,
      isCompleted,
      courseTitle: (lesson as any).course?.title || '',
      courseLessons: lessonsWithStatus,
    };
  }

  async complete(lessonId: string, userId: string, score?: number) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson) throw new NotFoundException('Урок не найден');

    // Save lesson progress
    await this.prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: { completed: true, score, completedAt: new Date() },
      create: { userId, lessonId, completed: true, score, completedAt: new Date() },
    });

    // Recalculate course progress
    const totalLessons = await this.prisma.lesson.count({ where: { courseId: lesson.courseId } });
    const completedCount = await this.prisma.lessonProgress.count({
      where: { userId, completed: true, lesson: { courseId: lesson.courseId } },
    });
    const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    await this.prisma.enrollment.updateMany({
      where: { userId, courseId: lesson.courseId },
      data: { progress, completedAt: progress === 100 ? new Date() : null },
    });

    // ── Award XP based on lesson type ────────────────────────────────────────
    let xpAmount = 0;
    let xpReason = '';

    switch (lesson.type) {
      case 'READING':
        xpAmount = XP_REWARDS.LESSON_READING;
        xpReason = `Урок прочитан: ${lesson.title}`;
        break;
      case 'LISTENING':
        xpAmount = XP_REWARDS.LESSON_LISTENING;
        xpReason = `Аудирование пройдено: ${lesson.title}`;
        break;
      case 'VOCABULARY':
        xpAmount = XP_REWARDS.LESSON_VOCABULARY;
        xpReason = `Словарный запас пройден: ${lesson.title}`;
        break;
      case 'QUIZ':
        if (score !== undefined) {
          if (score === 100) {
            xpAmount = XP_REWARDS.LESSON_QUIZ_PERFECT;
            xpReason = `Идеальный результат в квизе: ${lesson.title}`;
          } else if (score >= 80) {
            xpAmount = XP_REWARDS.LESSON_QUIZ_PASS;
            xpReason = `Квиз пройден (${score}%): ${lesson.title}`;
          } else {
            // Failed quiz — no XP
            return { xp: 0, gained: 0, message: 'Квиз не пройден. Наберите 80% для XP.' };
          }
        }
        break;
    }

    if (xpAmount === 0) {
      return { xp: 0, gained: 0, message: 'Прогресс сохранён.' };
    }

    const result = await this.xpService.awardXp(userId, xpAmount, xpReason);

    return {
      xp: result.totalXp,
      gained: result.gained,
      message: `+${result.gained} XP! ${result.leveledUp ? `🎉 Новый уровень: ${result.newLevel}!` : result.level.current.name}`,
      leveledUp: result.leveledUp,
      newLevel: result.newLevel,
      levelInfo: result.level,
    };
  }
}

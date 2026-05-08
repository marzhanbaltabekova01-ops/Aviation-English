// src/enrollments/enrollments.service.ts
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EnrollmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async enroll(userId: string, courseId: string) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Курс не найден');

    const existing = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (existing) throw new ConflictException('Вы уже записаны на этот курс');

    // Increment students count
    await this.prisma.course.update({
      where: { id: courseId },
      data: { studentsCount: { increment: 1 } },
    });

    const enrollment = await this.prisma.enrollment.create({
      data: { userId, courseId },
      include: {
        course: {
          select: {
            id: true, title: true, description: true, level: true,
            thumbnailUrl: true, price: true, currency: true,
            lessonsCount: true, duration: true, studentsCount: true,
          },
        },
      },
    });

    return enrollment;
  }

  async getMyEnrollments(userId: string) {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true, title: true, description: true, level: true,
            thumbnailUrl: true, price: true, currency: true,
            lessonsCount: true, duration: true, studentsCount: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return enrollments;
  }

  async getStats(userId: string) {
    // Lessons completed
    const lessonsCompleted = await this.prisma.lessonProgress.count({
      where: { userId, completed: true },
    });

    // Courses completed
    const coursesCompleted = await this.prisma.enrollment.count({
      where: { userId, completedAt: { not: null } },
    });

    // ICAO progress — average progress across all enrollments
    const enrollments = await this.prisma.enrollment.findMany({
      where: { userId },
      select: { progress: true },
    });
    const icaoProgress = enrollments.length > 0
      ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length)
      : 0;

    // Streak — count consecutive days with completed lessons
    const recentProgress = await this.prisma.lessonProgress.findMany({
      where: { userId, completed: true, completedAt: { not: null } },
      orderBy: { completedAt: 'desc' },
      select: { completedAt: true },
    });

    const streakDays = this.calculateStreak(recentProgress.map(p => p.completedAt!));

    return {
      streakDays,
      lessonsCompleted,
      icaoProgress,
      coursesCompleted,
    };
  }

  private calculateStreak(dates: Date[]): number {
    if (dates.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const uniqueDays = [...new Set(
      dates.map(d => {
        const day = new Date(d);
        day.setHours(0, 0, 0, 0);
        return day.getTime();
      })
    )].sort((a, b) => b - a);

    let streak = 0;
    let current = today.getTime();

    for (const day of uniqueDays) {
      if (day === current || day === current - 86400000) {
        streak++;
        current = day - 86400000;
      } else {
        break;
      }
    }

    return streak;
  }
}

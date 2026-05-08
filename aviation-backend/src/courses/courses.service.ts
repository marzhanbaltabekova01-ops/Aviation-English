// src/courses/courses.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(level?: string, search?: string) {
    const where: any = { isPublished: true };

    if (level) where.level = level;

    if (search) {
      where.OR = [
        { title:       { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const courses = await this.prisma.course.findMany({
      where,
      orderBy: { createdAt: 'asc' },
    });

    return courses;
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        lessons: {
          orderBy: { order: 'asc' },
          select: {
            id: true, title: true, type: true,
            duration: true, order: true, isFree: true,
          },
        },
      },
    });

    if (!course) throw new NotFoundException('Курс не найден');
    return course;
  }
}

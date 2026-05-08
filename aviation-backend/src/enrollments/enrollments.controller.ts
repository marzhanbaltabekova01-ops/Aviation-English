// src/enrollments/enrollments.controller.ts
import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EnrollmentsService } from './enrollments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('enrollments')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('api/enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Get('my')
  @ApiOperation({ summary: 'Мои записи на курсы' })
  @ApiResponse({ status: 200, description: 'Массив enrollments с данными курсов' })
  getMyEnrollments(@CurrentUser() user: any) {
    return this.enrollmentsService.getMyEnrollments(user.id);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Статистика дашборда' })
  @ApiResponse({ status: 200, description: '{ streakDays, lessonsCompleted, icaoProgress, coursesCompleted }' })
  getStats(@CurrentUser() user: any) {
    return this.enrollmentsService.getStats(user.id);
  }

  @Post(':courseId')
  @ApiOperation({ summary: 'Записаться на курс' })
  @ApiResponse({ status: 201, description: 'Запись создана' })
  @ApiResponse({ status: 404, description: 'Курс не найден' })
  @ApiResponse({ status: 409, description: 'Уже записаны' })
  enroll(@Param('courseId') courseId: string, @CurrentUser() user: any) {
    return this.enrollmentsService.enroll(user.id, courseId);
  }
}

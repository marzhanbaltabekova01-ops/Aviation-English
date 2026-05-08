// src/admin/admin.controller.ts
import {
  Controller, Get, Post, Put, Patch, Delete,
  Param, Query, Body, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminGuard } from './admin.guard';

@ApiTags('admin')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ── Stats ──────────────────────────────────────────────────────────────────
  @Get('stats')
  @ApiOperation({ summary: 'Общая статистика платформы' })
  getStats() { return this.adminService.getStats(); }

  // ── Users ──────────────────────────────────────────────────────────────────
  @Get('users')
  @ApiOperation({ summary: 'Список всех студентов с прогрессом' })
  @ApiQuery({ name: 'page',   required: false })
  @ApiQuery({ name: 'limit',  required: false })
  @ApiQuery({ name: 'search', required: false })
  getUsers(
    @Query('page')   page   = '1',
    @Query('limit')  limit  = '20',
    @Query('search') search?: string,
  ) { return this.adminService.getUsers(+page, +limit, search); }

  @Get('users/:id')
  @ApiOperation({ summary: 'Детальный прогресс студента' })
  getUserDetail(@Param('id') id: string) {
    return this.adminService.getUserDetail(id);
  }

  @Patch('users/:id/role')
  @ApiOperation({ summary: 'Изменить роль пользователя' })
  updateUserRole(@Param('id') id: string, @Body() body: { role: 'USER' | 'ADMIN' }) {
    return this.adminService.updateUserRole(id, body.role);
  }

  @Patch('users/:id/block')
  @ApiOperation({ summary: 'Заблокировать/разблокировать пользователя' })
  toggleUserBlock(@Param('id') id: string, @Body() body: { blocked: boolean }) {
    return this.adminService.toggleUserBlock(id, body.blocked);
  }

  @Delete('users/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить пользователя' })
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  // ── Courses ────────────────────────────────────────────────────────────────
  @Get('courses')
  @ApiOperation({ summary: 'Курсы со статистикой' })
  getCourses() { return this.adminService.getCourses(); }

  @Post('courses')
  @ApiOperation({ summary: 'Создать курс' })
  createCourse(@Body() body: any) {
    return this.adminService.createCourse(body);
  }

  @Put('courses/:id')
  @ApiOperation({ summary: 'Обновить курс' })
  updateCourse(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updateCourse(id, body);
  }

  @Delete('courses/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить курс' })
  deleteCourse(@Param('id') id: string) {
    return this.adminService.deleteCourse(id);
  }

  // ── Lessons ────────────────────────────────────────────────────────────────
  @Get('lessons')
  @ApiOperation({ summary: 'Уроки с процентом прохождения' })
  @ApiQuery({ name: 'courseId', required: false })
  getLessons(@Query('courseId') courseId?: string) {
    return this.adminService.getLessons(courseId);
  }

  @Post('lessons')
  @ApiOperation({ summary: 'Создать урок' })
  createLesson(@Body() body: any) {
    return this.adminService.createLesson(body);
  }

  @Put('lessons/:id')
  @ApiOperation({ summary: 'Обновить урок' })
  updateLesson(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updateLesson(id, body);
  }

  @Delete('lessons/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить урок' })
  deleteLesson(@Param('id') id: string) {
    return this.adminService.deleteLesson(id);
  }
}
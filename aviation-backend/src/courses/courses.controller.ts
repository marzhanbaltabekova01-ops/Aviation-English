// src/courses/courses.controller.ts
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CoursesService } from './courses.service';

@ApiTags('courses')
@Controller('api/courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @ApiOperation({ summary: 'Список всех курсов' })
  @ApiQuery({ name: 'level',  required: false, description: 'Фильтр по уровню ICAO' })
  @ApiQuery({ name: 'search', required: false, description: 'Поиск по названию и описанию' })
  @ApiResponse({ status: 200, description: 'Массив курсов' })
  findAll(
    @Query('level')  level?: string,
    @Query('search') search?: string,
  ) {
    return this.coursesService.findAll(level, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Курс по ID с уроками' })
  @ApiResponse({ status: 200, description: 'Курс с массивом уроков' })
  @ApiResponse({ status: 404, description: 'Курс не найден' })
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }
}

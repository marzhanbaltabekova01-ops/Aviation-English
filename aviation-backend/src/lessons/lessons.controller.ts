// src/lessons/lessons.controller.ts
import { Controller, Get, Param, Post, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LessonsService } from './lessons.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtService } from '@nestjs/jwt';

@ApiTags('lessons')
@Controller('api/lessons')
export class LessonsController {
  constructor(
    private readonly lessonsService: LessonsService,
    private readonly jwtService: JwtService,
  ) {}

  @Get(':id')
  @ApiOperation({ summary: 'Получить урок по ID' })
  @ApiResponse({ status: 200, description: 'Урок с контентом и списком уроков курса' })
  @ApiResponse({ status: 404, description: 'Урок не найден' })
  async findOne(@Param('id') id: string, @Request() req: any) {
    let userId: string | undefined;
    try {
      const auth = req.headers?.authorization as string | undefined;
      if (auth?.startsWith('Bearer ')) {
        const payload = this.jwtService.verify(auth.split(' ')[1]) as any;
        userId = payload?.sub;
      }
    } catch {}
    return this.lessonsService.findOne(id, userId);
  }

  @Post(':id/complete')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Завершить урок, получить XP' })
  @ApiResponse({ status: 201, description: '{ xp, message }' })
  complete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.lessonsService.complete(id, user.id);
  }
}

// src/xp/xp.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { XpService } from './xp.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('xp')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('api/xp')
export class XpController {
  constructor(private readonly xpService: XpService) {}

  @Get('me')
  @ApiOperation({ summary: 'XP, уровень и прогресс текущего пользователя' })
  @ApiResponse({
    status: 200,
    description: `{
      totalXp: number,
      level: {
        current: { name, icon, color, description },
        next: { name, icon, color, description } | null,
        xpIntoLevel: number,
        xpNeededForNext: number | null,
        progressPercent: number,
        isMaxLevel: boolean
      },
      recentGains: [{ amount, reason, createdAt }]
    }`,
  })
  getMyXp(@CurrentUser() user: any) {
    return this.xpService.getUserXp(user.id);
  }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Топ-10 пользователей по XP' })
  getLeaderboard() {
    return this.xpService.getLeaderboard(10);
  }
}

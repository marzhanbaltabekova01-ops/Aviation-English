// src/lessons/lessons.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LessonsController } from './lessons.controller';
import { LessonsService } from './lessons.service';
import { XpModule } from '../xp/xp.module';

@Module({
  imports: [
    XpModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (c: ConfigService) => ({
        secret: c.get('JWT_SECRET', 'fallback-secret-32-chars-minimum!'),
        signOptions: { expiresIn: c.get('JWT_EXPIRES_IN', '7d') },
      }),
    }),
  ],
  controllers: [LessonsController],
  providers: [LessonsService],
})
export class LessonsModule {}
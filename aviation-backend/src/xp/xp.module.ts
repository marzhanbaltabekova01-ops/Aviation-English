// src/xp/xp.module.ts
import { Module } from '@nestjs/common';
import { XpController } from './xp.controller';
import { XpService } from './xp.service';

@Module({
  controllers: [XpController],
  providers: [XpService],
  exports: [XpService], // exported so LessonsService can import it
})
export class XpModule {}

import { Module } from '@nestjs/common';
import { CheckerService } from './checker.service';
import { CheckerWeeklyStrategy } from './CheckStategy/checker.weekly.strategy';

@Module({
  providers: [CheckerService, CheckerWeeklyStrategy],
  exports: [CheckerService],
})
export class CheckerModule {}

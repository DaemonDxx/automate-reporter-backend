import { Module } from '@nestjs/common';
import { TemplaterService } from './templater.service';
import { TemplaterController } from './templater.controller';

@Module({
  providers: [TemplaterService],
  controllers: [TemplaterController]
})
export class TemplaterModule {}

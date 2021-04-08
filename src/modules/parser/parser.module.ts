import { Logger, Module } from '@nestjs/common';
import { ParserService } from './parser.service';

@Module({
  providers: [ParserService, Logger],
  exports: [ParserService],
})
export class ParserModule {}

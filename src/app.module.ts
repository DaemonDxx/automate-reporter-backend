import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FilesModule } from './files/files.module';
import { ParserModule } from './parser/parser.module';

@Module({
  imports: [FilesModule, ParserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

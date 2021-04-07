import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportModule } from './Report/report.module';
import { StorageModule } from './Storage/storage.module';
import { AuthModule } from './Auth/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { ParserModule } from './Parser/parser.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot({
      wildcard: true,
    }),
    ParserModule,
    MongooseModule.forRoot(
      'mongodb://' + (process.env.DB_HOST || '127.0.0.1') + ':27017',
    ),
    ReportModule,
    StorageModule,
    // TemperatureModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}

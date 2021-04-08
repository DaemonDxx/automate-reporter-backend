import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportModule } from './modules/report/report.module';
import { StorageModule } from './modules/storage/storage.module';
import { AuthModule } from './modules/auth/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { ParserModule } from './modules/parser/parser.module';
import { ValueModule } from './modules/value/value.module';

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
    ValueModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}

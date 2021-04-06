import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FilesModule } from './Files/files.module';
import { MongooseModule } from '@nestjs/mongoose';

import { ReportModule } from './Report/report.module';
import { TemplaterModule } from './Templater/templater.module';
import { StorageModule } from './Storage/storage.module';
import { TemperatureModule } from './Temperature/temperature.module';
import { UserModule } from './User/user.module';
import { AuthModule } from './Auth/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot({
      wildcard: true,
    }),
    FilesModule,
    MongooseModule.forRoot(
      'mongodb://' + (process.env.DB_HOST || '127.0.0.1') + ':27017',
    ),
    ReportModule,
    TemplaterModule,
    StorageModule,
    // TemperatureModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { TemperatureController } from './temperature.controller';
import { TemperatureService } from './temperature.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ForTemperatureValueSchema } from './Models/forTemperature.value';
import { StorageModule } from '../Storage/storage.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { schema: ForTemperatureValueSchema, name: 'TValue' },
    ]),
    StorageModule,
  ],
  controllers: [TemperatureController],
  providers: [TemperatureService],
})
export class TemperatureModule {}

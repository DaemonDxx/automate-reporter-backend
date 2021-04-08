import { Logger, Module } from '@nestjs/common';
import { TemperatureController } from './temperature.controller';
import { TemperatureService } from './temperature.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ForTemperatureValueSchema } from './Models/forTemperature.value';
import { StorageModule } from '../../storage/storage.module';
import { CoefficientSchema } from './Models/coefficient';
import { MathService } from './math.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { schema: ForTemperatureValueSchema, name: 'TValue' },
      { schema: CoefficientSchema, name: 'Coefficient' },
    ]),
    StorageModule,
  ],
  controllers: [TemperatureController],
  providers: [TemperatureService, MathService, Logger],
})
export class TemperatureModule {}

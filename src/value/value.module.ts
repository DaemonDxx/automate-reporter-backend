import { Logger, Module } from '@nestjs/common';
import { ValueService } from './value.service';
import { ValueController } from './value.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Value, ValueSchema } from './schemas/value.schema';
import {
  CoefficientSchema,
  CoefficientValue,
} from './schemas/coefficient.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Value.name,
        schema: ValueSchema,
        discriminators: [
          { name: CoefficientValue.Name, schema: CoefficientSchema },
        ],
      },
    ]),
  ],
  providers: [ValueService, Logger],
  controllers: [ValueController],
})
export class ValueModule {}

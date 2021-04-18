import { Module } from '@nestjs/common';
import { MathController } from './math.controller';
import { MathService } from './math.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Value, ValueSchema } from '../value/schemas/value.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Value.name, schema: ValueSchema }]),
  ],
  controllers: [MathController],
  providers: [MathService],
})
export class MathModule {}

import { Prop } from '@nestjs/mongoose';

export interface ICoefficient {
  department: string;
  tag: string;
  minTemp: number;
  maxTemp: number;
  value: number;
}

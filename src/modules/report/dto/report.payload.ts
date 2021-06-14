import { OffsetType } from '../../../typings/modules/math/offsetType';
import { Type } from 'class-transformer';
import { FormatOffset } from '../Entity/FormatOffset';
import { Offset } from '../../math/Entity/Offset';

export class ReportPayload {
  @Type(() => FormatOffset)
  formatOffset: FormatOffset[];

  @Type(() => Offset)
  offsets: OffsetType[];
}

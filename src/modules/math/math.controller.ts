import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { MathService } from './math.service';
import {
  Query$OffsetsByYear,
  Query$PersonalOffset,
} from '../../typings/modules/math/offset.personal';
import { Offset } from '../../typings/modules/math/offset';

@Controller('math')
export class MathController {
  constructor(private readonly mathService: MathService) {}

  @Get('/offset/personal')
  async solvePersonalOffset(
    @Query() query: Query$PersonalOffset,
  ): Promise<number> {
    const coefficientBefore = await this.mathService.findCoefficient(
      query.temperatureBefore,
      query.department,
    );
    const coefficientNow = await this.mathService.findCoefficient(
      query.temperatureNow,
      query.department,
    );
    const offset = this.mathService.solveOffset(
      {
        temperature: query.temperatureBefore,
        reception: query.reception,
        coefficient: coefficientBefore,
      },
      {
        temperature: query.temperatureNow,
        reception: query.reception,
        coefficient: coefficientNow,
      },
    );
    return offset;
  }

  @Get('/offset')
  async solveOffsetsByYear(@Query() query: Query$OffsetsByYear): Promise<Offset[]> {
    try {
      const offsets: Offset[] = await this.mathService.getOffsets(query);
      return offsets;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}

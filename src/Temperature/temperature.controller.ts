import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ParseFromFileDTO } from './DTO/ParseFromFile.dto';
import { ParsedStatistic, TemperatureService } from './temperature.service';
import { MathService } from './math.service';
import { CountResult } from './Math/interfaces/countResult.interface';

@Controller('Temperature')
export class TemperatureController {
  constructor(
    private readonly temperatureService: TemperatureService,
    private readonly mathService: MathService,
  ) {}

  @Post('/file')
  async parseValueFromFile(
    @Body() parseDTO: ParseFromFileDTO,
  ): Promise<ParsedStatistic> {
    return this.temperatureService.parseFromFile(parseDTO);
  }

  @Post('/coefficient/file')
  async parseCoefficientFromFile(
    @Body('filename') filename: string,
  ): Promise<string[]> {
    const result: Map<
      string,
      number
    > = await this.temperatureService.parseCoefficientFromFile(filename);
    const arr: string[] = [];
    for (const [key, value] of result.entries()) {
      arr.push(`${key}: ${value}`);
    }
    return arr;
  }

  @Get('/offset')
  async getTemperatureOffset(@Query() params): Promise<CountResult[]> {
    const year1 = parseInt(params.year1);
    const year2 = parseInt(params.year2);
    const result: CountResult[] = await this.mathService.countOffset(
      year1,
      year2,
    );
    return result;
  }

  @Get('/year')
  async getAccessYears(): Promise<number[]> {
    return this.temperatureService.getAccessYears();
  }
}

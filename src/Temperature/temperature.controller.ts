import { Body, Controller, Post } from '@nestjs/common';
import { ParseFromFileDTO } from './DTO/ParseFromFile.dto';
import { ParsedStatistic, TemperatureService } from './temperature.service';

@Controller('Temperature')
export class TemperatureController {
  constructor(private readonly temperatureService: TemperatureService) {}

  @Post('/file')
  async parseValueFromFile(
    @Body() parseDTO: ParseFromFileDTO,
  ): Promise<ParsedStatistic> {
    return this.temperatureService.parseFromFile(parseDTO);
  }

  @Post('/coefficient/file')
  async parseCoefficientFromFile(@Body('filename') filename: string): Promise<string[]> {
    const result: Map<string,number> = await this.temperatureService.parseCoefficientFromFile(filename);
    const arr: string[] = [];
    for (const [key, value] of result.entries()) {
      arr.push(`${key}: ${value}`);
    }
    return arr;
  }
}

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
}

import {
  Get,
  Inject,
  Logger,
  LoggerService,
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ParseFromFileDTO } from './DTO/ParseFromFile.dto';
import { SaveValuesStatistic, TemperatureService } from './temperature.service';
import { MathService } from './math.service';
import { CountResult } from './Math/interfaces/countResult.interface';
import { ForTemperatureValue } from './Models/forTemperature.value';
import { AuthGuard } from '@nestjs/passport';
import { LoggingInterceptor } from '../Utils/logging.interceptor';
import { CreateValueDTO } from './DTO/CreateValue.dto';
import { TValue } from './Models/TValue.interface';

@Controller('Temperature')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(LoggingInterceptor)
export class TemperatureController {
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    private readonly temperatureService: TemperatureService,
    private readonly mathService: MathService,
  ) {}

  @Post('/file')
  async parseValueFromFile(
    @Body() parseDTO: ParseFromFileDTO,
  ): Promise<SaveValuesStatistic> {
    try {
      return await this.temperatureService.parseFromFile(parseDTO);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
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

  @Get()
  async getValue(
    @Query('year') year: number,
    @Query('month') month: number,
  ): Promise<ForTemperatureValue[]> {
    const result = await this.temperatureService.getValue(year, month);
    return result;
  }

  @Post()
  async createValue(@Body() value: TValue): Promise<ForTemperatureValue> {
    const createdValue: ForTemperatureValue = await this.temperatureService.createValue(
      value,
      true,
    );
    return createdValue;
  }

  @Put()
  async updateValueForMonth(
    @Body() value: TValue,
  ): Promise<ForTemperatureValue> {
    const updatedValue: ForTemperatureValue = await this.temperatureService.updateValue(value);
    return updatedValue;
  }
}

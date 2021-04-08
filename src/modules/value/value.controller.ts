import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
  LoggerService,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ValueQuery } from '../../typings/modules/values/DTO/valueQuery';
import { SomeValueModel, ValueService } from './value.service';
import { CreateValueDto } from './dto/createValue.dto';
import { UpdateValueDto } from './dto/updateValue.dto';
import { User } from '../auth/schemas/user.schema';
import { AuthGuard } from '@nestjs/passport';
import { ReqUser } from '../../utils/decorators/user.decorator';

@Controller('value')
@UseGuards(AuthGuard('jwt'))
export class ValueController {
  constructor(
    private readonly valueService: ValueService,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {}

  @Get()
  async getValueByQuery(@Query() query: ValueQuery): Promise<SomeValueModel[]> {
    const result = await this.valueService.find(query);
    return result;
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async createValue(
    @Body() dto: CreateValueDto,
    @ReqUser() user: User,
  ): Promise<SomeValueModel> {
    const { v, ...query } = dto;
    const oldValue = await this.valueService.find(query);
    if (oldValue.length > 0)
      throw new BadRequestException(`Данное значение уже записано`);
    Object.assign(dto, { fromUser: user._id });
    const value = await this.valueService.create(dto);
    this.logger.log(`Создано новое значение`);
    this.logger.log(value.toObject());
    return value;
  }

  @Put()
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateValue(
    @Body() dto: UpdateValueDto,
    @ReqUser() user: User,
  ): Promise<SomeValueModel> {
    Object.assign(dto, { fromUser: user._id });
    const value = await this.valueService.update(dto);
    this.logger.log(`Обновлено значение`);
    this.logger.log(value.toObject());
    return value;
  }

  //TODO Протестировать метод
  @Delete(':_id')
  async deleteValue(@Param('_id') id: string): Promise<boolean> {
    const value = await this.valueService.findByID(id);
    if (!value) new BadRequestException('Данного значения не существует');
    await value.delete();
    return true;
  }
}

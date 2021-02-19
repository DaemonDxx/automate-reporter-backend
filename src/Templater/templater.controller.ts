import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TemplaterService } from './templater.service';
import { CreateMapDto } from './DTO/createMap.dto';

@Controller('templater')
export class TemplaterController {

  constructor(
    private readonly templaterService: TemplaterService
  ) {

  }
  // @Get()
  // async generateFilesByReport(@Param('reportID' reportID:string)): Promise<null> {
  //
  // }

  @Post('/map')
  async mapFile(@Body() createMapDto: CreateMapDto) {
    await this.templaterService.mapFile(createMapDto);
  }

}

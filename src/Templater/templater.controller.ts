import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TemplaterService } from './templater.service';

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
  async mapFile(@Body('filename') filename: string) {
    await this.templaterService.mapFile(filename);
  }

}

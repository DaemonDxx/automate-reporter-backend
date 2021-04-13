import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IncidentService } from './incident.service';
import { CreateIncidentDto } from './dto/createIncident.dto';
import { Incident } from './schemas/incident.schema';

@Controller('incident')
@UseGuards(AuthGuard('jwt'))
export class IncidentController {
  constructor(private readonly incidentService: IncidentService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async createIncident(@Body() dto: CreateIncidentDto): Promise<Incident> {
    const newIncident = this.incidentService.create(dto);
    return newIncident;
  }

  @Get()
  async getIncidentByQuery(
    @Query() query: Partial<Incident>,
  ): Promise<Incident[]> {
    const incidents = await this.incidentService.find(query);
    return incidents;
  }
}

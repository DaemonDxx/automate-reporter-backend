import { Injectable } from '@nestjs/common';
import { MongooseCRUDService } from '../../utils/mongoose/MongooseCRUDService';
import { Incident, IncidentModel } from './schemas/incident.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class IncidentService extends MongooseCRUDService<Incident> {
  constructor(
    @InjectModel(Incident.name)
    private readonly IncidentDB: Model<IncidentModel>,
  ) {
    super(IncidentDB);
  }
}

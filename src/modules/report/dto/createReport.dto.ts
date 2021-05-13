import { CreateReport$Options, CreateReport$Payload, ReportTypes } from '../../../typings/modules/report';

export class CreateReportDTO implements CreateReport$Options {
  type: ReportTypes;
  payload: CreateReport$Payload;
}

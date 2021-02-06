import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { IGetReportQuery } from './get.query.interface';

@Injectable()
export class GetReportValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): IGetReportQuery {
    console.log(metadata);
    console.log(value);
    return {
      type: value.type,
      offset: parseInt(value.offset),
      limit: parseInt(value.limit),
      month: parseInt(value.month),
      year: parseInt(value.year),
    };
  }
}

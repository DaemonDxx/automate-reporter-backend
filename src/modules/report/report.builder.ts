import { Inject, Injectable } from '@nestjs/common';
import * as XlsxTemplate from 'xlsx-template';
import { CreateReportDTO } from './dto/createReport.dto';
import { ReportTypes } from '../../typings/modules/report';
import { GetFilenameTemplate } from './utils/filenamesOfTemplates';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class ReportBuilder {
  constructor(private readonly Storage: StorageService) {}

  async build(dto: CreateReportDTO): Promise<Uint8Array> {
    const filenameTemplate = GetFilenameTemplate(dto.type);
    console.log(GetFilenameTemplate);
    const template = await this.getTemplate(filenameTemplate);
    template.substitute<Uint8Array>(1, dto.payload);
    return template.generate({
      type: 'Uint8Array',
    });
  }

  private async getTemplate(filename: string) {
    const bufferOfFile = await this.Storage.getBufferOfFile(
      filename,
      'static/reportsTemplate',
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const template = new XlsxTemplate(bufferOfFile);
    return template;
  }
}

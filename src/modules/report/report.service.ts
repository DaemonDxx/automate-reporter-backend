import { BadRequestException, Injectable } from '@nestjs/common';
import { StorageService } from '../storage/storage.service';
import { ReportBuilder } from './report.builder';
import { ReportTypes } from '../../typings/modules/report';
import { ReportPayload } from './dto/report.payload';

@Injectable()
export class ReportService {
  constructor(
    private readonly storageService: StorageService,
    private readonly builder: ReportBuilder,
  ) {}

  async generateReport(payload: ReportPayload): Promise<string | null> {
    try {
      const binaryFile = await this.builder.build(ReportTypes.Offsets, payload);
      const filename = this.generateFilename(ReportTypes.Offsets);
      return await this.storageService.saveFile(filename, binaryFile);
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  private generateFilename(type: ReportTypes): string {
    return 'temperature_factor.xlsx';
  }
}

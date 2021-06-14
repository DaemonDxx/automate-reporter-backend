import { OffsetType } from '../math/offsetType';

export enum ReportTypes {
  Offsets = 'Offsets',
}

export type FilenamesList = Record<keyof typeof ReportTypes, string>;

export type FormatOffsetType = Omit<OffsetType, 'month'>;

export type CreateReport$Payload = {
  formatOffset: FormatOffsetType[];
  offsets: OffsetType[];
};

export type CreateReport$Options = {
  type: ReportTypes,
  payload: CreateReport$Payload,
};

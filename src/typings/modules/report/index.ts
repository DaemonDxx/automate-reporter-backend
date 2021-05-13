import { Offset } from '../math/offset';

export enum ReportTypes {
  Offsets = 'Offsets',
}

export type FilenamesList = Record<keyof typeof ReportTypes, string>;

export type ConvertedOffsets = Omit<Offset, 'month'>;

export type OffsetsReport$Payload = Array<ConvertedOffsets>;

export type CreateReport$Payload = OffsetsReport$Payload;

export type CreateReport$Options = {
  type: ReportTypes,
  payload: CreateReport$Payload,
};

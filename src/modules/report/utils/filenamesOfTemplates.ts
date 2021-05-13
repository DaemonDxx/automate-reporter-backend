import { FilenamesList, ReportTypes } from '../../../typings/modules/report';

const FilenamesOfTemplates: FilenamesList = {
  Offsets: 'OffsetsTemplate.xlsx',
};

export function GetFilenameTemplate(type: ReportTypes) {
  return FilenamesOfTemplates[type];
}

export interface IMapper {
  mapTemplateByFile(file: Buffer): Promise<Buffer>;
}

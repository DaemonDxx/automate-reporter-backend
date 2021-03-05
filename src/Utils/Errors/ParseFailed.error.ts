export class ParseFailedError extends Error {
  constructor(errors: Error[]) {
    super(`Ошибка парсинга файла`);
    for (const error of errors) {
      this.message += ` ${error.message} \n`;
    }
  }
}

export class ParseFailedError extends Error {
  constructor(private readonly errors: Error[]) {
    super(`Ошибка парсинга файла`);
    for (const error of errors) {
      this.message += ` ${error.message} \n`;
    }
  }
}

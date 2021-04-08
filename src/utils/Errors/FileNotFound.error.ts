export class FileNotFoundError extends Error {
  constructor(filename) {
    super(filename);
    this.message = `Файл с именем ${filename} не найден`;
  }
}

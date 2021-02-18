import { ParserService } from '../../src/Parser/parser.service';
import * as fs from 'fs';
import { TYPES_REPORT } from '../../src/Utils/typesReport.constant';
import { IResultParsing } from '../../src/Parser/resultParsing.interface';
import * as path from 'path';

const META_OF_DEPARTMENT = {
  Алтайэнерго: {
    DATA_LENGTH: 92,
    SUM_ALL_VALUES: 2784.061,
    FILENAME: 'АЭ.xlsx',
  },
  Бурятэнерго: {
    DATA_LENGTH: 154,
    SUM_ALL_VALUES: 1865.389,
    FILENAME: 'БЭ.xlsx',
  },
  ГАЭС: {
    DATA_LENGTH: 86,
    SUM_ALL_VALUES: 212.699,
    FILENAME: 'ГАЭС.xlsx',
  },
  Красноярскэнерго: {
    DATA_LENGTH: 130,
    SUM_ALL_VALUES: 3952.954,
    FILENAME: 'КЭ.xlsx',
  },
  'Кузбассэнерго-РЭС': {
    DATA_LENGTH: 172,
    SUM_ALL_VALUES: 5748.836,
    FILENAME: 'КбЭ.xlsx',
  },
  Омскэнерго: {
    DATA_LENGTH: 86,
    SUM_ALL_VALUES: 3233.943,
    FILENAME: 'ОЭ.xlsx',
  },
  Читаэнерго: {
    DATA_LENGTH: 90,
    SUM_ALL_VALUES: 2376.529,
    FILENAME: 'ЧЭ.xlsx',
  },
  'АО "Тываэнерго"': {
    DATA_LENGTH: 74,
    SUM_ALL_VALUES: 273.934,
    FILENAME: 'ТЭ.xlsx',
  },
};

describe('Тестирование парсера для еженедльного отчета', () => {
  let parser: ParserService;
  const TYPE = TYPES_REPORT.WEEKLY;
  const departments = [];

  for (const department of Object.keys(META_OF_DEPARTMENT)) {
    departments.push(department);
  }

  departments.forEach((department) => {
    describe(`Парсинг файла от ${department}`, () => {
      let result: IResultParsing;

      beforeAll(() => {
        parser = new ParserService();
      });

      test('Парсинг файла', () => {
        const buffer: Buffer = fs.readFileSync(
          path.join(
            __dirname,
            `\\exampleFiles\\${META_OF_DEPARTMENT[department].FILENAME}`,
          ),
        );
        const res: IResultParsing = parser.parse({
          type: TYPE,
          file: buffer,
        });
        expect(res).toBeDefined();
        result = res;
      });

      test('Результат должен содержать название филиала', () => {
        expect(result.department).toBe(department);
      });

      test('Результат должен содержать n значений', () => {
        expect(result.data.length).toBe(
          META_OF_DEPARTMENT[department].DATA_LENGTH,
        );
      });

      test('Сумма всех значений должна быть равна', () => {
        const sum: number = parseFloat(
          result.data
            .reduce((before, current) => {
              return before + current.v;
            }, 0)
            .toFixed(3),
        );
        expect(sum).toBe(META_OF_DEPARTMENT[department].SUM_ALL_VALUES);
      });
    });
  });
});

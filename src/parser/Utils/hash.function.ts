import * as hash from 'object-hash';
import has = Reflect.has;

function createStringToHash(str: Array<string>): string {
  let result = '';
  str.forEach((item) => {
    result += item;
  });
  return result;
}

export default function createKey(data: Array<string>): string {
  const strKey: string = createStringToHash(data);
  return hash(strKey);
}

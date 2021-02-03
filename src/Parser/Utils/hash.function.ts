import * as hash from 'object-hash';
import has = Reflect.has;
import { IDescription } from '../ParserStrategy/description.interface';

export default function generateAndUpdateKey(
  description: IDescription,
): IDescription {
  const key = hash(description);
  description.key = key;
  return description;
}

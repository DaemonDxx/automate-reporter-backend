export const ACCESS_LIST = {
  CREATOR: 'CREATOR',
  TEMPERATURE_GET: 'TEMPERATURE_GET',
  TEMPERATURE_CHANGE: 'TEMPERATURE_CHANGE',
  BASE: 'BASE'
};

export function GetAccessListArray() {
  const result = [];
  for (const key of Object.keys(ACCESS_LIST)) {
    result.push(key);
  }
  return result;
}

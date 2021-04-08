export function toArray(e): string[] {
  return Object.keys(e).map((el) => e[el]);
}

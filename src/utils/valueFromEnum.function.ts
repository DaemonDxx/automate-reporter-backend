export function getKeyByValue(e, v) {
  for (const key of Object.keys(e)) {
    if (e[key] === v) return key;
  }
}

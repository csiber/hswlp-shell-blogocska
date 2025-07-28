export function normalizeTimestamp(value: Date | number | string): number {
  let num: number;
  if (value instanceof Date) {
    num = value.getTime();
  } else if (typeof value === 'string') {
    num = parseInt(value, 10);
    if (Number.isNaN(num)) num = Date.parse(value);
  } else {
    num = value;
  }

  if (num > 1e14) {
    return Math.floor(num / 1000);
  }
  if (num < 1e12) {
    return num * 1000;
  }
  return num;
}

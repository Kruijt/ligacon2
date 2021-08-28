export function assertArray<T>(item: T | T[]): T[] {
  return item != null ? (Array.isArray(item) ? item : [item]) : [];
}

export function mapToObject(
  map: Map<unknown, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of map.entries()) {
    const keyAsString = String(key);
    if (value instanceof Map) {
      result[keyAsString] = mapToObject(value);
    } else {
      result[keyAsString] = value;
    }
  }
  return result;
}

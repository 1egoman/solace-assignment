export function parseNumericQueryParameterOrDefault(
  possibleNumericStringOrNull: string | null,
  defaultValue: number,
): number {
  const parsed = parseInt(possibleNumericStringOrNull ?? '', 10);
  if (isNaN(parsed)) {
    return defaultValue;
  }

  return parsed;
}

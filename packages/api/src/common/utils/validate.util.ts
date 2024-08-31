export function isValidPostgresBigInt(
  input: string | number | bigint,
): boolean {
  try {
    const bigIntValue = BigInt(input);

    // PostgreSQL BIGINT range
    const MAX_POSTGRES_BIGINT = BigInt("9223372036854775807");
    const MIN_POSTGRES_BIGINT = BigInt("-9223372036854775808");

    if (
      bigIntValue > MAX_POSTGRES_BIGINT ||
      bigIntValue < MIN_POSTGRES_BIGINT
    ) {
      return false; // Out of range for PostgreSQL BIGINT
    }

    return true; // It's a valid BigInt and within PostgreSQL BIGINT range
  } catch {
    return false; // Not a valid BigInt
  }
}

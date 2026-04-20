export default function pickRandomStatusCode(
  statusCodes: Record<string, { weight: number; message: string }>,
): { error: boolean; code: number; message: string } {
  const entries = Object.entries(statusCodes);

  if (entries.length === 0) {
    return { error: false, code: 200, message: "OK" };
  }

  const totalWeight = entries.reduce((acc, [_, data]) => acc + data.weight, 0);
  const random = Math.random() * (totalWeight || 1);

  let cumulativeWeight = 0;
  for (const [code, data] of entries) {
    cumulativeWeight += data.weight;
    if (random <= cumulativeWeight) {
      const numericCode = Number(code);
      return {
        error: numericCode >= 400,
        code: numericCode,
        message: data.message,
      };
    }
  }

  const [firstCode, firstData] = entries[0];
  const fallbackCode = Number(firstCode);
  return {
    error: fallbackCode >= 400,
    code: fallbackCode,
    message: firstData.message,
  };
}
// Weighted Random Selection Algorithm

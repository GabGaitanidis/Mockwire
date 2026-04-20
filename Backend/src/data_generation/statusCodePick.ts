export default function pickRandomStatusCode(
  statusCodes: Record<string, { weight: number; message: string }>,
): { error: boolean; code: number; message: string } {
  const entries = Object.entries(statusCodes);
  const totalWeight = entries.reduce((acc, [_, data]) => acc + data.weight, 0);
  const random = Math.random() * totalWeight;
  let error = false;
  let cumulativeWeight = 0;
  for (const [code, data] of entries) {
    cumulativeWeight += data.weight;
    if (random <= cumulativeWeight) {
      if (Number(code) >= 400) error = true;
      return { error, code: Number(code), message: data.message };
    }
  }

  const [firstCode, firstData] = entries[0];
  if (Number(firstCode) >= 400) error = true;
  return {
    error,
    code: Number(firstCode),
    message: firstData.message,
  };
}
// Weighted Random Selection Algorithm

export default function pickRandomStatusCode(
  statusCodes: Record<string, { weight: number; message: string }>,
): { code: number; message: string } {
  const random = Math.random() * 100;
  let cumulativeWeight = 0;

  for (const [code, data] of Object.entries(statusCodes)) {
    cumulativeWeight += data.weight;

    if (random <= cumulativeWeight) {
      return { code: Number(code), message: data.message };
    }
  }

  const firstKey = Object.keys(statusCodes)[0];
  return {
    code: Number(firstKey),
    message: statusCodes[firstKey].message,
  };
}
// Weighted Random Selection Algorithm

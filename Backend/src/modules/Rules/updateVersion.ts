export function updateVersion(version: string): string {
  const match = /^v(\d+)$/i.exec(version?.trim());

  if (!match) {
    return "v2";
  }

  const next = Number(match[1]) + 1;
  return `v${next}`;
}

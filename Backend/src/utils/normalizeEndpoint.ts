function normalizeEndpoint(endpoint: string): string {
  if (!endpoint.startsWith("/")) {
    return `/${endpoint}`;
  }
  endpoint = endpoint.replace(/\s/g, "");
  endpoint = endpoint.replace("\\", "");
  const noDuplicateEndpoint = endpoint.replace(/\/+/g, "/");
  return noDuplicateEndpoint;
}

export default normalizeEndpoint;

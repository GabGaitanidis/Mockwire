import "dotenv/config";

const API_HOST = process.env.API_HOST || "http://localhost:5000";

function normalizeHost(host: string): string {
  return host.endsWith("/") ? host.slice(0, -1) : host;
}

function normalizeEndpoint(endpoint: string): string {
  if (!endpoint) return "";
  return endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
}

function urlGenerator(apiKey: string, endpoint: string) {
  const host = normalizeHost(API_HOST);
  const normalizedEndpoint = normalizeEndpoint(endpoint);
  const url = `${host}/dynamics/api/mock/${apiKey}${normalizedEndpoint}`;
  return url;
}

export default urlGenerator;

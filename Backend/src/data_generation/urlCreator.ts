import "dotenv/config";

function getApiHost() {
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    return process.env.API_HOST_PROD ?? process.env.API_HOST;
  }

  return process.env.API_HOST_DEV ?? process.env.API_HOST;
}

function normalizeHost(host: string): string {
  return host.endsWith("/") ? host.slice(0, -1) : host;
}

function normalizeEndpoint(endpoint: string): string {
  if (!endpoint) return "";
  return endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
}

function urlGenerator(apiKey: string, endpoint: string) {
  const host = normalizeHost(getApiHost() || "http://localhost:5000");
  const normalizedEndpoint = normalizeEndpoint(endpoint);
  const url = `${host}/dynamics/api/mock/${apiKey}${normalizedEndpoint}`;
  return url;
}

export default urlGenerator;

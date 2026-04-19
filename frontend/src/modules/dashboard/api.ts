import axios from "../../utils/axiosInstance";
import type {
  CreateDynamicUrlResponse,
  CreateRuleRequest,
  CreateRuleResponse,
  MessageResponse,
  Rule,
  RulesResponse,
  UrlItem,
  UrlsResponse,
} from "./types";

const HOSTS_TO_PROXY = [
  "http://localhost:5000",
  "https://localhost:5000",
  "http://localhost:3001",
  "https://localhost:3001",
  "https://api-generator-7lxt.onrender.com",
];

function normalizeUrlList(rawUrls: unknown): UrlItem[] {
  if (!Array.isArray(rawUrls)) {
    return [];
  }

  return rawUrls
    .map((item, index) => {
      if (typeof item === "string") {
        return { id: index + 1, url: item };
      }

      if (item && typeof item === "object" && "url" in item) {
        return item as UrlItem;
      }

      return null;
    })
    .filter((item): item is UrlItem => Boolean(item));
}

function toFrontendTestPath(generatedUrl: string): string {
  try {
    const parsed = new URL(generatedUrl);
    return `/api${parsed.pathname}${parsed.search}`;
  } catch {
    let testUrl = generatedUrl;
    for (const host of HOSTS_TO_PROXY) {
      testUrl = testUrl.replace(host, "/api");
    }
    return testUrl;
  }
}

export async function fetchRulesApi(): Promise<{
  message: string;
  rules: Rule[];
}> {
  const response = await axios.get<RulesResponse>("/api/rules");
  return {
    message: response.data.message,
    rules: response.data.rules ?? [],
  };
}

export async function fetchUrlsApi(): Promise<{
  message: string;
  urls: UrlItem[];
}> {
  const response = await axios.get<UrlsResponse>("/api/dynamics");
  return {
    message: response.data.message,
    urls: normalizeUrlList(response.data.urls),
  };
}

export async function createRuleApi(
  payload: CreateRuleRequest,
): Promise<{ message: string; rule: Rule }> {
  const response = await axios.post<CreateRuleResponse>("/api/rules", payload);
  return {
    message: response.data.message,
    rule: response.data.rule,
  };
}

export async function createDynamicUrlApi(
  ruleId: string,
): Promise<{ message: string; url: string }> {
  const response = await axios.post<CreateDynamicUrlResponse>(
    `/api/dynamics/${ruleId}`,
  );
  const urlPayload = response.data.url;

  const url =
    typeof urlPayload === "string" ? urlPayload : (urlPayload?.url ?? "");

  return {
    message: response.data.message,
    url,
  };
}

export async function testDynamicUrlApi(
  generatedUrl: string,
): Promise<{ message: string; statusCode: number; data: unknown }> {
  const response = await axios.get<
    MessageResponse & { mockData?: unknown; data?: unknown }
  >(toFrontendTestPath(generatedUrl));

  return {
    message: response.data.message,
    statusCode: response.status,
    data: response.data.mockData ?? response.data.data,
  };
}

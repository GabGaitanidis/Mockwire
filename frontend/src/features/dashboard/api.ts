import axios from "../../utils/axiosInstance";
import type { CreateRuleRequest, Rule, UrlItem } from "./types";

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

export async function fetchRulesApi(): Promise<Rule[]> {
  const response = await axios.get("/api/rules");
  return response.data?.rules ?? [];
}

export async function fetchUrlsApi(): Promise<UrlItem[]> {
  const response = await axios.get("/api/dynamics");

  const urls = response.data?.urls ?? response.data;
  return normalizeUrlList(urls);
}

export async function createRuleApi(payload: CreateRuleRequest): Promise<Rule> {
  const response = await axios.post("/api/rules", payload);
  return response.data?.rule;
}

export async function createDynamicUrlApi(ruleId: string): Promise<string> {
  const response = await axios.post(`/api/dynamics/${ruleId}`);
  const urlPayload = response.data?.url;

  if (typeof urlPayload === "string") {
    return urlPayload;
  }

  return urlPayload?.url ?? "";
}

export async function testDynamicUrlApi(generatedUrl: string) {
  const response = await axios.get(toFrontendTestPath(generatedUrl));
  return {
    statusCode: response.status,
    message: response.data?.message,
    data: response.data?.mockData ?? response.data?.data,
  };
}

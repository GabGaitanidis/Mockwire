import rawAxios from "axios";
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

const BACKEND_BASE_URL = "http://localhost:5000";

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

function toBackendDynamicUrl(generatedUrl: string): string {
  try {
    const parsed = new URL(generatedUrl);
    let pathname = parsed.pathname;

    if (pathname.startsWith("/api/mock/")) {
      pathname = `/dynamics${pathname}`;
    }

    return `${BACKEND_BASE_URL}${pathname}${parsed.search}`;
  } catch {
    let testUrl = generatedUrl
      .replace("https://localhost:5000", BACKEND_BASE_URL)
      .replace("http://localhost:5000", BACKEND_BASE_URL)
      .replace("https://localhost:3001", BACKEND_BASE_URL)
      .replace("http://localhost:3001", BACKEND_BASE_URL)
      .replace("https://api-generator-7lxt.onrender.com", BACKEND_BASE_URL);

    if (testUrl.startsWith(`${BACKEND_BASE_URL}/api/mock/`)) {
      testUrl = testUrl.replace(
        `${BACKEND_BASE_URL}/api/mock/`,
        `${BACKEND_BASE_URL}/dynamics/api/mock/`,
      );
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

export async function updateRuleApi(
  ruleId: number,
  payload: Partial<CreateRuleRequest>,
): Promise<{ message: string; rule: Rule }> {
  const response = await axios.patch<CreateRuleResponse>(
    `/api/rules/${ruleId}`,
    payload,
  );

  return {
    message: response.data.message,
    rule: response.data.rule,
  };
}

export async function deleteRuleApi(
  ruleId: number,
): Promise<{ message: string }> {
  const response = await axios.delete<MessageResponse>(`/api/rules/${ruleId}`);
  return {
    message: response.data.message,
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

export async function updateDynamicUrlApi(
  urlId: number,
  url: string,
): Promise<{ message: string; url: UrlItem | string }> {
  const response = await axios.patch<CreateDynamicUrlResponse>(
    `/api/dynamics/${urlId}`,
    { url },
  );

  return {
    message: response.data.message,
    url: response.data.url,
  };
}

export async function deleteDynamicUrlApi(
  urlId: number,
): Promise<{ message: string }> {
  const response = await axios.delete<MessageResponse>(
    `/api/dynamics/${urlId}`,
  );
  return {
    message: response.data.message,
  };
}

export async function testDynamicUrlApi(
  generatedUrl: string,
): Promise<{ message: string; statusCode: number; data: unknown }> {
  const response = await rawAxios.get<
    MessageResponse & { mockData?: unknown; data?: unknown }
  >(toBackendDynamicUrl(generatedUrl));

  return {
    message: response.data.message,
    statusCode: response.status,
    data: response.data.mockData ?? response.data.data,
  };
}

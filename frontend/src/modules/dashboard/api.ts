import rawAxios from "axios";
import axios from "../../utils/axiosInstance";
import type {
  CreateDynamicUrlResponse,
  CreateRuleRequest,
  CreateRuleResponse,
  MessageResponse,
  Project,
  Rule,
  RulesResponse,
  UrlItem,
  UrlsResponse,
} from "./types";

function getBackendBaseUrl() {
  if (import.meta.env.PROD) {
    return (
      import.meta.env.VITE_API_URL_PROD ??
      import.meta.env.VITE_API_URL ??
      "https://api-generator-7lxt.onrender.com"
    );
  }

  return (
    import.meta.env.VITE_API_URL_DEV ??
    import.meta.env.VITE_API_URL ??
    "http://localhost:5000"
  );
}

const BACKEND_BASE_URL = getBackendBaseUrl();

function normalizeUrlList(rawUrls: unknown): UrlItem[] {
  if (!Array.isArray(rawUrls)) {
    return [];
  }

  return rawUrls
    .map((item) => {
      if (typeof item === "string") {
        return { url: item };
      }

      if (item && typeof item === "object" && "url" in item) {
        const record = item as Record<string, unknown>;

        return {
          id:
            typeof record.id === "number"
              ? record.id
              : Number.isFinite(Number(record.id))
                ? Number(record.id)
                : undefined,
          url: String(record.url ?? ""),
          createdAt:
            typeof record.createdAt === "string"
              ? record.createdAt
              : typeof record.created_at === "string"
                ? record.created_at
                : undefined,
          rules_id:
            typeof record.rules_id === "number"
              ? record.rules_id
              : Number.isFinite(Number(record.rules_id))
                ? Number(record.rules_id)
                : undefined,
        };
      }

      return null;
    })
    .filter((item): item is UrlItem => Boolean(item && item.url));
}

function toBackendDynamicUrl(generatedUrl: string): string {
  const configuredBackendOrigin = (() => {
    try {
      return new URL(BACKEND_BASE_URL).origin;
    } catch {
      return BACKEND_BASE_URL;
    }
  })();

  try {
    const parsed = new URL(generatedUrl);
    let pathname = parsed.pathname;

    if (pathname.startsWith("/api/mock/")) {
      pathname = `/dynamics${pathname}`;
    }

    return `${parsed.origin}${pathname}${parsed.search}`;
  } catch {
    let testUrl = generatedUrl
      .replace("https://localhost:5000", configuredBackendOrigin)
      .replace("http://localhost:5000", configuredBackendOrigin)
      .replace("https://localhost:3001", configuredBackendOrigin)
      .replace("http://localhost:3001", configuredBackendOrigin)
      .replace(
        "https://api-generator-7lxt.onrender.com",
        configuredBackendOrigin,
      );

    if (testUrl.startsWith(`${configuredBackendOrigin}/api/mock/`)) {
      testUrl = testUrl.replace(
        `${configuredBackendOrigin}/api/mock/`,
        `${configuredBackendOrigin}/dynamics/api/mock/`,
      );
    }

    return testUrl;
  }
}

export async function fetchRulesApi(projectId: number): Promise<{
  message: string;
  rules: Rule[];
}> {
  return fetchRulesApiByProject(projectId);
}

export async function fetchProjectsApi(): Promise<Project[]> {
  const response = await axios.get<Project[]>("/projects");
  return Array.isArray(response.data) ? response.data : [];
}

export async function createProjectApi(name: string): Promise<Project> {
  const response = await axios.post<Project>("/projects", { name });
  return response.data;
}

export async function fetchRulesApiByProject(projectId: number): Promise<{
  message: string;
  rules: Rule[];
}> {
  const response = await axios.get<RulesResponse>(
    `/projects/${projectId}/rules`,
  );
  return {
    message: response.data.message,
    rules: response.data.rules ?? [],
  };
}

export async function fetchUrlsApiByProject(projectId: number): Promise<{
  message: string;
  urls: UrlItem[];
}> {
  const response = await axios.get<UrlsResponse>(`/projects/${projectId}/urls`);
  return {
    message: response.data.message,
    urls: normalizeUrlList(response.data.urls),
  };
}

export async function fetchUrlsApi(projectId: number): Promise<{
  message: string;
  urls: UrlItem[];
}> {
  return fetchUrlsApiByProject(projectId);
}

export async function createRuleApi(
  projectId: number,
  payload: CreateRuleRequest,
): Promise<{ message: string; rule: Rule }> {
  const response = await axios.post<CreateRuleResponse>(
    `/projects/${projectId}/rules`,
    payload,
  );
  return {
    message: response.data.message,
    rule: response.data.rule,
  };
}

export async function updateRuleApi(
  projectId: number,
  ruleId: number,
  version: string,
  payload: Partial<CreateRuleRequest>,
): Promise<{ message: string; rule: Rule }> {
  const response = await axios.patch<CreateRuleResponse>(
    `/projects/${projectId}/rules/${encodeURIComponent(version)}/${ruleId}`,
    payload,
  );

  return {
    message: response.data.message,
    rule: response.data.rule,
  };
}

export async function deleteRuleApi(
  projectId: number,
  ruleId: number,
): Promise<{ message: string }> {
  const response = await axios.delete<MessageResponse>(
    `/projects/${projectId}/rules/${ruleId}`,
  );
  return {
    message: response.data.message,
  };
}

export async function createDynamicUrlApi(
  projectId: number,
  ruleId: string,
): Promise<{ message: string; url: string }> {
  const response = await axios.post<CreateDynamicUrlResponse>(
    `/projects/${projectId}/urls/${ruleId}`,
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
  projectId: number,
  urlId: number,
  url: string,
): Promise<{ message: string; url: UrlItem | string }> {
  const response = await axios.patch<CreateDynamicUrlResponse>(
    `/projects/${projectId}/urls/${urlId}`,
    { url },
  );

  return {
    message: response.data.message,
    url: response.data.url,
  };
}

export async function deleteDynamicUrlApi(
  projectId: number,
  urlId: number,
): Promise<{ message: string }> {
  const response = await axios.delete<MessageResponse>(
    `/projects/${projectId}/urls/${urlId}`,
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

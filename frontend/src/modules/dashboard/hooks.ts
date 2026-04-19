import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { AxiosError } from "axios";
import {
  createDynamicUrlApi,
  createRuleApi,
  fetchRulesApi,
  fetchUrlsApi,
  testDynamicUrlApi,
} from "./api";
import type {
  Rule,
  RuleFormData,
  StatusCodeInput,
  StatusCodesMap,
  TestResponse,
  UrlItem,
  User,
} from "./types";

const INITIAL_FORM_DATA: RuleFormData = {
  endpoint: "",
  dataSchema: "",
  latency: 0,
  statusCodes: { "200": { weight: 100, message: "OK" } },
};

const INITIAL_STATUS_CODE_INPUT: StatusCodeInput = {
  code: "200",
  weight: "100",
  message: "OK",
};

const INITIAL_TEST_RESPONSE: TestResponse = {
  data: null,
  error: null,
};

function getApiErrorMessage(error: unknown, fallback: string) {
  if (error instanceof AxiosError) {
    return error.response?.data?.message ?? fallback;
  }
  return fallback;
}

export function useDashboard() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [urls, setUrls] = useState<UrlItem[]>([]);
  const [formData, setFormData] = useState<RuleFormData>(INITIAL_FORM_DATA);
  const [statusCodeInput, setStatusCodeInput] = useState<StatusCodeInput>(
    INITIAL_STATUS_CODE_INPUT,
  );
  const [selectedRuleId, setSelectedRuleId] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [testResponse, setTestResponse] = useState<TestResponse>(
    INITIAL_TEST_RESPONSE,
  );
  const [testLoading, setTestLoading] = useState(false);

  async function fetchRules() {
    try {
      const response = await fetchRulesApi();
      setRules(response.rules);
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to fetch rules"));
    }
  }

  async function fetchUrls() {
    try {
      const response = await fetchUrlsApi();
      setUrls(response.urls);
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to fetch URLs"));
    }
  }

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser) as User;
      setUser(parsedUser);
      fetchRules();
      fetchUrls();
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("apiKey");
    }
  }, []);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "latency" ? Number(value) : value,
    }));
  }

  async function handleSubmitRule(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!user) {
      setError("Please login first");
      return;
    }

    try {
      const dataSchema = JSON.parse(formData.dataSchema);
      const totalWeight = Object.values(formData.statusCodes).reduce(
        (acc, item) => acc + item.weight,
        0,
      );

      if (totalWeight !== 100) {
        setError("Status code weights must total 100%");
        return;
      }

      const response = await createRuleApi({
        endpoint: formData.endpoint,
        dataSchema,
        latency: formData.latency,
        statusCodes: formData.statusCodes,
      });

      setMessage(response.message);
      setError("");
      await fetchRules();
      setFormData(INITIAL_FORM_DATA);
      setStatusCodeInput(INITIAL_STATUS_CODE_INPUT);
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to create rule"));
    }
  }

  async function handleGenerateUrl() {
    if (!user || !selectedRuleId) {
      return;
    }

    try {
      const response = await createDynamicUrlApi(selectedRuleId);
      setGeneratedUrl(response.url);
      setMessage(response.message);
      setTestResponse(INITIAL_TEST_RESPONSE);
      await fetchUrls();
      setError("");
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to generate URL"));
    }
  }

  async function handleTestUrl() {
    if (!generatedUrl) {
      return;
    }

    setTestLoading(true);
    setTestResponse(INITIAL_TEST_RESPONSE);

    try {
      const result = await testDynamicUrlApi(generatedUrl);
      setTestResponse({
        statusCode: result.statusCode,
        message: result.message,
        data: result.data,
        error: null,
      });
    } catch (err) {
      setTestResponse({
        statusCode:
          err instanceof AxiosError ? err.response?.status : undefined,
        data: null,
        error: getApiErrorMessage(err, "Request failed"),
      });
    } finally {
      setTestLoading(false);
    }
  }

  function handleAddStatusCode() {
    const code = statusCodeInput.code;
    const weight = Number(statusCodeInput.weight);
    const statusMessage = statusCodeInput.message.trim();

    if (!code || weight <= 0 || weight > 100 || !statusMessage) {
      setError("Invalid status code, weight, or message");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      statusCodes: {
        ...prev.statusCodes,
        [code]: { weight, message: statusMessage },
      },
    }));

    setError("");
    setStatusCodeInput(INITIAL_STATUS_CODE_INPUT);
  }

  function handleRemoveStatusCode(code: string) {
    if (Object.keys(formData.statusCodes).length === 1) {
      setError("Must have at least one status code");
      return;
    }

    setFormData((prev) => {
      const nextCodes = { ...prev.statusCodes };
      delete nextCodes[code];
      return { ...prev, statusCodes: nextCodes };
    });
  }

  function applyStatusCodePreset(preset: StatusCodesMap) {
    setFormData((prev) => ({ ...prev, statusCodes: preset }));
  }

  return {
    rules,
    urls,
    formData,
    statusCodeInput,
    selectedRuleId,
    generatedUrl,
    user,
    error,
    message,
    testResponse,
    testLoading,
    setFormData,
    setStatusCodeInput,
    setSelectedRuleId,
    setError,
    setMessage,
    handleChange,
    handleSubmitRule,
    handleGenerateUrl,
    handleTestUrl,
    handleAddStatusCode,
    handleRemoveStatusCode,
    applyStatusCodePreset,
  };
}

import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { AxiosError } from "axios";
import {
  createDynamicUrlApi,
  createRuleApi,
  deleteDynamicUrlApi,
  deleteRuleApi,
  fetchRulesApi,
  fetchUrlsApi,
  testDynamicUrlApi,
  updateDynamicUrlApi,
  updateRuleApi,
} from "./api";
import type {
  FieldTypeOption,
  Rule,
  RuleFormData,
  SchemaEntry,
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

const FIELD_TYPE_OPTIONS: FieldTypeOption[] = [
  { label: "Full Name", fakerPath: "person.fullName" },
  { label: "Email", fakerPath: "internet.email" },
  { label: "Phone Number", fakerPath: "phone.number" },
  { label: "Street Address", fakerPath: "location.streetAddress" },
  { label: "Company Name", fakerPath: "company.name" },
  { label: "Job Title", fakerPath: "person.jobTitle" },
  { label: "Product Name", fakerPath: "commerce.productName" },
  { label: "Price", fakerPath: "commerce.price" },
  { label: "Recent Date", fakerPath: "date.recent" },
  { label: "Random Number", fakerPath: "number.int" },
];

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
  const [editingRuleId, setEditingRuleId] = useState<number | null>(null);
  const [editingUrlId, setEditingUrlId] = useState<number | null>(null);
  const [fieldNameInput, setFieldNameInput] = useState("");
  const [fieldTypeInput, setFieldTypeInput] = useState(
    FIELD_TYPE_OPTIONS[0].fakerPath,
  );

  function parseSchemaToObject(): Record<string, string> {
    if (!formData.dataSchema.trim()) {
      return {};
    }

    const parsed = JSON.parse(formData.dataSchema);

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("Schema must be a JSON object");
    }

    return parsed as Record<string, string>;
  }

  function writeSchemaObject(nextSchema: Record<string, string>) {
    setFormData((prev) => ({
      ...prev,
      dataSchema: JSON.stringify(nextSchema, null, 2),
    }));
  }

  function applySchemaTemplate(template: Record<string, string>) {
    writeSchemaObject(template);
    setError("");
  }

  function handleAddSchemaField() {
    const fieldName = fieldNameInput.trim();

    if (!fieldName) {
      setError("Field name is required");
      return;
    }

    try {
      const schema = parseSchemaToObject();

      schema[fieldName] = fieldTypeInput;
      writeSchemaObject(schema);
      setFieldNameInput("");
      setError("");
    } catch {
      setError("Fix Data Schema JSON before adding fields");
    }
  }

  function handleRemoveSchemaField(fieldName: string) {
    try {
      const schema = parseSchemaToObject();
      delete schema[fieldName];
      writeSchemaObject(schema);
      setError("");
    } catch {
      setError("Fix Data Schema JSON before removing fields");
    }
  }

  function getSchemaEntries(): SchemaEntry[] {
    try {
      const schema = parseSchemaToObject();

      return Object.entries(schema).map(([name, fakerPath]) => ({
        fieldName: name,
        fakerPath,
        label:
          FIELD_TYPE_OPTIONS.find((option) => option.fakerPath === fakerPath)
            ?.label ?? "Custom",
      }));
    } catch {
      return [];
    }
  }

  const schemaEntries = getSchemaEntries();

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

  async function handleDeleteRule(ruleId: number) {
    try {
      const response = await deleteRuleApi(ruleId);
      setMessage(response.message);
      setError("");
      await fetchRules();
      await fetchUrls();
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to delete rule"));
    }
  }

  async function handleUpdateRule(
    ruleId: number,
    payload: Partial<RuleFormData>,
  ) {
    try {
      const requestPayload: Partial<{
        endpoint: string;
        dataSchema: Record<string, string>;
        latency: number;
        statusCodes: StatusCodesMap;
      }> = {};

      if (payload.endpoint !== undefined) {
        requestPayload.endpoint = payload.endpoint;
      }

      if (payload.latency !== undefined) {
        requestPayload.latency = payload.latency;
      }

      if (payload.statusCodes !== undefined) {
        requestPayload.statusCodes = payload.statusCodes;
      }

      if (payload.dataSchema !== undefined) {
        requestPayload.dataSchema = JSON.parse(payload.dataSchema);
      }

      const response = await updateRuleApi(ruleId, requestPayload);
      setMessage(response.message);
      setError("");
      setEditingRuleId(null);
      await fetchRules();
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to update rule"));
    }
  }

  async function handleDeleteUrl(urlId?: number) {
    if (!urlId) {
      setError("Cannot delete URL without id");
      return;
    }

    try {
      const response = await deleteDynamicUrlApi(urlId);
      setMessage(response.message);
      setError("");
      await fetchUrls();
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to delete URL"));
    }
  }

  async function handleUpdateUrl(urlId: number, url: string) {
    try {
      const response = await updateDynamicUrlApi(urlId, url);
      setMessage(response.message);
      setError("");
      setEditingUrlId(null);
      await fetchUrls();
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to update URL"));
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
    editingRuleId,
    editingUrlId,
    setFormData,
    setStatusCodeInput,
    setSelectedRuleId,
    setEditingRuleId,
    setEditingUrlId,
    setError,
    setMessage,
    fieldNameInput,
    fieldTypeInput,
    fieldTypeOptions: FIELD_TYPE_OPTIONS,
    schemaEntries,
    setFieldNameInput,
    setFieldTypeInput,
    handleChange,
    handleAddSchemaField,
    handleRemoveSchemaField,
    applySchemaTemplate,
    handleSubmitRule,
    handleGenerateUrl,
    handleTestUrl,
    handleDeleteRule,
    handleUpdateRule,
    handleDeleteUrl,
    handleUpdateUrl,
    handleAddStatusCode,
    handleRemoveStatusCode,
    applyStatusCodePreset,
  };
}

import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { AxiosError } from "axios";
import {
  createProjectApi,
  createDynamicUrlApi,
  createRuleApi,
  deleteDynamicUrlApi,
  deleteRuleApi,
  fetchProjectsApi,
  fetchRulesApiByProject,
  fetchUrlsApiByProject,
  testDynamicUrlApi,
  updateDynamicUrlApi,
  updateRuleApi,
} from "./api";
import type {
  FieldTypeOption,
  Project,
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
  totalDelayMs: undefined,
  configuredLatencyMs: undefined,
  networkDelayMs: undefined,
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

type SectionFeedback = {
  type: "success" | "error";
  text: string;
};

function getApiErrorMessage(error: unknown, fallback: string) {
  if (error instanceof AxiosError) {
    return error.response?.data?.message ?? fallback;
  }
  return fallback;
}

export function useDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [rules, setRules] = useState<Rule[]>([]);
  const [urls, setUrls] = useState<UrlItem[]>([]);
  const [formData, setFormData] = useState<RuleFormData>(INITIAL_FORM_DATA);
  const [statusCodeInput, setStatusCodeInput] = useState<StatusCodeInput>(
    INITIAL_STATUS_CODE_INPUT,
  );
  const [selectedRuleId, setSelectedRuleId] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [testUrlInput, setTestUrlInput] = useState("");
  const [activeProjectId, setActiveProjectId] = useState<number | null>(null);
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
  const [projectFeedback, setProjectFeedback] =
    useState<SectionFeedback | null>(null);
  const [ruleFeedback, setRuleFeedback] = useState<SectionFeedback | null>(
    null,
  );
  const [urlFeedback, setUrlFeedback] = useState<SectionFeedback | null>(null);

  function clearSectionFeedback(section: "project" | "rule" | "url") {
    if (section === "project") {
      setProjectFeedback(null);
      return;
    }

    if (section === "rule") {
      setRuleFeedback(null);
      return;
    }

    setUrlFeedback(null);
  }

  function setSectionFeedback(
    section: "project" | "rule" | "url",
    type: "success" | "error",
    text: string,
  ) {
    if (section === "project") {
      setProjectFeedback({ type, text });
      return;
    }

    if (section === "rule") {
      setRuleFeedback({ type, text });
      return;
    }

    setUrlFeedback({ type, text });
  }

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
    clearSectionFeedback("rule");
  }

  function handleAddSchemaField() {
    const fieldName = fieldNameInput.trim();

    if (!fieldName) {
      setError("Field name is required");
      setSectionFeedback("rule", "error", "Field name is required");
      return;
    }

    try {
      const schema = parseSchemaToObject();

      schema[fieldName] = fieldTypeInput;
      writeSchemaObject(schema);
      setFieldNameInput("");
      setError("");
      clearSectionFeedback("rule");
    } catch {
      setError("Fix Data Schema JSON before adding fields");
      setSectionFeedback(
        "rule",
        "error",
        "Fix Data Schema JSON before adding fields",
      );
    }
  }

  function handleRemoveSchemaField(fieldName: string) {
    try {
      const schema = parseSchemaToObject();
      delete schema[fieldName];
      writeSchemaObject(schema);
      setError("");
      clearSectionFeedback("rule");
    } catch {
      setError("Fix Data Schema JSON before removing fields");
      setSectionFeedback(
        "rule",
        "error",
        "Fix Data Schema JSON before removing fields",
      );
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

  async function fetchRules(projectId: number) {
    try {
      const response = await fetchRulesApiByProject(projectId);
      setRules(response.rules);
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to fetch rules"));
      setSectionFeedback(
        "rule",
        "error",
        getApiErrorMessage(err, "Failed to fetch rules"),
      );
    }
  }

  async function fetchUrls(projectId: number) {
    try {
      const response = await fetchUrlsApiByProject(projectId);
      setUrls(response.urls);
    } catch (err) {
      setUrls([]);
      setError(getApiErrorMessage(err, "Failed to fetch URLs"));
      setSectionFeedback(
        "url",
        "error",
        getApiErrorMessage(err, "Failed to fetch URLs"),
      );
    }
  }

  async function initializeProjects() {
    const fetchedProjects = await fetchProjectsApi();

    if (fetchedProjects.length > 0) {
      setProjects(fetchedProjects);
      return fetchedProjects[0].id;
    }

    const created = await createProjectApi("Default Project");
    const nextProjects = [created];
    setProjects(nextProjects);
    return created.id;
  }

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser) as User;
      setUser(parsedUser);

      (async () => {
        try {
          const projectId = await initializeProjects();
          setActiveProjectId(projectId);
          await fetchRules(projectId);
          await fetchUrls(projectId);
        } catch (err) {
          setError(getApiErrorMessage(err, "Failed to initialize project"));
          setSectionFeedback(
            "project",
            "error",
            getApiErrorMessage(err, "Failed to initialize project"),
          );
        }
      })();
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("apiKey");
    }
  }, []);

  async function handleSelectProject(projectId: number) {
    if (!projectId || Number.isNaN(projectId)) {
      return;
    }

    setActiveProjectId(projectId);
    setSelectedRuleId("");
    setGeneratedUrl("");
    setTestUrlInput("");
    setTestResponse(INITIAL_TEST_RESPONSE);

    await fetchRules(projectId);
    await fetchUrls(projectId);
  }

  async function handleCreateProject(name: string) {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Project name is required");
      setSectionFeedback("project", "error", "Project name is required");
      return;
    }

    try {
      const created = await createProjectApi(trimmedName);
      const nextProjects = [...projects, created];
      setProjects(nextProjects);
      setMessage("Project created successfully");
      setError("");
      setSectionFeedback("project", "success", "Project created successfully");
      await handleSelectProject(created.id);
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to create project"));
      setSectionFeedback(
        "project",
        "error",
        getApiErrorMessage(err, "Failed to create project"),
      );
    }
  }

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
      setSectionFeedback("rule", "error", "Please login first");
      return;
    }

    if (!activeProjectId) {
      setError("No project selected");
      setSectionFeedback("rule", "error", "No project selected");
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
        setSectionFeedback(
          "rule",
          "error",
          "Status code weights must total 100%",
        );
        return;
      }

      const response = await createRuleApi(activeProjectId, {
        endpoint: formData.endpoint,
        dataSchema,
        latency: formData.latency,
        statusCodes: formData.statusCodes,
      });

      setMessage(response.message);
      setError("");
      setSectionFeedback("rule", "success", response.message);
      await fetchRules(activeProjectId);
      setFormData(INITIAL_FORM_DATA);
      setStatusCodeInput(INITIAL_STATUS_CODE_INPUT);
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to create rule"));
      setSectionFeedback(
        "rule",
        "error",
        getApiErrorMessage(err, "Failed to create rule"),
      );
    }
  }

  async function handleGenerateUrl() {
    if (!user || !selectedRuleId || !activeProjectId) {
      return;
    }

    try {
      const response = await createDynamicUrlApi(
        activeProjectId,
        selectedRuleId,
      );
      setGeneratedUrl(response.url);
      setTestUrlInput(response.url);
      setMessage(response.message);
      setTestResponse(INITIAL_TEST_RESPONSE);
      await fetchUrls(activeProjectId);
      setError("");
      setSectionFeedback("url", "success", response.message);
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to generate URL"));
      setSectionFeedback(
        "url",
        "error",
        getApiErrorMessage(err, "Failed to generate URL"),
      );
    }
  }

  async function handleDeleteRule(ruleId: number) {
    if (!activeProjectId) {
      setError("No project selected");
      setSectionFeedback("rule", "error", "No project selected");
      return;
    }

    try {
      const response = await deleteRuleApi(activeProjectId, ruleId);
      setMessage(response.message);
      setError("");
      setSectionFeedback("rule", "success", response.message);
      await fetchRules(activeProjectId);
      await fetchUrls(activeProjectId);
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to delete rule"));
      setSectionFeedback(
        "rule",
        "error",
        getApiErrorMessage(err, "Failed to delete rule"),
      );
    }
  }

  async function handleUpdateRule(
    ruleId: number,
    version: string,
    payload: Partial<RuleFormData>,
  ) {
    if (!activeProjectId) {
      setError("No project selected");
      setSectionFeedback("rule", "error", "No project selected");
      return;
    }

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

      const response = await updateRuleApi(
        activeProjectId,
        ruleId,
        version,
        requestPayload,
      );
      setMessage(response.message);
      setError("");
      setEditingRuleId(null);
      setSectionFeedback("rule", "success", response.message);
      await fetchRules(activeProjectId);
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to update rule"));
      setSectionFeedback(
        "rule",
        "error",
        getApiErrorMessage(err, "Failed to update rule"),
      );
    }
  }

  async function handleDeleteUrl(urlId?: number) {
    if (!activeProjectId) {
      setError("No project selected");
      setSectionFeedback("url", "error", "No project selected");
      return;
    }

    if (!urlId) {
      setError("Cannot delete URL without id");
      setSectionFeedback("url", "error", "Cannot delete URL without id");
      return;
    }

    try {
      const response = await deleteDynamicUrlApi(activeProjectId, urlId);
      setMessage(response.message);
      setError("");
      setSectionFeedback("url", "success", response.message);
      await fetchUrls(activeProjectId);
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to delete URL"));
      setSectionFeedback(
        "url",
        "error",
        getApiErrorMessage(err, "Failed to delete URL"),
      );
    }
  }

  async function handleUpdateUrl(urlId: number, url: string) {
    if (!activeProjectId) {
      setError("No project selected");
      setSectionFeedback("url", "error", "No project selected");
      return;
    }

    try {
      const response = await updateDynamicUrlApi(activeProjectId, urlId, url);
      setMessage(response.message);
      setError("");
      setEditingUrlId(null);
      setSectionFeedback("url", "success", response.message);
      await fetchUrls(activeProjectId);
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to update URL"));
      setSectionFeedback(
        "url",
        "error",
        getApiErrorMessage(err, "Failed to update URL"),
      );
    }
  }

  async function handleTestUrl() {
    if (!testUrlInput.trim()) {
      return;
    }

    setTestLoading(true);
    setTestResponse(INITIAL_TEST_RESPONSE);

    const selectedRule = rules.find(
      (rule) => String(rule.id) === selectedRuleId,
    );
    const configuredLatencyMs = selectedRule?.latency ?? 0;
    const start = performance.now();

    try {
      const result = await testDynamicUrlApi(testUrlInput.trim());
      const totalDelayMs = Math.max(0, Math.round(performance.now() - start));
      const networkDelayMs = Math.max(0, totalDelayMs - configuredLatencyMs);

      setTestResponse({
        statusCode: result.statusCode,
        message: result.message,
        data: result.data,
        error: null,
        totalDelayMs,
        configuredLatencyMs,
        networkDelayMs,
      });
    } catch (err) {
      const totalDelayMs = Math.max(0, Math.round(performance.now() - start));
      const networkDelayMs = Math.max(0, totalDelayMs - configuredLatencyMs);

      setTestResponse({
        statusCode:
          err instanceof AxiosError ? err.response?.status : undefined,
        data: null,
        error: getApiErrorMessage(err, "Request failed"),
        totalDelayMs,
        configuredLatencyMs,
        networkDelayMs,
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
      setSectionFeedback(
        "rule",
        "error",
        "Invalid status code, weight, or message",
      );
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
    clearSectionFeedback("rule");
    setStatusCodeInput(INITIAL_STATUS_CODE_INPUT);
  }

  function handleRemoveStatusCode(code: string) {
    if (Object.keys(formData.statusCodes).length === 1) {
      setError("Must have at least one status code");
      setSectionFeedback("rule", "error", "Must have at least one status code");
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
    projects,
    activeProjectId,
    rules,
    urls,
    formData,
    statusCodeInput,
    selectedRuleId,
    generatedUrl,
    testUrlInput,
    user,
    error,
    message,
    projectFeedback,
    ruleFeedback,
    urlFeedback,
    testResponse,
    testLoading,
    editingRuleId,
    editingUrlId,
    setFormData,
    setStatusCodeInput,
    setSelectedRuleId,
    setTestUrlInput,
    setActiveProjectId,
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
    handleSelectProject,
    handleCreateProject,
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

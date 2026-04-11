import { useState, useEffect, FC } from "react";
import axios from "../utils/axiosInstance";

interface Rule {
  id: number;
  endpoint: string;
  latency: number;
  errorRate: number;
  dataSchema: Record<string, string>;
  statusCodes?: Record<string, { weight: number; message: string }>;
}

interface URL {
  id: number;
  url: string;
  createdAt: string;
  rules_id: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  api_key: string;
}

interface FormData {
  endpoint: string;
  dataSchema: string;
  latency: number;
  errorRate: number;
  statusCodes: Record<string, { weight: number; message: string }>;
}

interface TestResponse {
  statusCode?: number;
  message?: string;
  data: any;
  error: string | null;
}

const Dashboard: FC = () => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [urls, setUrls] = useState<URL[]>([]);
  const [formData, setFormData] = useState<FormData>({
    endpoint: "",
    dataSchema: "",
    latency: 0,
    errorRate: 0,
    statusCodes: { "200": { weight: 100, message: "OK" } },
  });
  const [statusCodeInput, setStatusCodeInput] = useState({
    code: "200",
    weight: "100",
    message: "OK",
  });
  const [selectedRuleId, setSelectedRuleId] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [testResponse, setTestResponse] = useState<TestResponse>({
    data: null,
    error: null,
  });
  const [testLoading, setTestLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      fetchRules();
      fetchUrls();
    }
  }, []);

  const fetchRules = async () => {
    try {
      const response = await axios.get("/api/rules");
      setRules(response.data.rules);
    } catch (err) {
      setError("Failed to fetch rules");
    }
  };

  const fetchUrls = async () => {
    try {
      const response = await axios.get("/api/dynamics");
      const fetchedUrls = Array.isArray(response.data)
        ? response.data
        : (response.data?.urls ?? []);
      setUrls(fetchedUrls);
    } catch (err) {
      setError("Failed to fetch URLs");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "latency" || name === "errorRate" ? Number(value) : value,
    });
  };

  const handleSubmitRule = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      setError("Please login first");
      return;
    }
    try {
      const dataSchema = JSON.parse(formData.dataSchema);
      const totalWeight = Object.values(formData.statusCodes).reduce(
        (a, b) => a + b.weight,
        0,
      );
      if (totalWeight !== 100) {
        setError("Status code weights must total 100%");
        return;
      }
      await axios.post("/api/rules", { ...formData, dataSchema });
      setError("");
      fetchRules();
      setFormData({
        endpoint: "",
        dataSchema: "",
        latency: 0,
        errorRate: 0,
        statusCodes: { "200": { weight: 100, message: "OK" } },
      });
      setStatusCodeInput({ code: "200", weight: "100", message: "OK" });
    } catch (err) {
      setError("Failed to create rule");
    }
  };

  const handleGenerateUrl = async () => {
    if (!user || !selectedRuleId) return;
    try {
      const response = await axios.post(`/api/dynamics/${selectedRuleId}`);
      setGeneratedUrl(response.data.url);
      setTestResponse({ data: null, error: null });
      fetchUrls();
    } catch (err) {
      setError("Failed to generate URL");
    }
  };
  const handleTestUrl = async () => {
    if (!generatedUrl) return;
    setTestLoading(true);
    setTestResponse({ data: null, error: null });
    try {
      const testUrl = generatedUrl
        .replace("http://localhost:5000", "/api")
        .replace("http://localhost:3001", "/api")
        .replace("https://localhost:3001", "/api");

      const response = await axios.get(testUrl);
      setTestResponse({
        statusCode: response.status,
        message: response.data.message,
        data: response.data.data,
        error: null,
      });
    } catch (err: any) {
      setTestResponse({
        statusCode: err.response?.status,
        data: null,
        error: err.response?.data?.message || "Request failed",
      });
    } finally {
      setTestLoading(false);
    }
  };

  const handleAddStatusCode = () => {
    const code = statusCodeInput.code;
    const weight = Number(statusCodeInput.weight);
    const message = statusCodeInput.message.trim();
    if (!code || weight <= 0 || weight > 100 || !message) {
      setError("Invalid status code, weight, or message");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      statusCodes: { ...prev.statusCodes, [code]: { weight, message } },
    }));
    setError("");
    setStatusCodeInput({ code: "200", weight: "100", message: "OK" });
  };

  const handleRemoveStatusCode = (code: string) => {
    if (Object.keys(formData.statusCodes).length === 1) {
      setError("Must have at least one status code");
      return;
    }
    setFormData((prev) => {
      const newCodes = { ...prev.statusCodes };
      delete newCodes[code];
      return { ...prev, statusCodes: newCodes };
    });
  };

  const applyStatusCodePreset = (
    preset: Record<string, { weight: number; message: string }>,
  ) => {
    setFormData((prev) => ({ ...prev, statusCodes: preset }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 overflow-x-hidden">
      <div className="max-w-screen-2xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">
              Mock API Generator
            </h1>
            {user && (
              <button
                onClick={() => {
                  localStorage.removeItem("user");
                  localStorage.removeItem("apiKey");
                  window.location.reload();
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            )}
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {user ? (
            <div>
              {/* User Info Card */}
              <div className="mb-8 p-6 bg-white rounded-lg shadow-md border-l-4 border-blue-500">
                <p className="text-gray-700">
                  <span className="font-semibold">Welcome,</span> {user.name}!
                </p>
                <div className="mt-3 p-3 bg-gray-100 rounded flex items-center gap-3 flex-wrap">
                  <span className="text-sm text-gray-600">API Key:</span>
                  <code className="flex-1 text-xs break-all font-mono text-gray-800 min-w-0">
                    {user.api_key}
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(user.api_key);
                    }}
                    className="text-blue-500 hover:text-blue-700 text-sm font-semibold whitespace-nowrap"
                  >
                    Copy
                  </button>
                </div>
              </div>

              {/* Main Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Create Rule Card */}
                <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6 min-w-0">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">
                    Create Rule
                  </h2>
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <svg
                        className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      <div className="text-sm text-green-800">
                        <p className="font-semibold mb-1">What is a Rule?</p>
                        <p>
                          A rule defines the structure of mock data for an API
                          endpoint. Use Faker.js methods to generate realistic
                          test data with optional latency and error simulation.
                        </p>
                      </div>
                    </div>
                  </div>
                  <form onSubmit={handleSubmitRule} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Endpoint
                      </label>
                      <input
                        type="text"
                        name="endpoint"
                        value={formData.endpoint}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        placeholder="/api/users"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Data Schema (JSON)
                      </label>
                      <div className="mb-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <svg
                            className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                          <div className="text-sm text-blue-800">
                            <p className="font-semibold mb-2">
                              How to use Faker.js for mock data:
                            </p>
                            <p className="mb-2">
                              Create a JSON object where each value is a Faker
                              method. Common examples:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono bg-white p-2 rounded border">
                              <div>
                                <span className="text-gray-600">Name:</span>{" "}
                                "person.fullName"
                              </div>
                              <div>
                                <span className="text-gray-600">Email:</span>{" "}
                                "internet.email"
                              </div>
                              <div>
                                <span className="text-gray-600">Phone:</span>{" "}
                                "phone.number"
                              </div>
                              <div>
                                <span className="text-gray-600">Address:</span>{" "}
                                "location.streetAddress"
                              </div>
                              <div>
                                <span className="text-gray-600">Company:</span>{" "}
                                "company.name"
                              </div>
                              <div>
                                <span className="text-gray-600">Job:</span>{" "}
                                "person.jobTitle"
                              </div>
                              <div>
                                <span className="text-gray-600">ID:</span>{" "}
                                "number.int"
                              </div>
                              <div>
                                <span className="text-gray-600">Date:</span>{" "}
                                "date.recent"
                              </div>
                            </div>
                            <p className="mt-2 text-xs">
                              <a
                                href="https://fakerjs.dev/api/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline"
                              >
                                View full Faker.js documentation →
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mb-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              dataSchema:
                                '{\n  "name": "person.fullName",\n  "email": "internet.email",\n  "phone": "phone.number"\n}',
                            }))
                          }
                          className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border transition"
                        >
                          User Profile
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              dataSchema:
                                '{\n  "title": "lorem.sentence",\n  "content": "lorem.paragraph",\n  "author": "person.fullName"\n}',
                            }))
                          }
                          className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border transition"
                        >
                          Blog Post
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              dataSchema:
                                '{\n  "product": "commerce.productName",\n  "price": "commerce.price",\n  "category": "commerce.department"\n}',
                            }))
                          }
                          className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border transition"
                        >
                          Product
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              dataSchema:
                                '{\n  "id": "number.int",\n  "status": "helpers.arrayElement([\'active\', \'inactive\', \'pending\'])",\n  "createdAt": "date.recent"\n}',
                            }))
                          }
                          className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border transition"
                        >
                          API Response
                        </button>
                      </div>
                      <textarea
                        name="dataSchema"
                        value={formData.dataSchema}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition h-32 font-mono text-sm"
                        placeholder='{
  "name": "person.fullName",
  "email": "internet.email",
  "phone": "phone.number",
  "company": "company.name"
}'
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Latency (ms)
                          <span className="block text-xs text-gray-500 font-normal">
                            Delay before response (0-30000ms)
                          </span>
                        </label>
                        <input
                          type="number"
                          name="latency"
                          value={formData.latency}
                          onChange={handleChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                          min="0"
                          max="30000"
                          placeholder="1000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Error Rate (%)
                          <span className="block text-xs text-gray-500 font-normal">
                            Chance of returning error (0-100%)
                          </span>
                        </label>
                        <input
                          type="number"
                          name="errorRate"
                          value={formData.errorRate}
                          onChange={handleChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                          min="0"
                          max="100"
                          placeholder="5"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        applyStatusCodePreset({
                          "200": { weight: 100, message: "OK" },
                        })
                      }
                      className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border transition"
                    >
                      100% Success
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        applyStatusCodePreset({
                          "200": { weight: 85, message: "OK" },
                          "500": { weight: 15, message: "Server Error" },
                        })
                      }
                      className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border transition"
                    >
                      85% Success / 15% Error
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        applyStatusCodePreset({
                          "200": { weight: 70, message: "OK" },
                          "400": { weight: 20, message: "Bad Request" },
                          "500": { weight: 10, message: "Server Error" },
                        })
                      }
                      className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border transition"
                    >
                      Mixed Errors
                    </button>

                    <div className="mt-4 space-y-3">
                      <label className="block text-sm font-semibold text-gray-700">
                        HTTP Status Codes
                      </label>
                      <div className="flex gap-2 flex-wrap">
                        {Object.entries(formData.statusCodes).map(
                          ([code, { weight, message }]) => (
                            <div
                              key={code}
                              className="px-3 py-2 bg-blue-100 border border-blue-300 rounded-lg flex items-center gap-2"
                            >
                              <div className="flex flex-col">
                                <span className="font-mono text-sm">
                                  {code}:{" "}
                                  <span className="font-semibold">
                                    {weight}%
                                  </span>
                                </span>
                                <span className="text-xs text-gray-700">
                                  {message}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveStatusCode(code)}
                                className="text-red-600 hover:text-red-800 font-bold"
                              >
                                ×
                              </button>
                            </div>
                          ),
                        )}
                      </div>

                      <div className="grid grid-cols-4 gap-2">
                        <select
                          value={statusCodeInput.code}
                          onChange={(e) =>
                            setStatusCodeInput({
                              ...statusCodeInput,
                              code: e.target.value,
                            })
                          }
                          className="p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="200">200 OK</option>
                          <option value="201">201 Created</option>
                          <option value="202">202 Accepted</option>
                          <option value="204">204 No Content</option>
                          <option value="301">301 Moved Permanently</option>
                          <option value="302">302 Found</option>
                          <option value="304">304 Not Modified</option>
                          <option value="400">400 Bad Request</option>
                          <option value="401">401 Unauthorized</option>
                          <option value="403">403 Forbidden</option>
                          <option value="404">404 Not Found</option>
                          <option value="409">409 Conflict</option>
                          <option value="422">422 Unprocessable Entity</option>
                          <option value="429">429 Too Many Requests</option>
                          <option value="500">500 Internal Server Error</option>
                          <option value="502">502 Bad Gateway</option>
                          <option value="503">503 Service Unavailable</option>
                          <option value="504">504 Gateway Timeout</option>
                        </select>
                        <input
                          type="number"
                          value={statusCodeInput.weight}
                          onChange={(e) =>
                            setStatusCodeInput({
                              ...statusCodeInput,
                              weight: e.target.value,
                            })
                          }
                          className="p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                          placeholder="Weight %"
                          min="0"
                          max="100"
                        />
                        <input
                          type="text"
                          value={statusCodeInput.message}
                          onChange={(e) =>
                            setStatusCodeInput({
                              ...statusCodeInput,
                              message: e.target.value,
                            })
                          }
                          className="p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                          placeholder="Custom message"
                        />
                        <button
                          type="button"
                          onClick={handleAddStatusCode}
                          className="bg-green-600 text-white rounded-lg hover:bg-green-700 transition active:scale-95 text-sm font-semibold"
                        >
                          Add
                        </button>
                      </div>
                      <p className="text-xs text-gray-500">
                        Total weight:{" "}
                        {Object.values(formData.statusCodes).reduce(
                          (a, b) => a + b.weight,
                          0,
                        )}
                        % (must be 100%)
                      </p>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition active:scale-95 mt-6"
                    >
                      Create Rule
                    </button>
                  </form>
                </div>

                {/* Generate URL and Test Card */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6 min-w-0">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">
                    Test API
                  </h2>
                  <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <svg
                        className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      <div className="text-sm text-purple-800">
                        <p className="font-semibold mb-1">
                          How to Test Your API
                        </p>
                        <p>
                          1. Select a rule from the dropdown. 2. Generate a
                          unique URL. 3. Test the URL to see mock data with
                          latency and error simulation.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Select Rule
                    </label>
                    <select
                      value={selectedRuleId}
                      onChange={(e) => setSelectedRuleId(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                    >
                      <option value="">Choose a rule</option>
                      {rules.map((rule) => (
                        <option key={rule.id} value={rule.id}>
                          {rule.endpoint} (Latency: {rule.latency}ms, Error:{" "}
                          {rule.errorRate}%)
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleGenerateUrl}
                    className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 mb-6"
                    disabled={!selectedRuleId}
                  >
                    Generate URL
                  </button>

                  {generatedUrl && (
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-100 rounded-lg border border-gray-300 overflow-x-auto">
                        <p className="text-xs text-gray-600 mb-2 font-semibold">
                          Generated URL:
                        </p>
                        <code className="text-sm break-words whitespace-pre-wrap font-mono text-gray-800 block w-full">
                          {generatedUrl}
                        </code>
                      </div>

                      <button
                        onClick={handleTestUrl}
                        disabled={testLoading}
                        className="w-full bg-purple-600 text-white font-semibold py-3 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                      >
                        {testLoading ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg
                              className="animate-spin h-5 w-5"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Testing...
                          </span>
                        ) : (
                          "Test URL"
                        )}
                      </button>

                      {/* Response Display */}
                      {testResponse.data && (
                        <div className="p-4 bg-green-50 border border-green-300 rounded-lg animate-fadeIn">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="text-sm font-semibold text-green-700">
                                ✓ Success Response
                              </p>
                              {testResponse.message && (
                                <p className="text-xs text-green-600 mt-1">
                                  {testResponse.message}
                                </p>
                              )}
                            </div>
                            {testResponse.statusCode && (
                              <span className="px-3 py-1 bg-green-200 text-green-800 text-sm font-bold rounded">
                                {testResponse.statusCode}
                              </span>
                            )}
                          </div>
                          <pre className="bg-white p-4 rounded overflow-auto max-h-64 text-xs font-mono text-gray-800 border border-green-200">
                            {JSON.stringify(testResponse.data, null, 2)}
                          </pre>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(
                                JSON.stringify(testResponse.data, null, 2),
                              );
                            }}
                            className="mt-2 text-sm text-green-600 hover:text-green-700 font-semibold"
                          >
                            Copy Response
                          </button>
                        </div>
                      )}

                      {testResponse.error && (
                        <div className="p-4 bg-red-50 border border-red-300 rounded-lg animate-fadeIn">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-semibold text-red-700">
                              ✗ Error Response
                            </p>
                            {testResponse.statusCode && (
                              <span className="px-3 py-1 bg-red-200 text-red-800 text-sm font-bold rounded">
                                {testResponse.statusCode}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-red-600 font-mono bg-white p-3 rounded border border-red-200">
                            {testResponse.error}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Rules and URLs Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Rules List */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold mb-4 text-gray-800">
                    Your Rules
                  </h3>
                  {rules.length > 0 ? (
                    <ul className="space-y-3">
                      {rules.map((rule) => (
                        <li
                          key={rule.id}
                          className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-500 hover:shadow-md transition hover:scale-105 transform"
                        >
                          <p className="font-semibold text-gray-800">
                            {rule.endpoint}
                          </p>
                          <p className="text-xs text-gray-600 mt-2">
                            <span className="inline-block mr-4">
                              Latency:{" "}
                              <span className="font-mono text-blue-600">
                                {rule.latency}ms
                              </span>
                            </span>
                            <span className="inline-block">
                              Error:{" "}
                              <span className="font-mono text-red-600">
                                {rule.errorRate}%
                              </span>
                            </span>
                          </p>
                          {rule.statusCodes && (
                            <div className="text-xs text-gray-600 mt-2 flex flex-wrap gap-1">
                              {Object.entries(rule.statusCodes).map(
                                ([code, { weight, message }]) => (
                                  <span
                                    key={code}
                                    className="bg-gray-200 px-2 py-1 rounded font-mono"
                                  >
                                    {code}: {weight}% ({message})
                                  </span>
                                ),
                              )}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      No rules created yet
                    </p>
                  )}
                </div>

                {/* Generated URLs List */}
                <div className="bg-white rounded-lg shadow-md p-6 min-w-0 overflow-hidden">
                  <h3 className="text-xl font-bold mb-4 text-gray-800">
                    Your URLs
                  </h3>
                  {urls.length > 0 ? (
                    <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
                      {urls.map((url) => (
                        <li
                          key={url.id ?? url.url}
                          className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-l-4 border-green-500 hover:shadow-md transition group min-w-0"
                        >
                          <p className="text-xs break-words font-mono text-gray-700 mb-2 max-w-full">
                            {url.url}
                          </p>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(url.url);
                            }}
                            className="text-xs text-green-600 hover:text-green-700 font-semibold opacity-0 group-hover:opacity-100 transition"
                          >
                            Copy URL
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      No URLs generated yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-700 mb-4">
                Please log in to access the dashboard.
              </p>
              <a
                href="/login"
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                Go to Login
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

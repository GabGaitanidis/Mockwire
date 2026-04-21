import type { FC } from "react";
import type { Rule, TestResponse } from "../types";

type TestApiCardProps = {
  rules: Rule[];
  selectedRuleId: string;
  generatedUrl: string;
  testResponse: TestResponse;
  testLoading: boolean;
  onSelectRule: (value: string) => void;
  onGenerateUrl: () => Promise<void> | void;
  onTestUrl: () => Promise<void> | void;
};

const TestApiCard: FC<TestApiCardProps> = ({
  rules,
  selectedRuleId,
  generatedUrl,
  testResponse,
  testLoading,
  onSelectRule,
  onGenerateUrl,
  onTestUrl,
}) => {
  return (
    <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6 min-w-0">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Test API</h2>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Select Rule
        </label>
        <select
          value={selectedRuleId}
          onChange={(e) => onSelectRule(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        >
          <option value="">Choose a rule</option>
          {rules.map((rule) => (
            <option key={rule.id} value={rule.id}>
              {rule.endpoint} (Latency: {rule.latency}ms)
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={onGenerateUrl}
        className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50 mb-6"
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
            onClick={onTestUrl}
            disabled={testLoading}
            className="w-full bg-purple-600 text-white font-semibold py-3 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
          >
            {testLoading ? "Testing..." : "Test URL"}
          </button>

          {testResponse.data && (
            <div className="p-4 bg-green-50 border border-green-300 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-green-700">
                    Success Response
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
            </div>
          )}

          {testResponse.error && (
            <div className="p-4 bg-red-50 border border-red-300 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-red-700">
                  Error Response
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
  );
};

export default TestApiCard;

import type { FC } from "react";
import type { Rule, TestResponse } from "../types";

type TestApiCardProps = {
  rules: Rule[];
  selectedRuleId: string;
  generatedUrl: string;
  testResponse: TestResponse;
  testLoading: boolean;
  feedback: { type: "success" | "error"; text: string } | null;
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
  feedback,
  onSelectRule,
  onGenerateUrl,
  onTestUrl,
}) => {
  const codeLines = testResponse.data
    ? JSON.stringify(testResponse.data, null, 2).split("\n")
    : [];

  return (
    <div className="lg:col-span-2 bg-[#161b22] border border-[#30363d] rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.4)] p-6 min-w-0">
      <h2 className="text-2xl font-bold mb-4 text-[#e6edf3]">Test API</h2>

      {feedback && (
        <div className="mb-4 rounded-md border border-[#30363d] border-l-4 border-l-[#58a6ff] bg-[#1e2128] p-3 text-sm text-[#8b949e]">
          {feedback.text}
        </div>
      )}

      <div className="mb-6">
        <label className="block text-sm font-semibold text-[#8b949e] mb-2">
          Select Rule
        </label>
        <select
          value={selectedRuleId}
          onChange={(e) => onSelectRule(e.target.value)}
          className="w-full p-3 bg-[#0d1117] border border-[#30363d] rounded-md text-[#e6edf3] focus:outline-none focus:border-[#58a6ff]"
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
        className="w-full bg-[#58a6ff] text-[#0d1117] font-semibold py-3 rounded-md hover:bg-[#79c0ff] transition disabled:opacity-50 mb-6"
        disabled={!selectedRuleId}
      >
        Generate URL
      </button>

      {generatedUrl && (
        <div className="space-y-4">
          <div className="p-4 bg-[#0d1117] rounded-md border border-[#30363d] overflow-x-auto">
            <p className="text-xs text-[#8b949e] mb-2 font-semibold">
              Generated URL:
            </p>
            <code className="text-sm break-words whitespace-pre-wrap font-mono text-[#e6edf3] block w-full">
              {generatedUrl}
            </code>
          </div>

          <button
            onClick={onTestUrl}
            disabled={testLoading}
            className="w-full bg-[#58a6ff] text-[#0d1117] font-semibold py-3 rounded-md hover:bg-[#79c0ff] transition disabled:opacity-50"
          >
            {testLoading ? "Testing..." : "Test URL"}
          </button>

          {testResponse.data && (
            <div className="p-4 bg-[#1e2128] border border-[#30363d] rounded-md">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-[#e6edf3]">
                    Success Response
                  </p>
                  {testResponse.message && (
                    <p className="text-xs text-[#8b949e] mt-1">
                      {testResponse.message}
                    </p>
                  )}
                </div>
                {testResponse.statusCode && (
                  <span className="px-3 py-1 bg-[#0d1117] border border-[#30363d] text-[#58a6ff] text-sm font-bold rounded-md">
                    {testResponse.statusCode}
                  </span>
                )}
              </div>

              <div className="rounded-md border border-[#30363d] bg-[#0d1117] overflow-hidden">
                <div className="border-b border-[#30363d] px-3 py-2 text-xs text-[#8b949e] font-mono">
                  response.json
                </div>
                <div className="overflow-auto max-h-72 font-mono text-xs">
                  {codeLines.map((line, index) => (
                    <div
                      key={`${index}-${line}`}
                      className="grid grid-cols-[40px,1fr]"
                    >
                      <span className="px-2 py-1 text-right text-[#8b949e] border-r border-[#30363d] select-none">
                        {index + 1}
                      </span>
                      <span className="px-3 py-1 text-[#e6edf3] whitespace-pre">
                        {line || " "}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {testResponse.error && (
            <div className="p-4 bg-[#1e2128] border border-[#30363d] border-l-4 border-l-[#58a6ff] rounded-md">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-[#e6edf3]">
                  Error Response
                </p>
                {testResponse.statusCode && (
                  <span className="px-3 py-1 bg-[#0d1117] border border-[#30363d] text-[#58a6ff] text-sm font-bold rounded-md">
                    {testResponse.statusCode}
                  </span>
                )}
              </div>
              <p className="text-sm text-[#8b949e] font-mono bg-[#0d1117] p-3 rounded-md border border-[#30363d]">
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

import { useState } from "react";
import type { ChangeEvent, FC, FormEvent } from "react";
import type {
  FieldTypeOption,
  RuleFormData,
  SchemaEntry,
  StatusCodeInput,
  StatusCodesMap,
} from "../types";

type RuleBuilderCardProps = {
  formData: RuleFormData;
  statusCodeInput: StatusCodeInput;
  fieldNameInput: string;
  fieldTypeInput: string;
  fieldTypeOptions: FieldTypeOption[];
  schemaEntries: SchemaEntry[];
  feedback: { type: "success" | "error"; text: string } | null;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSetFieldNameInput: (value: string) => void;
  onSetFieldTypeInput: (value: string) => void;
  onSetStatusCodeInput: (value: StatusCodeInput) => void;
  onAddSchemaField: () => void;
  onRemoveSchemaField: (fieldName: string) => void;
  onApplySchemaTemplate: (template: Record<string, string>) => void;
  onAddStatusCode: () => void;
  onRemoveStatusCode: (code: string) => void;
  onApplyStatusCodePreset: (preset: StatusCodesMap) => void;
  onSubmitRule: (e: FormEvent<HTMLFormElement>) => Promise<void> | void;
};

const RuleBuilderCard: FC<RuleBuilderCardProps> = ({
  formData,
  statusCodeInput,
  fieldNameInput,
  fieldTypeInput,
  fieldTypeOptions,
  schemaEntries,
  feedback,
  onChange,
  onSetFieldNameInput,
  onSetFieldTypeInput,
  onSetStatusCodeInput,
  onAddSchemaField,
  onRemoveSchemaField,
  onApplySchemaTemplate,
  onAddStatusCode,
  onRemoveStatusCode,
  onApplyStatusCodePreset,
  onSubmitRule,
}) => {
  const [activeTemplate, setActiveTemplate] = useState<"user" | "blog" | null>(
    null,
  );

  return (
    <div className="lg:col-span-1 bg-[#161b22] border border-[#30363d] rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.4)] p-6 min-w-0">
      <h2 className="text-2xl font-bold mb-4 text-[#e6edf3]">Create Rule</h2>

      {feedback && (
        <div className="mb-4 rounded-md border border-[#30363d] border-l-4 border-l-[#58a6ff] bg-[#1e2128] p-3 text-sm text-[#8b949e]">
          {feedback.text}
        </div>
      )}

      <form onSubmit={onSubmitRule} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-[#8b949e] mb-2">
            Endpoint
          </label>
          <input
            type="text"
            name="endpoint"
            value={formData.endpoint}
            onChange={onChange}
            className="w-full p-3 bg-[#0d1117] border border-[#30363d] rounded-md text-[#e6edf3] focus:outline-none focus:border-[#58a6ff] transition"
            placeholder="/api/users"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#8b949e] mb-2">
            Data Fields
          </label>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
            <input
              type="text"
              value={fieldNameInput}
              onChange={(e) => onSetFieldNameInput(e.target.value)}
              className="p-2 bg-[#0d1117] border border-[#30363d] rounded-md text-sm text-[#e6edf3] focus:outline-none focus:border-[#58a6ff]"
              placeholder="Field name"
            />
            <select
              value={fieldTypeInput}
              onChange={(e) => onSetFieldTypeInput(e.target.value)}
              className="p-2 bg-[#0d1117] border border-[#30363d] rounded-md text-sm text-[#e6edf3] focus:outline-none focus:border-[#58a6ff]"
            >
              {fieldTypeOptions.map((option) => (
                <option key={option.fakerPath} value={option.fakerPath}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={onAddSchemaField}
              className="bg-[#58a6ff] text-[#0d1117] rounded-md hover:bg-[#79c0ff] transition text-sm font-semibold"
            >
              Add field
            </button>
          </div>

          {schemaEntries.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {schemaEntries.map((entry) => (
                <div
                  key={entry.fieldName}
                  className="px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-md flex items-center gap-2"
                >
                  <span className="text-xs text-[#e6edf3]">
                    <span className="font-semibold">{entry.fieldName}</span> •{" "}
                    {entry.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemoveSchemaField(entry.fieldName)}
                    className="text-[#8b949e] hover:text-[#e6edf3] font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mb-3 inline-flex rounded-md border border-[#30363d] bg-[#0d1117] overflow-hidden">
            <button
              type="button"
              onClick={() => {
                setActiveTemplate("user");
                onApplySchemaTemplate({
                  name: "person.fullName",
                  email: "internet.email",
                  phone: "phone.number",
                });
              }}
              className={`px-3 py-2 text-xs border-r border-[#30363d] transition ${
                activeTemplate === "user"
                  ? "bg-[#161b22] text-[#e6edf3]"
                  : "bg-[#0d1117] text-[#8b949e] hover:text-[#e6edf3]"
              }`}
            >
              User Profile
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTemplate("blog");
                onApplySchemaTemplate({
                  title: "lorem.sentence",
                  content: "lorem.paragraph",
                  author: "person.fullName",
                });
              }}
              className={`px-3 py-2 text-xs transition ${
                activeTemplate === "blog"
                  ? "bg-[#161b22] text-[#e6edf3]"
                  : "bg-[#0d1117] text-[#8b949e] hover:text-[#e6edf3]"
              }`}
            >
              Blog Post
            </button>
          </div>

          <textarea
            name="dataSchema"
            value={formData.dataSchema}
            onChange={onChange}
            className="w-full p-3 bg-[#0d1117] border border-[#30363d] rounded-md focus:outline-none focus:border-[#58a6ff] transition h-32 font-mono text-sm text-[#e6edf3]"
            placeholder='{"name":"person.fullName"}'
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#8b949e] mb-2">
            Latency (ms)
          </label>
          <input
            type="number"
            name="latency"
            value={formData.latency}
            onChange={onChange}
            className="w-full p-3 bg-[#0d1117] border border-[#30363d] rounded-md focus:outline-none focus:border-[#58a6ff] text-[#e6edf3]"
            min="0"
            max="30000"
          />
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                onApplyStatusCodePreset({
                  "200": { weight: 100, message: "OK" },
                })
              }
              className="px-3 py-1 text-xs bg-[#0d1117] hover:bg-[#1e2128] text-[#8b949e] rounded-md border border-[#30363d] transition"
            >
              100% Success
            </button>
            <button
              type="button"
              onClick={() =>
                onApplyStatusCodePreset({
                  "200": { weight: 85, message: "OK" },
                  "500": { weight: 15, message: "Server Error" },
                })
              }
              className="px-3 py-1 text-xs bg-[#0d1117] hover:bg-[#1e2128] text-[#8b949e] rounded-md border border-[#30363d] transition"
            >
              85/15
            </button>
          </div>

          <div className="flex gap-2 flex-wrap">
            {Object.entries(formData.statusCodes).map(
              ([code, { weight, message }]) => (
                <div
                  key={code}
                  className="px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-md flex items-center gap-2"
                >
                  <span className="text-xs font-mono text-[#e6edf3]">
                    {code}: {weight}% ({message})
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemoveStatusCode(code)}
                    className="text-[#8b949e] hover:text-[#e6edf3] font-bold"
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
                onSetStatusCodeInput({
                  ...statusCodeInput,
                  code: e.target.value,
                })
              }
              className="p-2 bg-[#0d1117] border border-[#30363d] rounded-md text-sm text-[#e6edf3]"
            >
              <option value="200">200 OK</option>
              <option value="400">400 Bad Request</option>
              <option value="401">401 Unauthorized</option>
              <option value="404">404 Not Found</option>
              <option value="500">500 Internal Server Error</option>
            </select>
            <input
              type="number"
              value={statusCodeInput.weight}
              onChange={(e) =>
                onSetStatusCodeInput({
                  ...statusCodeInput,
                  weight: e.target.value,
                })
              }
              className="p-2 bg-[#0d1117] border border-[#30363d] rounded-md text-sm text-[#e6edf3]"
              placeholder="Weight"
              min="0"
              max="100"
            />
            <input
              type="text"
              value={statusCodeInput.message}
              onChange={(e) =>
                onSetStatusCodeInput({
                  ...statusCodeInput,
                  message: e.target.value,
                })
              }
              className="p-2 bg-[#0d1117] border border-[#30363d] rounded-md text-sm text-[#e6edf3]"
              placeholder="Message"
            />
            <button
              type="button"
              onClick={onAddStatusCode}
              className="bg-[#58a6ff] text-[#0d1117] rounded-md hover:bg-[#79c0ff] transition text-sm font-semibold"
            >
              Add
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#58a6ff] text-[#0d1117] font-semibold py-3 rounded-md hover:bg-[#79c0ff] transition"
        >
          Create Rule
        </button>
      </form>
    </div>
  );
};

export default RuleBuilderCard;

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
  return (
    <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6 min-w-0">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Create Rule</h2>

      <form onSubmit={onSubmitRule} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Endpoint
          </label>
          <input
            type="text"
            name="endpoint"
            value={formData.endpoint}
            onChange={onChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            placeholder="/api/users"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Data Fields
          </label>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
            <input
              type="text"
              value={fieldNameInput}
              onChange={(e) => onSetFieldNameInput(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="Field name"
            />
            <select
              value={fieldTypeInput}
              onChange={(e) => onSetFieldTypeInput(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
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
              className="bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
            >
              Add field
            </button>
          </div>

          {schemaEntries.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {schemaEntries.map((entry) => (
                <div
                  key={entry.fieldName}
                  className="px-3 py-2 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center gap-2"
                >
                  <span className="text-xs text-gray-700">
                    <span className="font-semibold">{entry.fieldName}</span> •{" "}
                    {entry.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemoveSchemaField(entry.fieldName)}
                    className="text-red-600 hover:text-red-800 font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mb-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                onApplySchemaTemplate({
                  name: "person.fullName",
                  email: "internet.email",
                  phone: "phone.number",
                })
              }
              className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border transition"
            >
              User Profile
            </button>
            <button
              type="button"
              onClick={() =>
                onApplySchemaTemplate({
                  title: "lorem.sentence",
                  content: "lorem.paragraph",
                  author: "person.fullName",
                })
              }
              className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border transition"
            >
              Blog Post
            </button>
          </div>

          <textarea
            name="dataSchema"
            value={formData.dataSchema}
            onChange={onChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition h-32 font-mono text-sm"
            placeholder='{"name":"person.fullName"}'
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Latency (ms)
          </label>
          <input
            type="number"
            name="latency"
            value={formData.latency}
            onChange={onChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
              className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border transition"
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
              className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border transition"
            >
              85/15
            </button>
          </div>

          <div className="flex gap-2 flex-wrap">
            {Object.entries(formData.statusCodes).map(
              ([code, { weight, message }]) => (
                <div
                  key={code}
                  className="px-3 py-2 bg-blue-100 border border-blue-300 rounded-lg flex items-center gap-2"
                >
                  <span className="text-xs font-mono">
                    {code}: {weight}% ({message})
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemoveStatusCode(code)}
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
                onSetStatusCodeInput({
                  ...statusCodeInput,
                  code: e.target.value,
                })
              }
              className="p-2 border border-gray-300 rounded-lg text-sm"
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
              className="p-2 border border-gray-300 rounded-lg text-sm"
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
              className="p-2 border border-gray-300 rounded-lg text-sm"
              placeholder="Message"
            />
            <button
              type="button"
              onClick={onAddStatusCode}
              className="bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-semibold"
            >
              Add
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Create Rule
        </button>
      </form>
    </div>
  );
};

export default RuleBuilderCard;

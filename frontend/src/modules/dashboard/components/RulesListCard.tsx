import { useState } from "react";
import type { FC, FormEvent } from "react";
import type { Rule, RuleFormData } from "../types";

type RulesListCardProps = {
  rules: Rule[];
  editingRuleId: number | null;
  feedback: { type: "success" | "error"; text: string } | null;
  onSetEditingRuleId: (id: number | null) => void;
  onDeleteRule: (ruleId: number) => Promise<void>;
  onUpdateRule: (
    ruleId: number,
    version: string,
    payload: Partial<RuleFormData>,
  ) => Promise<void>;
};

type EditRuleDraft = {
  id: number;
  version: string;
  endpoint: string;
  latency: string;
  dataSchema: string;
  statusCodes: string;
};

const RulesListCard: FC<RulesListCardProps> = ({
  rules,
  editingRuleId,
  feedback,
  onSetEditingRuleId,
  onDeleteRule,
  onUpdateRule,
}) => {
  const [editDraft, setEditDraft] = useState<EditRuleDraft | null>(null);
  const [editFormError, setEditFormError] = useState("");

  function openEditModal(rule: Rule) {
    setEditFormError("");
    setEditDraft({
      id: rule.id,
      version: rule.version ?? "v1",
      endpoint: rule.endpoint,
      latency: String(rule.latency ?? 0),
      dataSchema: JSON.stringify(rule.dataSchema ?? {}, null, 2),
      statusCodes: JSON.stringify(
        rule.statusCodes ?? { "200": { weight: 100, message: "OK" } },
        null,
        2,
      ),
    });
  }

  async function handleSubmitEdit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!editDraft) {
      return;
    }

    const latency = Number(editDraft.latency);
    if (Number.isNaN(latency) || latency < 0) {
      setEditFormError("Latency must be a non-negative number");
      return;
    }

    let parsedDataSchema: unknown;
    let parsedStatusCodes: unknown;

    try {
      parsedDataSchema = JSON.parse(editDraft.dataSchema);
    } catch {
      setEditFormError("Data schema must be valid JSON");
      return;
    }

    if (
      !parsedDataSchema ||
      typeof parsedDataSchema !== "object" ||
      Array.isArray(parsedDataSchema)
    ) {
      setEditFormError("Data schema must be a JSON object");
      return;
    }

    try {
      parsedStatusCodes = JSON.parse(editDraft.statusCodes);
    } catch {
      setEditFormError("Status codes must be valid JSON");
      return;
    }

    if (
      !parsedStatusCodes ||
      typeof parsedStatusCodes !== "object" ||
      Array.isArray(parsedStatusCodes)
    ) {
      setEditFormError("Status codes must be a JSON object");
      return;
    }

    const statusEntries = Object.entries(
      parsedStatusCodes as Record<string, any>,
    );

    if (statusEntries.length === 0) {
      setEditFormError("Status codes must include at least one status code");
      return;
    }

    let totalWeight = 0;

    for (const [code, value] of statusEntries) {
      if (!/^\d{3}$/.test(code)) {
        setEditFormError("Status code keys must be 3-digit codes (e.g. 200)");
        return;
      }

      if (
        !value ||
        typeof value !== "object" ||
        typeof value.weight !== "number" ||
        typeof value.message !== "string"
      ) {
        setEditFormError(
          "Each status code must include numeric weight and string message",
        );
        return;
      }

      if (value.weight <= 0 || value.weight > 100) {
        setEditFormError("Each status code weight must be between 1 and 100");
        return;
      }

      totalWeight += value.weight;
    }

    if (totalWeight !== 100) {
      setEditFormError("Status code weights must total 100%");
      return;
    }

    setEditFormError("");
    onSetEditingRuleId(editDraft.id);

    await onUpdateRule(editDraft.id, editDraft.version, {
      endpoint: editDraft.endpoint.trim(),
      latency,
      dataSchema: JSON.stringify(parsedDataSchema),
      statusCodes: parsedStatusCodes as RuleFormData["statusCodes"],
    });

    onSetEditingRuleId(null);
    setEditDraft(null);
  }

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.4)] p-6">
      <h3 className="text-xl font-bold mb-4 text-[#e6edf3]">Your Rules</h3>
      {feedback && (
        <div className="mb-4 rounded-md border border-[#30363d] border-l-4 border-l-[#58a6ff] bg-[#1e2128] p-3 text-sm text-[#8b949e]">
          {feedback.text}
        </div>
      )}
      {rules.length > 0 ? (
        <ul className="space-y-3">
          {rules.map((rule) => (
            <li
              key={rule.id}
              className="p-4 bg-[#0d1117] rounded-md border border-[#30363d]"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold text-[#e6edf3] break-words">
                  {rule.endpoint}
                </p>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openEditModal(rule)}
                    disabled={editingRuleId === rule.id}
                    className="text-xs px-2 py-1 rounded-md border border-[#30363d] bg-[#1e2128] text-[#8b949e] hover:text-[#e6edf3] hover:border-[#58a6ff] disabled:opacity-50"
                  >
                    {editingRuleId === rule.id ? "Updating..." : "Edit"}
                  </button>
                  <button
                    onClick={async () => {
                      const ok = window.confirm(
                        "Delete this rule and related URLs?",
                      );
                      if (!ok) return;
                      await onDeleteRule(rule.id);
                    }}
                    className="text-xs px-2 py-1 rounded-md border border-[#30363d] bg-[#1e2128] text-[#8b949e] hover:text-[#e6edf3] hover:border-[#58a6ff]"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <p className="text-xs text-[#8b949e] mt-2">
                <span className="inline-block mr-4">
                  Version:{" "}
                  <span className="font-mono text-[#58a6ff]">
                    {rule.version ?? "v1"}
                  </span>
                </span>
                <span className="inline-block mr-4">
                  Latency:{" "}
                  <span className="font-mono text-[#58a6ff]">
                    {rule.latency}ms
                  </span>
                </span>
              </p>

              {rule.statusCodes && (
                <div className="text-xs text-[#8b949e] mt-2 flex flex-wrap gap-1">
                  {Object.entries(rule.statusCodes).map(
                    ([code, { weight, message }]) => (
                      <span
                        key={code}
                        className="bg-[#1e2128] border border-[#30363d] px-2 py-1 rounded-md font-mono text-[#e6edf3]"
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
        <p className="text-[#8b949e] text-center py-8">No rules created yet</p>
      )}

      {editDraft && (
        <div className="fixed inset-0 z-50 bg-black/65 p-4 flex items-center justify-center">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-md border border-[#30363d] bg-[#161b22] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h4 className="text-lg font-semibold text-[#e6edf3]">
                Edit Rule
              </h4>
              <span className="text-xs font-mono rounded-md border border-[#30363d] bg-[#0d1117] px-2 py-1 text-[#58a6ff]">
                {editDraft.version}
              </span>
            </div>

            {editFormError && (
              <div className="mb-4 rounded-md border border-[#30363d] border-l-4 border-l-[#58a6ff] bg-[#1e2128] p-3 text-sm text-[#8b949e]">
                {editFormError}
              </div>
            )}

            <form onSubmit={handleSubmitEdit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#8b949e]">
                  Endpoint
                </label>
                <input
                  type="text"
                  value={editDraft.endpoint}
                  onChange={(e) =>
                    setEditDraft((prev) =>
                      prev ? { ...prev, endpoint: e.target.value } : prev,
                    )
                  }
                  className="w-full rounded-md border border-[#30363d] bg-[#0d1117] p-3 text-[#e6edf3] focus:border-[#58a6ff] focus:outline-none"
                  placeholder="/api/users"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#8b949e]">
                  Latency (ms)
                </label>
                <input
                  type="number"
                  value={editDraft.latency}
                  onChange={(e) =>
                    setEditDraft((prev) =>
                      prev ? { ...prev, latency: e.target.value } : prev,
                    )
                  }
                  className="w-full rounded-md border border-[#30363d] bg-[#0d1117] p-3 text-[#e6edf3] focus:border-[#58a6ff] focus:outline-none"
                  min="0"
                  max="30000"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#8b949e]">
                  Data Schema (JSON)
                </label>
                <textarea
                  value={editDraft.dataSchema}
                  onChange={(e) =>
                    setEditDraft((prev) =>
                      prev ? { ...prev, dataSchema: e.target.value } : prev,
                    )
                  }
                  className="h-40 w-full rounded-md border border-[#30363d] bg-[#0d1117] p-3 font-mono text-sm text-[#e6edf3] focus:border-[#58a6ff] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#8b949e]">
                  Status Codes (JSON)
                </label>
                <textarea
                  value={editDraft.statusCodes}
                  onChange={(e) =>
                    setEditDraft((prev) =>
                      prev ? { ...prev, statusCodes: e.target.value } : prev,
                    )
                  }
                  className="h-40 w-full rounded-md border border-[#30363d] bg-[#0d1117] p-3 font-mono text-sm text-[#e6edf3] focus:border-[#58a6ff] focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onSetEditingRuleId(null);
                    setEditFormError("");
                    setEditDraft(null);
                  }}
                  className="rounded-md border border-[#30363d] bg-[#1e2128] px-4 py-2 text-sm text-[#8b949e] transition hover:border-[#58a6ff] hover:text-[#e6edf3]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editingRuleId === editDraft.id}
                  className="rounded-md bg-[#58a6ff] px-4 py-2 text-sm font-semibold text-[#0d1117] transition hover:bg-[#79c0ff] disabled:opacity-50"
                >
                  {editingRuleId === editDraft.id ? "Saving..." : "Save Rule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RulesListCard;

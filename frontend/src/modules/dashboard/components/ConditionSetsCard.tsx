import { useMemo, useState } from "react";
import type { FC, FormEvent } from "react";
import type {
  ConditionSet,
  CreateConditionSetRequest,
  UpdateConditionSetRequest,
} from "../types";

type SectionFeedback = { type: "success" | "error"; text: string } | null;

type ConditionSetsCardProps = {
  activeProjectId: number | null;
  conditionSets: ConditionSet[];
  feedback: SectionFeedback;
  onCreateConditionSet: (
    payload: CreateConditionSetRequest,
  ) => Promise<void> | void;
  onUpdateConditionSet: (
    conditionSetId: number,
    payload: UpdateConditionSetRequest,
  ) => Promise<void> | void;
  onDeleteConditionSet: (conditionSetId: number) => Promise<void> | void;
};

type ConditionSetDraft = {
  name: string;
  description: string;
  conditionsJson: string;
};

const DEFAULT_CONDITIONS_JSON = `[
  {
    "if": {
      "age": ">= 18"
    },
    "then": {
      "status": "adult"
    }
  }
]`;

function parseDraftConditions(value: string) {
  const parsed = JSON.parse(value) as unknown;

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("Conditions must be a non-empty JSON array");
  }

  for (const condition of parsed) {
    if (!condition || typeof condition !== "object") {
      throw new Error("Each condition must be an object");
    }

    const record = condition as Record<string, unknown>;

    if (
      !record.if ||
      typeof record.if !== "object" ||
      Array.isArray(record.if)
    ) {
      throw new Error("Each condition must include an 'if' object");
    }

    if (
      !record.then ||
      typeof record.then !== "object" ||
      Array.isArray(record.then)
    ) {
      throw new Error("Each condition must include a 'then' object");
    }
  }

  return parsed as CreateConditionSetRequest["conditions"];
}

function formatAppliedChanges(thenValue: Record<string, unknown>) {
  const entries = Object.entries(thenValue);

  if (entries.length === 0) {
    return "No applied changes";
  }

  return entries
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
    .join("\n");
}

function getConditionPreview(
  conditions: CreateConditionSetRequest["conditions"],
) {
  return conditions.map((condition, index) => ({
    index,
    appliedChanges: formatAppliedChanges(condition.then),
  }));
}

const ConditionSetsCard: FC<ConditionSetsCardProps> = ({
  activeProjectId,
  conditionSets,
  feedback,
  onCreateConditionSet,
  onUpdateConditionSet,
  onDeleteConditionSet,
}) => {
  const [draft, setDraft] = useState<ConditionSetDraft>({
    name: "",
    description: "",
    conditionsJson: DEFAULT_CONDITIONS_JSON,
  });
  const [draftError, setDraftError] = useState("");
  const [editingSet, setEditingSet] = useState<ConditionSet | null>(null);
  const [editingError, setEditingError] = useState("");
  const [editingDraft, setEditingDraft] = useState<ConditionSetDraft | null>(
    null,
  );

  const draftPreview = useMemo(() => {
    try {
      return getConditionPreview(parseDraftConditions(draft.conditionsJson));
    } catch {
      return [];
    }
  }, [draft.conditionsJson]);

  const editingPreview = useMemo(() => {
    if (!editingDraft) {
      return [];
    }

    try {
      return getConditionPreview(
        parseDraftConditions(editingDraft.conditionsJson),
      );
    } catch {
      return [];
    }
  }, [editingDraft]);

  const activeProjectLabel = useMemo(
    () =>
      activeProjectId ? `Project #${activeProjectId}` : "No project selected",
    [activeProjectId],
  );

  function resetCreateDraft() {
    setDraft({
      name: "",
      description: "",
      conditionsJson: DEFAULT_CONDITIONS_JSON,
    });
    setDraftError("");
  }

  function openEditModal(conditionSet: ConditionSet) {
    setEditingSet(conditionSet);
    setEditingError("");
    setEditingDraft({
      name: conditionSet.name,
      description: conditionSet.description ?? "",
      conditionsJson: JSON.stringify(conditionSet.conditions ?? [], null, 2),
    });
  }

  function closeEditModal() {
    setEditingSet(null);
    setEditingError("");
    setEditingDraft(null);
  }

  async function handleCreateSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!activeProjectId) {
      setDraftError("Select a project first");
      return;
    }

    const name = draft.name.trim();
    if (!name) {
      setDraftError("Name is required");
      return;
    }

    try {
      const conditions = parseDraftConditions(draft.conditionsJson);
      await onCreateConditionSet({
        name,
        description: draft.description.trim() || undefined,
        conditions,
      });
      resetCreateDraft();
    } catch (error) {
      setDraftError(error instanceof Error ? error.message : "Invalid JSON");
    }
  }

  async function handleUpdateSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!editingSet || !editingDraft) {
      return;
    }

    const name = editingDraft.name.trim();
    if (!name) {
      setEditingError("Name is required");
      return;
    }

    try {
      const conditions = parseDraftConditions(editingDraft.conditionsJson);
      await onUpdateConditionSet(editingSet.id, {
        name,
        description: editingDraft.description.trim() || undefined,
        conditions,
      });
      closeEditModal();
    } catch (error) {
      setEditingError(error instanceof Error ? error.message : "Invalid JSON");
    }
  }

  return (
    <div className="mt-6 rounded-md border border-[#30363d] bg-[#161b22] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-[#e6edf3]">Condition Sets</h3>
          <p className="mt-1 text-sm text-[#8b949e]">{activeProjectLabel}</p>
        </div>
      </div>

      {feedback && (
        <div className="mb-4 rounded-md border border-[#30363d] border-l-4 border-l-[#58a6ff] bg-[#1e2128] p-3 text-sm text-[#8b949e]">
          {feedback.text}
        </div>
      )}

      <form onSubmit={handleCreateSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#8b949e]">
              Name
            </label>
            <input
              type="text"
              value={draft.name}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full rounded-md border border-[#30363d] bg-[#0d1117] p-3 text-[#e6edf3] focus:border-[#58a6ff] focus:outline-none"
              placeholder="Adult gate"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#8b949e]">
              Description
            </label>
            <input
              type="text"
              value={draft.description}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, description: e.target.value }))
              }
              className="w-full rounded-md border border-[#30363d] bg-[#0d1117] p-3 text-[#e6edf3] focus:border-[#58a6ff] focus:outline-none"
              placeholder="Applies when age is 18 or above"
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label className="block text-sm font-semibold text-[#8b949e]">
              Conditions JSON
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  setDraft((prev) => ({
                    ...prev,
                    conditionsJson: `[
  {
    "if": {
      "age": ">= 18"
    },
    "then": {
      "status": "adult",
      "access": "full"
    }
  }
]`,
                  }))
                }
                className="rounded-md border border-[#30363d] bg-[#0d1117] px-3 py-1 text-xs text-[#8b949e] transition hover:border-[#58a6ff] hover:text-[#e6edf3]"
              >
                Adult template
              </button>
              <button
                type="button"
                onClick={() =>
                  setDraft((prev) => ({
                    ...prev,
                    conditionsJson: DEFAULT_CONDITIONS_JSON,
                  }))
                }
                className="rounded-md border border-[#30363d] bg-[#0d1117] px-3 py-1 text-xs text-[#8b949e] transition hover:border-[#58a6ff] hover:text-[#e6edf3]"
              >
                Reset
              </button>
            </div>
          </div>
          <textarea
            value={draft.conditionsJson}
            onChange={(e) =>
              setDraft((prev) => ({ ...prev, conditionsJson: e.target.value }))
            }
            className="h-40 w-full rounded-md border border-[#30363d] bg-[#0d1117] p-3 font-mono text-sm text-[#e6edf3] focus:border-[#58a6ff] focus:outline-none"
            spellCheck={false}
          />
        </div>

        <div className="rounded-md border border-[#30363d] bg-[#0d1117] p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#8b949e]">
            Applied changes preview
          </p>
          {draftPreview.length > 0 ? (
            <div className="space-y-3">
              {draftPreview.map((condition) => (
                <div
                  key={condition.index}
                  className="rounded-md border border-[#30363d] bg-[#161b22] p-3"
                >
                  <p className="mb-2 text-xs text-[#8b949e]">
                    Condition {condition.index + 1}
                  </p>
                  <pre className="whitespace-pre-wrap font-mono text-xs text-[#e6edf3]">
                    {condition.appliedChanges}
                  </pre>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#8b949e]">
              Add a valid conditions JSON to preview the applied fields.
            </p>
          )}
        </div>

        {draftError && (
          <div className="rounded-md border border-[#30363d] border-l-4 border-l-[#58a6ff] bg-[#1e2128] p-3 text-sm text-[#8b949e]">
            {draftError}
          </div>
        )}

        <button
          type="submit"
          disabled={!activeProjectId}
          className="rounded-md bg-[#58a6ff] px-4 py-3 font-semibold text-[#0d1117] transition hover:bg-[#79c0ff] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Create Condition Set
        </button>
      </form>

      <div className="mt-8 space-y-3">
        {conditionSets.length > 0 ? (
          conditionSets.map((conditionSet) => (
            <div
              key={conditionSet.id}
              className="rounded-md border border-[#30363d] bg-[#0d1117] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-semibold text-[#e6edf3]">
                    {conditionSet.name}
                  </h4>
                  {conditionSet.description && (
                    <p className="mt-1 text-sm text-[#8b949e]">
                      {conditionSet.description}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-[#8b949e]">
                    {conditionSet.conditions.length} condition
                    {conditionSet.conditions.length === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(conditionSet)}
                    className="rounded-md border border-[#30363d] bg-[#1e2128] px-3 py-1.5 text-xs text-[#8b949e] transition hover:border-[#58a6ff] hover:text-[#e6edf3]"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      const ok = window.confirm("Delete this condition set?");
                      if (!ok) return;
                      await onDeleteConditionSet(conditionSet.id);
                    }}
                    className="rounded-md border border-[#30363d] bg-[#1e2128] px-3 py-1.5 text-xs text-[#8b949e] transition hover:border-[#58a6ff] hover:text-[#e6edf3]"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <details className="mt-3 rounded-md border border-[#30363d] bg-[#161b22] p-3">
                <summary className="cursor-pointer text-sm font-semibold text-[#8b949e]">
                  View conditions
                </summary>
                <pre className="mt-3 overflow-auto font-mono text-xs text-[#e6edf3]">
                  {JSON.stringify(conditionSet.conditions, null, 2)}
                </pre>
              </details>

              <div className="mt-3 rounded-md border border-[#30363d] bg-[#0d1117] p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#8b949e]">
                  Applied changes
                </p>
                <div className="space-y-3">
                  {getConditionPreview(conditionSet.conditions).map(
                    (condition) => (
                      <div
                        key={condition.index}
                        className="rounded-md border border-[#30363d] bg-[#161b22] p-3"
                      >
                        <p className="mb-2 text-xs text-[#8b949e]">
                          Condition {condition.index + 1}
                        </p>
                        <pre className="whitespace-pre-wrap font-mono text-xs text-[#e6edf3]">
                          {condition.appliedChanges}
                        </pre>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="py-8 text-center text-[#8b949e]">
            No condition sets created yet
          </p>
        )}
      </div>

      {editingSet && editingDraft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-md border border-[#30363d] bg-[#161b22] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h4 className="text-lg font-semibold text-[#e6edf3]">
                  Edit Condition Set
                </h4>
                <p className="text-xs text-[#8b949e]">#{editingSet.id}</p>
              </div>
              <button
                type="button"
                onClick={closeEditModal}
                className="rounded-md border border-[#30363d] bg-[#0d1117] px-3 py-1.5 text-xs text-[#8b949e] transition hover:border-[#58a6ff] hover:text-[#e6edf3]"
              >
                Close
              </button>
            </div>

            {editingError && (
              <div className="mb-4 rounded-md border border-[#30363d] border-l-4 border-l-[#58a6ff] bg-[#1e2128] p-3 text-sm text-[#8b949e]">
                {editingError}
              </div>
            )}

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#8b949e]">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editingDraft.name}
                    onChange={(e) =>
                      setEditingDraft((prev) =>
                        prev ? { ...prev, name: e.target.value } : prev,
                      )
                    }
                    className="w-full rounded-md border border-[#30363d] bg-[#0d1117] p-3 text-[#e6edf3] focus:border-[#58a6ff] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#8b949e]">
                    Description
                  </label>
                  <input
                    type="text"
                    value={editingDraft.description}
                    onChange={(e) =>
                      setEditingDraft((prev) =>
                        prev ? { ...prev, description: e.target.value } : prev,
                      )
                    }
                    className="w-full rounded-md border border-[#30363d] bg-[#0d1117] p-3 text-[#e6edf3] focus:border-[#58a6ff] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#8b949e]">
                  Conditions JSON
                </label>
                <textarea
                  value={editingDraft.conditionsJson}
                  onChange={(e) =>
                    setEditingDraft((prev) =>
                      prev ? { ...prev, conditionsJson: e.target.value } : prev,
                    )
                  }
                  className="h-48 w-full rounded-md border border-[#30363d] bg-[#0d1117] p-3 font-mono text-sm text-[#e6edf3] focus:border-[#58a6ff] focus:outline-none"
                  spellCheck={false}
                />
              </div>

              <div className="rounded-md border border-[#30363d] bg-[#0d1117] p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#8b949e]">
                  Applied changes preview
                </p>
                {editingPreview.length > 0 ? (
                  <div className="space-y-3">
                    {editingPreview.map((condition) => (
                      <div
                        key={condition.index}
                        className="rounded-md border border-[#30363d] bg-[#161b22] p-3"
                      >
                        <p className="mb-2 text-xs text-[#8b949e]">
                          Condition {condition.index + 1}
                        </p>
                        <pre className="whitespace-pre-wrap font-mono text-xs text-[#e6edf3]">
                          {condition.appliedChanges}
                        </pre>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[#8b949e]">
                    Add valid JSON to preview the applied fields.
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="rounded-md border border-[#30363d] bg-[#1e2128] px-4 py-2 text-sm text-[#8b949e] transition hover:border-[#58a6ff] hover:text-[#e6edf3]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-[#58a6ff] px-4 py-2 text-sm font-semibold text-[#0d1117] transition hover:bg-[#79c0ff]"
                >
                  Save Condition Set
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConditionSetsCard;

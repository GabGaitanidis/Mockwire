import type { FC } from "react";
import type { Rule, RuleFormData } from "../types";

type RulesListCardProps = {
  rules: Rule[];
  editingRuleId: number | null;
  onSetEditingRuleId: (id: number | null) => void;
  onDeleteRule: (ruleId: number) => Promise<void>;
  onUpdateRule: (
    ruleId: number,
    version: string,
    payload: Partial<RuleFormData>,
  ) => Promise<void>;
};

const RulesListCard: FC<RulesListCardProps> = ({
  rules,
  editingRuleId,
  onSetEditingRuleId,
  onDeleteRule,
  onUpdateRule,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Your Rules</h3>
      {rules.length > 0 ? (
        <ul className="space-y-3">
          {rules.map((rule) => (
            <li
              key={rule.id}
              className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-500"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold text-gray-800 break-words">
                  {rule.endpoint}
                </p>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={async () => {
                      onSetEditingRuleId(rule.id);
                      const endpoint = window.prompt(
                        "Update endpoint",
                        rule.endpoint,
                      );
                      const latencyRaw = window.prompt(
                        "Update latency (ms)",
                        String(rule.latency ?? 0),
                      );

                      if (endpoint === null || latencyRaw === null) {
                        onSetEditingRuleId(null);
                        return;
                      }

                      const latency = Number(latencyRaw);
                      if (Number.isNaN(latency) || latency < 0) {
                        onSetEditingRuleId(null);
                        return;
                      }

                      await onUpdateRule(rule.id, rule.version ?? "v1", {
                        endpoint,
                        latency,
                      });
                    }}
                    disabled={editingRuleId === rule.id}
                    className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800 hover:bg-yellow-200 disabled:opacity-50"
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
                    className="text-xs px-2 py-1 rounded bg-red-100 text-red-800 hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <p className="text-xs text-gray-600 mt-2">
                <span className="inline-block mr-4">
                  Version:{" "}
                  <span className="font-mono text-indigo-600">
                    {rule.version ?? "v1"}
                  </span>
                </span>
                <span className="inline-block mr-4">
                  Latency:{" "}
                  <span className="font-mono text-blue-600">
                    {rule.latency}ms
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
        <p className="text-gray-500 text-center py-8">No rules created yet</p>
      )}
    </div>
  );
};

export default RulesListCard;

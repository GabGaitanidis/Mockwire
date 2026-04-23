import type { FC } from "react";
import type { Project, User } from "../types";

type UserProjectPanelProps = {
  user: User;
  projects: Project[];
  activeProjectId: number | null;
  feedback: { type: "success" | "error"; text: string } | null;
  onSelectProject: (projectId: number) => Promise<void> | void;
  onCreateProject: (name: string) => Promise<void> | void;
};

const UserProjectPanel: FC<UserProjectPanelProps> = ({
  user,
  projects,
  activeProjectId,
  feedback,
  onSelectProject,
  onCreateProject,
}) => {
  return (
    <div className="mb-8 p-6 bg-[#161b22] border border-[#30363d] rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
      <p className="text-[#e6edf3]">
        <span className="font-semibold">Welcome,</span> {user.name}!
      </p>

      <div className="mt-3 rounded-md border border-[#30363d] bg-[#0d1117]">
        <div className="flex items-center gap-2 border-b border-[#30363d] px-3 py-2 text-xs text-[#8b949e]">
          <span className="font-mono">$</span>
          <span className="font-semibold">API_KEY</span>
        </div>
        <div className="flex items-center gap-3 px-3 py-3">
          <code className="flex-1 text-xs break-all font-mono text-[#e6edf3] min-w-0 tracking-wide">
            {user.api_key}
          </code>
          <button
            onClick={() => {
              navigator.clipboard.writeText(user.api_key);
            }}
            className="text-[#58a6ff] hover:text-[#79c0ff] text-sm font-semibold whitespace-nowrap"
          >
            Copy
          </button>
        </div>
      </div>

      {feedback && (
        <div className="mt-4 rounded-md border border-[#30363d] border-l-4 border-l-[#58a6ff] bg-[#1e2128] p-3 text-sm text-[#8b949e]">
          {feedback.text}
        </div>
      )}

      <div className="mt-4 p-3 bg-[#1e2128] border border-[#30363d] rounded-md">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-[#8b949e] mb-1">
              Active Project
            </label>
            <select
              value={activeProjectId ?? ""}
              onChange={(e) => onSelectProject(Number(e.target.value))}
              className="w-full p-2 bg-[#0d1117] border border-[#30363d] text-[#e6edf3] rounded-md focus:outline-none focus:border-[#58a6ff]"
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              const name = window.prompt("New project name");
              if (!name) return;
              onCreateProject(name);
            }}
            className="self-end px-4 py-2 bg-[#58a6ff] text-[#0d1117] rounded-md hover:bg-[#79c0ff] transition font-semibold"
          >
            New Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProjectPanel;

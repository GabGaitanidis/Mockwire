import type { FC } from "react";
import type { Project, User } from "../types";

type UserProjectPanelProps = {
  user: User;
  projects: Project[];
  activeProjectId: number | null;
  onSelectProject: (projectId: number) => Promise<void> | void;
  onCreateProject: (name: string) => Promise<void> | void;
};

const UserProjectPanel: FC<UserProjectPanelProps> = ({
  user,
  projects,
  activeProjectId,
  onSelectProject,
  onCreateProject,
}) => {
  return (
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

      <div className="mt-4 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Active Project
            </label>
            <select
              value={activeProjectId ?? ""}
              onChange={(e) => onSelectProject(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
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
            className="self-end px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            New Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProjectPanel;

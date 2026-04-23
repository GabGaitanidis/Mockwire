import type { FC } from "react";

type DashboardHeaderProps = {
  onLogout: () => void;
  isAuthenticated: boolean;
};

const DashboardHeader: FC<DashboardHeaderProps> = ({
  onLogout,
  isAuthenticated,
}) => {
  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.4)] mt-4">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#e6edf3]">Mockwire</h1>
        {isAuthenticated && (
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-[#0d1117] border border-[#30363d] text-[#8b949e] rounded-md hover:text-[#e6edf3] hover:border-[#58a6ff] transition"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;

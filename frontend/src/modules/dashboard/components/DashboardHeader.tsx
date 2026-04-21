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
    <div className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Mock API Generator</h1>
        {isAuthenticated && (
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;

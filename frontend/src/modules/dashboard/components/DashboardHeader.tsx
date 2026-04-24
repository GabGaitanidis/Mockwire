import type { FC } from "react";

const DashboardHeader: FC = () => {
  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.4)] mt-4">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#e6edf3]">Mockwire</h1>
      </div>
    </div>
  );
};

export default DashboardHeader;

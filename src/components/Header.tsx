
import { BarChart3, Database } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">DataViz Pro</h1>
            <p className="text-sm text-gray-500">Interactive Data Analytics</p>
          </div>
        </div>
      </div>
    </header>
  );
};

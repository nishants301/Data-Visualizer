
import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { Dashboard } from "@/components/Dashboard";
import { Header } from "@/components/Header";

export interface DataEntry {
  end_year: string;
  intensity: number;
  sector: string;
  topic: string;
  insight: string;
  url: string;
  region: string;
  start_year: string;
  impact: string;
  added: string;
  published: string;
  country: string;
  relevance: number;
  pestle: string;
  source: string;
  title: string;
  likelihood: number;
}

const Index = () => {
  const [data, setData] = useState<DataEntry[]>([]);
  const [fileName, setFileName] = useState<string>("");

  const handleDataUpload = (uploadedData: DataEntry[], name: string) => {
    setData(uploadedData);
    setFileName(name);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Data Visualization Platform
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl">
                Upload your JSON data file to create beautiful, interactive visualizations and gain insights from your data.
              </p>
            </div>
            <FileUpload onDataUpload={handleDataUpload} />
          </div>
        ) : (
          <Dashboard data={data} fileName={fileName} onReset={() => setData([])} />
        )}
      </main>
    </div>
  );
};

export default Index;

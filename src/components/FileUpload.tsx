
import { useState, useCallback } from "react";
import { Upload, File, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import type { DataEntry } from "@/pages/Index";

interface FileUploadProps {
  onDataUpload: (data: DataEntry[], fileName: string) => void;
}

export const FileUpload = ({ onDataUpload }: FileUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const processFile = useCallback(async (file: File) => {
    if (!file.name.endsWith('.json')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JSON file.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const text = await file.text();
      const jsonData = JSON.parse(text);
      
      // Handle both single objects and arrays
      const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData];
      
      if (dataArray.length === 0) {
        throw new Error("No data found in the file");
      }

      onDataUpload(dataArray, file.name);
      toast({
        title: "File uploaded successfully",
        description: `Loaded ${dataArray.length} data entries.`,
      });
    } catch (error) {
      console.error("Error processing file:", error);
      toast({
        title: "Error processing file",
        description: "Please ensure your file contains valid JSON data.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [onDataUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, [processFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, [processFile]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200
          ${isDragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
          }
          ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
            <Upload className="w-8 h-8 text-white" />
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {isProcessing ? 'Processing...' : 'Upload your JSON file'}
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop your data file here, or click to browse
            </p>
          </div>

          <Button
            variant="default"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            disabled={isProcessing}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <File className="w-4 h-4 mr-2" />
            Choose File
          </Button>

          <input
            id="file-input"
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-1">Expected JSON format:</p>
              <p>Your file should contain an array of objects or a single object with fields like: sector, topic, intensity, region, country, etc.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

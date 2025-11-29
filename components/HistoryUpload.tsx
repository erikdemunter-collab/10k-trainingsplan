import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface HistoryUploadProps {
  onDataLoaded: (data: string) => void;
}

const HistoryUpload: React.FC<HistoryUploadProps> = ({ onDataLoaded }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError(null);

    if (file) {
      if (file.type !== "application/json" && file.type !== "text/csv" && !file.name.endsWith('.csv') && !file.name.endsWith('.json')) {
        setError("Upload a.u.b. een .csv of .json bestand.");
        return;
      }

      setFileName(file.name);
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const text = e.target?.result;
        if (typeof text === 'string') {
          // In a real app, we might parse and validate strictly here.
          // For Gemini context, we pass the raw text or a summary.
          onDataLoaded(text);
        }
      };

      reader.onerror = () => {
        setError("Fout bij het lezen van het bestand.");
      };

      reader.readAsText(file);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-700 mb-2">
        Upload Loophistoriek (Optioneel)
      </label>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg hover:border-emerald-500 transition-colors bg-white">
        <div className="space-y-1 text-center">
          {fileName ? (
            <div className="flex flex-col items-center text-emerald-600">
              <CheckCircle className="h-10 w-10 mb-2" />
              <p className="text-sm font-medium">{fileName} geladen</p>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  setFileName(null);
                  onDataLoaded("");
                }}
                className="text-xs text-slate-500 underline mt-2 hover:text-red-500"
              >
                Verwijder
              </button>
            </div>
          ) : (
            <>
              <Upload className="mx-auto h-12 w-12 text-slate-400" />
              <div className="flex text-sm text-slate-600 justify-center">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none"
                >
                  <span>Upload een bestand</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".csv,.json" />
                </label>
                <p className="pl-1">of sleep hierheen</p>
              </div>
              <p className="text-xs text-slate-500">
                CSV of JSON (Strava/Garmin export)
              </p>
            </>
          )}
        </div>
      </div>
      {error && (
        <div className="flex items-center mt-2 text-sm text-red-600">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </div>
      )}
    </div>
  );
};

export default HistoryUpload;
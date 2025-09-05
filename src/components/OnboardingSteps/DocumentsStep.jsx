import { File, FileText, Upload, X } from "lucide-react";
import React from "react";

const DocumentsStep = ({ data, setData }) => {
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    setData({ ...data, documents: files });
  };

  const removeFile = (index) => {
    const updatedFiles = (data.documents || []).filter((_, i) => i !== index);
    setData({ ...data, documents: updatedFiles });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-zinc-600" />
        </div>
        <h3 className="text-xl font-semibold text-zinc-900 mb-2">
          Upload your documents
        </h3>
        <p className="text-zinc-600 font-medium">
          Share PDFs, presentations, or articles that represent your expertise.
        </p>
      </div>

      <div className="relative">
        <input
          type="file"
          multiple
          accept=".pdf,.docx,.pptx"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          onChange={handleFileChange}
        />
        <div className="border-2 border-dashed border-zinc-300 rounded-2xl p-8 text-center hover:border-zinc-400 hover:bg-zinc-50/50 transition-all duration-200 cursor-pointer">
          <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8 text-zinc-400" />
          </div>
          <p className="text-zinc-700 font-medium mb-2">
            Drag and drop files here, or click to browse
          </p>
          <p className="text-sm text-zinc-500 font-medium">
            PDF, DOCX, PPTX up to 10MB each
          </p>
        </div>
      </div>

      {data.documents && data.documents.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-zinc-900">
            Selected Files ({data.documents.length})
          </h4>
          <div className="space-y-2">
            {data.documents.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white border border-zinc-200 rounded-xl"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-zinc-100 rounded-lg">
                    <File className="w-4 h-4 text-zinc-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900">
                      {file.name}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 hover:bg-zinc-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-zinc-400 hover:text-zinc-600" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsStep;

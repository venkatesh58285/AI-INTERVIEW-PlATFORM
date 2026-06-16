import React, { useState } from "react";
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react";

const ResumeUploader = ({ onUpload, loading }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    setError("");

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      if (droppedFile.type !== "application/pdf") {
        setError("Only PDF files are supported.");
        return;
      }
      if (droppedFile.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB.");
        return;
      }
      setFile(droppedFile);
    }
  };

  const handleFileChange = (e) => {
    setError("");
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setError("Only PDF files are supported.");
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB.");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }
    onUpload(file);
  };

  return (
    <div className="space-y-4 w-full">
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start space-x-3 text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
          isDragging
            ? "border-indigo-500 bg-indigo-500/5"
            : "border-dark-700 bg-dark-900/30 hover:border-indigo-500/50"
        }`}
      >
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
          id="resume-input"
        />
        <label htmlFor="resume-input" className="cursor-pointer block">
          <Upload className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
          <p className="text-sm font-semibold text-white mb-1">
            Drag and drop your resume here
          </p>
          <p className="text-xs text-slate-400">
            or click to browse (PDF, max 5MB)
          </p>
        </label>
      </div>

      {file && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center space-x-3">
          <FileText className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-emerald-400">{file.name}</p>
            <p className="text-xs text-slate-400">
              {(file.size / 1024).toFixed(2)} KB
            </p>
          </div>
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold text-sm hover:shadow-[0_0_25px_rgba(99,102,241,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Processing..." : "Upload Resume"}
      </button>
    </div>
  );
};

export default ResumeUploader;

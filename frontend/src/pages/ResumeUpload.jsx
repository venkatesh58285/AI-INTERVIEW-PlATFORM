import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

const ResumeUpload = () => {
  const { uploadResume, user } = useAuth();
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

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
    setError('');
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      if (droppedFile.type !== 'application/pdf') {
        setError('Only PDF files are supported.');
        return;
      }
      setFile(droppedFile);
    }
  };

  const handleFileChange = (e) => {
    setError('');
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('Only PDF files are supported.');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUploadSubmit = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess(false);

    const res = await uploadResume(file);
    setUploading(false);

    if (res.success) {
      setSuccess(true);
      setFile(null);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in py-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Resume Upload
        </h1>
        <p className="text-slate-400 mt-1 text-sm">
          Upload your latest professional CV. The Resume Agent will parse and query your achievements to generate custom questions.
        </p>
      </div>

      <div className="bg-dark-900/40 border border-dark-800 p-8 rounded-3xl backdrop-blur-xl shadow-lg space-y-6">
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start space-x-3 text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start space-x-3 text-emerald-400 text-sm">
            <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>Resume uploaded and processed successfully! Redirecting...</span>
          </div>
        )}

        {/* Drag Drop Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
            isDragging 
              ? 'border-indigo-500 bg-indigo-500/5' 
              : file 
                ? 'border-emerald-500 bg-emerald-500/5' 
                : 'border-slate-700 bg-dark-950/20 hover:border-slate-600'
          }`}
        >
          <input
            id="fileInput"
            type="file"
            onChange={handleFileChange}
            accept=".pdf"
            className="hidden"
            disabled={uploading}
          />
          <label htmlFor="fileInput" className="cursor-pointer block">
            {file ? (
              <div className="space-y-3">
                <FileText className="w-12 h-12 text-emerald-400 mx-auto" />
                <span className="block text-sm font-semibold text-slate-200">
                  {file.name}
                </span>
                <span className="block text-xs text-slate-500">
                  {Math.round(file.size / 1024)} KB
                </span>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="w-12 h-12 text-slate-500 mx-auto" />
                <span className="block text-sm font-semibold text-slate-300">
                  Drag and drop your resume PDF here
                </span>
                <span className="block text-xs text-slate-500">
                  or click to select file from device
                </span>
              </div>
            )}
          </label>
        </div>

        {/* Current File Meta */}
        {user?.resumeURI && !file && (
          <div className="p-4 bg-dark-950/40 border border-dark-800 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-indigo-400" />
              <span className="text-xs text-slate-300">Active Resume Loaded</span>
            </div>
            <span className="text-[10px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded">
              Ready
            </span>
          </div>
        )}

        <button
          onClick={handleUploadSubmit}
          disabled={uploading || !file}
          className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-[0_0_15px_rgba(99,102,241,0.2)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {uploading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Analyzing Resume Embeddings...</span>
            </>
          ) : (
            <span>Process & Save Resume</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default ResumeUpload;

import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, X, Sparkles, RefreshCw } from 'lucide-react';
import { resumeApi } from '../services/api';
import { Resume } from '../types';

interface ResumeUploaderProps {
  onUploadSuccess: (resume: Resume) => void;
  onAnalyzeTrigger?: (resumeId: number) => void;
}

export const ResumeUploader: React.FC<ResumeUploaderProps> = ({ onUploadSuccess, onAnalyzeTrigger }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedResume, setUploadedResume] = useState<Resume | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndProcessFile = async (selectedFile: File) => {
    setError(null);
    const validExtensions = ['.pdf', '.docx', '.doc', '.txt'];
    const ext = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();

    if (!validExtensions.includes(ext)) {
      setError(`Invalid file format: ${ext}. Please upload a PDF or DOCX file.`);
      return;
    }

    if (selectedFile.size > 15 * 1024 * 1024) {
      setError('File size exceeds the 15MB limit.');
      return;
    }

    setFile(selectedFile);
    setUploading(true);

    try {
      const result = await resumeApi.upload(selectedFile);
      setUploadedResume(result);
      onUploadSuccess(result);
    } catch (err: any) {
      setError(err.message || 'Failed to upload resume. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const handleReset = () => {
    setFile(null);
    setUploadedResume(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="w-full">
      {error && (
        <div className="mb-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!uploadedResume ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`cursor-pointer relative rounded-2xl border-2 border-dashed p-10 text-center transition duration-200 ${
            isDragging
              ? 'border-brand-500 bg-brand-500/10 scale-[1.01]'
              : 'border-slate-700 bg-slate-900/60 hover:border-brand-500/50 hover:bg-slate-900'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx,.doc,.txt"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600/30 to-indigo-600/30 border border-brand-500/40 flex items-center justify-center text-brand-400">
              {uploading ? (
                <div className="w-8 h-8 border-3 border-brand-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload className="w-8 h-8" />
              )}
            </div>

            <div>
              <p className="text-lg font-bold text-white mb-1">
                {uploading ? 'Processing & Extracting Text...' : 'Drag & Drop Your Resume'}
              </p>
              <p className="text-sm text-slate-400">
                or <span className="text-brand-400 font-semibold hover:underline">browse files</span> from your computer
              </p>
            </div>

            <div className="flex items-center space-x-3 text-xs text-slate-500">
              <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-400">PDF</span>
              <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-400">DOCX</span>
              <span>Max 15MB</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <span>{uploadedResume.original_filename}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </h4>
                <p className="text-xs text-slate-400">
                  {(uploadedResume.file_size / 1024).toFixed(1)} KB • Uploaded successfully
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleReset}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center space-x-1.5 transition"
                title="Replace Resume"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Replace</span>
              </button>
            </div>
          </div>

          {uploadedResume.extracted_text_preview && (
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 mb-5">
              <p className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-1.5 font-bold">Extracted Text Preview</p>
              <p className="text-xs text-slate-400 line-clamp-3 italic">
                "{uploadedResume.extracted_text_preview}"
              </p>
            </div>
          )}

          {onAnalyzeTrigger && (
            <button
              onClick={() => onAnalyzeTrigger(uploadedResume.id)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-bold text-sm hover:opacity-95 transition shadow-lg shadow-brand-600/30 flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Generate Portfolio with AI Now &rarr;</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

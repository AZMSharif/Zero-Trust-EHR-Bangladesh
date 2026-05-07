import React, { useState } from "react";
import { Upload, X, FileType, CheckCircle2, Loader2 } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import api from "../api/client";

export default function ReportUploadModal({ isOpen, onClose, patientUrn, onSuccess }) {
  const { t } = useLanguage();
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [reportType, setReportType] = useState("OTHER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    // Check file size (max 7MB to fit safely under 10MB base64 limit)
    if (selectedFile.size > 7 * 1024 * 1024) {
      setError(t("fileTooLarge") || "File is too large (max 7MB).");
      return;
    }
    
    setFile(selectedFile);
    setError("");
    if (!fileName) {
      // Set default title to file name without extension
      setFileName(selectedFile.name.split('.').slice(0, -1).join('.'));
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !fileName) {
      setError("Please provide a title and select a file.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const base64Data = await convertFileToBase64(file);
      
      await api.post(`/patient/${patientUrn}/report`, {
        file_name: fileName,
        file_data: base64Data,
        report_type: reportType
      });
      
      onSuccess();
      onClose();
      // Reset state
      setFile(null);
      setFileName("");
      setReportType("OTHER");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || t("uploadFailed") || "Failed to upload report.");
    } finally {
      setLoading(false);
    }
  };

  // Common report types based on Prisma schema enum
  const reportTypes = [
    "BLOOD_CBC", "BLOOD_BIOCHEMISTRY", "URINE_ROUTINE", "STOOL_ROUTINE",
    "XRAY", "ECG", "ULTRASOUND", "CT_SCAN", "MRI", "PATHOLOGY", "MICROBIOLOGY", "OTHER"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/5">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Upload size={18} className="text-sky-400" />
            {t("uploadReport") || "Upload Report"}
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">
              {t("reportTitle") || "Report Title"}
            </label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="e.g., Blood Test Result"
              className="glass-input w-full"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">
              {t("reportType") || "Report Type"}
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="glass-input w-full text-sm"
            >
              {reportTypes.map(type => (
                <option key={type} value={type} className="bg-slate-900">
                  {type.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">
              {t("selectFile") || "Select File (PDF or Image)"}
            </label>
            <div className="relative group">
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                required
              />
              <div className={`w-full p-4 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 transition-all ${file ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10 bg-white/5 group-hover:border-sky-500/50 group-hover:bg-sky-500/5'}`}>
                {file ? (
                  <>
                    <CheckCircle2 size={24} className="text-emerald-400" />
                    <div className="text-center">
                      <p className="text-sm font-medium text-white truncate max-w-[200px]">{file.name}</p>
                      <p className="text-xs text-white/50">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </>
                ) : (
                  <>
                    <FileType size={24} className="text-white/40 group-hover:text-sky-400 transition-colors" />
                    <div className="text-center">
                      <p className="text-sm font-medium text-white/70">{t("clickToBrowse") || "Click to browse"}</p>
                      <p className="text-xs text-white/40">PDF, JPG, PNG (Max 7MB)</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/70 hover:bg-white/5 hover:text-white transition-colors text-sm font-medium"
            >
              {t("cancel") || "Cancel"}
            </button>
            <button
              type="submit"
              disabled={loading || !file}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-medium text-sm transition-all shadow-lg shadow-sky-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> {t("uploading") || "Uploading..."}</>
              ) : (
                <><Upload size={16} /> {t("upload") || "Upload"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Upload, FileCode, CheckCircle2, AlertCircle, Cpu, Plus } from 'lucide-react';

export default function ModelUpload({ onUploadModel }) {
  const [modelName, setModelName] = useState('');
  const [algorithm, setAlgorithm] = useState('');
  const [modelType, setModelType] = useState('Regression');
  const [trainR2, setTrainR2] = useState('0.92');
  const [testR2, setTestR2] = useState('0.88');
  const [rmse, setRmse] = useState('4.1');
  const [mae, setMae] = useState('2.5');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!modelName || !algorithm || !selectedFile) {
      setStatusMsg({ type: 'error', text: 'Please fill in all required fields and select a model file.' });
      return;
    }

    setIsUploading(true);
    setStatusMsg(null);

    const formData = new FormData();
    formData.append('model_name', modelName);
    formData.append('algorithm', algorithm);
    formData.append('model_type', modelType);
    formData.append('train_r2', trainR2);
    formData.append('test_r2', testR2);
    formData.append('rmse', rmse);
    formData.append('mae', mae);
    formData.append('file', selectedFile);

    const res = await onUploadModel(formData);

    setIsUploading(false);
    if (res && res.status === 'success') {
      setStatusMsg({ type: 'success', text: res.message || 'Model uploaded and registered successfully!' });
      setModelName('');
      setAlgorithm('');
      setSelectedFile(null);
    } else {
      setStatusMsg({ type: 'error', text: 'Upload completed with local registration.' });
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-white/10">
        <h3 className="text-xl font-bold text-white tracking-wide">Model Upload & Colab Integration Manager</h3>
        <p className="text-xs text-slate-400">Register trained models from Google Colab or local scripts into the dashboard registry.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel p-6 md:p-8 rounded-3xl space-y-6 border border-white/10">
        {/* Supported Formats Banner */}
        <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-slate-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#2F5BFF]" />
            <span>Supported Model Formats:</span>
          </div>
          <div className="flex gap-1.5 font-mono">
            {['.pkl', '.joblib', '.pt', '.h5', '.keras'].map(ext => (
              <span key={ext} className="px-2 py-0.5 rounded bg-slate-900 text-[#FFD600] font-bold border border-slate-700">
                {ext}
              </span>
            ))}
          </div>
        </div>

        {/* Drag & Drop File Zone */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 block">1. Model File Upload</label>
          <div className="relative border-2 border-dashed border-slate-700 hover:border-[#2F5BFF] rounded-2xl p-8 text-center transition-all bg-slate-950/40">
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pkl,.joblib,.pt,.h5,.keras,.json"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="space-y-2 pointer-events-none">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-[#2F5BFF]">
                <Upload size={24} />
              </div>
              <div className="text-sm font-bold text-white">
                {selectedFile ? selectedFile.name : 'Click or Drag & Drop Colab Model File Here'}
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : 'Max size 50MB (.pkl, .joblib, .pt, .h5, .keras)'}
              </p>
            </div>
          </div>
        </div>

        {/* Model Spec Form Inputs */}
        <div className="space-y-4 pt-2">
          <label className="text-xs font-bold text-slate-300 block">2. Model Metadata & Performance Metrics</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-medium">Model Name</span>
              <input
                type="text"
                placeholder="e.g. Random Forest Regressor v2"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl glass-input text-sm"
                required
              />
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-medium">Algorithm Name</span>
              <input
                type="text"
                placeholder="e.g. Random Forest (200 Trees)"
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl glass-input text-sm"
                required
              />
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-medium">Problem Type</span>
              <select
                value={modelType}
                onChange={(e) => setModelType(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl glass-input text-sm bg-slate-900"
              >
                <option value="Regression">Regression (flood_risk_score)</option>
                <option value="Classification">Classification (flood_warning_level)</option>
              </select>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-medium">Testing R² / Accuracy Score</span>
              <input
                type="number"
                step="0.001"
                min="0"
                max="1"
                value={testR2}
                onChange={(e) => setTestR2(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl glass-input text-sm font-mono font-bold text-[#FFD600]"
              />
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-medium">Training R² Score</span>
              <input
                type="number"
                step="0.001"
                min="0"
                max="1"
                value={trainR2}
                onChange={(e) => setTrainR2(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl glass-input text-sm font-mono"
              />
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-medium">RMSE Score</span>
              <input
                type="number"
                step="0.01"
                value={rmse}
                onChange={(e) => setRmse(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl glass-input text-sm font-mono text-emerald-400"
              />
            </div>
          </div>
        </div>

        {statusMsg && (
          <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            statusMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'
          }`}>
            {statusMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isUploading}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#2F5BFF] to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-sm shadow-xl shadow-blue-500/30 transition-all border border-blue-400/30 disabled:opacity-50"
          >
            <Plus size={18} />
            <span>{isUploading ? 'Registering Model...' : 'Upload & Register Model'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

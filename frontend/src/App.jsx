import React, { Suspense, lazy, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Navigation/Sidebar';
import Topbar from './components/Navigation/Topbar';
import HeroSection from './components/Hero/HeroSection';
import ModelCards from './components/Models/ModelCards';
import PredictionWorkspace from './components/Prediction/PredictionWorkspace';
import DatasetInfo from './components/Dataset/DatasetInfo';
import ModelUpload from './components/Upload/ModelUpload';
import AboutProject from './components/About/AboutProject';
import Toast from './components/Common/Toast';
import { apiService } from './services/api';

const ModelDetailModal = lazy(() => import('./components/Models/ModelDetailModal'));
const ModelComparison = lazy(() => import('./components/Comparison/ModelComparison'));
const AnalyticsDashboard = lazy(() => import('./components/Analytics/AnalyticsDashboard'));

export default function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // API State
  const [models, setModels] = useState([]);
  const [featuresConfig, setFeaturesConfig] = useState([]);
  const [datasetInfo, setDatasetInfo] = useState(null);
  const [isLiveApi, setIsLiveApi] = useState(false);

  // Detail Modal & Selection
  const [selectedModelId, setSelectedModelId] = useState('random_forest_reg');
  const [detailModalModel, setDetailModalModel] = useState(null);

  // Prediction State & Stepper Animation
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionStep, setPredictionStep] = useState(0);
  const [predictionProgress, setPredictionProgress] = useState(0);
  const [predictionResult, setPredictionResult] = useState(null);
  const [comparisonResults, setComparisonResults] = useState(null);

  // Toast System
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
  };

  // Fetch Models & Metadata on mount
  useEffect(() => {
    async function initData() {
      const res = await apiService.getModels();
      if (res.data) {
        setModels(res.data.models || []);
        setFeaturesConfig(res.data.features || []);
        setDatasetInfo(res.data.project_info?.dataset || null);
        setIsLiveApi(res.isLive);
      }
    }
    initData();
  }, []);

  // Prediction Execution Handler with 5-Step Stepper Animation
  const handlePredict = async (modelId, features) => {
    if (!modelId || !features) {
      setPredictionResult(null);
      setComparisonResults(null);
      return;
    }

    setIsPredicting(true);
    setPredictionStep(0);
    setPredictionProgress(10);
    setPredictionResult(null);
    setComparisonResults(null);

    // Simulated 5-stage animation steps over 1.8 seconds
    const interval = setInterval(() => {
      setPredictionStep((prev) => {
        const next = prev + 1;
        setPredictionProgress(Math.min((next + 1) * 20, 100));
        if (next >= 4) {
          clearInterval(interval);
        }
        return Math.min(next, 4);
      });
    }, 350);

    // Predictions require the uploaded model artifacts served by FastAPI.
    try {
      const res = await apiService.predict(modelId, features);
      setTimeout(() => {
        setIsPredicting(false);
        setPredictionResult(res.data);
        showToast('Prediction completed successfully', 'success');
      }, 1850);
    } catch (error) {
      clearInterval(interval);
      setIsPredicting(false);
      showToast(error.message || 'Prediction failed. Please try again.', 'error');
    }
  };

  const handleCompareAll = async (features) => {
    if (!features) {
      setComparisonResults(null);
      return;
    }

    setIsPredicting(true);
    setPredictionStep(0);
    setPredictionProgress(10);
    setPredictionResult(null);
    setComparisonResults(null);
    let step = 0;
    const interval = setInterval(() => {
      step = Math.min(step + 1, 4);
      setPredictionStep(step);
      setPredictionProgress((step + 1) * 20);
      if (step === 4) clearInterval(interval);
    }, 350);

    try {
      const response = await apiService.predictAll(features);
      clearInterval(interval);
      setPredictionStep(4);
      setPredictionProgress(100);
      setComparisonResults(response.data.results);
      showToast(`${response.data.models_compared} models compared successfully`, 'success');
    } catch (error) {
      clearInterval(interval);
      showToast(error.message || 'Model comparison failed.', 'error');
    } finally {
      setIsPredicting(false);
    }
  };

  // Model Upload Handler
  const handleUploadModel = async (formData) => {
    const res = await apiService.uploadModel(formData);
    if (res.data && res.data.model) {
      setModels((prev) => [...prev, res.data.model]);
      showToast(`Model '${res.data.model.name}' registered successfully! ✓`, 'success');
      return res.data;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 selection:bg-[#2F5BFF] selection:text-white relative font-sans">
      {/* Toast Notification Container */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Detail Modal */}
      <Suspense fallback={null}>
        <ModelDetailModal
          model={detailModalModel}
          onClose={() => setDetailModalModel(null)}
          onSelectForPrediction={(id) => {
            setSelectedModelId(id);
            setActiveSection('prediction');
          }}
        />
      </Suspense>

      {/* Collapsible Left Sidebar */}
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Top Header */}
      <Topbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        collapsed={sidebarCollapsed}
        setIsMobileOpen={setIsMobileOpen}
        isLiveApi={isLiveApi}
      />

      {/* Main Viewport Content */}
      <main className={`transition-all duration-300 p-4 md:p-8 min-h-[calc(100vh-4rem)] ${
        sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
      }`}>
        <Suspense fallback={<div className="text-sm text-slate-400">Loading dashboard section…</div>}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="max-w-7xl mx-auto space-y-8"
          >
            {/* 🏠 Dashboard Home */}
            {activeSection === 'dashboard' && (
              <div className="space-y-8">
                <HeroSection
                  setActiveSection={setActiveSection}
                  models={models}
                  datasetInfo={datasetInfo}
                />
                <ModelCards
                  models={models}
                  setActiveSection={setActiveSection}
                  setSelectedModelId={setSelectedModelId}
                  onOpenDetailModal={(model) => setDetailModalModel(model)}
                />
              </div>
            )}

            {/* 🤖 Models Gallery */}
            {activeSection === 'models' && (
              <ModelCards
                models={models}
                setActiveSection={setActiveSection}
                setSelectedModelId={setSelectedModelId}
                onOpenDetailModal={(model) => setDetailModalModel(model)}
              />
            )}

            {/* 🔮 Prediction Workspace */}
            {activeSection === 'prediction' && (
              <PredictionWorkspace
                models={models}
                featuresConfig={featuresConfig}
                selectedModelId={selectedModelId}
                setSelectedModelId={setSelectedModelId}
                onPredict={handlePredict}
                onCompareAll={handleCompareAll}
                comparisonResults={comparisonResults}
                predictionResult={predictionResult}
                isPredicting={isPredicting}
                predictionStep={predictionStep}
                predictionProgress={predictionProgress}
              />
            )}

            {/* 📊 Performance & Comparison */}
            {activeSection === 'performance' && (
              <ModelComparison
                models={models}
                datasetInfo={datasetInfo}
              />
            )}

            {/* 📈 Analytics */}
            {activeSection === 'analytics' && (
              <AnalyticsDashboard
                models={models}
              />
            )}

            {/* 📁 Dataset Info */}
            {activeSection === 'dataset' && (
              <DatasetInfo
                datasetInfo={datasetInfo}
                features={featuresConfig}
              />
            )}

            {/* 💾 Model Upload Manager */}
            {activeSection === 'upload' && (
              <ModelUpload
                onUploadModel={handleUploadModel}
              />
            )}

            {/* ℹ️ About Project */}
            {activeSection === 'about' && (
              <AboutProject />
            )}
          </motion.div>
        </AnimatePresence>
        </Suspense>
      </main>
    </div>
  );
}

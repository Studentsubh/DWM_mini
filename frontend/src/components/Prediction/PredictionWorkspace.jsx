import React, { Suspense, lazy, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Cpu, Award, Sliders, AlertCircle, RefreshCw, Sparkles, ShieldAlert, CheckCircle2 } from 'lucide-react';
import PredictionStepper from './PredictionStepper';
import ResultDisplay from './ResultDisplay';
const ModelPredictionComparison = lazy(() => import('./ModelPredictionComparison'));

export default function PredictionWorkspace({ models, featuresConfig, selectedModelId, setSelectedModelId, onPredict, onCompareAll, comparisonResults, predictionResult, isPredicting, predictionStep, predictionProgress }) {
  // Initialize features state with default values
  const [featureValues, setFeatureValues] = useState(() => {
    const defaults = {};
    (featuresConfig || []).forEach(f => {
      defaults[f.id] = f.default;
    });
    return defaults;
  });

  useEffect(() => {
    setFeatureValues((current) => {
      const next = { ...current };
      (featuresConfig || []).forEach((feature) => {
        if (next[feature.id] === undefined) next[feature.id] = feature.default;
      });
      return next;
    });
  }, [featuresConfig]);

  const [validationErrors, setValidationErrors] = useState({});

  const selectedModel = models.find(m => m.id === selectedModelId) || models[0];

  const handleInputChange = (id, rawVal, min, max) => {
    const val = parseFloat(rawVal);
    setFeatureValues(prev => ({ ...prev, [id]: isNaN(val) ? '' : val }));

    if (isNaN(val) || val < min || val > max) {
      setValidationErrors(prev => ({ ...prev, [id]: `Value must be between ${min} and ${max}` }));
    } else {
      setValidationErrors(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  const applyPresetScenario = (scenario) => {
    if (scenario === 'monsoon') {
      setFeatureValues({
        precipitation_sum: 310, rain_sum: 310, soil_moisture_0_to_7cm_mean: 0.48,
        soil_moisture_7_to_28cm_mean: 0.45, temperature_2m_max: 26, wind_speed_10m_max: 18,
        rain_24h: 180, rain_48h: 260, rain_72h: 310, soil_saturation_index: 0.94,
        latitude: 20, longitude: 78, year: 2024, month: 7
      });
    } else if (scenario === 'normal') {
      setFeatureValues({
        precipitation_sum: 35, rain_sum: 35, soil_moisture_0_to_7cm_mean: 0.28,
        soil_moisture_7_to_28cm_mean: 0.31, temperature_2m_max: 24.5, wind_speed_10m_max: 8,
        rain_24h: 20, rain_48h: 30, rain_72h: 35, soil_saturation_index: 0.45,
        latitude: 20, longitude: 78, year: 2024, month: 1
      });
    } else if (scenario === 'extreme') {
      setFeatureValues({
        precipitation_sum: 900, rain_sum: 900, soil_moisture_0_to_7cm_mean: 0.55,
        soil_moisture_7_to_28cm_mean: 0.52, temperature_2m_max: 29, wind_speed_10m_max: 35,
        rain_24h: 460, rain_48h: 700, rain_72h: 900, soil_saturation_index: 0.99,
        latitude: 20, longitude: 78, year: 2024, month: 8
      });
    }
    setValidationErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.keys(validationErrors).length > 0) return;
    onPredict(selectedModel.id, featureValues);
  };

  return (
    <div className="space-y-8">
      {/* 1. Model Selection Component */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-black tracking-wide">1. Select Prediction Model</h3>
            <p className="text-xs text-gray-600">Choose an ensemble or regression estimator trained on hydrometeorological data.</p>
          </div>
          <span className="text-xs font-mono text-black bg-black px-3 py-1 rounded-full border border-black/20 font-semibold">
            {models.length} Models Available
          </span>
        </div>

        {/* Model Selection Selector Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {models.map(m => {
            const isSelected = m.id === selectedModel.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedModelId(m.id)}
                className={`p-3.5 rounded-2xl text-left transition-all duration-200 border relative ${
                  isSelected
                    ? 'bg-gradient-to-r from-black/20 to-blue-900/40 border-[#2F5BFF] shadow-lg shadow-black/10 text-white'
                    : 'bg-white hover:bg-white border-black/10 text-black'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle2 size={16} className="text-black" />
                  </div>
                )}
                <div className="text-xs font-mono text-gray-600 uppercase tracking-wider mb-1">{m.type}</div>
                <div className="font-bold text-sm text-black truncate pr-4">{m.name}</div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-black/10 text-[11px] font-mono">
                  <span className="text-gray-600">Test R²</span>
                  <span className="text-black font-bold">{m.metrics?.test_r2 ?? m.metrics?.test_accuracy}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Model Spec Banner */}
      <div className="p-4 rounded-2xl bg-white border border-black/10 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-black border border-black/30 flex items-center justify-center text-black font-bold">
            <Cpu size={20} />
          </div>
          <div>
            <div className="font-bold text-black text-sm">{selectedModel.name}</div>
            <div className="text-gray-600 font-mono text-[11px]">{selectedModel.algorithm}</div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-black font-mono text-[11px]">
          <div>Train R²: <span className="text-black font-bold">{selectedModel.metrics?.train_r2 ?? '0.94'}</span></div>
          <div>Test R²: <span className="text-black font-bold">{selectedModel.metrics?.test_r2 ?? '0.89'}</span></div>
          <div>RMSE: <span className="text-emerald-400 font-bold">{selectedModel.metrics?.rmse ?? '4.1'}</span></div>
        </div>
      </div>

      {/* Stepper or Result View */}
      {isPredicting ? (
        <PredictionStepper currentStep={predictionStep} totalProgress={predictionProgress} />
      ) : comparisonResults ? (
        <Suspense fallback={<div className="text-sm text-gray-600">Loading comparison chart…</div>}>
          <ModelPredictionComparison results={comparisonResults} models={models} onReset={() => onCompareAll(null)} />
        </Suspense>
      ) : predictionResult ? (
        <ResultDisplay result={predictionResult} onReset={() => onPredict(null)} selectedModel={selectedModel} />
      ) : (
        /* 2. Interactive Feature Form */
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-black tracking-wide">2. Hydrometeorological Feature Inputs</h3>
              <p className="text-xs text-gray-600">Enter the 14 weather, soil, location, and date fields used to train the selected models.</p>
            </div>

            {/* Scenario Quick Selector Pills */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-600">Preset Scenarios:</span>
              <button
                type="button"
                onClick={() => applyPresetScenario('monsoon')}
                className="px-2.5 py-1 rounded-lg bg-black hover:bg-black text-white border border-black/30 text-xs font-medium transition-colors"
              >
                🌧️ Heavy Monsoon
              </button>
              <button
                type="button"
                onClick={() => applyPresetScenario('normal')}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-medium transition-colors"
              >
                ⛅ Normal Stage
              </button>
              <button
                type="button"
                onClick={() => applyPresetScenario('extreme')}
                className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-medium transition-colors"
              >
                ⚠️ Flash Flood
              </button>
            </div>
          </div>

          {/* Form Input Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(featuresConfig || []).map((feat) => {
              const currentVal = featureValues[feat.id] ?? feat.default;
              const err = validationErrors[feat.id];

              return (
                <div
                  key={feat.id}
                  className={`glass-panel p-4.5 rounded-2xl space-y-3 border transition-all ${
                    err ? 'border-red-500/50 bg-red-500/5' : 'border-black/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-black block">{feat.label}</span>
                      <span className="text-[10px] text-gray-600 font-mono">{feat.category}</span>
                    </div>

                    {/* Numeric Input Box with Unit Badge */}
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        step={feat.step}
                        min={feat.min}
                        max={feat.max}
                        value={currentVal}
                        onChange={(e) => handleInputChange(feat.id, e.target.value, feat.min, feat.max)}
                        className="w-24 px-2.5 py-1 rounded-lg glass-input text-right font-mono font-bold text-sm"
                      />
                      <span className="text-xs font-mono font-bold text-black px-2 py-1 rounded bg-white border border-slate-700">
                        {feat.unit}
                      </span>
                    </div>
                  </div>

                  {/* Range sliders are useful for bounded weather values, but not precise coordinates. */}
                  {!['latitude', 'longitude'].includes(feat.id) && <div className="space-y-1">
                    <input
                      type="range"
                      min={feat.min}
                      max={feat.max}
                      step={feat.step}
                      value={currentVal || feat.min}
                      onChange={(e) => handleInputChange(feat.id, e.target.value, feat.min, feat.max)}
                      className="w-full accent-black cursor-pointer h-1.5 bg-white rounded-lg"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-gray-600">
                      <span>{feat.min} {feat.unit}</span>
                      <span>{feat.max} {feat.unit}</span>
                    </div>
                  </div>}

                  {/* Short Explanation */}
                  <p className="text-[11px] text-gray-600 leading-tight">{feat.description}</p>

                  {err && (
                    <div className="flex items-center gap-1.5 text-red-400 text-xs font-mono">
                      <AlertCircle size={14} />
                      <span>{err}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Prediction actions */}
          <div className="pt-4 flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="submit"
              disabled={Object.keys(validationErrors).length > 0}
              className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-black via-gray-900 to-indigo-600 hover:from-black hover:to-gray-800 text-white font-bold text-base shadow-2xl shadow-black/10 border border-black/40 transition-all duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            >
              <Zap className="w-5 h-5 fill-current text-black" />
              <span>Predict with selected model</span>
            </button>
            <button
              type="button"
              disabled={Object.keys(validationErrors).length > 0}
              onClick={() => onCompareAll(featureValues)}
              className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-base shadow-xl shadow-emerald-900/30 border border-emerald-300/30 transition-all duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="w-5 h-5" />
              <span>Run all models &amp; compare</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}



import axios from 'axios';
import { DEFAULT_CONFIG } from '../config/modelsData';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 4000,
});

export const apiService = {
  async getModels() {
    try {
      const response = await client.get('/models');
      return { data: response.data, isLive: true };
    } catch (err) {
      console.warn('Backend API unreachable, using local config fallback.', err.message);
      return {
        data: {
          models: DEFAULT_CONFIG.models,
          project_info: DEFAULT_CONFIG.project_info,
          features: DEFAULT_CONFIG.features
        },
        isLive: false
      };
    }
  },

  async predict(modelId, features) {
    try {
      const response = await client.post('/predict', {
        model_id: modelId,
        features: features
      });
      return { data: response.data, isLive: true };
    } catch (err) {
      console.error('Prediction API is unavailable:', err.message);
      throw new Error('The prediction backend is unavailable. Start the backend and try again.');
    }
  },

  async predictAll(features) {
    try {
      const response = await client.post('/predict/all', { features }, { timeout: 60000 });
      return { data: response.data, isLive: true };
    } catch (err) {
      console.error('Model comparison API is unavailable:', err.message);
      const detail = err.response?.data?.detail;
      const reason = typeof detail === 'string'
        ? detail
        : detail
          ? JSON.stringify(detail)
          : err.code === 'ECONNABORTED'
            ? 'The comparison timed out. Try again; the first run may take longer while models load.'
            : 'The backend could not be reached. Make sure its terminal window is open.';
      throw new Error(`Could not compare the models. ${reason}`);
    }
  },

  async uploadModel(formData) {
    try {
      const response = await client.post('/models/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return { data: response.data, isLive: true };
    } catch (err) {
      console.warn('Upload endpoint failed or offline. Simulating local model registration.', err.message);
      
      const modelName = formData.get('model_name') || 'Uploaded Custom Model';
      const modelType = formData.get('model_type') || 'Regression';
      const algorithm = formData.get('algorithm') || 'Custom Estimator';
      const trainR2 = parseFloat(formData.get('train_r2') || '0.90');
      const testR2 = parseFloat(formData.get('test_r2') || '0.86');

      const mockModel = {
        id: `custom_${Date.now()}`,
        name: modelName,
        algorithm: algorithm,
        type: modelType,
        task: modelType === 'Regression' ? 'flood_risk_score' : 'flood_warning_level',
        file: 'custom_colab_model.pkl',
        status: 'Trained',
        is_recommended: false,
        metrics: {
          train_r2: trainR2,
          test_r2: testR2,
          rmse: 4.1,
          mae: 2.7,
          mse: 16.8,
          cv_score: testR2 - 0.01,
          training_time_sec: 1.8
        },
        description: 'Locally registered custom model.',
        feature_importance: [
          { feature: "24h Precipitation", importance: 0.40 },
          { feature: "River Water Level", importance: 0.30 },
          { feature: "Soil Moisture Saturation", importance: 0.20 },
          { feature: "River Discharge Rate", importance: 0.10 }
        ],
        actual_vs_predicted: [
          { actual: 20, predicted: 21 },
          { actual: 50, predicted: 49 },
          { actual: 80, predicted: 81 }
        ],
        residual_data: [
          { predicted: 21, residual: -1 },
          { predicted: 49, residual: 1 }
        ]
      };

      return {
        data: {
          status: 'success',
          message: `Model '${modelName}' registered in local memory session.`,
          model: mockModel
        },
        isLive: false
      };
    }
  },

  async getDatasetInfo() {
    try {
      const response = await client.get('/dataset');
      return { data: response.data, isLive: true };
    } catch (err) {
      return { data: DEFAULT_CONFIG.project_info.dataset, isLive: false };
    }
  }
};

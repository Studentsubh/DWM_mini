# Flood Risk Prediction Dashboard — Project Report

**Report date:** 14 October 2026  
**Project:** AI-Powered Flood Risk Prediction Platform

## 1. Executive summary

This project is a locally run web dashboard for entering hydrometeorological observations, requesting flood-risk predictions, comparing configured machine-learning models, and viewing model and dataset metadata. It has two main services: a React single-page application served by Vite and a Python API served by FastAPI. The API reads model definitions and feature specifications from `backend/models_config.json` and loads saved estimator artifacts from `backend/uploaded_models`.

The application presents predictions as a 0–100 risk score and a risk tier. Regression models provide a numeric score; classifier classes are mapped to representative numeric scores so that results can be shown alongside regression outputs. This makes the comparison view convenient, while the mapped classifier scores should be understood as display values rather than calibrated probabilities.

## 2. Goals and user-facing capabilities

- Show a dashboard landing page with project overview, model highlights, and navigation.
- Collect 14 weather, soil, location, and date inputs for inference.
- Run an individual configured model or send the same feature values to all supported comparison models.
- Present a result with a score, tier, label, explanation, and timestamp.
- Browse model descriptions, metrics, feature importance, and comparison charts.
- Show dataset metadata and the feature schema.
- Display analytics and diagnostics using configured actual-versus-predicted, residual, and feature-importance data.
- Provide a model upload form that registers model metadata and an artifact through the API when available.
- Run locally on Windows through the supplied batch launcher and PowerShell setup script.

## 3. Architecture

| Layer | Implementation | Responsibility |
|---|---|---|
| User interface | React 19, Vite, Tailwind CSS 4 | Navigation, forms, cards, results, responsive layout |
| Visual behavior | Framer Motion, Lucide React, Recharts | Transitions, icons, charts, prediction progress display |
| API client | Axios (`frontend/src/services/api.js`) | Calls the local API and provides metadata fallback when API metadata cannot be reached |
| API service | FastAPI, Pydantic, Uvicorn | Metadata routes, validation, artifact loading, prediction, upload |
| Model runtime | scikit-learn, XGBoost, joblib, pandas | Deserializes trained estimators and constructs one-row prediction input |
| Configuration | `backend/models_config.json` | Project/dataset metadata, input definitions, model descriptions, metrics and chart data |
| Model artifacts | `backend/uploaded_models/` | Saved estimators, label encoder, and other supplied serialized artifacts |

### Request flow

1. On page load, the frontend requests `GET /api/models` and uses the response to populate the model list, inputs, and dataset summary. If this metadata request fails, it uses `frontend/src/config/modelsData.js` as a local metadata fallback.
2. A user chooses a model and supplies feature values in the prediction workspace.
3. The frontend posts either one model request to `POST /api/predict` or a shared feature set to `POST /api/predict/all`.
4. The backend finds the configured model, loads its mapped artifact, uses the estimator's declared `feature_names_in_` to order the values, and calls `predict` on a one-row pandas DataFrame.
5. The backend converts the result to a score and risk tier, then the frontend renders the returned result or comparison.

The five-step prediction progress display is a frontend animation. It communicates progress visually; it is not a sequence of five separate backend processing stages.

## 4. Dataset and input schema

The project configuration describes a dataset named **Global Hydrometeorological Flood Observation Dataset 2024** with 10,562 observations, 14 total features, 8,450 training samples, 2,112 test samples, and zero missing values. Its target is `flood_risk_score (0 - 100)`. These are values in the project metadata; this repository does not include the source tabular dataset or a training pipeline to independently reproduce those figures.

The API configuration defines 14 model inputs:

| Group | Inputs |
|---|---|
| Meteorological | Total precipitation, accumulated rainfall, maximum daily temperature, maximum wind speed, and rainfall over 24, 48, and 72 hours |
| Environmental | Surface and subsurface soil moisture, and soil saturation index |
| Location | Latitude and longitude |
| Time | Observation year and month |

Each field has a configured label, unit, description, minimum, maximum, step, and default. The prediction form presents numeric controls and sliders where appropriate; latitude and longitude are entered numerically without sliders. The backend checks that every feature expected by a loaded estimator is present and returns a 422 response listing missing fields. The UI also uses the configured bounds for input controls and validation.

## 5. Models and prediction behavior

The backend maps these five model IDs to fixed artifact filenames:

| Model ID | Artifact | Type |
|---|---|---|
| `random_forest_reg` | `random_forest_regressor.pkl` | Regression |
| `gradient_boosting_reg` | `gradient_boosting_regressor.pkl` | Regression |
| `linear_regression` | `linear_regression.pkl` | Regression |
| `flood_classifier_rf` | `random_forest_classifier.pkl` | Classification |
| `xgboost_classifier` | `xgboost_classifier.pkl` | Classification |

The model metadata contains metrics such as R², accuracy, precision, recall, F1, ROC AUC, RMSE, MAE, and cross-validation score, depending on model type. It also contains descriptive feature importance, actual-versus-predicted samples, and residual samples for the interface. These metadata values are presented by the UI; they are not recomputed during each prediction.

Regression predictions are converted to floats, clamped to 0–100, and rounded to one decimal place. Classification predictions are decoded through `label_encoder.pkl`. The backend maps known labels to representative score values: Low Risk to 15, Advisory to 45, High Warning to 75, and Critical Emergency to 92. Unknown labels map to 50. Risk tiers are selected by score boundaries: below 35 is low, 35–64.9 medium, 65–84.9 high, and 85 or above severe. The configured tier label, color, and description are returned with the result.

## 6. API reference

| Method and path | Purpose |
|---|---|
| `GET /` | Backend status and version |
| `GET /api/models` | Model catalog, project metadata, and feature definitions |
| `GET /api/models/{model_id}` | Details for one configured model |
| `GET /api/models/{model_id}/metrics` | Metrics and feature-importance metadata for one model |
| `GET /api/dataset` | Dataset metadata |
| `POST /api/predict` | Predict using one model; body has `model_id` and numeric `features` map |
| `POST /api/predict/all` | Predict using all fixed-mapped comparison models; body has numeric `features` map |
| `POST /api/models/upload` | Upload an artifact and append a model metadata record |

FastAPI's interactive API documentation is available at `http://127.0.0.1:8000/docs` while the backend is running.

## 7. Main dashboard sections

- **Dashboard:** Hero overview and model summary cards.
- **Models:** Model cards and a detail modal for descriptions and performance metadata.
- **Prediction:** Select a model, edit feature inputs, choose preset scenarios, run inference, or compare all supported models.
- **Performance:** Side-by-side configured model metric comparison.
- **Analytics:** Charts for configured feature importance, residuals, and actual-versus-predicted samples. Some distribution chart bins are hard-coded in the component.
- **Dataset:** Dataset summary and the configured feature schema table.
- **Upload:** Form for entering model name, type, algorithm, metrics, and selecting a file.
- **About:** In-app overview of the architecture and intended project capabilities.

## 8. Local setup and operation

The supported launcher is `Run Flood Dashboard.bat`, which invokes `run-local.ps1`. The setup expects Python 3.11 or later and Node.js 20.19+ or 22.12+. On first run, the script creates a backend virtual environment, installs packages from `backend/requirements.txt`, installs frontend packages with `npm ci`, checks for the six model artifacts required for prediction (including the label encoder), starts the FastAPI and Vite services in separate command windows, waits for them to respond, and opens the dashboard.

- Dashboard: `http://127.0.0.1:5173`
- Backend API docs: `http://127.0.0.1:8000/docs`

The command windows must remain open while the app is in use. The README also documents manual backend and frontend startup and an optional frontend production build (`npm run build`).

## 9. Dependencies and implementation details

The frontend dependencies include React, Axios, Framer Motion, Lucide React, Recharts, Tailwind CSS, and Vite. The backend dependencies include FastAPI, Uvicorn, Pydantic, scikit-learn 1.6.1, NumPy, pandas, joblib, and XGBoost 3.2.0. Model objects are cached in-process after the first load. Inference is reduced to one job when the estimator exposes an `n_jobs` property, which is intended to keep single-row predictions reliable on local Windows environments.

## 10. Scope and interpretation notes

- The repository contains trained model artifacts and metadata, but not the dataset or code that trains those artifacts. The report therefore describes the configured model claims and application behavior, not a reproducible scientific validation of the models.
- The classifier-to-score conversion supports visual comparison with regression scores; those mapped values do not express calibrated class probabilities or equivalence to a regression output.
- The backend's upload route saves a file and appends a metadata entry. Prediction routes, however, resolve artifacts through the fixed `MODEL_FILES` mapping. The upload form by itself does not extend that mapping, so newly uploaded models are registered for display but are not automatically usable by the prediction endpoints.
- When metadata loading fails, the frontend falls back to local model metadata. Prediction requests still require the backend and actual artifacts; they do not have a local inference fallback.
- Some analytics visualizations use built-in sample or distribution data when configuration data is absent, so they should be interpreted as dashboard diagnostics/examples rather than live summaries over a dataset.

## 11. Conclusion

The project provides an end-to-end local interface for presenting flood-risk model metadata and running predictions from supplied serialized estimators. Its main workflow is feature entry followed by single-model inference or a multi-model comparison. The strongest areas represented in the implementation are the interactive dashboard, API-backed prediction, configurable feature schema, and visualization of model metadata. Reproducing training results or treating the interface as an operational warning system would require the underlying dataset, training/evaluation procedure, validation of the metadata, and additional deployment-specific review beyond what is present in this repository.

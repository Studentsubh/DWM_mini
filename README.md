# Flood Risk Prediction Dashboard

This app runs on your Windows computer. It has a browser based dashboard, a local prediction API, and trained machine learning models.

## Install and run on Windows

### 1. Install Python

Download and install [Python 3.11 or newer](https://www.python.org/downloads/). During installation, check **Add Python to PATH**.

### 2. Install Node.js

Download and install the current [Node.js LTS version](https://nodejs.org/). This also installs npm, which the app uses to set up the website.

After installing Python and Node.js, close and reopen File Explorer if the launcher was already open.

### 3. Check the project files

If you received the project as a ZIP, extract it first. Open the extracted project folder and check that it contains:

- `Run Flood Dashboard.bat`
- `backend` and `frontend` folders
- `backend\uploaded_models` with the supplied model files

Do not move the launcher out of the project folder.

### 4. Start the app

Double-click **Run Flood Dashboard.bat**. On the first run, it creates a local Python environment and downloads the required Python and website packages. This can take several minutes and needs an internet connection. Wait while setup finishes.

The launcher opens separate command windows for the backend and frontend. It opens the dashboard in your browser when both are ready:

- Dashboard: [http://127.0.0.1:5173](http://127.0.0.1:5173)
- Backend status and API docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

Keep the backend and frontend command windows open while using the app. Close both windows to stop it. The next time you run the launcher, it reuses installed packages; it only installs again if the dependency files have changed.

## Compare all prediction models

1. Open **Prediction** in the dashboard.
2. Enter the weather, soil, location, and date inputs. The same values are sent to every model.
3. Select **Run all models & compare** to view each result and the comparison chart. Choose **Change inputs** to run another comparison.

Classifier outputs are categories, so the chart maps those categories to representative risk index values. The predicted category is also shown on each classifier's result card.

## Run manually (optional)

Use this if you prefer starting each service yourself. Open two PowerShell windows in the project folder.

In the first window, start the backend:

```powershell
cd backend
py -3 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

In the second window, start the frontend:

```powershell
cd frontend
npm ci
npm run dev -- --host 127.0.0.1
```

Then visit [http://127.0.0.1:5173](http://127.0.0.1:5173). Keep both windows open until you are finished.

## Troubleshooting

- **The launcher says Python or Node.js is missing:** Install both tools using the links above, then double-click the launcher again.
- **Setup cannot download packages:** Check your internet connection and run the launcher again. It will retry the installation.
- **The browser does not open:** Visit [http://127.0.0.1:5173](http://127.0.0.1:5173) yourself. Keep the two service windows open.
- **The launcher reports a startup error:** Read the backend and frontend command windows for details. Make sure ports 8000 and 5173 are not already in use.
- **Model files are missing:** The launcher needs the supplied files in `backend\uploaded_models`. It does not download models.
- **Predictions say the backend is unavailable:** Check that the backend window is still open and has no startup error. The backend status page is [http://127.0.0.1:8000/](http://127.0.0.1:8000/).

## Build the frontend (optional)

```powershell
cd frontend
npm ci
npm run build
```

The generated production files are placed in `frontend\dist`.

$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Backend = Join-Path $Root 'backend'
$Frontend = Join-Path $Root 'frontend'
$Venv = Join-Path $Backend '.venv'
$VenvPython = Join-Path $Venv 'Scripts\python.exe'

function Invoke-Checked {
  param([scriptblock]$Command, [string]$FailureMessage)
  & $Command
  if ($LASTEXITCODE -ne 0) { throw $FailureMessage }
}

if (-not (Get-Command node -ErrorAction SilentlyContinue) -or -not (Get-Command npm -ErrorAction SilentlyContinue)) {
  throw 'Node.js is required. Install the current Node.js LTS release, then run this launcher again.'
}
Invoke-Checked { & node -e "const [major,minor]=process.versions.node.split('.').map(Number); process.exit(major > 22 || (major === 22 && minor >= 12) || (major === 20 && minor >= 19) ? 0 : 1)" } 'Node.js 20.19+ or 22.12+ is required. Install the current Node.js LTS release, then run this launcher again.'

$PythonLauncher = Get-Command py -ErrorAction SilentlyContinue
if ($PythonLauncher) {
  Invoke-Checked { & py -3 -c "import sys; sys.exit(0 if sys.version_info >= (3, 11) else 1)" } 'Python 3.11 or newer is required. Install it, then run this launcher again.'
  if (-not (Test-Path $VenvPython)) {
    Invoke-Checked { & py -3 -m venv $Venv } 'Could not create the backend Python environment.'
  }
} else {
  $PythonCommand = Get-Command python -ErrorAction SilentlyContinue
  if (-not $PythonCommand) { throw 'Python 3 is required. Install Python 3.11 or newer, then run this launcher again.' }
  Invoke-Checked { & python -c "import sys; sys.exit(0 if sys.version_info >= (3, 11) else 1)" } 'Python 3.11 or newer is required. Install it, then run this launcher again.'
  if (-not (Test-Path $VenvPython)) {
    Invoke-Checked { & python -m venv $Venv } 'Could not create the backend Python environment.'
  }
}

$RequirementsHash = (Get-FileHash (Join-Path $Backend 'requirements.txt') -Algorithm SHA256).Hash
$RequirementsMarker = Join-Path $Venv '.requirements.sha256'
$InstalledRequirementsHash = if (Test-Path $RequirementsMarker) { (Get-Content $RequirementsMarker -Raw).Trim() } else { '' }
if ($RequirementsHash -ne $InstalledRequirementsHash) {
  Write-Host 'Installing backend packages (first run, or backend requirements changed)...' -ForegroundColor Cyan
  Invoke-Checked { & $VenvPython -m pip install -r (Join-Path $Backend 'requirements.txt') } 'Backend package installation failed. Check your internet connection and try again.'
  Set-Content -Path $RequirementsMarker -Value $RequirementsHash -NoNewline
}

$LockFile = Join-Path $Frontend 'package-lock.json'
$FrontendHash = (Get-FileHash $LockFile -Algorithm SHA256).Hash
$FrontendMarker = Join-Path $Frontend 'node_modules\.setup-lock.sha256'
$InstalledFrontendHash = if (Test-Path $FrontendMarker) { (Get-Content $FrontendMarker -Raw).Trim() } else { '' }
if (-not (Test-Path (Join-Path $Frontend 'node_modules\.bin\vite.cmd')) -or $FrontendHash -ne $InstalledFrontendHash) {
  Write-Host 'Installing frontend packages (first run, or frontend dependencies changed)...' -ForegroundColor Cyan
  Push-Location $Frontend
  try { Invoke-Checked { & npm ci } 'Frontend package installation failed. Check your internet connection and try again.' }
  finally { Pop-Location }
  Set-Content -Path $FrontendMarker -Value $FrontendHash -NoNewline
}

$ModelFiles = @(
  'random_forest_regressor.pkl',
  'gradient_boosting_regressor.pkl',
  'linear_regression.pkl',
  'random_forest_classifier.pkl',
  'xgboost_classifier.pkl',
  'label_encoder.pkl'
)
$MissingModels = $ModelFiles | Where-Object { -not (Test-Path (Join-Path (Join-Path $Backend 'uploaded_models') $_)) }
if ($MissingModels) { throw "Required model files are missing from backend\uploaded_models: $($MissingModels -join ', ')" }

$BackendCommand = 'cd /d "' + $Backend + '" && "' + $VenvPython + '" -m uvicorn main:app --reload --host 127.0.0.1 --port 8000'
$FrontendCommand = 'cd /d "' + $Frontend + '" && npm run dev -- --host 127.0.0.1'
Start-Process -FilePath $env:ComSpec -ArgumentList @('/k', $BackendCommand) -WorkingDirectory $Backend
Start-Process -FilePath $env:ComSpec -ArgumentList @('/k', $FrontendCommand) -WorkingDirectory $Frontend

Write-Host ''
Write-Host 'Starting the Flood Risk Dashboard...' -ForegroundColor Green
Write-Host 'Backend:  http://127.0.0.1:8000/docs'
Write-Host 'Frontend: http://127.0.0.1:5173'
Write-Host 'Waiting for the backend and frontend to become ready...'
$BackendReady = $false
$FrontendReady = $false
for ($Attempt = 0; $Attempt -lt 60 -and (-not $BackendReady -or -not $FrontendReady); $Attempt++) {
  if (-not $BackendReady) {
    try { Invoke-RestMethod 'http://127.0.0.1:8000/' -TimeoutSec 2 | Out-Null; $BackendReady = $true } catch { }
  }
  if (-not $FrontendReady) {
    try { Invoke-WebRequest 'http://127.0.0.1:5173/' -TimeoutSec 2 -UseBasicParsing | Out-Null; $FrontendReady = $true } catch { }
  }
  if (-not $BackendReady -or -not $FrontendReady) { Start-Sleep -Seconds 1 }
}
if (-not $BackendReady -or -not $FrontendReady) {
  throw 'The services did not become ready. Read the backend and frontend terminal windows for the startup error, fix it, then run this launcher again.'
}
Write-Host 'Both services are ready. Keep their terminal windows open while using the dashboard.' -ForegroundColor Green
Start-Process 'http://127.0.0.1:5173'

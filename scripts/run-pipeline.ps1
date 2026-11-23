# Ejecuta el pipeline de productos de 0NOXTACKORE con CrewAI + Ollama (local, sin API de pago).
# Logs en tmp/products/logs/
$ErrorActionPreference = "Continue"

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

$logDir = Join-Path $root "tmp\products\logs"
New-Item -ItemType Directory -Force -Path $logDir | Out-Null
$log = Join-Path $logDir ("pipeline-{0:yyyy-MM-dd-HHmmss}.log" -f (Get-Date))

$stamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
"=== pipeline start $stamp (crewai+ollama) ===" | Tee-Object -FilePath $log

$py = Join-Path $root ".venv\Scripts\python.exe"
if (-not (Test-Path $py)) { $py = "python" }

if (-not $env:OLLAMA_MODEL) { $env:OLLAMA_MODEL = "ollama/llama3.2:1b" }
if (-not $env:OLLAMA_BASE_URL) { $env:OLLAMA_BASE_URL = "http://localhost:11434" }

"Using python: $py" | Tee-Object -FilePath $log -Append
"Using model: $($env:OLLAMA_MODEL) @ $($env:OLLAMA_BASE_URL)" | Tee-Object -FilePath $log -Append

& $py (Join-Path $root "scripts\crewai_pipeline.py") *>&1 | Tee-Object -FilePath $log -Append
$code = $LASTEXITCODE
"=== pipeline end (exit $code) ===" | Tee-Object -FilePath $log -Append
exit $code

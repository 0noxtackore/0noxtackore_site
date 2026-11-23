# Ejecuta el pipeline completo de productos de 0NOXTACKORE en modo headless.
# Diseñado para Windows Task Scheduler: logs en tmp/products/logs/
# Nota: `opencode run` NO expande comandos slash, así que leemos la
# instrucción directamente de .opencode/commands/product-pipeline.md.
$ErrorActionPreference = "Continue"

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

# El CLI viene con la app de escritorio de OpenCode (la ruta incluye la versión)
$cli = Get-ChildItem "$env:APPDATA\ai.opencode.desktop\cli\*\opencode-cli.exe" -ErrorAction SilentlyContinue |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 1
if (-not $cli) {
    Write-Output "No se encontro opencode-cli.exe en $env:APPDATA\ai.opencode.desktop\cli\"
    exit 1
}

# Instruccion del pipeline desde el archivo de comando (sin frontmatter)
$cmdFile = Join-Path $root ".opencode\commands\product-pipeline.md"
if (-not (Test-Path $cmdFile)) {
    Write-Output "No se encontro $cmdFile"
    exit 1
}
$raw = Get-Content $cmdFile -Raw
if ($raw -match '(?s)^---\r?\n.*?\r?\n---\r?\n(.*)$') {
    $msg = $Matches[1]
} else {
    $msg = $raw
}
$msg = $msg.Replace('$ARGUMENTS', '').Trim()

$logDir = Join-Path $root "tmp\products\logs"
New-Item -ItemType Directory -Force -Path $logDir | Out-Null
$log = Join-Path $logDir ("pipeline-{0:yyyy-MM-dd-HHmmss}.log" -f (Get-Date))

$stamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
"=== pipeline start $stamp ===" | Tee-Object -FilePath $log
& $cli.FullName run --auto --model "freellmapi/auto" --title "product-pipeline $stamp" $msg *>&1 |
    Tee-Object -FilePath $log -Append
$code = $LASTEXITCODE
"=== pipeline end (exit $code) ===" | Tee-Object -FilePath $log -Append
exit $code

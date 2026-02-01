# Sobe o app e o ngrok juntos no Windows.
# Uso: .\scripts\tunnel.ps1   ou   pwsh -File scripts\tunnel.ps1
# Na VPS Linux use tunnel.sh; no Windows use este ou tunnel.bat.

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

# Carrega .env (PORT, etc.)
if (Test-Path .env) {
    Get-Content .env | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            Set-Item -Path "Env:$name" -Value $value
        }
    }
}

$port = if ($env:PORT) { $env:PORT } else { "3000" }

Write-Host ">>> Build..."
npm run build

Write-Host ">>> Iniciando app na porta $port (background)..."
$nodeProc = Start-Process -FilePath "node" -ArgumentList "dist/server.js" -WorkingDirectory (Get-Location) -PassThru -WindowStyle Hidden

try {
    Start-Sleep -Seconds 1
    Write-Host ">>> Iniciando ngrok (Ctrl+C para parar)..."
    Write-Host ">>> URL do webhook: https://SEU-SUBDOMINIO.ngrok-free.app/webhook"
    & ngrok http $port
} finally {
    Write-Host ">>> Encerrando app (PID $($nodeProc.Id))..."
    Stop-Process -Id $nodeProc.Id -Force -ErrorAction SilentlyContinue
}

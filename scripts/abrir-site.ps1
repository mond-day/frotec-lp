# Abre o site Frotec+ em desenvolvimento local (Windows PowerShell).
# Execute: .\scripts\abrir-site.ps1

Set-Location (Join-Path $PSScriptRoot "..")

if (-not (Test-Path "node_modules")) {
    Write-Host "Instalando dependencias..."
    npm install
}

Write-Host "Iniciando servidor em http://localhost:3000 ..."
$dev = Start-Process npm -ArgumentList "run", "dev" -PassThru -NoNewWindow

try {
    for ($i = 0; $i -lt 30; $i++) {
        try {
            Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 1 | Out-Null
            break
        } catch {
            Start-Sleep -Seconds 1
        }
    }

    Start-Process "http://localhost:3000"
    Wait-Process -Id $dev.Id
} finally {
    if (-not $dev.HasExited) {
        Stop-Process -Id $dev.Id -Force -ErrorAction SilentlyContinue
    }
}

@echo off
REM Abre o site Frotec+ em desenvolvimento local (Windows).
REM Duplo-clique ou execute: scripts\abrir-site.bat

cd /d "%~dp0.."

if not exist "node_modules\" (
  echo Instalando dependencias...
  call npm install
)

echo Iniciando servidor em http://localhost:3000 ...
start /b npm run dev

set /a TENTATIVAS=0
:AGUARDAR
set /a TENTATIVAS+=1
if %TENTATIVAS% gtr 30 goto ABRIR
powershell -NoProfile -Command "try { Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing -TimeoutSec 1 | Out-Null; exit 0 } catch { exit 1 }" >nul 2>&1
if errorlevel 1 (
  timeout /t 1 /nobreak >nul
  goto AGUARDAR
)

:ABRIR
start "" "http://localhost:3000"
echo Servidor rodando. Feche esta janela ou pressione Ctrl+C para encerrar.
pause >nul
